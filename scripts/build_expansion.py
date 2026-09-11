"""Monta o catalogo a partir dos modulos de conteudo em scripts/content/.

Cada modulo e um JSON com duas chaves opcionais:
  "patches": ajustes em fichas existentes (merge de campos, related, aliases)
  "new":     fichas novas, com "source_objects" listando objetos do Z-Anatomy

Escreve src/data/structures.json e ../scratch/z-mapping.json e valida tudo
antes de gravar. Nao inventa geometria: todo objeto 3D citado deve existir no
inventario da fonte.
"""
import json, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRATCH = ROOT.parent / 'scratch'
CONTENT = ROOT / 'scripts/content'
KINDS = {'ossos', 'musculos', 'articulacoes', 'ligamentos', 'tendoes', 'nervos'}
REGIONS = {
    'Cabeça e pescoço', 'Tronco', 'Ombro', 'Braço', 'Cotovelo', 'Antebraço',
    'Punho', 'Mão', 'Pelve', 'Quadril', 'Coxa', 'Joelho', 'Perna', 'Tornozelo',
    'Pé', 'Coluna vertebral',
}
MUSCLE_FIELDS = ['Origem', 'Inserção', 'Inervação', 'Ação', 'Na prática']
MARK = re.compile(r'\.(i|j|o\d*|e)[lr]?\Z', re.I)
sys.stdout.reconfigure(encoding='utf-8')


def load_sources():
    text = (ROOT / 'src/data/sources.ts').read_text(encoding='utf8')
    return set(re.findall(r"id:\s*['\"]([^'\"]+)['\"]", text))


def load_inventory():
    inv = json.loads((SCRATCH / 'z-inventory.json').read_text(encoding='utf8'))
    return {o['name'].strip() for o in inv if o.get('type') in ('MESH', 'CURVE')}


def slug(name):
    s = unicodedata.normalize('NFD', name)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def load_model_metadata():
    """Guarda os IDs de malha ja gerados pelo export do Blender.

    O conteudo e reconstruido a partir do baseline a cada build, mas os campos
    modelIds/modelComponents/modelSource so existem depois que o Blender roda.
    Sem preservar isso, um build de conteudo apagaria a ligacao das fichas com
    o 3D e quebraria os testes ate o proximo export.
    """
    atual = ROOT / 'src/data/structures.json'
    if not atual.exists():
        return {}
    try:
        return {
            s['id']: {k: s[k] for k in ('modelIds', 'modelComponents', 'modelSource', 'modelNote') if k in s}
            for s in json.loads(atual.read_text(encoding='utf8'))
        }
    except (json.JSONDecodeError, KeyError, TypeError):
        return {}


def main():
    base = json.loads((SCRATCH / 'backup-pre-expansao/structures.json').read_text(encoding='utf8'))
    catalog = {s['id']: s for s in base}
    order = [s['id'] for s in base]
    mapping = json.loads((SCRATCH / 'backup-pre-expansao/z-mapping.json').read_text(encoding='utf8'))
    modelos = load_model_metadata()
    valid_sources = load_sources()
    inventory = load_inventory()
    errors = []
    modules = sorted(CONTENT.glob('*.json'))
    if not modules:
        errors.append('nenhum modulo de conteudo em scripts/content/')
    n_patch = n_new = 0

    for mod in modules:
        data = json.loads(mod.read_text(encoding='utf8'))
        for p in data.get('patches', []):
            sid = p['id']
            if sid not in catalog:
                errors.append(f'{mod.name}: patch para ficha inexistente {sid}')
                continue
            target = catalog[sid]
            for key in ('summary', 'depth', 'region', 'english', 'name', 'envelope'):
                if key in p:
                    target[key] = p[key]
            target['fields'].update(p.get('fields', {}))
            for key in ('related', 'aliases', 'sources'):
                if key in p:
                    merged = list(dict.fromkeys(list(target.get(key, [])) + list(p[key])))
                    target[key] = merged
            if 'source_objects' in p:
                mapping[sid] = p['source_objects']
            n_patch += 1
        for s in data.get('new', []):
            sid = s.get('id') or slug(s['name'])
            s['id'] = sid
            if sid in catalog:
                errors.append(f'{mod.name}: id duplicado {sid}')
                continue
            objs = s.pop('source_objects', [])
            entry = {
                'id': sid,
                'name': s['name'],
                'english': s.get('english', ''),
                'kind': s['kind'],
                'region': s['region'],
                'summary': s['summary'],
                'fields': s.get('fields', {}),
                'related': s.get('related', []),
                'depth': s.get('depth', 'profunda'),
                'sources': s.get('sources', ['z-anatomy']),
                'aliases': s.get('aliases', []),
                'modelIds': [],
            }
            if s.get('envelope'):
                entry['envelope'] = True
            catalog[sid] = entry
            order.append(sid)
            mapping[sid] = objs
            n_new += 1

    # ---- validacao -------------------------------------------------------
    for sid in order:
        s = catalog[sid]
        where = f'{sid}'
        if s['kind'] not in KINDS:
            errors.append(f'{where}: kind invalido {s["kind"]}')
        if s['region'] not in REGIONS:
            errors.append(f'{where}: regiao invalida {s["region"]}')
        if len(s['summary']) <= 10:
            errors.append(f'{where}: summary curto')
        for rid in s['related']:
            if rid not in catalog:
                errors.append(f'{where}: related nao resolve -> {rid}')
        for src in s['sources']:
            if src not in valid_sources:
                errors.append(f'{where}: fonte desconhecida {src}')
        if s['kind'] == 'musculos':
            for key in MUSCLE_FIELDS:
                if len(s['fields'].get(key, '')) <= 10:
                    errors.append(f'{where}: campo muscular ausente/curto: {key}')
        if not s['fields']:
            errors.append(f'{where}: sem campos')
        for obj in mapping.get(sid, []):
            if obj not in inventory:
                errors.append(f'{where}: objeto 3D inexistente na fonte: {obj!r}')
    missing_map = [sid for sid in order if sid not in mapping]
    for sid in missing_map:
        errors.append(f'{sid}: sem entrada no z-mapping')
    # um objeto do Z-Anatomy nao pode pertencer a duas fichas
    owner = {}
    for sid in order:
        for obj in mapping.get(sid, []):
            if obj in owner:
                errors.append(f'objeto 3D repetido em {owner[obj]} e {sid}: {obj!r}')
            owner[obj] = sid

    if errors:
        print(f'FALHOU com {len(errors)} erro(s):')
        for e in errors[:60]:
            print('  -', e)
        if len(errors) > 60:
            print(f'  ... mais {len(errors) - 60}')
        raise SystemExit(1)

    # Reaplica os metadados de malha e avisa quando o Blender precisa rodar.
    pendentes = []
    for sid in order:
        objetos = mapping.get(sid, [])
        salvo = modelos.get(sid, {})
        if salvo.get('modelComponents', []) == objetos and (objetos or not salvo.get('modelIds')):
            catalog[sid].update(salvo)
        elif objetos:
            pendentes.append(sid)
            catalog[sid]['modelIds'] = []

    out = [catalog[sid] for sid in order]
    (ROOT / 'src/data/structures.json').write_text(
        json.dumps(out, ensure_ascii=False, indent=2), encoding='utf8')
    (SCRATCH / 'z-mapping.json').write_text(
        json.dumps(mapping, ensure_ascii=False, indent=2), encoding='utf8')
    kinds = {}
    for s in out:
        kinds[s['kind']] = kinds.get(s['kind'], 0) + 1
    print(f'OK  {len(out)} fichas  ({n_patch} ajustadas, {n_new} novas)')
    for k in sorted(kinds):
        print(f'    {k:14} {kinds[k]:4}')
    print(f'    objetos 3D mapeados: {len(owner)}')
    if pendentes:
        print(f'    ATENCAO: {len(pendentes)} ficha(s) com mapeamento novo ou alterado.')
        print('    Rode o export do Blender para gerar as malhas:')
        print('      blender --background --factory-startup --python scripts/export_z_anatomy.py')
        for sid in pendentes[:10]:
            print(f'      - {sid}')
    else:
        print('    malhas em dia: nenhum export pendente.')


if __name__ == '__main__':
    main()
