"""Export named Z-Anatomy components in their common anatomical coordinate frame.

Run with Blender --background --factory-startup --python scripts/export_z_anatomy.py.
Source scripts are disabled. Geometry is evaluated, triangulated and transformed,
not generated from prompts. Each source object and association is recorded.
"""
import bpy,json,struct,hashlib,math
from pathlib import Path
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1];RAW=ROOT.parent/'scratch';DEST=ROOT/'public/models'
mapping=json.loads((RAW/'z-mapping.json').read_text(encoding='utf8'))
catalog=json.loads((ROOT/'src/data/structures.json').read_text(encoding='utf8'))
# Prefere o Startup-split.blend, que tem as malhas de grupo (interosseos, lumbricais)
# separadas em musculos individuais por scripts/split_muscle_islands.py.
_blend=RAW/'z-anatomy/Z-Anatomy/Startup-split.blend'
if not _blend.exists():_blend=RAW/'z-anatomy/Z-Anatomy/Startup.blend'
bpy.ops.wm.open_mainfile(filepath=str(_blend),load_ui=False,use_scripts=False)
# Keep geometry modifiers, including thickness and curves. Cap display subdivision
# only to preserve a practical interactive triangle budget.
for o in bpy.data.objects:
    for mod in o.modifiers:
        if mod.type=='SUBSURF':mod.levels=min(mod.levels,1)
    if o.type=='CURVE':o.data.resolution_u=min(o.data.resolution_u,6);o.data.bevel_resolution=min(o.data.bevel_resolution,3)
deps=bpy.context.evaluated_depsgraph_get()
groups=defaultdict(list);coverage={};bounds={};manifest=[]
for s in catalog:
    s['modelIds']=[]
    for name in mapping[s['id']]:groups[s['kind']].append((s,name))
    s['modelSource']='z-anatomy' if mapping[s['id']] else None
    s['modelComponents']=mapping[s['id']]
    if s['kind']=='articulacoes' and mapping[s['id']]:
        names=' '.join(mapping[s['id']]).lower()
        s['modelNote']=('Representação articular por cápsula: a cápsula envolve a articulação, não é uma superfície óssea.' if 'capsul' in names else 'Representação articular pelos componentes anatômicos listados abaixo (discos, meniscos ou ligamentos de suporte).')
    if mapping[s['id']] and 'z-anatomy' not in s['sources']:s['sources'].append('z-anatomy')
for kind,entries in groups.items():
    doc={'asset':{'version':'2.0','generator':'FisioAtlas Z-Anatomy conversion','copyright':'Z-Anatomy contributors / BodyParts3D; CC-BY-SA-4.0. See Z-ANATOMY-LICENSE.md'},'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'buffers':[],'bufferViews':[],'accessors':[]}
    binary=bytearray();total_triangles=0
    def accessor(values,typ,component,count,lo=None,hi=None):
        while len(binary)%4:binary.append(0)
        start=len(binary)
        from array import array
        binary.extend(array('f' if component==5126 else 'I',values).tobytes())
        view=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':start,'byteLength':len(binary)-start})
        a={'bufferView':view,'componentType':component,'count':count,'type':typ}
        if lo is not None:a.update(min=lo,max=hi)
        idx=len(doc['accessors']);doc['accessors'].append(a);return idx
    for s,name in entries:
        obj=bpy.data.objects[name];ev=obj.evaluated_get(deps);mesh=ev.to_mesh()
        if mesh is None:raise RuntimeError('No mesh: '+name)
        mesh.calc_loop_triangles();mat=obj.matrix_world;normalmat=mat.to_3x3().inverted().transposed()
        points=[];normals=[]
        for v in mesh.vertices:
            p=mat@v.co;n=(normalmat@v.normal).normalized()
            points.append((p.x,p.z,-p.y));normals.append((n.x,n.z,-n.y))
        faces=[int(i) for tri in mesh.loop_triangles for i in tri.vertices]
        if mat.determinant()<0:
            for i in range(0,len(faces),3):faces[i+1],faces[i+2]=faces[i+2],faces[i+1]
        ev.to_mesh_clear()
        if not points or not faces:raise RuntimeError('Empty geometry: '+name)
        assert all(math.isfinite(n) for v in points for n in v),name
        eid='ZA-'+hashlib.sha256(name.encode()).hexdigest()[:14];s['modelIds'].append(eid)
        lo=[min(v[i] for v in points) for i in range(3)];hi=[max(v[i] for v in points) for i in range(3)]
        bounds[eid]={'id':s['id'],'min':lo,'max':hi,'sourceObject':name}
        pos=accessor((x for v in points for x in v),'VEC3',5126,len(points),lo,hi)
        norm=accessor((x for v in normals for x in v),'VEC3',5126,len(normals))
        ind=accessor(faces,'SCALAR',5125,len(faces))
        idx=len(doc['meshes']);n=s['id']+'__'+eid
        doc['meshes'].append({'name':n,'primitives':[{'attributes':{'POSITION':pos,'NORMAL':norm},'indices':ind}]})
        doc['scenes'][0]['nodes'].append(len(doc['nodes']));doc['nodes'].append({'mesh':idx,'name':n,'extras':{'structureId':s['id'],'elementId':eid,'sourceObject':name,'source':'Z-Anatomy'}})
        total_triangles+=len(faces)//3
    while len(binary)%4:binary.append(0)
    doc['buffers']=[{'byteLength':len(binary)}];chunk=json.dumps(doc,separators=(',',':')).encode();chunk+=b' '*((-len(chunk))%4)
    data=struct.pack('<III',0x46546C67,2,28+len(chunk)+len(binary))+struct.pack('<II',len(chunk),0x4E4F534A)+chunk+struct.pack('<II',len(binary),0x004E4942)+binary
    filename='z-'+kind+'.glb';(DEST/filename).write_bytes(data)
    manifest.append({'kind':kind,'url':'/models/'+filename,'bytes':len(data),'meshes':len(entries)})
    print(kind,len(entries),total_triangles,len(data),flush=True)
for s in catalog:coverage[s['id']]={'name':s['name'],'kind':s['kind'],'sourceObjects':mapping[s['id']],'modelIds':s['modelIds']}
(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(ROOT/'src/data/model-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(ROOT/'src/data/structures.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf8')
(DEST/'bounds.json').write_text(json.dumps(bounds),encoding='utf8')
(DEST/'coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2),encoding='utf8')
(DEST/'provenance.json').write_text(json.dumps({'source':'https://github.com/Z-Anatomy/Models-of-human-anatomy','archiveSHA256':hashlib.sha256((RAW/'z-anatomy.zip').read_bytes()).hexdigest(),'manifest':manifest,'unmapped':[(s['name'],s['english']) for s in catalog if not s['modelIds']],'converted':'2026-09-10','transform':'Blender world coordinates in metres; Z-up to Y-up; capped viewport subdivision 1, curve resolution 6 and bevel 3; evaluated modifiers, triangulation, per-vertex normals. No anatomical geometry invented.'},ensure_ascii=False,indent=2),encoding='utf8')
print('Completed',sum(bool(s['modelIds']) for s in catalog),'of',len(catalog),flush=True)
