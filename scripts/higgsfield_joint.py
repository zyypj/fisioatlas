"""Executed with the Higgsfield 3D Jutsu Blender worker (bpy + artifacts)."""
import bpy, math
from mathutils import Vector
materials={}
for name,color in [('Osso',(.83,.75,.57,1)),('Cartilagem',(.19,.7,.76,1)),('Capsula',(.65,.43,.29,1)),('Sinovial',(.91,.43,.45,1)),('Ligamento',(.78,.72,.49,1))]:
    m=bpy.data.materials.new(name);m.diffuse_color=color;m.use_nodes=True
    m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=color
    m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.48
    materials[name]=m
def lathe(name,profile,material,start=0,end=2*math.pi):
    verts=[];faces=[];steps=64
    for radius,z in profile:
        for j in range(steps+1):
            a=start+(end-start)*j/steps;verts.append((radius*math.cos(a),radius*math.sin(a),z))
    for i in range(len(profile)-1):
        for j in range(steps):
            a=i*(steps+1)+j;faces.append((a,a+1,a+steps+2,a+steps+1))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);mesh.materials.append(materials[material])
    o['educational']='Esquema genérico ampliado; não representa uma articulação específica.'
    for p in mesh.polygons:p.use_smooth=True
for sign,label in [(1,'superior'),(-1,'inferior')]:
    lathe('Osso_'+label,[(0,sign*.155),(.018,sign*.155),(.021,sign*.075),(.037,sign*.046),(.040,sign*.015),(0,sign*.015)],'Osso')
    lathe('Cartilagem_'+label,[(0,sign*.015),(.04,sign*.015),(.041,sign*.010),(0,sign*.010)],'Cartilagem')
lathe('Capsula_fibrosa_em_corte',[(.027,-.07),(.051,-.045),(.054,0),(.051,.045),(.027,.07)],'Capsula',0,math.pi)
lathe('Membrana_sinovial_em_corte',[(.026,-.064),(.047,-.04),(.050,0),(.047,.04),(.026,.064)],'Sinovial',0,math.pi)
for side in [-1,1]:
    curve=bpy.data.curves.new('Ligamento','CURVE');curve.dimensions='3D';curve.bevel_depth=.003;curve.bevel_resolution=4
    s=curve.splines.new('BEZIER');s.bezier_points.add(3)
    for p,co in zip(s.bezier_points,[(side*.026,0,-.070),(side*.058,0,-.025),(side*.058,0,.025),(side*.026,0,.070)]):
        p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
    o=bpy.data.objects.new('Ligamento_extrinseco_'+str(side),curve);bpy.context.collection.objects.link(o);o.data.materials.append(materials['Ligamento'])
    bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
bpy.ops.object.camera_add(location=(.20,-.64,.17));cam=bpy.context.object;cam.name='Camera_de_estudo'
cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=.40
scene=bpy.context.scene;scene.camera=cam
for name,loc,energy in [('Luz_principal',(.25,-.35,.45),35),('Preenchimento',(-.35,-.15,.2),15),('Recorte',(0,.3,.35),25)]:
    bpy.ops.object.light_add(type='POINT',location=loc);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.shadow_soft_size=.2
if scene.world is None:scene.world=bpy.data.worlds.new('Ambiente')
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.6,.65,.6,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.4
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=700;scene.render.resolution_y=700;scene.render.resolution_percentage=100
scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG'
target=artifacts.file(name='articulacao-sinovial-esquema.png',media_type='image/png');scene.render.filepath=str(target.path)
bpy.ops.render.render(write_still=True);target.publish()
result={'mesh_names':[o.name for o in bpy.data.objects if o.type=='MESH'],'purpose':'Esquema genérico de articulação sinovial em corte','source':'https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints'}
