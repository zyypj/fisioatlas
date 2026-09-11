import bpy, json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(root/'scratch/z-anatomy/Z-Anatomy/Startup.blend'), load_ui=False, use_scripts=False)
rows=[]
for o in bpy.data.objects:
    if o.type in ('MESH','CURVE'):
        rows.append({'name':o.name,'type':o.type,'vertices':len(o.data.vertices) if o.type=='MESH' else 0,'faces':len(o.data.polygons) if o.type=='MESH' else 1,'collections':[c.name for c in o.users_collection],'bounds':[list(o.matrix_world @ __import__('mathutils').Vector(v)) for v in o.bound_box]})
(root/'scratch/z-inventory.json').write_text(json.dumps(rows,ensure_ascii=False),encoding='utf8')
print('OBJECTS',len(rows))
