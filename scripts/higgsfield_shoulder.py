"""Higgsfield 3D Jutsu: editable, metre-scale DIDACTIC shoulder complements.

These surfaces are approximate topographic models, not segmented patient anatomy.
Coordinates are in the Z-Anatomy Blender frame (X left, Y posterior, Z superior).
Bone context objects are schematic and never imported into the anatomical atlas.
"""

import bpy, math
from mathutils import Vector

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
materials = {}
for name, color in [
    ("tendon", (0.89, 0.81, 0.62, 1)),
    ("cartilage", (0.18, 0.67, 0.72, 1)),
    ("synovial", (0.77, 0.33, 0.43, 1)),
    ("interval", (0.62, 0.49, 0.76, 1)),
    ("bone", (0.79, 0.75, 0.64, 1)),
    ("bursa", (0.30, 0.61, 0.80, 1)),
]:
    m = bpy.data.materials.new(name)
    m.diffuse_color = color
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = 0.52
    materials[name] = m


def tag(o, sid, material):
    o.name = sid + "__HG-r"
    o["structureId"] = sid
    o["source"] = "higgsfield-shoulder"
    o["representation"] = (
        "Aproximação didática; trajeto e espessura não validados por segmentação."
    )
    o.data.materials.append(materials[material])
    for p in getattr(o.data, "polygons", []):
        p.use_smooth = True
    return o


def ribbon(sid, points, widths, thickness=0.0018, material="tendon"):
    # Smooth Catmull-Rom path and an elliptical cross-section. End caps close the mesh.
    ps = [Vector(p) for p in points]
    verts = []
    faces = []
    steps = 48
    sides = 16
    for i in range(steps + 1):
        t = i / steps * (len(ps) - 1)
        k = min(int(t), len(ps) - 2)
        u = t - k
        a, b, c, d = ps[max(k - 1, 0)], ps[k], ps[k + 1], ps[min(k + 2, len(ps) - 1)]
        center = 0.5 * (
            (2 * b)
            + (-a + c) * u
            + (2 * a - 5 * b + 4 * c - d) * u * u
            + (-a + 3 * b - 3 * c + d) * u * u * u
        )
        tangent = (c - b).normalized()
        normal = tangent.cross(Vector((0, 0, 1)))
        if normal.length < 0.01:
            normal = tangent.cross(Vector((0, 1, 0)))
        normal.normalize()
        vertical = tangent.cross(normal).normalized()
        w = widths[k] * (1 - u) + widths[k + 1] * u
        for j in range(sides):
            angle = 2 * math.pi * j / sides
            verts.append(
                center
                + normal * (0.5 * w * math.cos(angle))
                + vertical * (0.5 * thickness * math.sin(angle))
            )
    for i in range(steps):
        for j in range(sides):
            a = i * sides + j
            b = i * sides + (j + 1) % sides
            faces.append((a, b, b + sides, a + sides))
    faces.extend(
        [tuple(reversed(range(sides))), tuple(steps * sides + j for j in range(sides))]
    )
    mesh = bpy.data.meshes.new(sid)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    o = bpy.data.objects.new(sid, mesh)
    bpy.context.collection.objects.link(o)
    return tag(o, sid, material)


def ellipsoid(sid, center, radii, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, location=center)
    o = bpy.context.object
    o.scale = radii
    return tag(o, sid, material)


ribbon(
    "tendao-supraespinal",
    [
        (-0.142, 0.052, 1.400),
        (-0.161, 0.038, 1.409),
        (-0.180, 0.026, 1.406),
        (-0.192, 0.025, 1.394),
    ],
    [0.018, 0.019, 0.018, 0.016],
    0.0028,
)
ribbon(
    "tendao-infraespinal",
    [
        (-0.145, 0.073, 1.377),
        (-0.163, 0.061, 1.390),
        (-0.181, 0.050, 1.392),
        (-0.193, 0.040, 1.386),
    ],
    [0.021, 0.021, 0.020, 0.017],
    0.0026,
)
ribbon(
    "tendao-redondo-menor",
    [
        (-0.153, 0.065, 1.353),
        (-0.168, 0.059, 1.365),
        (-0.183, 0.048, 1.375),
        (-0.194, 0.038, 1.374),
    ],
    [0.011, 0.011, 0.010, 0.009],
    0.0022,
)
ribbon(
    "tendao-subescapular",
    [
        (-0.133, 0.041, 1.370),
        (-0.146, 0.025, 1.382),
        (-0.159, 0.012, 1.389),
        (-0.172, 0.008, 1.382),
    ],
    [0.022, 0.022, 0.020, 0.017],
    0.0028,
)
ribbon(
    "tendao-cabeca-longa-biceps",
    [
        (-0.1445, 0.0363, 1.3952),
        (-0.158, 0.022, 1.407),
        (-0.175, 0.010, 1.402),
        (-0.181, 0.006, 1.382),
        (-0.191, 0.006, 1.340),
    ],
    [0.003, 0.003, 0.003, 0.003, 0.004],
    0.003,
)
ribbon(
    "cabo-rotador",
    [
        (-0.160, 0.018, 1.398),
        (-0.161, 0.032, 1.405),
        (-0.168, 0.049, 1.401),
        (-0.181, 0.060, 1.386),
    ],
    [0.004, 0.004, 0.004, 0.004],
    0.0018,
)
ribbon(
    "crescente-rotador",
    [(-0.178, 0.020, 1.405), (-0.183, 0.033, 1.404), (-0.187, 0.048, 1.395)],
    [0.009, 0.011, 0.010],
    0.0009,
)
ribbon(
    "polia-bicipital",
    [(-0.160, 0.015, 1.403), (-0.172, 0.012, 1.404), (-0.177, 0.008, 1.398)],
    [0.006, 0.007, 0.006],
    0.0013,
    "interval",
)
ribbon(
    "intervalo-rotador",
    [(-0.147, 0.026, 1.393), (-0.155, 0.021, 1.400), (-0.168, 0.012, 1.398)],
    [0.006, 0.014, 0.008],
    0.0008,
    "interval",
)
ellipsoid(
    "cartilagem-cabeca-umeral",
    (-0.156, 0.033, 1.380),
    (0.012, 0.020, 0.024),
    "cartilage",
)
ellipsoid(
    "cartilagem-glenoidal", (-0.147, 0.036, 1.378), (0.002, 0.010, 0.016), "cartilage"
)
ellipsoid(
    "recesso-subescapular", (-0.140, 0.025, 1.377), (0.010, 0.003, 0.008), "synovial"
)
ellipsoid("bolsa-subcoracoidea", (-0.139, 0.014, 1.389), (0.010, 0.003, 0.007), "bursa")
ellipsoid(
    "interface-escapulotoracica", (-0.109, 0.060, 1.329), (0.043, 0.003, 0.058), "bursa"
)

# Cutaway synovial lining: a half shell leaves the inner structures accessible.
verts = []
faces = []
rings = 32
steps = 48
for i in range(rings + 1):
    phi = 0.18 + (math.pi - 0.36) * i / rings
    for j in range(steps + 1):
        theta = math.pi * j / steps
        verts.append(
            (
                -0.163 + 0.027 * math.sin(phi) * math.cos(theta),
                0.033 + 0.021 * math.sin(phi) * math.sin(theta),
                1.378 + 0.028 * math.cos(phi),
            )
        )
for i in range(rings):
    for j in range(steps):
        a = i * (steps + 1) + j
        faces.append((a, a + 1, a + steps + 2, a + steps + 1))
m = bpy.data.meshes.new("synovial")
m.from_pydata(verts, [], faces)
m.update()
o = bpy.data.objects.new("synovial", m)
bpy.context.collection.objects.link(o)
tag(o, "membrana-sinovial-ombro", "synovial")
mod = o.modifiers.new("Espessura didática", "SOLIDIFY")
mod.thickness = 0.0006

# Schematic context; retained only in the editable Higgsfield scene.
ellipsoid(
    "contexto-cabeca-umeral", (-0.171, 0.035, 1.378), (0.022, 0.022, 0.024), "bone"
)
ribbon(
    "contexto-diafise-umeral",
    [(-0.180, 0.030, 1.368), (-0.191, 0.027, 1.327), (-0.205, 0.030, 1.27)],
    [0.021, 0.015, 0.014],
    0.014,
    "bone",
)
ellipsoid("contexto-glenoide", (-0.142, 0.038, 1.378), (0.005, 0.013, 0.020), "bone")

scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1
bpy.ops.object.camera_add(location=(-0.42, -0.32, 1.52))
cam = bpy.context.object
cam.name = "Camera anterior oblíqua"
cam.rotation_euler = (
    (Vector((-0.170, 0.032, 1.370)) - cam.location).to_track_quat("-Z", "Y").to_euler()
)
cam.data.type = "ORTHO"
cam.data.ortho_scale = 0.210
scene.camera = cam
for name, loc, power, size in [
    ("Key", (-0.34, -0.12, 1.61), 0.66, 0.12),
    ("Fill", (0.02, -0.08, 1.46), 0.24, 0.15),
    ("Rim", (-0.20, 0.21, 1.50), 0.42, 0.10),
]:
    bpy.ops.object.light_add(type="POINT", location=loc)
    l = bpy.context.object
    l.name = name
    l.data.energy = power
    l.data.shadow_soft_size = size
if not scene.world:
    scene.world = bpy.data.worlds.new("Ambiente de estudo")
scene.world.color = (0.12, 0.12, 0.12)
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "Khronos PBR Neutral"
bpy.data.objects["interface-escapulotoracica__HG-r"].hide_render = True
target = artifacts.file(name="ombro-higgsfield.png", media_type="image/png")
scene.render.filepath = target.path
bpy.ops.render.render(write_still=True)
target.publish()
result = {
    "model": "Complementos topográficos didáticos do ombro direito",
    "units": "metres",
    "representation": "approximate, not segmented anatomy",
    "structures": [
        o["structureId"]
        for o in bpy.data.objects
        if "structureId" in o and not o["structureId"].startswith("contexto-")
    ],
}
