import type {
  ClinicalAnimation,
  Force,
} from "../../features/viewer/clinicalAnimation";
import {
  ANTERIOR,
  CAUDAL,
  ESTENDIDO,
  LATERAL,
  MEDIAL,
  PE_APOIADO,
  POSTERIOR,
} from "./comum";

/** Examinador sentado sobre o antepé. */
const antepe: Force = { at: "dorso-pe", dir: CAUDAL };
const puxaTibia: Force = { at: "tibia-proximal-posterior", dir: ANTERIOR };
const empurraTibia: Force = { at: "tibia-proximal", dir: POSTERIOR };
/** Fulcro lateral e perna distal para dentro (valgo), e o espelho (varo). */
const valgo: Force[] = [
  { at: "joelho-lateral", dir: MEDIAL },
  { at: "perna-distal-medial", dir: LATERAL },
];
const varo: Force[] = [
  { at: "joelho-medial", dir: LATERAL },
  { at: "perna-distal-lateral", dir: MEDIAL },
];
const mcmurray: Force[] = [
  { at: "joelho-medial", dir: LATERAL },
  { at: "calcanhar", dir: ANTERIOR },
];
const calcanhares: Force[] = [
  { at: "calcanhar", dir: ANTERIOR },
  { at: "calcanhar", side: "esquerdo", dir: ANTERIOR },
];
/** Vista de perfil do joelho fletido, para ver a translação da tíbia. */
const PERFIL: [number, number, number] = [-0.2, 0.35, -1];

export const animacoesJoelho: Record<string, ClinicalAnimation> = {
  lachman: {
    base: "supino",
    focus: "joelho",
    steps: [
      [{ pose: { right: { hipFlex: 13, kneeFlex: 25 } }, duration: 2 }],
      [{ forces: [{ at: "coxa-distal", dir: POSTERIOR }], duration: 0.8 }],
      [
        {
          forces: [{ at: "coxa-distal", dir: POSTERIOR }, puxaTibia],
          duration: 0.8,
        },
      ],
      [
        {
          pose: { right: { tibiaShift: 12 } },
          forces: [{ at: "coxa-distal", dir: POSTERIOR }, puxaTibia],
          duration: 0.7,
        },
        { pose: { right: { tibiaShift: 0 } }, duration: 0.6 },
        {
          pose: { right: { tibiaShift: 12 } },
          forces: [{ at: "coxa-distal", dir: POSTERIOR }, puxaTibia],
          duration: 0.7,
        },
      ],
      [
        { pose: { right: { tibiaShift: 0 } }, duration: 0.8 },
        { pose: { right: { hipFlex: 0, kneeFlex: 0 } }, duration: 1.6 },
      ],
    ],
  },
  "gaveta-anterior-joelho": {
    base: "supino",
    focus: "joelho",
    view: PERFIL,
    zoom: 1.5,
    steps: [
      [{ pose: { right: PE_APOIADO }, duration: 2.4 }],
      [{ duration: 1.2 }],
      [{ forces: [antepe], duration: 0.8 }],
      [{ forces: [antepe, puxaTibia], duration: 0.8 }],
      [
        {
          pose: { right: { tibiaShift: 12 } },
          forces: [antepe, puxaTibia],
          duration: 0.8,
        },
        { pose: { right: { tibiaShift: 0 } }, duration: 0.6 },
        {
          pose: { right: { tibiaShift: 12 } },
          forces: [antepe, puxaTibia],
          duration: 0.8,
        },
        { pose: { right: { tibiaShift: 0 } }, duration: 0.8 },
      ],
    ],
  },
  "pivot-shift": {
    base: "supino",
    focus: "joelho",
    view: [-0.3, 0.6, -1],
    zoom: 1.4,
    steps: [
      [{ duration: 1 }],
      [
        {
          pose: { right: { hipFlex: 30, kneeRot: -15 } },
          forces: [{ at: "calcanhar", dir: ANTERIOR }],
          duration: 2.4,
        },
      ],
      [
        {
          // Valgo + rotação interna subluxam o platô lateral à frente.
          pose: { right: { kneeValgus: 5, tibiaShift: 8 } },
          forces: [{ at: "calcanhar", dir: ANTERIOR }, valgo[0]],
          duration: 1.6,
        },
      ],
      [
        {
          pose: { right: { kneeFlex: 25 } },
          forces: [{ at: "calcanhar", dir: ANTERIOR }, valgo[0]],
          duration: 2.4,
        },
        {
          // O ressalto: a tíbia volta de uma vez por volta de 30°.
          pose: { right: { kneeFlex: 35, tibiaShift: 0 } },
          forces: [{ at: "calcanhar", dir: ANTERIOR }, valgo[0]],
          duration: 0.3,
        },
        {
          pose: { right: { kneeFlex: 45 } },
          forces: [{ at: "calcanhar", dir: ANTERIOR }, valgo[0]],
          duration: 1.2,
        },
      ],
      [
        {
          pose: {
            right: { hipFlex: 0, kneeFlex: 0, kneeRot: 0, kneeValgus: 0 },
          },
          duration: 2.4,
        },
      ],
    ],
  },
  "gaveta-posterior-joelho": {
    base: "supino",
    focus: "joelho",
    view: PERFIL,
    zoom: 1.5,
    steps: [
      [{ pose: { right: PE_APOIADO }, duration: 2.4 }],
      [{ duration: 1.5 }],
      [{ forces: [antepe], duration: 0.8 }],
      [
        { forces: [antepe, empurraTibia], duration: 0.8 },
        {
          pose: { right: { tibiaShift: -12 } },
          forces: [antepe, empurraTibia],
          duration: 0.9,
        },
        { pose: { right: { tibiaShift: 0 } }, duration: 0.7 },
        {
          pose: { right: { tibiaShift: -12 } },
          forces: [antepe, empurraTibia],
          duration: 0.9,
        },
      ],
      [{ forces: [antepe, empurraTibia], duration: 1.4 }],
      [
        { pose: { right: { tibiaShift: 0 } }, duration: 0.8 },
        { pose: { right: ESTENDIDO }, duration: 2.4 },
      ],
    ],
  },
  "sinal-de-godfrey": {
    base: "supino",
    focus: "joelho",
    view: [-0.1, 0.3, -1],
    zoom: 1.6,
    steps: [
      [
        {
          pose: {
            right: { hipFlex: 90, kneeFlex: 90 },
            left: { hipFlex: 90, kneeFlex: 90 },
          },
          forces: calcanhares,
          duration: 2.6,
        },
      ],
      [
        {
          // Quadríceps relaxado: a tíbia cai para trás pela gravidade.
          pose: { right: { tibiaShift: -10 } },
          forces: calcanhares,
          duration: 1.8,
        },
      ],
      [{ forces: calcanhares, duration: 1.5 }],
      [{ forces: calcanhares, duration: 1.5 }],
      [
        {
          pose: { right: { tibiaShift: -3 } },
          forces: calcanhares,
          duration: 1.2,
        },
        {
          pose: {
            right: { tibiaShift: 0, hipFlex: 0, kneeFlex: 0 },
            left: { hipFlex: 0, kneeFlex: 0 },
          },
          duration: 2.4,
        },
      ],
    ],
  },
  "estresse-em-valgo": {
    base: "supino",
    focus: "joelho",
    view: [-0.6, 1, -0.5],
    zoom: 1.3,
    steps: [
      [{ duration: 1 }],
      [
        { forces: valgo, duration: 0.8 },
        { pose: { right: { kneeValgus: 6 } }, forces: valgo, duration: 1.2 },
        { pose: { right: { kneeValgus: 0 } }, duration: 0.8 },
      ],
      [
        // Perna apoiada no antebraço do examinador, joelho a 30°.
        { pose: { right: { hipFlex: 20, kneeFlex: 30 } }, duration: 2 },
        { forces: valgo, duration: 0.8 },
        { pose: { right: { kneeValgus: 7 } }, forces: valgo, duration: 1.2 },
        { pose: { right: { kneeValgus: 0 } }, duration: 0.8 },
      ],
      [
        { pose: { right: { kneeValgus: 7 } }, forces: valgo, duration: 1 },
        { forces: valgo, duration: 0.6 },
        { pose: { right: { kneeValgus: 0 } }, duration: 0.8 },
      ],
      [{ pose: { right: { hipFlex: 0, kneeFlex: 0 } }, duration: 2 }],
    ],
  },
  "estresse-em-varo": {
    base: "supino",
    focus: "joelho",
    view: [-0.6, 1, -0.5],
    zoom: 1.3,
    steps: [
      [{ duration: 1 }],
      [
        { forces: varo, duration: 0.8 },
        { pose: { right: { kneeValgus: -6 } }, forces: varo, duration: 1.2 },
        { pose: { right: { kneeValgus: 0 } }, duration: 0.8 },
      ],
      [
        { pose: { right: { hipFlex: 20, kneeFlex: 30 } }, duration: 2 },
        { forces: varo, duration: 0.8 },
        { pose: { right: { kneeValgus: -7 } }, forces: varo, duration: 1.2 },
        { pose: { right: { kneeValgus: 0 } }, duration: 0.8 },
      ],
      [
        {
          // Figura de 4: o colateral lateral fica palpável como um cordão.
          pose: {
            right: { hipFlex: 45, kneeFlex: 120, hipAbd: 25, hipRot: 70 },
          },
          duration: 2.4,
        },
        { forces: [{ at: "joelho-lateral", dir: MEDIAL }], duration: 1.4 },
      ],
      [
        {
          pose: { right: { hipFlex: 0, kneeFlex: 0, hipAbd: 0, hipRot: 0 } },
          duration: 2.4,
        },
      ],
    ],
  },
  mcmurray: {
    base: "supino",
    focus: "joelho",
    view: [-0.5, 0.8, -1],
    zoom: 1.4,
    steps: [
      [
        {
          pose: { right: { hipFlex: 110, kneeFlex: 140 } },
          forces: mcmurray,
          duration: 2.6,
        },
      ],
      [
        {
          pose: { right: { kneeRot: 25, kneeValgus: 3 } },
          forces: mcmurray,
          duration: 1.2,
        },
        { pose: { right: { kneeFlex: 90 } }, forces: mcmurray, duration: 2.2 },
      ],
      [
        {
          pose: { right: { kneeFlex: 140, kneeRot: 0, kneeValgus: 0 } },
          duration: 1.6,
        },
        {
          pose: { right: { kneeRot: -25, kneeValgus: -3 } },
          forces: mcmurray,
          duration: 1.2,
        },
        { pose: { right: { kneeFlex: 90 } }, forces: mcmurray, duration: 2.2 },
      ],
      [{ forces: mcmurray, duration: 1.2 }],
      [
        { pose: { right: { kneeRot: 0, kneeValgus: 0 } }, duration: 1 },
        { pose: { right: { hipFlex: 0, kneeFlex: 0 } }, duration: 2.4 },
      ],
    ],
  },
  thessaly: {
    base: "em-pe",
    stance: "direito",
    focus: "corpo",
    view: [-0.8, 0.35, 1],
    // Apoio só no membro testado; as mãos seguram as do examinador.
    start: {
      left: { hipFlex: 20, kneeFlex: 70 },
      rightArmFlex: 60,
      leftArmFlex: 60,
    },
    steps: [
      [{ duration: 1.2 }],
      [
        {
          pose: { right: { hipFlex: 3, kneeFlex: 5, ankleDorsi: 2 } },
          duration: 1,
        },
        { pose: { yaw: -20 }, duration: 0.9 },
        { pose: { yaw: 20 }, duration: 1.4 },
        { pose: { yaw: -20 }, duration: 1.4 },
        { pose: { yaw: 20 }, duration: 1.4 },
        { pose: { yaw: 0 }, duration: 0.9 },
      ],
      [
        {
          pose: { right: { hipFlex: 10, kneeFlex: 20, ankleDorsi: 10 } },
          duration: 1.2,
        },
        { pose: { yaw: -20 }, duration: 0.9 },
        { pose: { yaw: 20 }, duration: 1.4 },
        { pose: { yaw: -20 }, duration: 1.4 },
        { pose: { yaw: 20 }, duration: 1.4 },
        { pose: { yaw: 0 }, duration: 0.9 },
      ],
      [{ duration: 1.2 }],
      [
        {
          pose: {
            right: ESTENDIDO,
            left: { hipFlex: 0, kneeFlex: 0 },
            rightArmFlex: 0,
            leftArmFlex: 0,
          },
          duration: 2,
        },
      ],
    ],
  },
  apley: {
    base: "prono",
    focus: "joelho",
    view: [-0.35, 0.55, 1],
    zoom: 1.8,
    steps: [
      [
        {
          pose: { right: { kneeFlex: 90 } },
          forces: [{ at: "coxa-posterior", dir: ANTERIOR }],
          duration: 2,
        },
      ],
      [
        {
          pose: { right: { kneeRot: 20 } },
          forces: [
            { at: "coxa-posterior", dir: ANTERIOR },
            { at: "planta", dir: [0, 1, 0] },
          ],
          duration: 1,
        },
        { pose: { right: { kneeRot: -20 } }, duration: 1.2 },
        { pose: { right: { kneeRot: 20 } }, duration: 1.2 },
        { pose: { right: { kneeRot: 0 } }, duration: 1 },
      ],
      [{ duration: 1.2 }],
      [
        {
          pose: { right: { kneeRot: 20 } },
          forces: [
            { at: "coxa-posterior", dir: ANTERIOR },
            { at: "calcanhar", dir: CAUDAL },
          ],
          duration: 1,
        },
        { pose: { right: { kneeRot: -20 } }, duration: 1.2 },
        { pose: { right: { kneeRot: 0 } }, duration: 1 },
      ],
      [{ pose: { right: { kneeFlex: 0 } }, duration: 1.8 }],
    ],
  },
  "dor-interlinha-articular": {
    base: "supino",
    focus: "joelho",
    view: [-0.5, 0.6, -1],
    steps: [
      [{ pose: { right: PE_APOIADO }, duration: 2.4 }],
      [
        // Rodar a tíbia deixa a interlinha mais fácil de sentir.
        { pose: { right: { kneeRot: 10 } }, duration: 0.8 },
        { pose: { right: { kneeRot: -10 } }, duration: 1 },
        { pose: { right: { kneeRot: 0 } }, duration: 0.8 },
      ],
      [
        { forces: [{ at: "joelho-medial", dir: LATERAL }], duration: 0.8 },
        { forces: [{ at: "joelho-medial", dir: LATERAL }], duration: 1.5 },
      ],
      [
        { forces: [{ at: "joelho-lateral", dir: MEDIAL }], duration: 0.8 },
        { forces: [{ at: "joelho-lateral", dir: MEDIAL }], duration: 1.5 },
      ],
      [{ pose: { right: ESTENDIDO }, duration: 2.4 }],
    ],
  },
  "apreensao-patelar": {
    base: "supino",
    focus: "joelho",
    view: [-0.4, 0.9, -0.8],
    steps: [
      [{ pose: { right: { hipFlex: 12, kneeFlex: 25 } }, duration: 2 }],
      [{ forces: [{ at: "patela", dir: LATERAL }], duration: 0.8 }],
      [{ forces: [{ at: "patela", dir: LATERAL }], duration: 1.8 }],
      [
        {
          // Contração reflexa do quadríceps: o joelho estende de repente.
          pose: { right: { kneeFlex: 15 } },
          forces: [{ at: "patela", dir: LATERAL }],
          duration: 0.4,
        },
        { pose: { right: { kneeFlex: 22 } }, duration: 1 },
      ],
      [{ pose: { right: { hipFlex: 0, kneeFlex: 0 } }, duration: 2 }],
    ],
  },
  clarke: {
    base: "supino",
    focus: "joelho",
    view: [-0.4, 0.8, -0.9],
    steps: [
      [{ forces: [{ at: "coxa-distal", dir: CAUDAL }], duration: 0.8 }],
      [{ forces: [{ at: "coxa-distal", dir: CAUDAL }], duration: 1.4 }],
      [{ forces: [{ at: "coxa-distal", dir: CAUDAL }], duration: 1.6 }],
      [{ forces: [{ at: "coxa-distal", dir: CAUDAL }], duration: 1.2 }],
      [{ duration: 1 }],
    ],
  },
};
