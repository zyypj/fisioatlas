import type {
  ClinicalAnimation,
  Force,
} from "../../features/viewer/clinicalAnimation";
import { ANTERIOR, POSTERIOR } from "./comum";

const sacro: Force = { at: "sacro", dir: ANTERIOR };
const lombar: Force = { at: "lombar", dir: ANTERIOR };

export const animacoesLombar: Record<string, ClinicalAnimation> = {
  "estiramento-nervo-femoral": {
    base: "prono",
    focus: "joelho",
    view: [-0.35, 0.55, 1],
    zoom: 1.9,
    steps: [
      [{ duration: 1 }],
      [{ forces: [sacro], duration: 0.8 }],
      [
        {
          pose: { right: { kneeFlex: 115 } },
          forces: [sacro, { at: "perna-distal", dir: POSTERIOR }],
          duration: 2.8,
        },
      ],
      [
        {
          pose: { right: { hipFlex: -12 } },
          forces: [sacro, { at: "coxa-distal", dir: POSTERIOR }],
          duration: 2,
        },
      ],
      [
        {
          forces: [sacro, { at: "coxa-distal", dir: POSTERIOR }],
          duration: 1.6,
        },
      ],
      [
        { pose: { right: { hipFlex: 0 } }, duration: 1.2 },
        { pose: { right: { kneeFlex: 0 } }, duration: 2 },
      ],
    ],
  },
  "instabilidade-em-prono": {
    base: "prono",
    // Tronco na maca, quadris fletidos na borda e pés no chão.
    table: { from: 0.95 },
    focus: "lombar",
    zoom: 1.5,
    start: { right: { hipFlex: 85 }, left: { hipFlex: 85 } },
    steps: [
      [{ duration: 1 }],
      [
        { forces: [lombar], duration: 0.8 },
        { forces: [lombar], duration: 1 },
      ],
      [
        {
          pose: { right: { hipFlex: 0 }, left: { hipFlex: 0 } },
          duration: 2.6,
        },
      ],
      [
        { forces: [lombar], duration: 0.8 },
        { forces: [lombar], duration: 1 },
      ],
      [
        {
          pose: { right: { hipFlex: 85 }, left: { hipFlex: 85 } },
          duration: 2.2,
        },
      ],
    ],
  },
  "extensao-rotacao-lombar": {
    base: "em-pe",
    stance: "ambos",
    focus: "lombar",
    view: [-0.6, 0.3, -1],
    zoom: 1.7,
    steps: [
      [{ duration: 1 }],
      [
        {
          pose: { trunkFlex: -20 },
          forces: [sacro, { at: "ombro", dir: POSTERIOR }],
          duration: 2.2,
        },
      ],
      [
        {
          pose: { trunkSide: 12, trunkRot: 15 },
          forces: [sacro, { at: "ombro", dir: [0, -0.6, -1] }],
          duration: 2.2,
        },
      ],
      [
        {
          pose: { trunkFlex: -25, trunkSide: 15, trunkRot: 18 },
          forces: [sacro, { at: "ombro", dir: [0, -1, -0.6] }],
          duration: 1,
        },
        { forces: [sacro, { at: "ombro", dir: [0, -1, -0.6] }], duration: 1 },
        {
          pose: { trunkFlex: -20, trunkSide: 12, trunkRot: 15 },
          duration: 0.8,
        },
      ],
      [{ duration: 1.5 }],
      [{ pose: { trunkFlex: 0, trunkSide: 0, trunkRot: 0 }, duration: 2.2 }],
    ],
  },
  "schober-modificado": {
    base: "em-pe",
    stance: "ambos",
    focus: "lombar",
    view: [0.55, 0.3, -1],
    zoom: 1.8,
    steps: [
      [{ forces: [sacro], duration: 1.2 }],
      [{ forces: [lombar], duration: 1.2 }],
      [
        {
          // Flexão da coluna e do quadril; os braços pendem.
          pose: {
            trunkFlex: 60,
            pelvisTilt: 45,
            rightArmFlex: 95,
            leftArmFlex: 95,
          },
          duration: 3.2,
        },
      ],
      [{ forces: [lombar], duration: 1.5 }],
      [
        {
          pose: {
            trunkFlex: 0,
            pelvisTilt: 0,
            rightArmFlex: 0,
            leftArmFlex: 0,
          },
          duration: 2.6,
        },
      ],
    ],
  },
};
