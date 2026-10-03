import * as THREE from "three";
import type { Layers, Structure } from "../../types";
import { motionWeight } from "./softMotion";

export interface LaseguePose {
  hip: number;
  ankle: number;
  support: number;
}
export const lasegueDurations = [2.4, 5.5, 2.8, 5.8, 6.2];
export const laseguePresets: Record<string, Layers> = {
  completo: {
    ossos: 100,
    musculos: 100,
    articulacoes: 50,
    ligamentos: 80,
    tendoes: 100,
    nervos: 100,
  },
  ossos: {
    ossos: 100,
    musculos: 0,
    articulacoes: 65,
    ligamentos: 70,
    tendoes: 0,
    nervos: 0,
  },
  neural: {
    ossos: 100,
    musculos: 0,
    articulacoes: 0,
    ligamentos: 0,
    tendoes: 0,
    nervos: 100,
  },
};
export const neuralPath = new Set([
  "nervo-ciatico",
  "nervo-tibial",
  "nervo-fibular-comum",
  "nervo-fibular-profundo",
  "nervo-fibular-superficial",
]);

/** Quintic easing has zero velocity and acceleration at both ends. */
export function smoothMotion(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}
export function lasegueStepPose(step: number, time: number): LaseguePose {
  const ease = (start: number, duration: number) =>
    smoothMotion((time - start) / duration);
  switch (step) {
    case 0:
      return { hip: 0, ankle: 0, support: ease(0, 1.6) };
    case 1:
      return { hip: 45 * ease(0.4, 4.4), ankle: 0, support: 1 };
    case 2:
      return { hip: 45, ankle: 0, support: 1 };
    case 3:
      return {
        hip: 45 - 10 * ease(0, 1.8),
        ankle: 12 * ease(2.4, 2),
        support: 1,
      };
    case 4:
      return {
        hip: 35 * (1 - ease(1.2, 4.2)),
        ankle: 12 * (1 - ease(0, 1)),
        support: 1 - ease(5.4, 0.8),
      };
    default:
      return { hip: 0, ankle: 0, support: 0 };
  }
}

/** Native atlas: X=laterality, Y=long axis, Z=anterior. Supine:
 * longitudinal axis horizontal, anterior surface facing upward. */
export const supineMatrix = new THREE.Matrix4().set(
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
);

export function lasegueJoints(femur: THREE.Box3, talus: THREE.Box3) {
  // Medial proximal femoral head, rather than the shaft's center.
  const hip = new THREE.Vector3(
    femur.max.x - 0.018,
    femur.max.y - 0.025,
    (femur.min.z + femur.max.z) / 2,
  );
  const ankle = talus.getCenter(new THREE.Vector3());
  ankle.y = talus.max.y - 0.006;
  return { hip, ankle };
}

const distalRegions = new Set(["Coxa", "Joelho", "Perna", "Tornozelo", "Pé"]);
const crossingHip = new Set([
  "iliaco",
  "psoas-maior",
  "iliopsoas",
  "piriforme",
  "gluteo-maximo",
  "gluteo-medio",
  "gluteo-minimo",
  "tensor-da-fascia-lata",
]);
export function lasegueWeights(
  structure: Structure,
  center: THREE.Vector3,
  point: THREE.Vector3,
  hip: THREE.Vector3,
  ankle: THREE.Vector3,
) {
  if (center.x >= 0) return [0, 0] as const;
  const lower = distalRegions.has(structure.region);
  if (structure.kind === "ossos")
    return lower
      ? ([
          1,
          structure.region === "Pé" || structure.id === "talus" ? 1 : 0,
        ] as const)
      : ([0, 0] as const);
  if (
    !lower &&
    structure.region !== "Quadril" &&
    structure.region !== "Pelve" &&
    !crossingHip.has(structure.id)
  )
    return [0, 0] as const;
  const side = THREE.MathUtils.smoothstep(-point.x, 0.005, 0.025);
  return [
    motionWeight(point.y, hip.y, 0.13) * side,
    motionWeight(point.y, ankle.y, 0.05) * side,
  ] as const;
}

export function deformLaseguePoint(
  point: THREE.Vector3,
  hip: THREE.Vector3,
  ankle: THREE.Vector3,
  pose: LaseguePose,
  weights: readonly number[],
  target = new THREE.Vector3(),
) {
  const axis = new THREE.Vector3(1, 0, 0);
  return target
    .copy(point)
    .sub(ankle)
    .applyAxisAngle(axis, -THREE.MathUtils.degToRad(pose.ankle) * weights[1])
    .add(ankle)
    .sub(hip)
    .applyAxisAngle(axis, -THREE.MathUtils.degToRad(pose.hip) * weights[0])
    .add(hip);
}

/** Two joint deformations, applied at the ankle before the hip. Knee extension
 * is retained: all leg bones share the same hip transform. Soft tissue uses
 * continuous attachment weights, not per-frame CPU vertex rewrites. */
export function bindLasegueShader(
  mesh: { material: THREE.Material },
  hip: THREE.Vector3,
  ankle: THREE.Vector3,
) {
  const uniforms = {
    slrHip: { value: 0 },
    slrAnkle: { value: 0 },
    slrHipPivot: { value: hip },
    slrAnklePivot: { value: ankle },
  };
  mesh.material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      `attribute vec2 lasegueWeight;
      uniform float slrHip; uniform float slrAnkle;
      uniform vec3 slrHipPivot; uniform vec3 slrAnklePivot;
      vec3 slrRotate(vec3 p,float a){float c=cos(a);float s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
    ` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed=slrAnklePivot+slrRotate(transformed-slrAnklePivot,slrAnkle*lasegueWeight.y);\ntransformed=slrHipPivot+slrRotate(transformed-slrHipPivot,slrHip*lasegueWeight.x);",
      )
      .replace(
        "#include <beginnormal_vertex>",
        "#include <beginnormal_vertex>\nobjectNormal=slrRotate(slrRotate(objectNormal,slrAnkle*lasegueWeight.y),slrHip*lasegueWeight.x);",
      );
  };
  mesh.material.customProgramCacheKey = () =>
    "fisioatlas-lasegue-two-joints-v1";
  return uniforms;
}

export function attachLasegueRig(
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
  structure: Structure,
  hip: THREE.Vector3,
  ankle: THREE.Vector3,
  pose: { value: LaseguePose },
) {
  const position = mesh.geometry.getAttribute("position");
  const center = mesh.geometry.boundingBox!.getCenter(new THREE.Vector3());
  const values = new Float32Array(position.count * 2),
    point = new THREE.Vector3();
  let moving = false;
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const weights = lasegueWeights(structure, center, point, hip, ankle);
    values[i * 2] = weights[0];
    values[i * 2 + 1] = weights[1];
    moving ||= weights[0] > 0 || weights[1] > 0;
  }
  mesh.geometry.setAttribute(
    "lasegueWeight",
    new THREE.BufferAttribute(values, 2),
  );
  if (!moving) return null;
  const uniforms = bindLasegueShader(mesh, hip, ankle);
  mesh.getVertexPosition = (index, target) => {
    point.fromBufferAttribute(position, index);
    return deformLaseguePoint(
      point,
      hip,
      ankle,
      pose.value,
      [values[index * 2], values[index * 2 + 1]],
      target,
    );
  };
  // Pose-dependent bounds would require scanning vertices. A conservative sphere
  // about the hip covers both rotations for frustum culling and picking.
  mesh.geometry.computeBoundingSphere();
  const rest = mesh.geometry.boundingSphere!;
  mesh.geometry.boundingSphere = new THREE.Sphere(
    hip.clone(),
    rest.center.distanceTo(hip) + rest.radius + ankle.distanceTo(hip) * 0.3,
  );
  mesh.geometry.boundingBox = null;
  return uniforms;
}
