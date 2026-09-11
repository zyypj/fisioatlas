"""Explicit, reviewable association of source object names to study entries."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
inventory=json.loads((ROOT.parent/'scratch/z-inventory.json').read_text(encoding='utf8'))
catalog=json.loads((ROOT/'src/data/structures.json').read_text(encoding='utf8'))
def normalized(name):
    return re.sub(r'\.(?:l|r)(?:\.\d+)?$','',name.lower()).replace(' muscle','').strip()
aliases={
 'atlas':['atlas (c1)'],'axis':['axis (c2)'],
 'sternum':['body of sternum','manubrium of sternum','xiphoid process'],
 'frontal':['frontal bone'], 'occipital':['occipital bone'], 'parietal':['parietal bone'], 'temporal':['temporal bone'],
 'sphenoid':['sphenoid bone'],'ethmoid':['ethmoid bone'],
 'internal oblique':['internal abdominal oblique'],'external oblique':['external abdominal oblique'],
 'common fibular nerve':['common fibular nerve','common peroneal nerve'],
 'peroneus longus':['fibularis longus'],'peroneus brevis':['fibularis brevis'],
 'calcaneal tendon':['calcaneal tendon'],
}
for word in ['scaphoid','lunate','triquetral','pisiform','trapezium','trapezoid','capitate','hamate','cuboid','medial cuneiform','intermediate cuneiform','lateral cuneiform']:
    aliases[word]=[word+' bone']
aliases['triquetral']=['triquetrum bone']
joint_terms={
 'glenoumeral':['articular capsule of glenohumeral joint'],
 'acromioclavicular':['articular capsule of acromioclavicular joint'],
 'esternoclavicular':['articular capsule of sternoclavicular joint'],
 'cotovelo':['articular capsule of elbow joint'],
 'radiocarpal':['articular capsule of radiocarpal joint'],
 'metacarpofalangicas':['articular capsules of metacarpophalangeal joints'],
 'interfalangicas-da-mao':['articular capsules of proximal interphalangeal joints','articular capsules of distal interphalangeal joints'],
 'coxofemoral':['articular capsule of hip joint'],
 'joelho':['articular capsule of knee joint'],
 'metatarsofalangicas':['articular capsules of metatarsophalangeal joints'],
 'temporomandibular':['articular capsule of temporomandibular joint'],
 'sinfise-pubica':['interpubic disc'],
 'intervertebrais':['intervertebral disc'],
 'radioulnar-distal':['articular disc of distal radio-ulnar joint'],
 'radioulnar-proximal':['annular ligament of radius'],
 'sacroiliaca':['anterior sacro-iliac ligament','interosseous sacro-iliac ligament','posterior sacro-iliac ligament'],
 'subtalar':['talocalcaneal interosseous ligament','anterior talocalcaneal ligament','posterior talocalcaneal ligament','medial talocalcaneal ligament','lateral talocalcaneal ligament'],
}
system_col={'musculos':'4: Muscular system','ossos':'1: Skeletal system','articulacoes':'3: Joints','ligamentos':'3: Joints','nervos':'7: Nervous system & Sense organs','tendoes':'4: Muscular system'}
mapping={};missing=[]
for s in catalog:
    en=s['english'].lower();terms=[en]+aliases.get(en,[])+joint_terms.get(s['id'],[])
    terms=[normalized(x) for x in terms if x]
    found=[]
    for o in inventory:
        if not o['faces'] or system_col[s['kind']] not in o['collections']:continue
        name=normalized(o['name'])
        if name in terms:found.append(o['name'])
        elif s['kind']=='musculos' and any((name.startswith(t+' (') or re.search(r'(?:head|part) of '+re.escape(t)+r'\)?$',name)) for t in terms):found.append(o['name'])
        elif s['kind']=='ossos' and ((en=='cervical vertebra' and re.fullmatch(r'vertebra c[3-7]',name)) or (en=='thoracic vertebra' and re.fullmatch(r'vertebra t\d+',name)) or (en=='lumbar vertebra' and re.fullmatch(r'vertebra l\d+',name)) or (en=='rib' and re.fullmatch(r'\w+ rib',name)) or (en in ['metacarpal bone','metatarsal bone'] and name.endswith(' '+en)) or (en=='phalanx of hand' and 'phalanx of' in name and name.endswith('of hand')) or (en=='phalanx of foot' and 'phalanx of' in name and name.endswith('of foot'))):found.append(o['name'])
        elif s['id']=='intervertebrais' and name.startswith('intervertebral disc '):found.append(o['name'])
        elif s['kind']=='ligamentos' and (name.endswith('part of '+en) or (s['id']=='ligamento-deltoide' and name in ['tibionavicular ligament','tibiocalcaneal ligament','posterior tibiotalar ligament','anterior tibiotalar ligament'])):found.append(o['name'])
        elif s['id']=='plexo-braquial' and 'brachial plexus' in name:found.append(o['name'])
    mapping[s['id']]=found
    if not found:missing.append((s['id'],en))
# Add named distal branches from the source nerve collections without assigning
# the same object to two study entries (e.g. tibial versus sciatic nerve).
used={name for values in mapping.values() for name in values}
for s in catalog:
    if s['kind']!='nervos' or not mapping[s['id']]:continue
    for o in inventory:
        if o['name'] in used or not o['faces'] or system_col['nervos'] not in o['collections']:continue
        if s['english'].lower() in [c.lower() for c in o['collections']]:
            mapping[s['id']].append(o['name']);used.add(o['name'])
(ROOT.parent/'scratch/z-mapping.json').write_text(json.dumps(mapping,indent=2),encoding='utf8')
print('Mapped',sum(bool(v) for v in mapping.values()),'objects',sum(map(len,mapping.values())))
print('Missing',missing)
