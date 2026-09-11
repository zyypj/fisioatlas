import * as THREE from "three";
import type { Animation } from "../../types";

/** Descreve como cada movimento gira o segmento distal sobre o proximal.
 *
 * `bone` é o osso proximal usado para localizar o eixo da articulação; `pivot`
 * diz em que extremidade dele o eixo se encontra. `regions` são as regiões que
 * acompanham o segmento distal e `include`/`exclude` ajustam estruturas
 * isoladas que não seguem a regra da região.
 *
 * Os ângulos e as posições dos eixos são escolhas didáticas aproximadas, não
 * medidas de goniometria nem eixos instantâneos reais de rotação.
 */
export interface AnimationRig {
  /** Osso proximal que define a posição do eixo. */
  bone: string;
  /** Extremidade do osso onde fica a articulação. */
  pivot: "superior" | "inferior" | "centro";
  /** Eixo de rotação em coordenadas do modelo. */
  axis: [number, number, number];
  /** Sentido do giro: +1 acompanha a regra da mão direita no eixo dado. */
  sign: 1 | -1;
  /** Regiões que acompanham o segmento distal. */
  regions: string[];
  /** Estruturas que se movem mesmo estando fora das regiões listadas. */
  include?: string[];
  /** Estruturas que ficam paradas mesmo estando nas regiões listadas. */
  exclude?: string[];
  /** Cadeia usada para decidir quais tecidos moles acompanham o movimento. */
  chain: "superior" | "inferior" | "axial" | "cervical";
  /** Ligamentos que cruzam a articulação e têm as duas extremidades presas. */
  spanning: string[];
  /** Vista de câmera que melhor mostra o movimento. */
  view: "anterior" | "lateral-direita";
  /** Desloca o eixo para a borda lateral do osso, como no ombro. */
  lateralPivot?: boolean;
  /** Move os dois lados do corpo. Usado nos movimentos axiais, em que separar
   *  um lado partiria a caixa torácica e a coluna ao meio. */
  bilateral?: boolean;
  /** Onde fica o segmento que se move em relação ao pivô. Nos membros é o
   *  segmento distal, abaixo da articulação. Nos movimentos axiais é o
   *  contrário: o tronco e a cabeça ficam acima do pivô. */
  segment?: "distal" | "proximal";
  /** Quais tecidos moles acompanham o movimento. "chain" usa as regiões da
   *  cadeia; "movers" restringe às estruturas que realmente cruzam a
   *  articulação, para movimentos de escopo pequeno como o da mandíbula. */
  softScope?: "chain" | "movers";
}

/** Estruturas a menos desta distância do plano mediano são consideradas da
 *  linha média. O sinal do centro delas é ruído de ponto flutuante, então não
 *  serve para decidir de que lado estão. */
const MEIO = 0.02;

/** A malha participa do lado animado deste movimento? */
export function onAnimatedSide(rig: AnimationRig, centerX: number) {
  return rig.bilateral || centerX < 0 || Math.abs(centerX) < MEIO;
}

const CADEIA_SUPERIOR = ["Ombro", "Braço", "Cotovelo", "Antebraço", "Punho", "Mão"];
const CADEIA_INFERIOR = ["Pelve", "Quadril", "Coxa", "Joelho", "Perna", "Tornozelo", "Pé"];
// A cadeia axial acompanha o que o rig da coluna de fato gira: tudo acima do
// sacro, incluindo os membros superiores, que vão junto com o tronco.
const CADEIA_AXIAL = [
  "Coluna vertebral", "Tronco", "Cabeça e pescoço",
  "Ombro", "Braço", "Cotovelo", "Antebraço", "Punho", "Mão",
];
const CADEIA_CERVICAL = ["Cabeça e pescoço"];

export const chainRegions: Record<AnimationRig["chain"], string[]> = {
  superior: CADEIA_SUPERIOR,
  inferior: CADEIA_INFERIOR,
  axial: CADEIA_AXIAL,
  cervical: CADEIA_CERVICAL,
};

export const rigs: Record<Animation, AnimationRig> = {
  elbow: {
    bone: "umero",
    pivot: "inferior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Antebraço", "Punho", "Mão"],
    chain: "superior",
    spanning: [
      "ligamento-colateral-radial-do-cotovelo",
      "ligamento-colateral-ulnar-do-cotovelo",
    ],
    view: "lateral-direita",
  },
  shoulder: {
    bone: "umero",
    pivot: "superior",
    axis: [0, 0, -1],
    sign: 1,
    regions: ["Braço", "Antebraço", "Punho", "Mão"],
    chain: "superior",
    spanning: [
      "ligamento-coracoumeral",
      "ligamento-glenoumeral-superior",
      "ligamento-glenoumeral-medio",
      "ligamento-glenoumeral-inferior",
    ],
    view: "anterior",
    lateralPivot: true,
  },
  knee: {
    bone: "femur",
    pivot: "inferior",
    axis: [1, 0, 0],
    sign: 1,
    regions: ["Perna", "Tornozelo", "Pé"],
    chain: "inferior",
    spanning: [
      "ligamento-cruzado-anterior",
      "ligamento-cruzado-posterior",
      "ligamento-colateral-tibial",
      "ligamento-colateral-fibular",
      "ligamento-popliteo-obliquo",
    ],
    view: "lateral-direita",
  },
  hip: {
    bone: "femur",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Coxa", "Joelho", "Perna", "Tornozelo", "Pé"],
    chain: "inferior",
    spanning: ["ligamento-iliofemoral", "ligamento-da-cabeca-do-femur"],
    view: "lateral-direita",
  },
  ankle: {
    bone: "tibia",
    pivot: "inferior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Pé", "Tornozelo"],
    exclude: ["tibia", "fibula"],
    chain: "inferior",
    spanning: [
      "ligamento-talofibular-anterior",
      "ligamento-talofibular-posterior",
      "ligamento-calcaneofibular",
      "ligamento-deltoide",
    ],
    view: "lateral-direita",
  },
  // ---- rigs acrescentados na ampliação ----
  shoulderflex: {
    bone: "umero",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Braço", "Antebraço", "Punho", "Mão"],
    chain: "superior",
    spanning: [
      "ligamento-coracoumeral",
      "ligamento-glenoumeral-superior",
      "ligamento-glenoumeral-medio",
      "ligamento-glenoumeral-inferior",
    ],
    view: "lateral-direita",
    lateralPivot: true,
  },
  shoulderrot: {
    bone: "umero",
    pivot: "superior",
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Braço", "Antebraço", "Punho", "Mão"],
    chain: "superior",
    spanning: [
      "ligamento-coracoumeral",
      "ligamento-glenoumeral-superior",
      "ligamento-glenoumeral-medio",
      "ligamento-glenoumeral-inferior",
    ],
    view: "anterior",
    lateralPivot: true,
  },
  forearm: {
    bone: "ulna",
    pivot: "centro",
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Punho", "Mão"],
    include: ["radio"],
    chain: "superior",
    spanning: ["membrana-interossea-do-antebraco", "ligamento-quadrado"],
    view: "anterior",
  },
  wrist: {
    bone: "radio",
    pivot: "inferior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Punho", "Mão"],
    chain: "superior",
    spanning: [
      "ligamento-radiocarpal-dorsal",
      "ligamento-escafolunar-interosseo",
      "ligamento-lunopiramidal-interosseo",
    ],
    view: "lateral-direita",
  },
  wristdev: {
    bone: "radio",
    pivot: "inferior",
    axis: [0, 0, -1],
    sign: 1,
    regions: ["Punho", "Mão"],
    chain: "superior",
    spanning: [
      "ligamento-radiocarpal-dorsal",
      "ligamento-escafolunar-interosseo",
      "ligamento-lunopiramidal-interosseo",
    ],
    view: "anterior",
  },
  hipabd: {
    bone: "femur",
    pivot: "superior",
    axis: [0, 0, -1],
    sign: -1,
    regions: ["Coxa", "Joelho", "Perna", "Tornozelo", "Pé"],
    chain: "inferior",
    spanning: [
      "ligamento-iliofemoral",
      "ligamento-pubofemoral",
      "ligamento-da-cabeca-do-femur",
    ],
    view: "anterior",
  },
  hiprot: {
    bone: "femur",
    pivot: "superior",
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Coxa", "Joelho", "Perna", "Tornozelo", "Pé"],
    chain: "inferior",
    spanning: [
      "ligamento-iliofemoral",
      "ligamento-isquiofemoral",
      "ligamento-pubofemoral",
    ],
    view: "anterior",
  },
  kneerot: {
    bone: "femur",
    pivot: "inferior",
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Perna", "Tornozelo", "Pé"],
    chain: "inferior",
    spanning: [
      "ligamento-cruzado-anterior",
      "ligamento-cruzado-posterior",
      "ligamento-colateral-tibial",
      "ligamento-colateral-fibular",
    ],
    view: "anterior",
  },
  subtalar: {
    bone: "talus",
    pivot: "inferior",
    axis: [0, 0, -1],
    sign: 1,
    regions: ["Pé"],
    chain: "inferior",
    spanning: [
      "ligamento-calcaneofibular",
      "ligamento-deltoide",
      "ligamento-calcaneonavicular-plantar",
    ],
    view: "anterior",
  },
  cervical: {
    bilateral: true,
    segment: "proximal",
    bone: "vertebras-toracicas",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Cabeça e pescoço"],
    chain: "cervical",
    spanning: ["ligamento-nucal", "ligamentos-amarelos", "ligamento-longitudinal-anterior"],
    view: "lateral-direita",
  },
  cervicalrot: {
    bilateral: true,
    segment: "proximal",
    bone: "vertebras-toracicas",
    pivot: "superior",
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Cabeça e pescoço"],
    chain: "cervical",
    spanning: ["ligamento-nucal", "ligamentos-amarelos"],
    view: "anterior",
  },
  cervicalinc: {
    bilateral: true,
    segment: "proximal",
    bone: "vertebras-toracicas",
    pivot: "superior",
    axis: [0, 0, -1],
    sign: 1,
    regions: ["Cabeça e pescoço"],
    chain: "cervical",
    spanning: ["ligamento-nucal", "ligamentos-amarelos"],
    view: "anterior",
  },
  jaw: {
    bilateral: true,
    softScope: "movers",
    bone: "mandibula",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: [],
    include: ["mandibula", "hioide"],
    chain: "axial",
    spanning: ["ligamento-temporomandibular-lateral", "ligamento-esfenomandibular"],
    view: "lateral-direita",
  },
  spine: {
    bilateral: true,
    segment: "proximal",
    bone: "sacro",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Coluna vertebral", "Tronco", "Cabeça e pescoço", "Ombro", "Braço", "Cotovelo", "Antebraço", "Punho", "Mão"],
    chain: "axial",
    spanning: [
      "ligamento-longitudinal-anterior",
      "ligamento-longitudinal-posterior",
      "ligamentos-amarelos",
      "ligamento-supraespinal",
      "ligamentos-interespinais",
    ],
    view: "lateral-direita",
  },
  spinerot: {
    bilateral: true,
    segment: "proximal",
    bone: "sacro",
    pivot: "superior",
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Coluna vertebral", "Tronco", "Cabeça e pescoço", "Ombro", "Braço", "Cotovelo", "Antebraço", "Punho", "Mão"],
    chain: "axial",
    spanning: ["ligamentos-interespinais", "ligamentos-intertransversarios"],
    view: "anterior",
  },
  spineinc: {
    bilateral: true,
    segment: "proximal",
    bone: "sacro",
    pivot: "superior",
    axis: [0, 0, -1],
    sign: 1,
    regions: ["Coluna vertebral", "Tronco", "Cabeça e pescoço", "Ombro", "Braço", "Cotovelo", "Antebraço", "Punho", "Mão"],
    chain: "axial",
    spanning: ["ligamentos-intertransversarios", "ligamento-iliolombar"],
    view: "anterior",
  },
};

/** Limites do osso proximal somando todas as suas malhas no lado animado.
 *  Estruturas com várias malhas, como as vértebras torácicas, precisam da
 *  união para que o eixo caia na extremidade certa do conjunto. */
export function rigBounds(
  rig: AnimationRig,
  meshes: { userData: Record<string, any> }[],
) {
  const box = new THREE.Box3();
  let found = false;
  for (const m of meshes) {
    if (m.userData.structureId !== rig.bone) continue;
    if (!onAnimatedSide(rig, m.userData.center.x)) continue;
    box.union(m.userData.bounds);
    found = true;
  }
  return found ? box : null;
}

/** Ponto em que o eixo da articulação atravessa o osso proximal. */
export function rigPivot(rig: AnimationRig, bounds: THREE.Box3) {
  const center = bounds.getCenter(new THREE.Vector3());
  const y =
    rig.pivot === "superior"
      ? bounds.max.y - 0.035
      : rig.pivot === "inferior"
        ? bounds.min.y + 0.025
        : center.y;
  const pivot = new THREE.Vector3(center.x, y, center.z);
  if (rig.lateralPivot) pivot.x = bounds.max.x - 0.02;
  return pivot;
}

/** Altura a usar no cálculo do peso de deformação.
 *
 *  O peso cresce para baixo do pivô, o que é correto para um membro pendurado.
 *  Quando o segmento móvel está acima do pivô, como na coluna e no pescoço,
 *  espelha-se a altura em torno do pivô para inverter o sentido do degradê. */
export function weightHeight(rig: AnimationRig, y: number, pivotY: number) {
  return rig.segment === "proximal" ? 2 * pivotY - y : y;
}

/** Estrutura acompanha o segmento distal neste movimento? */
export function rigMoves(rig: AnimationRig, id: string, region: string) {
  if (rig.exclude?.includes(id)) return false;
  if (rig.include?.includes(id)) return true;
  return rig.regions.includes(region);
}
