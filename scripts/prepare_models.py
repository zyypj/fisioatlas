"""Convert licensed BodyParts3D v4 OBJ elements to indexed, per-system GLB assets.

Input: ../../scratch/{bodyparts.zip,parts.tsv,elements.tsv}; all mesh coordinates
are retained relative to one global frame (millimeters -> meters, Z-up -> Y-up).
No geometry is invented. See public/models/LICENSE.md.
"""
import json, zipfile, struct, math, hashlib
from pathlib import Path
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT.parent/'scratch'
DEST=ROOT/'public/models'
DEST.mkdir(parents=True,exist_ok=True)
catalog=json.loads((ROOT/'src/data/structures.json').read_text(encoding='utf8'))
names={}
for row in (RAW/'parts.tsv').read_text(encoding='utf-8-sig').splitlines()[1:]:
    c,b,n=row.split('\t'); names[n.lower()]=c
elements=defaultdict(set)
for row in (RAW/'elements.tsv').read_text(encoding='utf-8-sig').splitlines()[1:]:
    c,n,e=row.split('\t'); elements[c].add(e)
aliases={
 'deltoid':['clavicular part of deltoid','acromial part of deltoid','spinal part of deltoid'],
 'biceps brachii':['short head of biceps brachii','long head of biceps brachii'],
 'triceps brachii':['long head of triceps brachii','medial head of triceps brachii','lateral head of triceps brachii'],
 'biceps femoris':['long head of biceps femoris','short head of biceps femoris'],
 'gastrocnemius':['medial head of gastrocnemius','lateral head of gastrocnemius'],
 'sternum':['manubrium','body of sternum','xiphoid process'],
 'phalanx of hand':['phalanx of finger'], 'phalanx of foot':['phalanx of toe'],
 'peroneus longus':['fibularis longus'], 'peroneus brevis':['fibularis brevis'],
 'sphenoid':['sphenoid bone'], 'ethmoid':['ethmoid bone'],
 'scaphoid':['scaphoid bone'],'lunate':['lunate bone'],'triquetral':['triquetral bone'],
 'pisiform':['pisiform bone'],'trapezium':['trapezium bone'],'trapezoid':['trapezoid bone'],
 'capitate':['capitate bone'],'hamate':['hamate bone'],'cuboid':['cuboid bone'],
 'common fibular nerve':['common peroneal nerve'],
 'navicular bone':['navicular bone of foot'],
 'medial cuneiform':['medial cuneiform bone'],
 'intermediate cuneiform':['intermediate cuneiform bone'],
 'lateral cuneiform':['lateral cuneiform bone'],
 'trapezius':['ascending part of trapezius','transverse part of trapezius','descending part of trapezius'],
 'pectoralis major':['clavicular part of pectoralis major','sternocostal part of pectoralis major','abdominal part of pectoralis major'],
 'pronator teres':['humeral head of pronator teres','ulnar head of pronator teres'],
 'flexor carpi ulnaris':['humeral head of flexor carpi ulnaris','ulnar head of flexor carpi ulnaris'],
 'adductor pollicis':['oblique head of adductor pollicis','transverse head of adductor pollicis'],
}
archive=zipfile.ZipFile(RAW/'bodyparts.zip')
files={Path(n).stem:n for n in archive.namelist() if n.endswith('.obj')}
used=set(); groups=defaultdict(list); misses=[]
for entry in catalog:
    en=entry['english']; ids=set()
    for term in [en,*aliases.get(en,[])]:
        if term in names: ids |= elements[names[term]]
    entry['modelIds']=sorted(ids.intersection(files).difference(used))
    for eid in entry['modelIds']:
        used.add(eid); groups[entry['kind']].append((entry,eid))
    if en and not entry['modelIds']: misses.append((entry['name'],en))

def parse_obj(data):
    vertices=[]; faces=[]
    for line in data.decode('utf8').splitlines():
        s=line.split()
        if not s: continue
        if s[0]=='v':
            x,y,z=map(float,s[1:4])
            vertices.append([x/1000,z/1000,-y/1000])
        elif s[0]=='f':
            ids=[int(x.split('/')[0]) for x in s[1:]]
            ids=[i-1 if i>0 else len(vertices)+i for i in ids]
            for j in range(1,len(ids)-1): faces.extend([ids[0],ids[j],ids[j+1]])
    normals=[[0.,0.,0.] for _ in vertices]
    for k in range(0,len(faces),3):
        ia,ib,ic=faces[k:k+3]; a,b,c=[vertices[i] for i in [ia,ib,ic]]
        u=[b[j]-a[j] for j in range(3)]; v=[c[j]-a[j] for j in range(3)]
        n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
        for i in [ia,ib,ic]:
            for j in range(3): normals[i][j]+=n[j]
    for n in normals:
        length=math.sqrt(sum(x*x for x in n)) or 1
        for j in range(3): n[j]/=length
    return vertices,normals,faces

manifest=[]; centers={}; bounds={}
for kind,entries in groups.items():
    doc={'asset':{'version':'2.0','generator':'FisioAtlas: BodyParts3D OBJ to indexed GLB','copyright':'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International'},'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'buffers':[],'bufferViews':[],'accessors':[]}
    binary=bytearray()
    def accessor(values,typ,component,count,minimum=None,maximum=None):
        while len(binary)%4: binary.append(0)
        offset=len(binary); binary.extend(struct.pack('<'+('f' if component==5126 else 'I')*len(values),*values))
        view=len(doc['bufferViews']); doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(binary)-offset})
        acc={'bufferView':view,'componentType':component,'count':count,'type':typ}
        if minimum is not None: acc.update(min=minimum,max=maximum)
        idx=len(doc['accessors']); doc['accessors'].append(acc); return idx
    for entry,eid in entries:
        vertices,normals,faces=parse_obj(archive.read(files[eid]))
        if not vertices or not faces: raise ValueError(eid)
        lo=[min(v[j] for v in vertices) for j in range(3)]; hi=[max(v[j] for v in vertices) for j in range(3)]
        bounds[eid]={'min':lo,'max':hi,'id':entry['id']}
        pos=accessor([n for v in vertices for n in v],'VEC3',5126,len(vertices),lo,hi)
        norm=accessor([n for v in normals for n in v],'VEC3',5126,len(normals))
        ind=accessor(faces,'SCALAR',5125,len(faces))
        mesh=len(doc['meshes']);doc['meshes'].append({'name':entry['id']+'__'+eid,'primitives':[{'attributes':{'POSITION':pos,'NORMAL':norm},'indices':ind}]})
        doc['scenes'][0]['nodes'].append(len(doc['nodes']));doc['nodes'].append({'mesh':mesh,'name':entry['id']+'__'+eid,'extras':{'structureId':entry['id'],'elementId':eid}})
    while len(binary)%4:binary.append(0)
    doc['buffers']=[{'byteLength':len(binary)}]
    chunk=json.dumps(doc,separators=(',',':'),ensure_ascii=True).encode()
    chunk+=b' '*((-len(chunk))%4)
    glb=struct.pack('<III',0x46546C67,2,12+8+len(chunk)+8+len(binary))+struct.pack('<II',len(chunk),0x4E4F534A)+chunk+struct.pack('<II',len(binary),0x004E4942)+binary
    (DEST/f'{kind}.glb').write_bytes(glb)
    manifest.append({'kind':kind,'url':f'/models/{kind}.glb','bytes':len(glb),'meshes':len(entries)})
    print(kind,len(entries),round(len(glb)/1024/1024,2),'MiB',flush=True)
(ROOT/'src/data/structures.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf8')
(ROOT/'src/data/model-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(DEST/'bounds.json').write_text(json.dumps(bounds),encoding='utf8')
(DEST/'LICENSE.md').write_text('''# BodyParts3D 4.0

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
License statement: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
License: https://creativecommons.org/licenses/by/4.0/
Publication: https://doi.org/10.1093/nar/gkn613

Original: isa_BP3D_4.0_obj_99.zip (99% polygon reduction). Changes: conversion from OBJ to GLB; scale from mm to m; Z-up to Y-up rotation; calculated vertex normals; grouping by educational category. No invented anatomical mesh. Runtime coloration and rigid segment animations are educational adaptations, not biomechanical simulation.
''',encoding='utf8')
(DEST/'provenance.json').write_text(json.dumps({'archiveSHA256':hashlib.sha256((RAW/'bodyparts.zip').read_bytes()).hexdigest(),'manifest':manifest,'unmapped':misses,'converted':'2026-09-10'},ensure_ascii=False,indent=2),encoding='utf8')
print('No dedicated mesh:',misses)
print('Bounds:',[min(v['min'][i] for v in bounds.values()) for i in range(3)],[max(v['max'][i] for v in bounds.values()) for i in range(3)])
