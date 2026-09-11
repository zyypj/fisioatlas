"""Rebuild the current six-system atlas from locally downloaded Z-Anatomy."""
from pathlib import Path
import shutil, subprocess
root=Path(__file__).resolve().parents[1]
blender=shutil.which('blender')
if not blender:
    candidates=list((root.parent/'scratch/blender').glob('*/blender.exe'))
    if candidates:blender=str(candidates[0])
if not blender:raise SystemExit('Instale Blender 4.5 LTS e adicione blender ao PATH.')
if not (root.parent/'scratch/z-anatomy/Z-Anatomy/Startup.blend').exists():
    raise SystemExit('Extraia o ZIP oficial Z-Anatomy em ../scratch/z-anatomy/ antes de preparar.')
import sys
for command in [
    [blender,'--background','--factory-startup','--python','scripts/inspect_z_anatomy.py'],
    [sys.executable,'scripts/map_z_anatomy.py'],
    [blender,'--background','--factory-startup','--python','scripts/export_z_anatomy.py'],
    [shutil.which('node') or 'node','scripts/optimize_models.mjs'],
]:subprocess.run(command,cwd=root,check=True)
