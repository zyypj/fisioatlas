import type { ClinicalPose } from "./clinicalRig";

/** Leituras das articulações que estão de fato fora do repouso. */
export function poseReadout(pose: ClinicalPose, side: "direito" | "esquerdo") {
  const limb = side === "direito" ? pose.right : pose.left;
  const out: [string, string][] = [];
  const deg = (value: number) => `${Math.abs(value).toFixed(0)}°`;
  const add = (show: boolean, label: string, value: string) => {
    if (show) out.push([label, value]);
  };
  add(
    Math.abs(limb.hipFlex) >= 1,
    limb.hipFlex >= 0 ? "Flexão do quadril" : "Extensão do quadril",
    deg(limb.hipFlex),
  );
  add(
    Math.abs(limb.hipAbd) >= 1,
    limb.hipAbd >= 0 ? "Abdução" : "Adução",
    deg(limb.hipAbd),
  );
  add(
    Math.abs(limb.hipRot) >= 1,
    limb.hipRot >= 0 ? "Rotação externa" : "Rotação interna",
    deg(limb.hipRot),
  );
  add(Math.abs(limb.kneeFlex) >= 1, "Flexão do joelho", deg(limb.kneeFlex));
  add(
    Math.abs(limb.kneeRot) >= 1,
    limb.kneeRot >= 0 ? "Rotação externa da tíbia" : "Rotação interna da tíbia",
    deg(limb.kneeRot),
  );
  add(
    Math.abs(limb.kneeValgus) >= 1,
    limb.kneeValgus >= 0 ? "Valgo do joelho" : "Varo do joelho",
    deg(limb.kneeValgus),
  );
  add(
    Math.abs(limb.tibiaShift) >= 0.5,
    limb.tibiaShift >= 0 ? "Tíbia anterior" : "Tíbia posterior",
    `${Math.abs(limb.tibiaShift).toFixed(0)} mm`,
  );
  add(
    Math.abs(limb.ankleDorsi) >= 1,
    limb.ankleDorsi >= 0 ? "Dorsiflexão" : "Flexão plantar",
    deg(limb.ankleDorsi),
  );
  add(
    Math.abs(limb.ankleInv) >= 1,
    limb.ankleInv >= 0 ? "Inversão" : "Eversão",
    deg(limb.ankleInv),
  );
  add(
    Math.abs(limb.ankleRot) >= 1,
    limb.ankleRot >= 0 ? "Rotação externa do pé" : "Rotação interna do pé",
    deg(limb.ankleRot),
  );
  add(
    Math.abs(limb.talarShift) >= 0.5,
    "Tálus anterior",
    `${limb.talarShift.toFixed(0)} mm`,
  );
  add(Math.abs(limb.hallux) >= 1, "Extensão do hálux", deg(limb.hallux));
  add(
    Math.abs(pose.trunkFlex) >= 1,
    pose.trunkFlex >= 0 ? "Flexão do tronco" : "Extensão do tronco",
    deg(pose.trunkFlex),
  );
  add(
    Math.abs(pose.trunkSide) >= 1,
    "Inclinação do tronco",
    deg(pose.trunkSide),
  );
  add(Math.abs(pose.trunkRot) >= 1, "Rotação do tronco", deg(pose.trunkRot));
  add(Math.abs(pose.pelvisTilt) >= 1, "Báscula da pelve", deg(pose.pelvisTilt));
  add(Math.abs(pose.pelvisDrop) >= 1, "Queda da pelve", deg(pose.pelvisDrop));
  add(Math.abs(pose.yaw) >= 1, "Rotação sobre o pé", deg(pose.yaw));
  return out;
}
