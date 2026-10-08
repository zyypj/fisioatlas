import type {
  ClinicalAnimation,
  Force,
} from "../../features/viewer/clinicalAnimation";
import { ANTERIOR, CRANIAL, MEDIAL, POSTERIOR } from "./comum";

const sacro: Force = { at: "sacro", dir: ANTERIOR };
/** Pressão nas EIAS para trás e para fora (antebraços cruzados). */
const distracao: Force[] = [
  { at: "eias", side: "direito", dir: [-0.4, 0, -1] },
  { at: "eias", side: "esquerdo", dir: [0.4, 0, -1] },
];
/** Mãos nas laterais dos ilíacos, aproximando-os. */
const compressaoPelve: Force[] = [
  { at: "crista-iliaca", side: "direito", dir: MEDIAL },
  { at: "crista-iliaca", side: "esquerdo", dir: [-1, 0, 0] },
];

export const animacoesPelve: Record<string, ClinicalAnimation> = {
  "distracao-sacroiliaca": {
    base: "supino",
    focus: "pelve",
    view: [-0.6, 1, -0.6],
    zoom: 1.2,
    steps: [
      [{ duration: 1 }],
      [{ duration: 1 }],
      [{ forces: distracao, duration: 0.8 }],
      [
        { forces: distracao, duration: 1.2 },
        { forces: distracao, duration: 1.2 },
      ],
      [{ duration: 1 }],
    ],
  },
  "thigh-thrust": {
    base: "supino",
    focus: "quadril",
    view: [-0.3, 0.8, -1],
    zoom: 1.4,
    steps: [
      [{ duration: 1 }],
      [
        {
          pose: { right: { hipFlex: 90, kneeFlex: 95, hipAbd: -8 } },
          duration: 2.4,
        },
      ],
      [{ forces: [sacro], duration: 0.8 }],
      [
        // Força ao longo do fêmur, do joelho para o quadril.
        { forces: [sacro, { at: "patela", dir: CRANIAL }], duration: 1.2 },
        { forces: [sacro, { at: "patela", dir: CRANIAL }], duration: 1 },
      ],
      [{ duration: 1.2 }],
      [
        {
          pose: { right: { hipFlex: 0, kneeFlex: 0, hipAbd: 0 } },
          duration: 2.4,
        },
      ],
    ],
  },
  "compressao-sacroiliaca": {
    base: "lateral",
    focus: "pelve",
    view: [-0.5, 0.8, -1],
    zoom: 1.5,
    start: {
      right: { hipFlex: 45, kneeFlex: 70 },
      left: { hipFlex: 45, kneeFlex: 70 },
      leftArmFlex: 160,
      rightArmFlex: 15,
    },
    steps: [
      [{ duration: 1 }],
      [{ duration: 1.2 }],
      [{ forces: [{ at: "crista-iliaca", dir: MEDIAL }], duration: 0.8 }],
      [
        { forces: [{ at: "crista-iliaca", dir: MEDIAL }], duration: 1.2 },
        { forces: [{ at: "crista-iliaca", dir: MEDIAL }], duration: 1.2 },
      ],
      [{ duration: 1 }],
    ],
  },
  "sacral-thrust": {
    base: "prono",
    focus: "pelve",
    zoom: 1.3,
    steps: [
      [{ duration: 1 }],
      [{ duration: 1 }],
      [{ forces: [sacro], duration: 0.8 }],
      [
        { forces: [sacro], duration: 1.2 },
        { forces: [sacro], duration: 1.2 },
      ],
      [{ duration: 1 }],
    ],
  },
  gaenslen: {
    base: "supino",
    // Glúteo do lado testado na borda da maca.
    table: { shift: 0.23 },
    focus: "pelve",
    view: [-0.8, 0.7, -1],
    zoom: 1.6,
    steps: [
      [{ duration: 1 }],
      [{ duration: 1 }],
      [
        {
          pose: { left: { hipFlex: 115, kneeFlex: 125 } },
          forces: [{ at: "patela", side: "esquerdo", dir: CRANIAL }],
          duration: 2.4,
        },
      ],
      [
        {
          pose: { right: { hipFlex: -20, hipAbd: 18, kneeFlex: 60 } },
          duration: 2.4,
        },
      ],
      [
        {
          pose: { right: { hipFlex: -28 }, left: { hipFlex: 120 } },
          forces: [
            { at: "patela", side: "esquerdo", dir: CRANIAL },
            { at: "coxa-distal", dir: POSTERIOR },
          ],
          duration: 2,
        },
      ],
      [
        {
          pose: {
            right: { hipFlex: 0, hipAbd: 0, kneeFlex: 0 },
            left: { hipFlex: 0, kneeFlex: 0 },
          },
          duration: 2.6,
        },
      ],
    ],
  },
  "elevacao-ativa-perna-estendida": {
    base: "supino",
    focus: "quadril",
    view: [-0.5, 0.6, -1],
    zoom: 1.8,
    steps: [
      [{ duration: 1 }],
      [
        { pose: { right: { hipFlex: 15 } }, duration: 1.6 },
        { duration: 0.6 },
        { pose: { right: { hipFlex: 0 } }, duration: 1.4 },
        { pose: { left: { hipFlex: 15 } }, duration: 1.6 },
        { duration: 0.6 },
        { pose: { left: { hipFlex: 0 } }, duration: 1.4 },
      ],
      [{ duration: 1 }],
      [
        { pose: { right: { hipFlex: 15 } }, duration: 1.6 },
        { duration: 1 },
        { pose: { right: { hipFlex: 0 } }, duration: 1.4 },
      ],
      [
        { forces: compressaoPelve, duration: 0.8 },
        {
          pose: { right: { hipFlex: 15 } },
          forces: compressaoPelve,
          duration: 1.6,
        },
        {
          pose: { right: { hipFlex: 0 } },
          forces: compressaoPelve,
          duration: 1.4,
        },
      ],
      [{ duration: 1 }],
    ],
  },
};
