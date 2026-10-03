"""Measure shoulder landmarks in the source frame; no source geometry is changed."""

import bpy, json
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(
    filepath=str(ROOT.parent / "scratch/z-anatomy/Z-Anatomy/Startup-split.blend"),
    load_ui=False,
    use_scripts=False,
)
names = [
    "Acromion.i",
    "Coracoid process.i",
    "Glenoid fossa.i",
    "Greater tubercle.i",
    "Lesser tubercle.i",
    "Supraglenoid tubercle.i",
    "Supraspinatus muscle.or",
    "Infraspinatus muscle.or",
    "Subscapularis muscle.or",
    "Teres minor muscle.or",
    "Long head of biceps brachii.or",
]
out = {}
for name in names:
    o = bpy.data.objects.get(name)
    if not o:
        continue
    points = [o.matrix_world @ v.co for v in o.data.vertices]
    if not points:
        points = [o.matrix_world.translation]
    out[name] = {
        "center": list(sum(points, Vector()) / len(points)),
        "min": [min(p[i] for p in points) for i in range(3)],
        "max": [max(p[i] for p in points) for i in range(3)],
        "parent": o.parent.name if o.parent else None,
    }
(ROOT.parent / "scratch/shoulder-landmarks.json").write_text(
    json.dumps(out, indent=2), encoding="utf8"
)
print(json.dumps(out), flush=True)
