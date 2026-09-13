"""Separa malhas de grupo do Z-Anatomy em músculos individuais reais.

Roda com: blender --background --factory-startup --python scripts/split_muscle_islands.py

Alguns músculos que o Z-Anatomy guarda como UMA malha são, na verdade, várias
ilhas de geometria desconectadas — um músculo por ilha. Este script separa essas
ilhas (sem inventar geometria: só desconecta o que já está desconectado), ordena
cada peça pelo eixo radial→ulnar do próprio membro (do 1º ao 5º metacarpal ou
metatarsal) e dá a cada uma o nome anatômico correto.

Gera scratch/z-anatomy/Z-Anatomy/Startup-split.blend e atualiza scratch/z-inventory.json.
Malhas fundidas numa ilha só (interósseos palmares, lumbricais do pé) NÃO são tocadas.
"""
import bpy, bmesh, json
from pathlib import Path
from mathutils import Vector

RAW = Path(__file__).resolve().parents[2] / "scratch"
SRC = RAW / "z-anatomy/Z-Anatomy/Startup.blend"
OUT = RAW / "z-anatomy/Z-Anatomy/Startup-split.blend"
INV = RAW / "z-inventory.json"

ORD = ["First", "Second", "Third", "Fourth", "Fifth"]

# grupo -> (n_esperado, eixo_bones, template_nome)
GROUPS = [
    ("Dorsal interossei muscles of hand", 4, ("First metacarpal bone", "Fifth metacarpal bone"), "{ord} dorsal interosseous of hand"),
    ("Lumbrical muscles of hand", 4, ("First metacarpal bone", "Fifth metacarpal bone"), "{ord} lumbrical of hand"),
    ("Dorsal interossei muscles of foot", 4, ("First metatarsal bone", "Fifth metatarsal bone"), "{ord} dorsal interosseous of foot"),
    ("Plantar interossei muscles", 3, ("First metatarsal bone", "Fifth metatarsal bone"), "{ord} plantar interosseous"),
]


def centro(obj):
    return sum((obj.matrix_world @ Vector(c) for c in obj.bound_box), Vector()) / 8.0


def ilhas_bmesh(me):
    """Retorna listas de índices de vértice, uma por componente conexo (por arestas)."""
    bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
    visto = set(); comps = []
    for v in bm.verts:
        if v.index in visto:
            continue
        pilha = [v]; comp = []
        while pilha:
            x = pilha.pop()
            if x.index in visto:
                continue
            visto.add(x.index); comp.append(x.index)
            for e in x.link_edges:
                o = e.other_vert(x)
                if o.index not in visto:
                    pilha.append(o)
        comps.append(sorted(comp))
    # coordenadas locais e faces, para reconstruir
    coords = [v.co.copy() for v in bm.verts]
    faces = [[v.index for v in f.verts] for f in bm.faces]
    bm.free()
    return comps, coords, faces


def nova_malha(nome, idxs, coords, faces, matriz, colecoes):
    idxset = set(idxs)
    remap = {old: i for i, old in enumerate(idxs)}
    vcoords = [coords[i] for i in idxs]
    vfaces = [[remap[i] for i in f] for f in faces if all(i in idxset for i in f)]
    me = bpy.data.meshes.new(nome)
    me.from_pydata([list(c) for c in vcoords], [], vfaces)
    me.update()
    obj = bpy.data.objects.new(nome, me)
    obj.matrix_world = matriz.copy()
    for c in colecoes:
        c.objects.link(obj)
    return obj


def um_lado(base, comps, coords, faces, eixo, template, side):
    obj = bpy.data.objects.get(f"{base}.{side}")
    if not obj:
        print(f"  MISSING {base}.{side}"); return []
    matriz = obj.matrix_world.copy()
    colecoes = list(obj.users_collection)
    pecas = [nova_malha(f"tmp_{side}_{i}", c, coords, faces, matriz, colecoes)
             for i, c in enumerate(comps)]
    a = bpy.data.objects.get(f"{eixo[0]}.{side}")
    b = bpy.data.objects.get(f"{eixo[1]}.{side}")
    axis = (centro(b) - centro(a)); axis.normalize()
    origem = centro(a)
    pecas.sort(key=lambda o: (centro(o) - origem).dot(axis))
    novos = []
    for i, o in enumerate(pecas):
        o.name = f"{template.format(ord=ORD[i])}.{side}"
        o.data.name = o.name
        novos.append(o.name)
    return novos


def separar(base, n, eixo, template):
    """Separa .l e .r (que compartilham a mesma malha) e remove os originais."""
    obj_l = bpy.data.objects.get(f"{base}.l")
    if not obj_l:
        print(f"  MISSING {base}.l"); return []
    comps, coords, faces = ilhas_bmesh(obj_l.data)
    if len(comps) != n:
        print(f"  AVISO {base}: {len(comps)} ilhas (esperado {n})")
    novos = []
    for side in ("l", "r"):
        novos += um_lado(base, comps, coords, faces, eixo, template, side)
    # remove os objetos originais e a malha compartilhada
    malhas = set()
    for side in ("l", "r"):
        o = bpy.data.objects.get(f"{base}.{side}")
        if o:
            malhas.add(o.data)
            bpy.data.objects.remove(o, do_unlink=True)
    for me in malhas:
        if me.users == 0:
            bpy.data.meshes.remove(me)
    print(f"  {base} ({len(comps)} ilhas) -> {len(novos)} objetos: {novos}")
    return novos


def inv_row(name):
    o = bpy.data.objects[name]
    return {
        "name": o.name, "type": "MESH",
        "vertices": len(o.data.vertices), "faces": len(o.data.polygons),
        "collections": [c.name for c in o.users_collection],
        "bounds": [list(o.matrix_world @ Vector(v)) for v in o.bound_box],
    }


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SRC), load_ui=False, use_scripts=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    removidos, adicionados = [], []
    for base, n, eixo, template in GROUPS:
        removidos += [f"{base}.l", f"{base}.r"]
        adicionados += separar(base, n, eixo, template)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT))
    print(f"Salvo {OUT}")

    inv = json.loads(INV.read_text(encoding="utf8"))
    inv = [r for r in inv if r["name"] not in removidos]
    inv += [inv_row(n) for n in adicionados]
    INV.write_text(json.dumps(inv, ensure_ascii=False), encoding="utf8")
    print(f"Inventario: -{len(removidos)} +{len(adicionados)} = {len(inv)} objetos")


if __name__ == "__main__":
    main()
