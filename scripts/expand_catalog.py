"""Add explicitly named source structures, without treating insertion markers as tendons."""
import json, unicodedata
from pathlib import Path
root = Path(__file__).resolve().parents[1]
path = root/'src/data/structures.json'
catalog = json.loads(path.read_text(encoding='utf8'))
# Portuguese name | exact source name | anatomical region
rows = {
 'ligamentos': '''Ligamento acromioclavicular|Acromioclavicular ligament|Ombro
Ligamento conoide|Conoid ligament|Ombro
Ligamento trapezoide|Trapezoid ligament|Ombro
Ligamento coracoacromial|Coraco-acromial ligament|Ombro
Ligamento coracoumeral|Coracohumeral ligament|Ombro
Ligamento glenoumeral superior|Superior glenohumeral ligament|Ombro
Ligamento glenoumeral médio|Middle glenohumeral ligament|Ombro
Ligamento glenoumeral inferior|Inferior glenohumeral ligament|Ombro
Ligamento colateral radial do cotovelo|Radial collateral ligament|Cotovelo
Ligamento colateral ulnar do cotovelo|Ulnar collateral ligament|Cotovelo
Ligamento quadrado|Quadrate ligament|Cotovelo
Ligamento radiocarpal dorsal|Dorsal radiocarpal ligament|Punho
Ligamento escafolunar interósseo|Scapholunate interosseous ligament|Punho
Ligamento lunopiramidal interósseo|Lunotriquetral interosseous ligament|Punho
Ligamentos colaterais metacarpofalângicos|Collateral metacarpophalangeal ligaments|Mão
Ligamentos colaterais interfalângicos da mão|Collateral interphalangeal ligaments of hand|Mão
Ligamento da cabeça do fêmur|Ligament of head of femur|Quadril
Ligamento transverso do acetábulo|Transverse acetabular ligament|Quadril
Ligamento sacrotuberal|Sacrotuberous ligament|Pelve
Ligamento sacroespinal|Sacrospinous ligament|Pelve
Ligamento poplíteo oblíquo|Oblique popliteal ligament|Joelho
Ligamento poplíteo arqueado|Arcuate popliteal ligament|Joelho
Ligamento popliteofibular|Popliteofibular ligament|Joelho
Ligamento transverso do joelho|Transverse ligament of knee|Joelho
Ligamento talofibular posterior|Posterior talofibular ligament|Tornozelo
Ligamento tibiofibular anterior|Anterior tibiofibular ligament|Tornozelo
Ligamento tibiofibular posterior|Posterior tibiofibular ligament|Tornozelo
Ligamento plantar longo|Long plantar ligament|Pé
Ligamento calcaneonavicular plantar|Plantar calcaneonavicular ligament|Pé
Ligamento calcaneocuboideo plantar|Plantar calcaneocuboid ligament|Pé
Ligamentos colaterais metatarsofalângicos|Collateral metatarsophalangeal ligaments|Pé
Ligamento longitudinal anterior|Anterior longitudinal ligament|Coluna vertebral
Ligamento longitudinal posterior|Posterior longitudinal ligament|Coluna vertebral
Ligamentos amarelos|Ligamenta flava|Coluna vertebral
Ligamento supraespinal|Supraspinous ligament|Coluna vertebral
Ligamentos interespinais|Interspinous ligaments|Coluna vertebral
Ligamento nucal|Nuchal ligament|Cabeça e pescoço''',
 'nervos': '''Nervo supraescapular|Suprascapular nerve|Ombro
Nervo dorsal da escápula|Dorsal scapular nerve|Ombro
Nervo torácico longo|Long thoracic nerve|Tronco
Nervo toracodorsal|Thoracodorsal nerve|Tronco
Nervo peitoral lateral|Lateral pectoral nerve|Tronco
Nervo peitoral medial|Medial pectoral nerve|Tronco
Nervo subescapular superior|Superior subscapular nerve|Ombro
Nervo subescapular inferior|Inferior subscapular nerve|Ombro
Nervo cutâneo lateral do antebraço|Lateral antebrachial cutaneous nerve|Antebraço
Nervo cutâneo medial do antebraço|Medial antebrachial cutaneous nerve|Antebraço
Nervo interósseo anterior do antebraço|Anterior interosseous nerve of forearm|Antebraço
Nervo interósseo posterior do antebraço|Posterior interosseous nerve of forearm|Antebraço
Nervo cutâneo lateral da coxa|Lateral femoral cutaneous nerve|Coxa
Nervo cutâneo posterior da coxa|Posterior femoral cutaneous nerve|Coxa
Nervo safeno|Saphenous nerve|Perna
Nervo sural|Sural nerve|Perna
Nervo plantar medial|Medial plantar nerve|Pé
Nervo plantar lateral|Lateral plantar nerve|Pé
Nervo pudendo|Pudendal nerve|Pelve
Nervo ilioinguinal|Ilio-inguinal nerve|Pelve
Nervo ilio-hipogástrico|Iliohypogastric nerve|Pelve
Nervo genitofemoral|Genitofemoral nerve|Pelve''',
 'tendoes': '''Tendão do extensor longo dos dedos|Tendon of extensor digitorum longus|Pé
Tendão intermediário do digástrico|Intermediate tendon of digastric muscle|Cabeça e pescoço''',
}
ids = {s['id'] for s in catalog}
english = {s['english'].lower() for s in catalog}
for kind, lines in rows.items():
 for line in lines.splitlines():
  name,en,region = line.split('|')
  if en.lower() in english: continue
  slug = ''.join(c for c in unicodedata.normalize('NFD',name.lower()) if not unicodedata.combining(c)).replace(' ','-')
  assert slug not in ids
  summary = f'{name}: estrutura identificada no modelo Z-Anatomy, na região {region.lower()}.'
  if kind=='tendoes':
   summary = ('Conjunto tendíneo do extensor longo dos dedos no dorso do pé.' if 'extensor' in en else 'Porção tendínea entre os ventres do músculo digástrico, no pescoço.')
  catalog.append(dict(id=slug,name=name,english=en.lower(),kind=kind,region=region,summary=summary,
    fields={'Localização':region,'Identificação na fonte':en,'Estudo 3D':'Explore o trajeto e as relações espaciais. Os lados disponíveis estão listados nos componentes da malha.'},
    related=[],depth='profunda',sources=['z-anatomy'],aliases=[en],modelIds=[]))
  ids.add(slug);english.add(en.lower())
path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf8')
print('Catalog:',len(catalog))
