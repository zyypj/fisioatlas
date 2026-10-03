import * as THREE from "three";
import type { Structure } from "../../types";
import { lasegueJoints, lasegueWeights, smoothMotion } from "./lasegueRig";
import type { LaseguePose } from "./lasegueRig";
import { motionWeight } from "./softMotion";

export interface SlumpPose extends LaseguePose {
  knee: number;
  trunk: number;
  neck: number;
}
export const slumpDurations = [2.5, 4.5, 3.5, 5, 3.5, 4, 7];
export function slumpStepPose(step: number, time: number): SlumpPose {
  const e = (start: number, duration: number) =>
    smoothMotion((time - start) / duration);
  const pose: SlumpPose = {
    hip: 90,
    knee: 90,
    ankle: 0,
    trunk: 0,
    neck: 0,
    support: 0,
  };
  if (step === 0) return pose;
  pose.trunk = 25;
  if (step === 1) {
    pose.trunk = 25 * e(0.3, 3.5);
    return pose;
  }
  pose.neck = 30;
  if (step === 2) {
    pose.neck = 30 * e(0.3, 2.5);
    return pose;
  }
  pose.knee = 20;
  if (step === 3) {
    pose.knee = 90 - 70 * e(0.3, 4);
    return pose;
  }
  pose.ankle = 12;
  if (step === 4) {
    pose.ankle = 12 * e(0.3, 2.5);
    return pose;
  }
  pose.neck = 0;
  if (step === 5) {
    pose.neck = 30 * (1 - e(0.3, 3));
    return pose;
  }
  pose.ankle = 12 * (1 - e(0, 1.2));
  pose.knee = 20 + 70 * e(1.3, 2.6);
  pose.trunk = 25 * (1 - e(4.1, 2.3));
  return pose;
}

export interface SlumpJoints {
  hip: THREE.Vector3;
  knee: THREE.Vector3;
  ankle: THREE.Vector3;
  leftHip: THREE.Vector3;
  leftKnee: THREE.Vector3;
  leftAnkle: THREE.Vector3;
  trunk: THREE.Vector3;
  neck: THREE.Vector3;
}
export function slumpJoints(
  bounds: (id: string, right: boolean) => THREE.Box3,
): SlumpJoints {
  const right = lasegueJoints(bounds("femur", true), bounds("talus", true));
  const left = lasegueJoints(bounds("femur", false), bounds("talus", false));
  left.hip.x = bounds("femur", false).min.x + 0.018;
  const knee = (right: boolean) => {
    const box = bounds("tibia", right),
      point = box.getCenter(new THREE.Vector3());
    point.y = box.max.y - 0.003;
    return point;
  };
  return {
    ...right,
    leftHip: left.hip,
    leftAnkle: left.ankle,
    knee: knee(true),
    leftKnee: knee(false),
    trunk: new THREE.Vector3(0, 0.99, -0.035),
    neck: new THREE.Vector3(0, 1.43, -0.035),
  };
}

const legRegions = new Set(["Coxa", "Joelho", "Perna", "Tornozelo", "Pé"]);
const armRegions = new Set(["Braço", "Cotovelo", "Antebraço", "Punho", "Mão"]);
export function slumpWeights(
  structure: Structure,
  center: THREE.Vector3,
  point: THREE.Vector3,
  bounds: THREE.Box3,
  joints: SlumpJoints,
) {
  const right = center.x < 0,
    knee = right ? joints.knee : joints.leftKnee,
    ankle = right ? joints.ankle : joints.leftAnkle;
  const leg = legRegions.has(structure.region);
  let hipWeight = 0,
    kneeWeight = 0,
    ankleWeight = 0;
  if (structure.kind === "ossos" && leg) {
    hipWeight = 1;
    kneeWeight = ["Perna", "Tornozelo", "Pé"].includes(structure.region)
      ? 1
      : 0;
    ankleWeight = structure.region === "Pé" || structure.id === "talus" ? 1 : 0;
  } else if (structure.kind !== "ossos") {
    const mirroredCenter = center.clone(),
      mirroredPoint = point.clone(),
      mirroredBounds = bounds.clone();
    if (!right) {
      mirroredCenter.x *= -1;
      mirroredPoint.x *= -1;
      mirroredBounds.min.x = -bounds.max.x;
      mirroredBounds.max.x = -bounds.min.x;
    }
    hipWeight = lasegueWeights(
      structure,
      mirroredCenter,
      mirroredPoint,
      joints.hip,
      joints.ankle,
      mirroredBounds,
    )[0];
    if (leg) {
      kneeWeight = motionWeight(point.y, knee.y, 0.12);
      ankleWeight = motionWeight(point.y, ankle.y, 0.05);
    }
  }
  const arm =
    armRegions.has(structure.region) ||
    structure.id === "umero" ||
    structure.id === "deltoide";
  const trunkWeight =
    hipWeight > 0 ||
    leg ||
    structure.region === "Pelve" ||
    structure.region === "Quadril"
      ? 0
      : arm
        ? 1
        : THREE.MathUtils.smoothstep(
            structure.kind === "ossos" ? center.y : point.y,
            0.96,
            1.15,
          );
  const neckWeight = arm
    ? 0
    : THREE.MathUtils.smoothstep(
        structure.kind === "ossos" ? center.y : point.y,
        1.41,
        1.52,
      );
  return {
    leg: [hipWeight, kneeWeight, ankleWeight, right ? 1 : 0],
    upper: [trunkWeight, neckWeight, arm ? 1 : 0, right ? 1 : 0],
  };
}

function rotate(
  point: THREE.Vector3,
  pivot: THREE.Vector3,
  degrees: number,
  weight: number,
) {
  return point
    .sub(pivot)
    .applyAxisAngle(
      new THREE.Vector3(1, 0, 0),
      THREE.MathUtils.degToRad(degrees) * weight,
    )
    .add(pivot);
}
/** Hierarchy: ankle → knee → hip; neck → trunk. Both limbs start seated,
 * but only the right knee and ankle change during the test. */
export function deformSlumpPoint(
  point: THREE.Vector3,
  j: SlumpJoints,
  pose: LaseguePose,
  leg: ArrayLike<number>,
  upper: ArrayLike<number>,
  target = new THREE.Vector3(),
) {
  const right = leg[3] > 0,
    hip = right ? j.hip : j.leftHip,
    knee = right ? j.knee : j.leftKnee,
    ankle = right ? j.ankle : j.leftAnkle;
  target.copy(point);
  rotate(target, ankle, right ? -pose.ankle : 0, leg[2]);
  rotate(target, knee, right ? (pose.knee ?? 90) : 90, leg[1]);
  rotate(target, hip, -pose.hip, leg[0]);
  if (upper[2] > 0) {
    const shoulder = new THREE.Vector3(
      upper[3] > 0 ? -0.18 : 0.18,
      1.38,
      -0.025,
    );
    rotate(target, shoulder, 15, upper[2]);
    target
      .sub(shoulder)
      .applyAxisAngle(
        new THREE.Vector3(0, 0, 1),
        THREE.MathUtils.degToRad(upper[3] > 0 ? 15 : -15) * upper[2],
      )
      .add(shoulder);
  }
  rotate(target, j.neck, pose.neck ?? 0, upper[1]);
  return rotate(target, j.trunk, pose.trunk ?? 0, upper[0]);
}

export function bindSlumpShader(
  mesh: { material: THREE.Material },
  j: SlumpJoints,
) {
  const uniforms = {
    slrHip: { value: -Math.PI / 2 },
    slrAnkle: { value: 0 },
    slrKnee: { value: Math.PI / 2 },
    slrTrunk: { value: 0 },
    slrNeck: { value: 0 },
    slumpHipR: { value: j.hip },
    slumpHipL: { value: j.leftHip },
    slumpKneeR: { value: j.knee },
    slumpKneeL: { value: j.leftKnee },
    slumpAnkleR: { value: j.ankle },
    slumpAnkleL: { value: j.leftAnkle },
    slumpTrunk: { value: j.trunk },
    slumpNeck: { value: j.neck },
  };
  mesh.material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      `attribute vec4 slumpLeg; attribute vec4 slumpUpper;
      uniform float slrHip,slrAnkle,slrKnee,slrTrunk,slrNeck;
      uniform vec3 slumpHipR,slumpHipL,slumpKneeR,slumpKneeL,slumpAnkleR,slumpAnkleL,slumpTrunk,slumpNeck;
      vec3 slumpX(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
      vec3 slumpZ(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
      vec3 slumpNormal(vec3 p){
        p=slumpX(p,slrAnkle*slumpLeg.z*slumpLeg.w);
        p=slumpX(p,mix(1.57079632679,slrKnee,slumpLeg.w)*slumpLeg.y);
        p=slumpX(p,slrHip*slumpLeg.x);
        p=slumpZ(slumpX(p,.2617993878*slumpUpper.z),mix(-.2617993878,.2617993878,slumpUpper.w)*slumpUpper.z);
        return slumpX(slumpX(p,slrNeck*slumpUpper.y),slrTrunk*slumpUpper.x);
      }
      vec3 slumpPosition(vec3 p){
        vec3 a=mix(slumpAnkleL,slumpAnkleR,slumpLeg.w),k=mix(slumpKneeL,slumpKneeR,slumpLeg.w),h=mix(slumpHipL,slumpHipR,slumpLeg.w);
        p=a+slumpX(p-a,slrAnkle*slumpLeg.z*slumpLeg.w);
        p=k+slumpX(p-k,mix(1.57079632679,slrKnee,slumpLeg.w)*slumpLeg.y);
        p=h+slumpX(p-h,slrHip*slumpLeg.x);
        vec3 shoulder=vec3(mix(.18,-.18,slumpUpper.w),1.38,-.025);
        p=shoulder+slumpZ(slumpX(p-shoulder,.2617993878*slumpUpper.z),mix(-.2617993878,.2617993878,slumpUpper.w)*slumpUpper.z);
        p=slumpNeck+slumpX(p-slumpNeck,slrNeck*slumpUpper.y);
        return slumpTrunk+slumpX(p-slumpTrunk,slrTrunk*slumpUpper.x);
      }
    ` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed=slumpPosition(transformed);",
      )
      .replace(
        "#include <beginnormal_vertex>",
        "#include <beginnormal_vertex>\nobjectNormal=slumpNormal(objectNormal);",
      );
  };
  mesh.material.customProgramCacheKey = () => "fisioatlas-slump-chain-v1";
  return uniforms;
}

export function attachSlumpRig(
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
  structure: Structure,
  joints: SlumpJoints,
  pose: { value: LaseguePose },
) {
  const bounds = mesh.geometry.boundingBox!.clone(),
    center = bounds.getCenter(new THREE.Vector3()),
    position = mesh.geometry.getAttribute("position");
  const leg = new Float32Array(position.count * 4),
    upper = new Float32Array(position.count * 4),
    point = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const weights = slumpWeights(structure, center, point, bounds, joints);
    leg.set(weights.leg, i * 4);
    upper.set(weights.upper, i * 4);
  }
  mesh.geometry.setAttribute("slumpLeg", new THREE.BufferAttribute(leg, 4));
  mesh.geometry.setAttribute("slumpUpper", new THREE.BufferAttribute(upper, 4));
  mesh.getVertexPosition = (i, target) =>
    deformSlumpPoint(
      point.fromBufferAttribute(position, i),
      joints,
      pose.value,
      leg.subarray(i * 4, i * 4 + 4),
      upper.subarray(i * 4, i * 4 + 4),
      target,
    );
  mesh.geometry.boundingBox = null;
  mesh.geometry.boundingSphere = new THREE.Sphere(joints.trunk.clone(), 2);
}
