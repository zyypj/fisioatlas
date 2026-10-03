import * as THREE from "three";
import type { Structure } from "../../types";

export type RevealMode = "off" | "ghost" | "hide";
export interface LayerMesh {
  id: string;
  bounds: THREE.Box3;
}

/** Keep one side in focus, matching the atlas camera's right-side default. */
export function selectedBounds(meshes: LayerMesh[], id: string) {
  let matches = meshes.filter((m) => m.id === id);
  const right = matches.filter(
    (m) => m.bounds.getCenter(new THREE.Vector3()).x < -0.015,
  );
  if (right.length) matches = right;
  if (!matches.length) return null;
  const bounds = new THREE.Box3();
  for (const m of matches) bounds.union(m.bounds);
  return bounds;
}

/** Nine sight lines against bounds, not triangle raycasts. Conservative visual
 * estimate, independent of material opacity: hidden blockers cannot oscillate.
 * No anatomical depth ranking is inferred from these boxes.
 */
export function findOccluders(
  meshes: LayerMesh[],
  selectedId: string,
  bounds: THREE.Box3,
  camera: THREE.PerspectiveCamera,
) {
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const extent = (axis: THREE.Vector3) =>
    (Math.abs(axis.x) * size.x +
      Math.abs(axis.y) * size.y +
      Math.abs(axis.z) * size.z) *
    0.3;
  const rays: { ray: THREE.Ray; distance: number }[] = [];
  for (const x of [-1, 0, 1])
    for (const y of [-1, 0, 1]) {
      const target = center
        .clone()
        .addScaledVector(right, x * extent(right))
        .addScaledVector(up, y * extent(up));
      const direction = target.clone().sub(camera.position);
      rays.push({
        ray: new THREE.Ray(
          camera.position.clone(),
          direction.clone().normalize(),
        ),
        distance: direction.length(),
      });
    }
  const point = new THREE.Vector3();
  const ids = new Set<string>();
  for (const m of meshes) {
    if (m.id === selectedId) continue;
    // A region that contains the camera is not a reliable occlusion estimate.
    if (m.bounds.containsPoint(camera.position)) continue;
    for (const { ray, distance } of rays) {
      if (
        ray.intersectBox(m.bounds, point) &&
        camera.position.distanceTo(point) < distance - 0.008
      ) {
        ids.add(m.id);
        break;
      }
    }
  }
  return [...ids].sort();
}

export function isInStudyContext(
  mesh: LayerMesh,
  selected: Structure,
  bounds: THREE.Box3,
) {
  if (mesh.id === selected.id || selected.related.includes(mesh.id))
    return true;
  return mesh.bounds.intersectsBox(bounds.clone().expandByScalar(0.12));
}

export function smartOpacity(
  base: number,
  id: string,
  selectedId: string | null,
  mode: RevealMode,
  occluders: ReadonlySet<string>,
  inContext: boolean,
) {
  if (id !== selectedId && !inContext) return 0;
  if (id === selectedId || mode === "off" || !occluders.has(id)) return base;
  return mode === "hide" ? 0 : base * 0.08;
}
