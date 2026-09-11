"""Lista objetos reais do Z-Anatomy ainda nao mapeados, agrupados por nome base.

Uso: python scripts/candidates.py <colecao-alvo> [--kind musculo|ligamento|tendao|osso|artic]
Imprime, para cada estrutura candidata, o nome base e os objetos exatos (lado l/r),
prontos para copiar no campo source_objects de um modulo de conteudo.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRATCH = ROOT.parent / 'scratch'
INV = json.loads((SCRATCH / 'z-inventory.json').read_text(encoding='utf8'))
MAP = json.loads((SCRATCH / 'z-mapping.json').read_text(encoding='utf8'))
SIDE = re.compile(r'\.(l|r)\Z', re.I)
MARK = re.compile(r'\.(i|j|o|e)\d*[lr]?\Z', re.I)
sys.stdout.reconfigure(encoding='utf-8')

taken = {o for objs in MAP.values() for o in objs}
args = [a for a in sys.argv[1:] if not a.startswith('--')]
groups = {}
for o in INV:
    if o.get('type') not in ('MESH', 'CURVE'):
        continue
    name = o['name'].strip()
    if MARK.search(name) or name in taken:
        continue
    cols = [c.lower() for c in o.get('collections', [])]
    if args and not any(all(t.lower() in ' | '.join(cols + [name.lower()]) for t in [a]) for a in args):
        continue
    base = SIDE.sub('', name)
    g = groups.setdefault(base, {'objs': [], 'cols': o.get('collections', []), 'verts': 0})
    g['objs'].append(name)
    g['verts'] += o.get('vertices', 0)

for base in sorted(groups):
    g = groups[base]
    tag = ', '.join(c for c in g['cols'] if not c[0].isdigit())
    print(f'### {base}   [{tag}]   v={g["verts"]}')
    print('    ' + json.dumps(sorted(g['objs']), ensure_ascii=False))
print(f'-- {len(groups)} candidatos')
