import type * as THREE from 'three';

/** Raycaster does not exclude invisible objects: filter before triangle tests. */
export function pickableMeshes<T extends THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(meshes: T[]) {
  return meshes.filter(m => m.visible && m.material.opacity > 0.18);
}

/** Snap fades to their destination so they finish and the renderer can sleep. */
export function fadeOpacity(current: number, target: number) {
  const next = current + (target - current) * 0.2;
  return Math.abs(next - target) < 0.002 ? target : next;
}
