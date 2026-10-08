import type {
  ClinicalAnimation,
  Force,
} from "../../features/viewer/clinicalAnimation";
import {
  ANTERIOR,
  CRANIAL,
  LATERAL,
  MEDIAL,
  POSTERIOR,
  SENTADO,
} from "./comum";

/** Mão na face anterior da tíbia distal, segurando a perna. */
const tibiaDistal: Force = { at: "perna-distal", dir: POSTERIOR };
/** Duas mãos envolvendo a perna, comprimindo de fora para dentro. */
const comprimePerna: Force[] = [
  { at: "perna-medial", dir: LATERAL },
  { at: "perna-lateral", dir: MEDIAL },
];
const gaveta: Force[] = [tibiaDistal, { at: "calcanhar", dir: ANTERIOR }];
const inversao: Force[] = [
  { at: "perna-distal-medial", dir: LATERAL },
  { at: "pe-lateral", dir: MEDIAL },
];
const rotacaoExterna: Force[] = [
  tibiaDistal,
  { at: "pe-medial", dir: LATERAL },
];
const halux: Force = { at: "halux", dir: CRANIAL };

/** Lunge: pé testado à frente, o outro atrás, ambos apoiados. */
const BASE_LUNGE = {
  right: { hipFlex: 15, kneeFlex: 0, ankleDorsi: -15 },
  left: { hipFlex: -15, kneeFlex: 0, ankleDorsi: 15 },
};
/** Joelho da frente na parede com o calcanhar no chão; o pé de trás fica
 *  apoiado na ponta (calcanhar sobe ~8 cm), valores resolvidos no rig. */
const AVANCO_LUNGE = {
  right: { hipFlex: 30, kneeFlex: 70, ankleDorsi: 40 },
  left: { hipFlex: -10, kneeFlex: 52.5, ankleDorsi: 40 },
};

export const animacoesTornozelo: Record<string, ClinicalAnimation> = {
  "gaveta-anterior-tornozelo": {
    base: "sentado",
    focus: "tornozelo",
    view: [-1, 0.25, 0.3],
    zoom: 1.3,
    start: { right: SENTADO, left: SENTADO },
    steps: [
      [{ pose: { right: { ankleDorsi: -15 } }, duration: 1.4 }],
      [{ forces: [tibiaDistal], duration: 0.8 }],
      [
        { forces: gaveta, duration: 0.8 },
        { pose: { right: { talarShift: 10 } }, forces: gaveta, duration: 1 },
        { pose: { right: { talarShift: 0 } }, duration: 0.7 },
        { pose: { right: { talarShift: 10 } }, forces: gaveta, duration: 1 },
      ],
      [{ forces: gaveta, duration: 1.4 }],
      [{ pose: { right: { talarShift: 0, ankleDorsi: 0 } }, duration: 1.4 }],
    ],
  },
  "inclinacao-talar": {
    base: "supino",
    focus: "tornozelo",
    view: [-1, 0.6, -0.3],
    zoom: 1.3,
    steps: [
      [{ pose: { right: { hipFlex: 10, kneeFlex: 20 } }, duration: 1.6 }],
      [{ forces: [inversao[0]], duration: 0.8 }],
      [{ pose: { right: { ankleInv: 25 } }, forces: inversao, duration: 2 }],
      [{ forces: inversao, duration: 1.4 }],
      [
        { pose: { right: { ankleInv: 0 } }, duration: 1.2 },
        { pose: { right: { hipFlex: 0, kneeFlex: 0 } }, duration: 1.6 },
      ],
    ],
  },
  "squeeze-test": {
    base: "supino",
    focus: "joelho",
    view: [-0.6, 0.8, -0.8],
    zoom: 1.4,
    steps: [
      [{ duration: 1 }],
      [{ forces: comprimePerna, duration: 0.8 }],
      [
        { forces: comprimePerna, duration: 1.2 },
        { duration: 0.6 },
        { forces: comprimePerna, duration: 1.2 },
      ],
      [{ duration: 1.2 }],
      [{ duration: 1 }],
    ],
  },
  "rotacao-externa-tornozelo": {
    base: "sentado",
    focus: "tornozelo",
    view: [-0.6, 0.4, 1],
    zoom: 1.3,
    start: { right: SENTADO, left: SENTADO },
    steps: [
      [{ duration: 1 }],
      [{ forces: [tibiaDistal], duration: 0.8 }],
      [
        {
          pose: { right: { ankleRot: 30 } },
          forces: rotacaoExterna,
          duration: 2,
        },
      ],
      [{ forces: rotacaoExterna, duration: 1.4 }],
      [{ pose: { right: { ankleRot: 0 } }, duration: 1.4 }],
    ],
  },
  thompson: {
    base: "prono",
    // Pés para fora da borda da maca, relaxados em leve flexão plantar.
    table: { from: 0.17 },
    focus: "tornozelo",
    view: [-0.4, 0.5, 1],
    zoom: 1.7,
    start: { right: { ankleDorsi: -20 }, left: { ankleDorsi: -20 } },
    steps: [
      [{ duration: 1.2 }],
      [{ forces: [{ at: "tendao-calcaneo", dir: ANTERIOR }], duration: 1.2 }],
      [
        { forces: comprimePerna, duration: 0.5 },
        {
          pose: { right: { ankleDorsi: -38 } },
          forces: comprimePerna,
          duration: 0.5,
        },
        { pose: { right: { ankleDorsi: -20 } }, duration: 0.9 },
        { forces: comprimePerna, duration: 0.5 },
        {
          pose: { right: { ankleDorsi: -38 } },
          forces: comprimePerna,
          duration: 0.5,
        },
        { pose: { right: { ankleDorsi: -20 } }, duration: 0.9 },
      ],
      [
        { forces: comprimePerna, duration: 0.5 },
        {
          pose: { right: { ankleDorsi: -38 } },
          forces: comprimePerna,
          duration: 0.5,
        },
        { pose: { right: { ankleDorsi: -20 } }, duration: 1 },
      ],
      [{ duration: 1 }],
    ],
  },
  windlass: {
    base: "sentado",
    focus: "pe",
    view: [-0.7, 0.4, 0.9],
    zoom: 1.4,
    start: { right: SENTADO, left: SENTADO },
    steps: [
      [
        {
          forces: [{ at: "calcanhar-plantar", dir: CRANIAL }],
          duration: 1.2,
        },
      ],
      [
        { forces: [tibiaDistal], duration: 0.6 },
        {
          pose: { right: { hallux: 55 } },
          forces: [tibiaDistal, halux],
          duration: 2,
        },
      ],
      [
        { pose: { right: { hallux: 0 } }, duration: 1 },
        {
          // A carga do corpo, representada pela pressão sobre a coxa.
          pose: { right: { hallux: 55 } },
          forces: [{ at: "coxa-distal", dir: POSTERIOR }, halux],
          duration: 2,
        },
      ],
      [
        {
          forces: [{ at: "coxa-distal", dir: POSTERIOR }, halux],
          duration: 1.2,
        },
      ],
      [{ pose: { right: { hallux: 0 } }, duration: 1.2 }],
    ],
  },
  "lunge-dorsiflexao": {
    base: "em-pe",
    stance: "direito",
    wall: true,
    focus: "corpo",
    // Do lado do corpo, para a parede não ficar entre a câmera e a pessoa.
    view: [-1, 0.25, -0.35],
    start: BASE_LUNGE,
    steps: [
      [{ duration: 1.2 }],
      [{ pose: AVANCO_LUNGE, duration: 2.6 }],
      [
        { pose: BASE_LUNGE, duration: 1.6 },
        { pose: AVANCO_LUNGE, duration: 2.2 },
      ],
      [{ duration: 1.5 }],
      [{ pose: BASE_LUNGE, duration: 2 }],
    ],
  },
};
