import * as THREE from "three";

type AnatomyMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

/** Separate depth-writing solid and sorted translucent batches. The original
 * components retain their structure IDs for picking and animation. */
export class AtlasBatches {
  readonly opaque: THREE.BatchedMesh;
  readonly transparent: THREE.BatchedMesh;
  private entries: {
    mesh: AnatomyMesh;
    solidId: number;
    fadeId: number;
    key: string;
  }[] = [];
  private color = new THREE.Vector4();
  constructor(meshes: AnatomyMesh[]) {
    const vertices = meshes.reduce(
      (sum, m) => sum + m.geometry.getAttribute("position").count,
      0,
    );
    const indices = meshes.reduce((sum, m) => sum + m.geometry.index!.count, 0);
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.66,
      side: THREE.DoubleSide,
      forceSinglePass: true,
    });
    this.opaque = new THREE.BatchedMesh(
      meshes.length,
      vertices,
      indices,
      material,
    );
    const fade = material.clone();
    fade.transparent = true;
    fade.depthWrite = false;
    this.transparent = new THREE.BatchedMesh(
      meshes.length,
      vertices,
      indices,
      fade,
    );
    for (const mesh of meshes) {
      const geometry = mesh.geometry.clone();
      for (const key of Object.keys(geometry.attributes))
        if (key !== "position" && key !== "normal")
          geometry.deleteAttribute(key);
      const solidId = this.opaque.addInstance(
        this.opaque.addGeometry(geometry),
      );
      const fadeId = this.transparent.addInstance(
        this.transparent.addGeometry(geometry),
      );
      this.entries.push({ mesh, solidId, fadeId, key: "" });
      geometry.dispose();
    }
  }
  sync(active: boolean) {
    this.opaque.visible = active;
    this.transparent.visible = active;
    if (!active) return;
    for (const entry of this.entries) {
      const { mesh, solidId, fadeId } = entry;
      const { opacity, color } = mesh.material;
      const key = `${mesh.visible}:${opacity}:${color.r}:${color.g}:${color.b}`;
      if (key === entry.key) continue;
      entry.key = key;
      this.opaque.setVisibleAt(solidId, mesh.visible && opacity === 1);
      this.transparent.setVisibleAt(fadeId, mesh.visible && opacity < 1);
      this.opaque.setColorAt(solidId, color);
      this.transparent.setColorAt(
        fadeId,
        this.color.set(color.r, color.g, color.b, opacity),
      );
    }
  }
  dispose() {
    this.opaque.dispose();
    this.transparent.dispose();
    this.opaque.material.dispose();
    this.transparent.material.dispose();
  }
}
