"""Constrói o esquema de articulação sinovial de /fundamentos.

Roda com: blender --background --factory-startup --python scripts/lesson_synovial.py

Substitui o modelo anterior, que tinha 4.800 triângulos em oito primitivas
(cilindros e toros) e parecia um boneco de encaixe. Aqui cada peça é uma
superfície de revolução gerada a partir de um perfil descrito por funções,
com sombreamento suave: o côndilo é convexo de verdade, a superfície inferior
é côncava, e a cápsula e a membrana sinovial são cascas finas abertas na
frente, para deixar a cavidade à vista.

Continua sendo um ESQUEMA genérico e ampliado, não um osso real: serve para
explicar a organização de uma articulação sinovial. Nenhuma geometria aqui
pretende representar um joelho, um ombro ou o exame de alguém.

Os nomes das malhas começam com Osso, Cartilagem, Capsula, Membrana e
Ligamento porque JointLesson.tsx seleciona as peças por esse prefixo.
"""
import math
from pathlib import Path

import bmesh
import bpy

RAIZ = Path(__file__).resolve().parents[1]
DESTINO = RAIZ / "public/lessons/synovial.glb"

SEGMENTOS = 96            # divisões ao redor do eixo
ALTURA = 0.16             # metade da altura total, para bater com a câmera da cena
ABERTURA = math.radians(120)   # quanto da cápsula fica aberto, na frente

# Cores de tecido, escolhidas para leitura didática e não para realismo.
CORES = {
    "Osso": (0.925, 0.890, 0.812, 1.0),
    "Cartilagem": (0.796, 0.886, 0.918, 1.0),
    "Capsula": (0.851, 0.761, 0.651, 1.0),
    "Membrana": (0.910, 0.718, 0.690, 1.0),
    "Ligamento": (0.871, 0.839, 0.761, 1.0),
}


def limpar():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(nome):
    chave = nome.split("_")[0].split(".")[0]
    mat = bpy.data.materials.new(nome)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = CORES[chave]
    bsdf.inputs["Roughness"].default_value = 0.55
    return mat


def revolver(nome, perfil, a0=0.0, a1=2 * math.pi, fechado=True, espessura=0.0):
    """Gera uma superfície de revolução a partir de um perfil (raio, z).

    Com fechado=True o perfil dá a volta completa e vira um sólido; os pontos
    de raio zero viram polos, sem faces degeneradas. Com fechado=False sobra
    uma casca aberta, que ganha espessura pelo Solidify.
    """
    bm = bmesh.new()
    n = len(perfil)
    passos = SEGMENTOS if fechado else max(8, int(SEGMENTOS * (a1 - a0) / (2 * math.pi)))
    polos = {}
    aneis = []
    for i in range(passos if fechado else passos + 1):
        ang = a0 + (a1 - a0) * (i / passos)
        cos_a, sen_a = math.cos(ang), math.sin(ang)
        anel = []
        for j, (r, z) in enumerate(perfil):
            if fechado and r < 1e-6:
                if j not in polos:
                    polos[j] = bm.verts.new((0.0, 0.0, z))
                anel.append(polos[j])
            else:
                anel.append(bm.verts.new((r * cos_a, r * sen_a, z)))
        aneis.append(anel)

    total = passos if fechado else passos
    for i in range(total):
        a = aneis[i]
        b = aneis[(i + 1) % len(aneis)]
        for j in range(n - 1):
            cantos = [a[j], a[j + 1], b[j + 1], b[j]]
            unicos = []
            for v in cantos:
                if not unicos or unicos[-1] is not v:
                    unicos.append(v)
            if len(unicos) > 2 and unicos[0] is unicos[-1]:
                unicos.pop()
            if len(unicos) >= 3:
                try:
                    bm.faces.new(unicos)
                except ValueError:
                    pass

    bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    malha = bpy.data.meshes.new(nome)
    bm.to_mesh(malha)
    bm.free()
    for p in malha.polygons:
        p.use_smooth = True

    obj = bpy.data.objects.new(nome, malha)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material(nome))
    if espessura:
        mod = obj.modifiers.new("Espessura", "SOLIDIFY")
        mod.thickness = espessura
        mod.offset = 0.0
        mod.use_rim = True
        mod.use_rim_only = False
    return obj


def arco(r0, z0, r1, z1, passos, curva=0.0):
    """Trecho de perfil entre dois pontos, com curvatura suave opcional."""
    pontos = []
    for i in range(passos + 1):
        t = i / passos
        s = t * t * (3 - 2 * t)  # suaviza início e fim
        r = r0 + (r1 - r0) * s
        z = z0 + (z1 - z0) * s
        if curva:
            r += curva * math.sin(math.pi * t)
        pontos.append((r, z))
    return pontos


def domo(raio, z_base, profundidade, passos, para_baixo=True):
    """Quarto de elipse: a superfície articular convexa."""
    pontos = []
    for i in range(passos + 1):
        t = (math.pi / 2) * (i / passos)
        r = raio * math.cos(t)
        dz = profundidade * math.sin(t)
        pontos.append((r, z_base - dz if para_baixo else z_base + dz))
    return pontos


def concavidade(raio, z_borda, fundo, passos):
    """Superfície articular côncava, do centro para a borda."""
    pontos = []
    for i in range(passos + 1):
        t = i / passos
        r = raio * t
        z = z_borda - fundo * (1 - t * t)
        pontos.append((r, z))
    return pontos


def construir():
    limpar()

    # --- osso superior: diáfise, alargamento e côndilo convexo ---
    perfil = [(0.0, ALTURA)]
    perfil += arco(0.026, ALTURA - 0.002, 0.030, 0.088, 10)
    perfil += arco(0.030, 0.088, 0.044, 0.058, 10, curva=0.004)
    perfil += arco(0.044, 0.058, 0.062, 0.030, 12, curva=0.003)
    perfil += domo(0.062, 0.030, 0.024, 18)
    revolver("Osso_superior", perfil)

    # --- osso inferior: diáfise e superfície côncava ---
    perfil = [(0.0, -ALTURA)]
    perfil += arco(0.026, -ALTURA + 0.002, 0.030, -0.088, 10)
    perfil += arco(0.030, -0.088, 0.046, -0.056, 10, curva=0.004)
    perfil += arco(0.046, -0.056, 0.064, -0.020, 12, curva=0.003)
    perfil += [(0.064, -0.008)]
    perfil += list(reversed(concavidade(0.064, -0.008, 0.012, 16)))
    revolver("Osso_inferior", perfil)

    # --- cartilagens: casca fina sobre cada superfície articular ---
    revolver(
        "Cartilagem_superior",
        domo(0.0625, 0.0295, 0.0245, 18),
        fechado=False, a0=0.0, a1=2 * math.pi, espessura=0.005,
    )
    revolver(
        "Cartilagem_inferior",
        concavidade(0.0645, -0.0075, 0.0125, 16),
        fechado=False, a0=0.0, a1=2 * math.pi, espessura=0.005,
    )

    # --- cápsula e membrana sinovial: cascas abertas na frente ---
    inicio = -math.pi / 2 + ABERTURA / 2
    fim = inicio + (2 * math.pi - ABERTURA)
    capsula = (
        arco(0.040, 0.082, 0.074, 0.040, 10, curva=0.006)
        + arco(0.074, 0.040, 0.080, 0.000, 8)
        + arco(0.080, 0.000, 0.072, -0.044, 8)
        + arco(0.072, -0.044, 0.040, -0.082, 10, curva=0.006)
    )
    revolver("Capsula_fibrosa_em_corte", capsula, a0=inicio, a1=fim,
             fechado=False, espessura=0.0045)
    sinovial = [(r - 0.007, z) for r, z in capsula]
    revolver("Membrana_sinovial_em_corte", sinovial, a0=inicio, a1=fim,
             fechado=False, espessura=0.002)

    # --- ligamentos colaterais: duas tiras laterais, por fora da cápsula ---
    for indice, angulo in enumerate((0.0, math.pi)):
        tira = (
            arco(0.008, 0.086, 0.013, 0.030, 8)
            + arco(0.013, 0.030, 0.013, -0.030, 6)
            + arco(0.013, -0.030, 0.008, -0.086, 8)
        )
        obj = revolver(f"Ligamento{'' if indice == 0 else '.001'}", tira)
        obj.scale = (1.0, 0.55, 1.0)          # achata a tira
        obj.location = (0.086 * math.cos(angulo), 0.086 * math.sin(angulo), 0.0)
        obj.rotation_euler = (0.0, 0.0, angulo)

    bpy.context.view_layer.update()


def exportar():
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(DESTINO),
        export_format="GLB",
        export_apply=True,
        use_selection=False,
    )
    total = 0
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            avaliado = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
            malha = avaliado.to_mesh()
            malha.calc_loop_triangles()
            n = len(malha.loop_triangles)
            total += n
            print(f"  {obj.name:32} {n:6} triangulos")
            avaliado.to_mesh_clear()
    print(f"  {'TOTAL':32} {total:6} triangulos")
    print(f"Gravado em {DESTINO}")


if __name__ == "__main__":
    construir()
    exportar()
