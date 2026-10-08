import type {
  ClinicalAnimation,
  Force,
} from "../../features/viewer/clinicalAnimation";
import { ANTERIOR, LATERAL, MEDIAL, POSTERIOR } from "./comum";

const sacro: Force = { at: "sacro", dir: ANTERIOR };

export const animacoesQuadril: Record<string, ClinicalAnimation> = {
  faber: {
    base: "supino",
    focus: "pelve",
    view: [-1, 0.75, -0.25],
    steps: [
      [
        {
          pose: {
            right: { hipFlex: 45, kneeFlex: 120, hipAbd: 25, hipRot: 70 },
          },
          duration: 2.4,
        },
      ],
      [
        {
          forces: [{ at: "eias", side: "esquerdo", dir: POSTERIOR }],
          duration: 0.8,
        },
      ],
      [{ duration: 1.2 }],
      [
        {
          pose: { right: { hipAbd: 40, hipRot: 75 } },
          forces: [
            { at: "eias", side: "esquerdo", dir: POSTERIOR },
            { at: "joelho-medial", dir: [-0.6, 0, -1] },
          ],
          duration: 2,
        },
      ],
      [
        { pose: { right: { hipAbd: 25, hipRot: 70 } }, duration: 1 },
        {
          pose: { right: { hipFlex: 0, kneeFlex: 0, hipAbd: 0, hipRot: 0 } },
          duration: 2,
        },
      ],
    ],
  },
  fadir: {
    base: "supino",
    focus: "quadril",
    view: [-0.4, 0.9, -1],
    zoom: 1.4,
    steps: [
      [{ pose: { right: { hipFlex: 90, kneeFlex: 90 } }, duration: 2.4 }],
      [
        {
          pose: { right: { hipAbd: -15 } },
          forces: [{ at: "joelho-lateral", dir: MEDIAL }],
          duration: 1.8,
        },
      ],
      [
        {
          // Pé para fora = rotação interna do quadril.
          pose: { right: { hipRot: -30 } },
          forces: [
            { at: "joelho-lateral", dir: MEDIAL },
            { at: "perna-distal-medial", dir: LATERAL },
          ],
          duration: 2,
        },
      ],
      [
        {
          forces: [
            { at: "joelho-lateral", dir: MEDIAL },
            { at: "perna-distal-medial", dir: LATERAL },
          ],
          duration: 1.5,
        },
      ],
      [
        { pose: { right: { hipRot: 0, hipAbd: 0 } }, duration: 1.4 },
        { pose: { right: { hipFlex: 0, kneeFlex: 0 } }, duration: 2.2 },
      ],
    ],
  },
  thomas: {
    base: "supino",
    // Sentado na borda distal: metade da coxa fica para fora da maca.
    table: { from: 0.62 },
    focus: "quadril",
    view: [-0.5, 0.45, -1],
    zoom: 1.7,
    start: {
      right: { hipFlex: 115, kneeFlex: 125 },
      left: { hipFlex: 115, kneeFlex: 125 },
    },
    steps: [
      [{ duration: 1.5 }],
      [{ pose: { right: { hipFlex: 0, kneeFlex: 85 } }, duration: 3 }],
      [{ duration: 1.2 }],
      [{ duration: 1.2 }],
      [
        {
          pose: { right: { kneeFlex: 20 } },
          forces: [{ at: "panturrilha", dir: ANTERIOR }],
          duration: 2,
        },
        { pose: { right: { kneeFlex: 85 } }, duration: 1.6 },
      ],
      [{ pose: { right: { hipFlex: 115, kneeFlex: 125 } }, duration: 2.4 }],
    ],
  },
  ober: {
    base: "lateral",
    focus: "quadril",
    view: [-0.5, 0.8, -1],
    // Membro de baixo fletido; braço de baixo sob a cabeça.
    start: {
      left: { hipFlex: 45, kneeFlex: 70 },
      leftArmFlex: 160,
      rightArmFlex: 15,
    },
    steps: [
      [{ duration: 1 }],
      [{ forces: [{ at: "crista-iliaca", dir: MEDIAL }], duration: 0.8 }],
      [
        {
          pose: { right: { hipAbd: 35, hipFlex: -10, kneeFlex: 90 } },
          forces: [{ at: "crista-iliaca", dir: MEDIAL }],
          duration: 2,
        },
      ],
      [
        {
          pose: { right: { hipAbd: -8 } },
          forces: [{ at: "crista-iliaca", dir: MEDIAL }],
          duration: 3,
        },
      ],
      [{ duration: 1.2 }],
    ],
  },
  ely: {
    base: "prono",
    focus: "joelho",
    view: [-0.35, 0.55, 1],
    zoom: 1.9,
    steps: [
      [{ duration: 1 }],
      [{ forces: [sacro], duration: 0.8 }],
      [
        {
          pose: { right: { kneeFlex: 130 } },
          forces: [sacro, { at: "perna-distal", dir: POSTERIOR }],
          duration: 3,
        },
      ],
      [
        {
          forces: [sacro, { at: "perna-distal", dir: POSTERIOR }],
          duration: 1.5,
        },
      ],
      [{ pose: { right: { kneeFlex: 0 } }, duration: 2.4 }],
    ],
  },
  trendelenburg: {
    base: "em-pe",
    stance: "direito",
    focus: "corpo",
    view: [0.55, 0.2, -1],
    steps: [
      [{ duration: 1 }],
      [{ pose: { left: { hipFlex: 30, kneeFlex: 90 } }, duration: 2 }],
      [{ duration: 1.5 }],
      [
        { pose: { pelvisDrop: 9 }, duration: 1.4 },
        { duration: 0.8 },
        { pose: { pelvisDrop: 0 }, duration: 1.4 },
      ],
      [{ pose: { left: { hipFlex: 0, kneeFlex: 0 } }, duration: 1.8 }],
    ],
  },
  "log-roll": {
    base: "supino",
    focus: "quadril",
    view: [-1, 0.7, -0.4],
    zoom: 1.6,
    steps: [
      [{ duration: 1 }],
      [
        {
          forces: [
            { at: "coxa-anterior", dir: POSTERIOR },
            { at: "tibia-proximal", dir: POSTERIOR },
          ],
          duration: 0.8,
        },
      ],
      [
        { pose: { right: { hipRot: -25 } }, duration: 1.4 },
        { pose: { right: { hipRot: 35 } }, duration: 2 },
        { pose: { right: { hipRot: -25 } }, duration: 2 },
        { pose: { right: { hipRot: 0 } }, duration: 1.4 },
      ],
      [{ duration: 1 }],
      [{ duration: 1 }],
    ],
  },
};
