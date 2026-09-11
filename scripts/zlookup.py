"""Consulta o inventario Z-Anatomy: nomes exatos de objetos para o mapeamento 3D.

Uso:  python scripts/zlookup.py <termo> [<termo> ...]
      python scripts/zlookup.py --collection "Muscles of foot"
Apenas objetos reais (MESH/CURVE) sao listados; marcadores de insercao (.i/.j/.o/.e) sao omitidos.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INV = json.loads((ROOT.parent / 'scratch/z-inventory.json').read_text(encoding='utf8'))
MARK = re.compile(r'\.(i|j|o|e)\d*[lr]?\Z', re.I)


def real_meshes():
    for o in INV:
        if o.get('type') not in ('MESH', 'CURVE'):
            continue
        if MARK.search(o['name'].strip()):
            continue
        yield o


def search(terms, collection=None):
    hits = {}
    for o in real_meshes():
        name = o['name'].strip()
        cols = o.get('collections', [])
        if collection and not any(collection.lower() == c.lower() for c in cols):
            continue
        low = name.lower()
        if terms and not all(t.lower() in low for t in terms):
            continue
        hits.setdefault(name, (o.get('vertices', 0), cols))
    return hits


if __name__ == '__main__':
    args = sys.argv[1:]
    col = None
    if args and args[0] == '--collection':
        col, args = args[1], args[2:]
    sys.stdout.reconfigure(encoding='utf-8')
    hits = search(args, col)
    for name in sorted(hits):
        verts, cols = hits[name]
        tag = ', '.join(c for c in cols if not c[0].isdigit())[:70]
        print(f'{name:62} v={verts:<6} {tag}')
    print(f'-- {len(hits)} objetos')
