import * as THREE from "three";
import type { Structure } from "../../types";
import { slumpJoints, slumpWeights } from "./slumpRig";
import type { SlumpJoints } from "./slumpRig";
import { componentStructure } from "./componentStructure";

/**
 * Rig genérico dos testes clínicos do quadrante inferior.
 *
 * Coordenadas do atlas: X lateral (lado direito negativo), Y vertical, Z
 * anterior; repouso = posição anatômica em pé. Cada vértice recebe pesos de
 * quadril, joelho, tornozelo, hálux, tronco e braço (os mesmos do Slump, para
 * os dois lados) e o shader aplica as rotações do distal para o proximal:
 * hálux → tornozelo → joelho → quadril → tronco. A postura (supino, prono,
 * decúbito lateral, sentado, em pé) e os ajustes globais (inclinação e queda
 * da pelve, rotação sobre o pé de apoio, pé fixo no chão) vão na matriz do
 * grupo do corpo. Ângulos em graus; translações em milímetros.
 */

export interface LimbPose {
  hipFlex: number;
  hipAbd: number;
  /** Positivo = rotação externa. */
  hipRot: number;
  kneeFlex: number;
  /** Rotação da tíbia; positivo = externa (pé para fora). */
  kneeRot: number;
  /** Angulação no plano frontal; positivo = valgo (perna para fora). */
  kneeValgus: number;
  /** Translação anterior da tíbia (mm); negativa = posterior. */
  tibiaShift: number;
  /** Positivo = dorsiflexão; negativo = flexão plantar. */
  ankleDorsi: number;
  /** Positivo = inversão. */
  ankleInv: number;
  /** Rotação do pé sob a tíbia; positivo = externa (ponta para fora). */
  ankleRot: number;
  /** Translação anterior do tálus (mm), como na gaveta do tornozelo. */
  talarShift: number;
  /** Extensão da metatarsofalângica do hálux. */
  hallux: number;
}

export interface ClinicalPose {
  right: LimbPose;
  left: LimbPose;
  /** Positivo = flexão; negativo = extensão. */
  trunkFlex: number;
  /** Positivo = inclinação para a direita. */
  trunkSide: number;
  /** Positivo = rotação para a direita. */
  trunkRot: number;
  /** Flexão de cada ombro (braço à frente; 180 = acima da cabeça). */
  rightArmFlex: number;
  leftArmFlex: number;
  /** Báscula anterior da pelve com os pés no chão (inclinar-se à frente). */
  pelvisTilt: number;
  /** Queda da pelve do lado sem apoio (Trendelenburg), em pé. */
  pelvisDrop: number;
  /** Rotação do corpo sobre o pé de apoio (Thessaly), em pé. */
  yaw: number;
}

export type ClinicalBase = "supino" | "prono" | "lateral" | "sentado" | "em-pe";
export type Side = "direito" | "esquerdo";

export const restLimb = (): LimbPose => ({
  hipFlex: 0,
  hipAbd: 0,
  hipRot: 0,
  kneeFlex: 0,
  kneeRot: 0,
  kneeValgus: 0,
  tibiaShift: 0,
  ankleDorsi: 0,
  ankleInv: 0,
  ankleRot: 0,
  talarShift: 0,
  hallux: 0,
});
export const restPose = (): ClinicalPose => ({
  right: restLimb(),
  left: restLimb(),
  trunkFlex: 0,
  trunkSide: 0,
  trunkRot: 0,
  rightArmFlex: 0,
  leftArmFlex: 0,
  pelvisTilt: 0,
  pelvisDrop: 0,
  yaw: 0,
});

/** Patch de pose: só os campos que mudam em relação à pose anterior. */
export type PosePatch = Partial<
  Omit<ClinicalPose, "right" | "left"> & {
    right: Partial<LimbPose>;
    left: Partial<LimbPose>;
  }
>;

export function applyPatch(pose: ClinicalPose, patch: PosePatch) {
  return {
    ...pose,
    ...patch,
    right: { ...pose.right, ...patch.right },
    left: { ...pose.left, ...patch.left },
  } as ClinicalPose;
}

export function lerpPose(a: ClinicalPose, b: ClinicalPose, t: number) {
  const limb = (x: LimbPose, y: LimbPose) =>
    Object.fromEntries(
      (Object.keys(x) as (keyof LimbPose)[]).map((key) => [
        key,
        THREE.MathUtils.lerp(x[key], y[key], t),
      ]),
    ) as unknown as LimbPose;
  const out = { ...a } as ClinicalPose;
  for (const key of Object.keys(a) as (keyof ClinicalPose)[])
    if (key !== "right" && key !== "left")
      (out[key] as number) = THREE.MathUtils.lerp(
        a[key] as number,
        b[key] as number,
        t,
      );
  out.right = limb(a.right, b.right);
  out.left = limb(a.left, b.left);
  return out;
}

export interface ClinicalJoints extends SlumpJoints {
  /** Cabeça do 1º metatarsal (eixo da metatarsofalângica do hálux). */
  mtp: THREE.Vector3;
  leftMtp: THREE.Vector3;
  /** Centro da cabeça do úmero de cada lado. */
  shoulder: THREE.Vector3;
  leftShoulder: THREE.Vector3;
}

export function clinicalJoints(
  bounds: (id: string, right: boolean) => THREE.Box3,
): ClinicalJoints {
  const base = slumpJoints(bounds);
  const mtp = (right: boolean) => {
    const box = bounds("primeiro-metatarsal", right);
    return new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      box.min.y + 0.006,
      box.max.z - 0.008,
    );
  };
  const shoulder = (right: boolean) => {
    const box = bounds("umero", right);
    return new THREE.Vector3(
      right ? box.max.x - 0.025 : box.min.x + 0.025,
      box.max.y - 0.021,
      (box.min.z + box.max.z) / 2,
    );
  };
  return {
    ...base,
    mtp: mtp(true),
    leftMtp: mtp(false),
    shoulder: shoulder(true),
    leftShoulder: shoulder(false),
  };
}

/** Pesos de um ponto: [quadril, joelho, tornozelo, lado (1 = direito)],
 *  [tronco, braço, hálux, lado]. */
export interface ClinicalWeights {
  leg: [number, number, number, number];
  upper: [number, number, number, number];
}

const HALUX_BONES = new Set([
  "falange-proximal-do-halux",
  "falange-distal-do-halux",
]);

export function clinicalWeights(
  structure: Structure,
  center: THREE.Vector3,
  point: THREE.Vector3,
  bounds: THREE.Box3,
  joints: ClinicalJoints,
): ClinicalWeights {
  const w = slumpWeights(structure, center, point, bounds, joints);
  const right = center.x < 0;
  const mtp = right ? joints.mtp : joints.leftMtp;
  let hallux = 0;
  if (HALUX_BONES.has(structure.id)) hallux = 1;
  else if (structure.kind !== "ossos" && structure.region === "Pé")
    hallux =
      THREE.MathUtils.smoothstep(point.z, mtp.z - 0.004, mtp.z + 0.012) *
      (1 - THREE.MathUtils.smoothstep(Math.abs(point.x - mtp.x), 0.014, 0.026));
  return {
    leg: [w.leg[0], w.leg[1], w.leg[2], right ? 1 : 0],
    upper: [w.upper[0], w.upper[2], hallux, right ? 1 : 0],
  };
}

const X = new THREE.Vector3(1, 0, 0),
  Y = new THREE.Vector3(0, 1, 0),
  Z = new THREE.Vector3(0, 0, 1);
const rad = THREE.MathUtils.degToRad;
const q = (axis: THREE.Vector3, degrees: number) =>
  new THREE.Quaternion().setFromAxisAngle(axis, rad(degrees));

/** Eixo-ângulo de um quaternion (para o peso escalar o ângulo). */
function axisAngle(quaternion: THREE.Quaternion) {
  const n = quaternion.clone().normalize();
  if (n.w < 0) n.set(-n.x, -n.y, -n.z, -n.w);
  const angle = 2 * Math.acos(THREE.MathUtils.clamp(n.w, -1, 1));
  const s = Math.sqrt(Math.max(0, 1 - n.w * n.w));
  const axis =
    s < 1e-6
      ? new THREE.Vector3(1, 0, 0)
      : new THREE.Vector3(n.x / s, n.y / s, n.z / s);
  return { axis, angle };
}

export interface LimbRig {
  hip: { axis: THREE.Vector3; angle: number };
  knee: { axis: THREE.Vector3; angle: number };
  ankle: { axis: THREE.Vector3; angle: number };
  hallux: number;
  kneeShift: THREE.Vector3;
  ankleShift: THREE.Vector3;
}
export interface ClinicalRigState {
  right: LimbRig;
  left: LimbRig;
  trunk: { axis: THREE.Vector3; angle: number };
  /** Ângulo de flexão de cada ombro (rad), [direito, esquerdo]. */
  armAngles: [number, number];
  /** Ajuste global aplicado ao grupo do corpo (coordenadas do atlas). */
  global: THREE.Matrix4;
}

/** Converte a pose em eixos-ângulos por articulação e na matriz global. */
export function poseRig(
  pose: ClinicalPose,
  joints: ClinicalJoints,
  base: ClinicalBase,
  stance: Side | "ambos" | undefined,
): ClinicalRigState {
  const center = joints.hip.clone().add(joints.leftHip).multiplyScalar(0.5);
  const stanceHip =
    stance === "esquerdo"
      ? joints.leftHip
      : stance === "direito"
        ? joints.hip
        : center;
  const stanceAnkle =
    stance === "esquerdo"
      ? joints.leftAnkle
      : stance === "direito"
        ? joints.ankle
        : joints.ankle.clone().add(joints.leftAnkle).multiplyScalar(0.5);
  // Ajustes globais (só em pé): báscula e queda da pelve sobre os quadris,
  // rotação sobre o pé de apoio.
  const standing = base === "em-pe";
  const tilt = q(X, standing ? pose.pelvisTilt : 0);
  const drop = q(
    Z,
    standing ? (stance === "esquerdo" ? -1 : 1) * pose.pelvisDrop : 0,
  );
  const yaw = q(Y, standing ? pose.yaw : 0);
  const about = (rotation: THREE.Quaternion, pivot: THREE.Vector3) =>
    new THREE.Matrix4()
      .makeTranslation(pivot.x, pivot.y, pivot.z)
      .multiply(new THREE.Matrix4().makeRotationFromQuaternion(rotation))
      .multiply(
        new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z),
      );
  const global = about(yaw, stanceAnkle)
    .multiply(about(drop, stanceHip))
    .multiply(about(tilt, center));
  const planted = (side: Side) =>
    standing && (stance === side || stance === "ambos");
  const limb = (limbPose: LimbPose, side: Side): LimbRig => {
    const s = side === "direito" ? -1 : 1;
    let hip = q(X, -limbPose.hipFlex)
      .multiply(q(Z, s * limbPose.hipAbd))
      .multiply(q(Y, s * limbPose.hipRot));
    let kneeRot = limbPose.kneeRot;
    // Perna de apoio: compensa a báscula e a queda da pelve no quadril e a
    // rotação do corpo na tíbia, para o pé continuar plantado.
    if (planted(side)) {
      hip = drop.clone().multiply(tilt).invert().multiply(hip);
      kneeRot -= s * pose.yaw;
    }
    const knee = q(X, limbPose.kneeFlex)
      .multiply(q(Z, s * limbPose.kneeValgus))
      .multiply(q(Y, s * kneeRot));
    const ankle = q(X, -limbPose.ankleDorsi)
      .multiply(q(Z, -s * limbPose.ankleInv))
      .multiply(q(Y, s * limbPose.ankleRot));
    return {
      hip: axisAngle(hip),
      knee: axisAngle(knee),
      ankle: axisAngle(ankle),
      hallux: -rad(limbPose.hallux),
      kneeShift: new THREE.Vector3(0, 0, limbPose.tibiaShift / 1000),
      ankleShift: new THREE.Vector3(0, 0, limbPose.talarShift / 1000),
    };
  };
  const trunk = axisAngle(
    q(Y, -pose.trunkRot)
      .multiply(q(Z, pose.trunkSide))
      .multiply(q(X, pose.trunkFlex)),
  );
  const state: ClinicalRigState = {
    right: limb(pose.right, "direito"),
    left: limb(pose.left, "esquerdo"),
    trunk,
    armAngles: [-rad(pose.rightArmFlex), -rad(pose.leftArmFlex)],
    global,
  };
  // Pé de apoio fixo no chão: translada o corpo para que o tornozelo de apoio
  // volte ao lugar depois das rotações.
  if (standing && stance) {
    const target = stanceAnkle.clone();
    const moved = (side: Side) =>
      deformClinicalPoint(
        side === "direito" ? joints.ankle : joints.leftAnkle,
        {
          leg: [1, 1, 0, side === "direito" ? 1 : 0],
          upper: [0, 0, 0, side === "direito" ? 1 : 0],
        },
        state,
        joints,
      ).applyMatrix4(global);
    const now =
      stance === "ambos"
        ? moved("direito").add(moved("esquerdo")).multiplyScalar(0.5)
        : moved(stance);
    state.global = new THREE.Matrix4()
      .makeTranslation(target.x - now.x, target.y - now.y, target.z - now.z)
      .multiply(global);
  }
  return state;
}

function rotateAbout(
  point: THREE.Vector3,
  pivot: THREE.Vector3,
  axis: THREE.Vector3,
  angle: number,
) {
  if (!angle) return point;
  return point.sub(pivot).applyAxisAngle(axis, angle).add(pivot);
}

/** Mesma deformação do shader, na CPU (seleção, setas, câmera e testes). */
export function deformClinicalPoint(
  point: THREE.Vector3,
  weights: ClinicalWeights,
  rig: ClinicalRigState,
  joints: ClinicalJoints,
  target = new THREE.Vector3(),
) {
  const [hipW, kneeW, ankleW, side] = weights.leg;
  const [trunkW, armW, halluxW] = weights.upper;
  const right = side > 0.5;
  const limb = right ? rig.right : rig.left;
  const hip = right ? joints.hip : joints.leftHip,
    knee = right ? joints.knee : joints.leftKnee,
    ankle = right ? joints.ankle : joints.leftAnkle,
    mtp = right ? joints.mtp : joints.leftMtp,
    shoulder = right ? joints.shoulder : joints.leftShoulder;
  target.copy(point);
  rotateAbout(target, mtp, X, limb.hallux * halluxW);
  target.addScaledVector(limb.ankleShift, ankleW);
  rotateAbout(target, ankle, limb.ankle.axis, limb.ankle.angle * ankleW);
  target.addScaledVector(limb.kneeShift, kneeW);
  rotateAbout(target, knee, limb.knee.axis, limb.knee.angle * kneeW);
  rotateAbout(target, hip, limb.hip.axis, limb.hip.angle * hipW);
  rotateAbout(target, shoulder, X, rig.armAngles[right ? 0 : 1] * armW);
  rotateAbout(target, joints.trunk, rig.trunk.axis, rig.trunk.angle * trunkW);
  return target;
}

/** Anexa os pesos à malha e faz a seleção seguir os vértices deformados. */
export function attachClinicalRig(
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
  structure: Structure,
  joints: ClinicalJoints,
  rig: { value: ClinicalRigState },
) {
  const component = componentStructure(
    structure,
    mesh.userData.sourceObject ?? "",
  );
  const bounds = mesh.geometry.boundingBox!.clone(),
    center = bounds.getCenter(new THREE.Vector3()),
    position = mesh.geometry.getAttribute("position");
  const leg = new Float32Array(position.count * 4),
    upper = new Float32Array(position.count * 4),
    point = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const w = clinicalWeights(component, center, point, bounds, joints);
    leg.set(w.leg, i * 4);
    upper.set(w.upper, i * 4);
  }
  mesh.geometry.setAttribute("clinicalLeg", new THREE.BufferAttribute(leg, 4));
  mesh.geometry.setAttribute(
    "clinicalUpper",
    new THREE.BufferAttribute(upper, 4),
  );
  const weights: ClinicalWeights = {
    leg: [0, 0, 0, 0],
    upper: [0, 0, 0, 0],
  };
  mesh.getVertexPosition = (i, target) => {
    weights.leg = Array.from(
      leg.subarray(i * 4, i * 4 + 4),
    ) as ClinicalWeights["leg"];
    weights.upper = Array.from(
      upper.subarray(i * 4, i * 4 + 4),
    ) as ClinicalWeights["upper"];
    return deformClinicalPoint(
      point.fromBufferAttribute(position, i),
      weights,
      rig.value,
      joints,
      target,
    );
  };
  mesh.geometry.boundingBox = null;
  mesh.geometry.boundingSphere = new THREE.Sphere(joints.trunk.clone(), 2.2);
}

/** Injeta a deformação no shader do material (e no de profundidade). */
export function bindClinicalShader(
  mesh: { material: THREE.Material },
  joints: ClinicalJoints,
) {
  const v3 = () => ({ value: new THREE.Vector3(1, 0, 0) });
  const uniforms = {
    cHipR: { value: joints.hip },
    cHipL: { value: joints.leftHip },
    cKneeR: { value: joints.knee },
    cKneeL: { value: joints.leftKnee },
    cAnkleR: { value: joints.ankle },
    cAnkleL: { value: joints.leftAnkle },
    cMtpR: { value: joints.mtp },
    cMtpL: { value: joints.leftMtp },
    cShoulderR: { value: joints.shoulder },
    cShoulderL: { value: joints.leftShoulder },
    cTrunk: { value: joints.trunk },
    cHipAxisR: v3(),
    cHipAxisL: v3(),
    cKneeAxisR: v3(),
    cKneeAxisL: v3(),
    cAnkleAxisR: v3(),
    cAnkleAxisL: v3(),
    cTrunkAxis: v3(),
    cKneeShiftR: { value: new THREE.Vector3() },
    cKneeShiftL: { value: new THREE.Vector3() },
    cAnkleShiftR: { value: new THREE.Vector3() },
    cAnkleShiftL: { value: new THREE.Vector3() },
    // ângulos: quadril, joelho, tornozelo, hálux (x, y, z, w) por lado
    cAnglesR: { value: new THREE.Vector4() },
    cAnglesL: { value: new THREE.Vector4() },
    // tronco, braço
    cUpper: { value: new THREE.Vector3() },
  };
  mesh.material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      `attribute vec4 clinicalLeg; attribute vec4 clinicalUpper;
      uniform vec3 cHipR,cHipL,cKneeR,cKneeL,cAnkleR,cAnkleL,cMtpR,cMtpL,cShoulderR,cShoulderL,cTrunk;
      uniform vec3 cHipAxisR,cHipAxisL,cKneeAxisR,cKneeAxisL,cAnkleAxisR,cAnkleAxisL,cTrunkAxis;
      uniform vec3 cKneeShiftR,cKneeShiftL,cAnkleShiftR,cAnkleShiftL;
      uniform vec4 cAnglesR,cAnglesL; uniform vec3 cUpper;
      vec3 cRot(vec3 v, vec3 k, float a) {
        if (a == 0.0) return v;
        return v * cos(a) + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - cos(a));
      }
      vec3 clinicalMove(vec3 p, bool normal) {
        float r = clinicalLeg.w;
        vec4 ang = mix(cAnglesL, cAnglesR, r);
        vec3 mtp = mix(cMtpL, cMtpR, r), ankle = mix(cAnkleL, cAnkleR, r);
        vec3 knee = mix(cKneeL, cKneeR, r), hip = mix(cHipL, cHipR, r);
        vec3 shoulder = mix(cShoulderL, cShoulderR, r);
        vec3 aAxis = normalize(mix(cAnkleAxisL, cAnkleAxisR, r));
        vec3 kAxis = normalize(mix(cKneeAxisL, cKneeAxisR, r));
        vec3 hAxis = normalize(mix(cHipAxisL, cHipAxisR, r));
        vec3 o = normal ? vec3(0.0) : vec3(1.0);
        p = mtp*o + cRot(p - mtp*o, vec3(1.0,0.0,0.0), ang.w * clinicalUpper.z);
        if (!normal) p += mix(cAnkleShiftL, cAnkleShiftR, r) * clinicalLeg.z;
        p = ankle*o + cRot(p - ankle*o, aAxis, ang.z * clinicalLeg.z);
        if (!normal) p += mix(cKneeShiftL, cKneeShiftR, r) * clinicalLeg.y;
        p = knee*o + cRot(p - knee*o, kAxis, ang.y * clinicalLeg.y);
        p = hip*o + cRot(p - hip*o, hAxis, ang.x * clinicalLeg.x);
        p = shoulder*o + cRot(p - shoulder*o, vec3(1.0,0.0,0.0), mix(cUpper.z, cUpper.y, r) * clinicalUpper.y);
        p = cTrunk*o + cRot(p - cTrunk*o, normalize(cTrunkAxis), cUpper.x * clinicalUpper.x);
        return p;
      }
    ` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed = clinicalMove(transformed, false);",
      )
      .replace(
        "#include <beginnormal_vertex>",
        "#include <beginnormal_vertex>\nobjectNormal = clinicalMove(objectNormal, true);",
      );
  };
  mesh.material.customProgramCacheKey = () => "fisioatlas-clinical-rig-v2";
  return uniforms;
}

/** Atualiza os uniforms a partir do estado do rig. */
export function updateClinicalUniforms(
  uniforms: ReturnType<typeof bindClinicalShader>,
  rig: ClinicalRigState,
) {
  for (const [side, limb] of [
    ["R", rig.right],
    ["L", rig.left],
  ] as const) {
    uniforms[`cHipAxis${side}`].value.copy(limb.hip.axis);
    uniforms[`cKneeAxis${side}`].value.copy(limb.knee.axis);
    uniforms[`cAnkleAxis${side}`].value.copy(limb.ankle.axis);
    uniforms[`cKneeShift${side}`].value.copy(limb.kneeShift);
    uniforms[`cAnkleShift${side}`].value.copy(limb.ankleShift);
    uniforms[`cAngles${side}`].value.set(
      limb.hip.angle,
      limb.knee.angle,
      limb.ankle.angle,
      limb.hallux,
    );
  }
  uniforms.cTrunkAxis.value.copy(rig.trunk.axis);
  uniforms.cUpper.value.set(rig.trunk.angle, ...rig.armAngles);
}

/** Matriz da postura de base (atlas → cena). Deitado, a maca tem o topo em
 *  y = 0; sentado, em y = 0,7; em pé, o chão fica em y = 0. */
export function baseMatrix(base: ClinicalBase, joints: ClinicalJoints) {
  const m = new THREE.Matrix4();
  switch (base) {
    case "supino":
      // X da cena = eixo longo; Y = anterior; Z = lateral.
      m.set(0, 1, 0, 0, 0, 0, 1, 0.125, 1, 0, 0, 0, 0, 0, 0, 1);
      break;
    case "prono":
      m.set(0, 1, 0, 0, 0, 0, -1, 0.125, -1, 0, 0, 0, 0, 0, 0, 1);
      break;
    case "lateral":
      // Deitado sobre o lado esquerdo, lado direito para cima.
      m.set(0, 1, 0, 0, -1, 0, 0, 0.22, 0, 0, 1, 0, 0, 0, 0, 1);
      break;
    case "sentado":
      m.makeTranslation(0, 0.84 - joints.hip.y, 0);
      break;
    case "em-pe":
      m.identity();
  }
  return m;
}

const MEMBRO = new Set(["direito", "esquerdo"]);
export type Anchor =
  | "coxa-anterior"
  | "coxa-distal"
  | "coxa-lateral"
  | "coxa-posterior"
  | "patela"
  | "joelho-medial"
  | "joelho-lateral"
  | "tibia-proximal"
  | "tibia-proximal-posterior"
  | "panturrilha"
  | "perna-medial"
  | "perna-lateral"
  | "perna-distal"
  | "perna-distal-medial"
  | "perna-distal-lateral"
  | "tendao-calcaneo"
  | "calcanhar"
  | "calcanhar-plantar"
  | "planta"
  | "pe-medial"
  | "pe-lateral"
  | "dorso-pe"
  | "halux"
  | "eias"
  | "crista-iliaca"
  | "sacro"
  | "lombar"
  | "ombro";

/** Ponto de referência na superfície e pesos do segmento que o carrega. */
export function anchorPoint(
  anchor: Anchor,
  side: Side,
  joints: ClinicalJoints,
): { point: THREE.Vector3; weights: ClinicalWeights } {
  const right = side === "direito";
  const s = right ? -1 : 1;
  const hip = right ? joints.hip : joints.leftHip,
    knee = right ? joints.knee : joints.leftKnee,
    ankle = right ? joints.ankle : joints.leftAnkle,
    mtp = right ? joints.mtp : joints.leftMtp;
  const r = right ? 1 : 0;
  const thigh: ClinicalWeights = { leg: [1, 0, 0, r], upper: [0, 0, 0, r] },
    leg: ClinicalWeights = { leg: [1, 1, 0, r], upper: [0, 0, 0, r] },
    foot: ClinicalWeights = { leg: [1, 1, 1, r], upper: [0, 0, 0, r] },
    toe: ClinicalWeights = { leg: [1, 1, 1, r], upper: [0, 0, 1, r] },
    pelvis: ClinicalWeights = { leg: [0, 0, 0, r], upper: [0, 0, 0, r] };
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const mid = hip.clone().add(knee).multiplyScalar(0.5);
  const table: Record<Anchor, [THREE.Vector3, ClinicalWeights]> = {
    "coxa-anterior": [mid.clone().add(v(0, 0, 0.075)), thigh],
    "coxa-distal": [knee.clone().add(v(0, 0.09, 0.06)), thigh],
    "coxa-lateral": [knee.clone().add(v(s * 0.065, 0.12, 0)), thigh],
    "coxa-posterior": [knee.clone().add(v(0, 0.1, -0.06)), thigh],
    patela: [knee.clone().add(v(0, 0.035, 0.06)), thigh],
    "joelho-medial": [knee.clone().add(v(-s * 0.05, 0.005, 0)), leg],
    "joelho-lateral": [knee.clone().add(v(s * 0.055, 0.005, 0)), leg],
    "tibia-proximal": [knee.clone().add(v(0, -0.07, 0.045)), leg],
    "tibia-proximal-posterior": [knee.clone().add(v(0, -0.07, -0.06)), leg],
    panturrilha: [knee.clone().add(v(0, -0.14, -0.07)), leg],
    "perna-medial": [knee.clone().add(v(-s * 0.045, -0.17, -0.025)), leg],
    "perna-lateral": [knee.clone().add(v(s * 0.05, -0.17, -0.025)), leg],
    "perna-distal": [ankle.clone().add(v(0, 0.08, 0.035)), leg],
    "perna-distal-medial": [ankle.clone().add(v(-s * 0.04, 0.07, 0)), leg],
    "perna-distal-lateral": [ankle.clone().add(v(s * 0.04, 0.07, 0)), leg],
    "tendao-calcaneo": [ankle.clone().add(v(0, 0.06, -0.055)), leg],
    calcanhar: [ankle.clone().add(v(0, -0.045, -0.07)), foot],
    "calcanhar-plantar": [
      ankle.clone().add(v(-s * 0.012, -0.085, -0.035)),
      foot,
    ],
    planta: [ankle.clone().add(v(0, -0.075, 0.07)), foot],
    "pe-medial": [ankle.clone().add(v(-s * 0.035, -0.04, 0.06)), foot],
    "pe-lateral": [ankle.clone().add(v(s * 0.045, -0.045, 0.05)), foot],
    "dorso-pe": [ankle.clone().add(v(0, -0.02, 0.1)), foot],
    halux: [mtp.clone().add(v(0, 0.005, 0.04)), toe],
    eias: [hip.clone().add(v(s * 0.04, 0.12, 0.085)), pelvis],
    "crista-iliaca": [hip.clone().add(v(s * 0.075, 0.17, 0.01)), pelvis],
    sacro: [v(0, hip.y + 0.07, -0.115), pelvis],
    lombar: [v(0, 1.08, -0.1), { leg: [0, 0, 0, r], upper: [0.6, 0, 0, r] }],
    ombro: [
      (right ? joints.shoulder : joints.leftShoulder)
        .clone()
        .add(v(0, 0.04, 0)),
      { leg: [0, 0, 0, r], upper: [1, 0, 0, r] },
    ],
  };
  if (!MEMBRO.has(side)) throw new Error("Lado inválido");
  const [point, weights] = table[anchor];
  return { point, weights };
}

export { slumpJoints };
