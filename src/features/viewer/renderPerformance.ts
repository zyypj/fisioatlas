import type * as THREE from 'three';

export type RenderQuality = 'auto' | 'light' | 'detail';
export const QUALITY_STORAGE_KEY = 'fisioatlas-render-quality';

export function parseRenderQuality(value: string | null): RenderQuality {
  return value === 'light' || value === 'detail' ? value : 'auto';
}

export function renderProfile(quality: RenderQuality, touchDevice: boolean) {
  const light = quality === 'light' || (quality === 'auto' && touchDevice);
  return { light, maxPixelRatio: light ? 1 : 1.75, maxPixels: light ? 750_000 : 2_000_000 };
}

/** Budget physical pixels, not CSS size: large high-DPI tablets need a cap. */
export function renderPixelRatio(width: number, height: number, deviceRatio: number, profile: ReturnType<typeof renderProfile>) {
  const ratio = Math.min(deviceRatio || 1, profile.maxPixelRatio);
  return Math.min(ratio, Math.sqrt(profile.maxPixels / Math.max(1, width * height)));
}

/** Keep the hashed shader active at 100% too: slider updates only its uniform.
 * Depth writes let nearer surviving fragments reject hidden layers. The tradeoff
 * is visible grain; detailed mode retains blended transparency.
 */
export function applyTransparency(material: THREE.MeshStandardMaterial, opacity: number, light: boolean) {
  const transparent = !light && opacity < 1;
  if (material.transparent !== transparent || material.alphaHash !== light) {
    material.transparent = transparent;
    material.alphaHash = light;
    material.needsUpdate = true;
  }
  material.opacity = opacity;
  material.depthWrite = light || opacity === 1;
}

/** Raycaster does not exclude invisible objects: filter before triangle tests. */
export function pickableMeshes<T extends THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(meshes: T[]) {
  return meshes.filter(m => m.visible && m.material.opacity > 0.18);
}

/** Snap fades to their destination so they finish and the renderer can sleep. */
export function fadeOpacity(current: number, target: number) {
  const next = current + (target - current) * 0.2;
  return Math.abs(next - target) < 0.002 ? target : next;
}
