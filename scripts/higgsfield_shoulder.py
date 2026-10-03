"""Higgsfield 3D Jutsu: editable, metre-scale DIDACTIC shoulder complements.

These surfaces are approximate topographic models, not segmented patient anatomy.
Coordinates are in the Z-Anatomy Blender frame (X left, Y posterior, Z superior).
Bone context objects are schematic and never imported into the anatomical atlas.
"""
import bpy, math
from mathutils import Vector

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
materials = {}
for name, color in [('tendon',(.89,.81,.62,1)), ('cartilage',(.18,.67,.72,1)), ('synovial',(.77,.33,.43,1)), ('interval',(.62,.49,.76,1)), ('bone',(.79,.75,.64,1)), ('bursa',(.30,.61,.80,1))]:
    m=bpy.data.materials.new(name); m.diffuse_color=color; m.use_nodes=True
    p=m.node_tree.nodes['Principled BSDF']; p.inputs['Base Color'].default_value=color; p.inputs['Roughness'].default_value=.52
    materials[name]=m

def tag(o, sid, material):
    o.name=sid+'__HG-r'; o['structureId']=sid; o['source']='higgsfield-shoulder'
    o['representation']='Aproximação didática; trajeto e espessura não validados por segmentação.'
    o.data.materials.append(materials[material])
    for p in getattr(o.data,'polygons',[]): p.use_smooth=True
    return o

def ribbon(sid, points, widths, thickness=.0018, material='tendon'):
    # Smooth Catmull-Rom path and an elliptical cross-section. End caps close the mesh.
    ps=[Vector(p) for p in points]; verts=[]; faces=[]; steps=48; sides=16
    for i in range(steps+1):
        t=i/steps*(len(ps)-1); k=min(int(t),len(ps)-2); u=t-k
        a,b,c,d=ps[max(k-1,0)],ps[k],ps[k+1],ps[min(k+2,len(ps)-1)]
        center=.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u)
        tangent=(c-b).normalized(); normal=tangent.cross(Vector((0,0,1)))
        if normal.length<.01: normal=tangent.cross(Vector((0,1,0)))
        normal.normalize(); vertical=tangent.cross(normal).normalized()
        w=widths[k]*(1-u)+widths[k+1]*u
        for j in range(sides):
            angle=2*math.pi*j/sides
            verts.append(center+normal*(.5*w*math.cos(angle))+vertical*(.5*thickness*math.sin(angle)))
    for i in range(steps):
        for j in range(sides):
            a=i*sides+j; b=i*sides+(j+1)%sides; faces.append((a,b,b+sides,a+sides))
    faces.extend([tuple(reversed(range(sides))),tuple(steps*sides+j for j in range(sides))])
    mesh=bpy.data.meshes.new(sid); mesh.from_pydata(verts,[],faces); mesh.update()
    o=bpy.data.objects.new(sid,mesh); bpy.context.collection.objects.link(o)
    return tag(o,sid,material)

def ellipsoid(sid,center,radii,material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64,ring_count=32,location=center)
    o=bpy.context.object; o.scale=radii; return tag(o,sid,material)

ribbon('tendao-supraespinal',[(-.142,.052,1.400),(-.161,.038,1.409),(-.180,.026,1.406),(-.192,.025,1.394)],[.018,.019,.018,.016],.0028)
ribbon('tendao-infraespinal',[(-.145,.073,1.377),(-.163,.061,1.390),(-.181,.050,1.392),(-.193,.040,1.386)],[.021,.021,.020,.017],.0026)
ribbon('tendao-redondo-menor',[(-.153,.065,1.353),(-.168,.059,1.365),(-.183,.048,1.375),(-.194,.038,1.374)],[.011,.011,.010,.009],.0022)
ribbon('tendao-subescapular',[(-.133,.041,1.370),(-.146,.025,1.382),(-.159,.012,1.389),(-.172,.008,1.382)],[.022,.022,.020,.017],.0028)
ribbon('tendao-cabeca-longa-biceps',[(-.1445,.0363,1.3952),(-.158,.022,1.407),(-.175,.010,1.402),(-.181,.006,1.382),(-.191,.006,1.340)],[.003,.003,.003,.003,.004],.003)
ribbon('cabo-rotador',[(-.160,.018,1.398),(-.161,.032,1.405),(-.168,.049,1.401),(-.181,.060,1.386)],[.004,.004,.004,.004],.0018)
ribbon('crescente-rotador',[(-.178,.020,1.405),(-.183,.033,1.404),(-.187,.048,1.395)],[.009,.011,.010],.0009)
ribbon('polia-bicipital',[(-.160,.015,1.403),(-.172,.012,1.404),(-.177,.008,1.398)],[.006,.007,.006],.0013, 'interval')
ribbon('intervalo-rotador',[(-.147,.026,1.393),(-.155,.021,1.400),(-.168,.012,1.398)],[.006,.014,.008],.0008,'interval')
ellipsoid('cartilagem-cabeca-umeral',(-.156,.033,1.380),(.012,.020,.024),'cartilage')
ellipsoid('cartilagem-glenoidal',(-.147,.036,1.378),(.002,.010,.016),'cartilage')
ellipsoid('recesso-subescapular',(-.140,.025,1.377),(.010,.003,.008),'synovial')
ellipsoid('bolsa-subcoracoidea',(-.139,.014,1.389),(.010,.003,.007),'bursa')
ellipsoid('interface-escapulotoracica',(-.109,.060,1.329),(.043,.003,.058),'bursa')

# Cutaway synovial lining: a half shell leaves the inner structures accessible.
verts=[]; faces=[]; rings=32; steps=48
for i in range(rings+1):
    phi=.18+(math.pi-.36)*i/rings
    for j in range(steps+1):
        theta=math.pi*j/steps
        verts.append((-.163+.027*math.sin(phi)*math.cos(theta),.033+.021*math.sin(phi)*math.sin(theta),1.378+.028*math.cos(phi)))
for i in range(rings):
    for j in range(steps):
        a=i*(steps+1)+j; faces.append((a,a+1,a+steps+2,a+steps+1))
m=bpy.data.meshes.new('synovial');m.from_pydata(verts,[],faces);m.update()
o=bpy.data.objects.new('synovial',m);bpy.context.collection.objects.link(o);tag(o,'membrana-sinovial-ombro','synovial')
mod=o.modifiers.new('Espessura didática','SOLIDIFY');mod.thickness=.0006

# Schematic context; retained only in the editable Higgsfield scene.
ellipsoid('contexto-cabeca-umeral',(-.171,.035,1.378),(.022,.022,.024),'bone')
ribbon('contexto-diafise-umeral',[(-.180,.030,1.368),(-.191,.027,1.327),(-.205,.030,1.27)],[.021,.015,.014],.014,'bone')
ellipsoid('contexto-glenoide',(-.142,.038,1.378),(.005,.013,.020),'bone')

scene=bpy.context.scene;scene.unit_settings.system='METRIC';scene.unit_settings.scale_length=1
bpy.ops.object.camera_add(location=(-.42,-.32,1.52));cam=bpy.context.object;cam.name='Camera anterior oblíqua'
cam.rotation_euler=(Vector((-.170,.032,1.370))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=.210;scene.camera=cam
for name,loc,power,size in [('Key',(-.34,-.12,1.61),.66,.12),('Fill',(.02,-.08,1.46),.24,.15),('Rim',(-.20,.21,1.50),.42,.10)]:
    bpy.ops.object.light_add(type='POINT',location=loc);l=bpy.context.object;l.name=name;l.data.energy=power;l.data.shadow_soft_size=size
if not scene.world: scene.world=bpy.data.worlds.new('Ambiente de estudo')
scene.world.color=(.12,.12,.12);scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=900;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.view_settings.view_transform='Khronos PBR Neutral'
bpy.data.objects['interface-escapulotoracica__HG-r'].hide_render=True
target=artifacts.file(name='ombro-higgsfield.png',media_type='image/png');scene.render.filepath=target.path;bpy.ops.render.render(write_still=True);target.publish()
result={'model':'Complementos topográficos didáticos do ombro direito','units':'metres','representation':'approximate, not segmented anatomy','structures':[o['structureId'] for o in bpy.data.objects if 'structureId' in o and not o['structureId'].startswith('contexto-')]}
