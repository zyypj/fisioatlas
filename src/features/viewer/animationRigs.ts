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
  chain: "superior" | "inferior" | "axial" | "cervical" | "cintura";
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
  /** Como calcular o peso de deformação dos tecidos moles. "height" (padrão)
   *  faz o peso crescer abaixo do pivô, como num membro pendurado. "bones"
   *  usa a proximidade aos ossos que se movem versus os que ficam, para a
   *  cintura escapular, em que a escápula desliza sobre o tórax. */
  weighting?: "height" | "bones";
  /** Usa só a malha do lado animado para localizar o pivô, mesmo que ela
   *  esteja a menos de 2 cm do plano mediano, como a esternoclavicular. */
  strictAnchor?: boolean;
  /** Pose fixa aplicada antes do giro animado, em graus. A abdução e a adução
   *  horizontais partem do braço elevado à frente. */
  base?: { axis: [number, number, number]; angle: number };
  /** O braço acompanha a cintura escapular só em translação, continuando
   *  pendurado: depois do giro da escápula, uma contrarrotação no centro da
   *  cabeça do úmero desfaz a inclinação do membro. Sem isso, encolher os
   *  ombros abriria o braço como numa abdução. */
  carryArm?: boolean;
  /** Tecidos moles fora das regiões da cadeia que também deformam, com o
   *  peso por proximidade óssea: os músculos que ligam a cintura escapular
   *  ao tronco e ao pescoço. */
  tissues?: string[];
}

/** Estruturas a menos desta distância do plano mediano são consideradas da
 *  linha média. O sinal do centro delas é ruído de ponto flutuante, então não
 *  serve para decidir de que lado estão. */
const MEIO = 0.02;

/** A malha participa do lado animado deste movimento? */
export function onAnimatedSide(rig: AnimationRig, centerX: number) {
  return rig.bilateral || centerX < 0 || Math.abs(centerX) < MEIO;
}

const CADEIA_SUPERIOR = [
  "Ombro",
  "Braço",
  "Cotovelo",
  "Antebraço",
  "Punho",
  "Mão",
];
const CADEIA_INFERIOR = [
  "Pelve",
  "Quadril",
  "Coxa",
  "Joelho",
  "Perna",
  "Tornozelo",
  "Pé",
];
// A cadeia axial acompanha o que o rig da coluna de fato gira: tudo acima do
// sacro, incluindo os membros superiores, que vão junto com o tronco.
const CADEIA_AXIAL = [
  "Coluna vertebral",
  "Tronco",
  "Cabeça e pescoço",
  "Ombro",
  "Braço",
  "Cotovelo",
  "Antebraço",
  "Punho",
  "Mão",
];
const CADEIA_CERVICAL = ["Cabeça e pescoço"];
// Na cintura escapular, a cadeia é a do membro superior; os músculos do
// tronco e do pescoço que se prendem à clavícula e à escápula entram pela
// lista `tissues` do rig. O resto do tronco (costelas, intercostais, eretores)
// fica parado, mesmo passando a 1 cm da escápula.
const CADEIA_CINTURA = CADEIA_SUPERIOR;
const TECIDOS_DA_CINTURA = [
  "trapezio-superior",
  "trapezio-medio",
  "trapezio-inferior",
  "romboide-maior",
  "romboide-menor",
  "levantador-da-escapula",
  "serratil-anterior",
  "peitoral-menor",
  "peitoral-clavicular",
  "peitoral-esternocostal",
  "subclavio",
  "latissimo-do-dorso",
  "esternocleidomastoideo",
  "omo-hioideo",
  // Nervos que correm sobre o latíssimo e o serrátil.
  "nervo-toracodorsal",
  "nervo-toracico-longo",
];

export const chainRegions: Record<AnimationRig["chain"], string[]> = {
  superior: CADEIA_SUPERIOR,
  inferior: CADEIA_INFERIOR,
  axial: CADEIA_AXIAL,
  cervical: CADEIA_CERVICAL,
  cintura: CADEIA_CINTURA,
};

const MEMBRO_SUPERIOR = ["Braço", "Cotovelo", "Antebraço", "Punho", "Mão"];

/** O osso pertence ao braço livre (úmero e segmentos distais)? */
export function armBone(id: string, region: string) {
  return id === "umero" || MEMBRO_SUPERIOR.includes(region);
}

/** Centro aproximado da cabeça do úmero a partir dos limites do úmero do lado
 *  animado (ajuste de esfera no modelo: ~2,5 cm medial ao limite e ~2 cm
 *  abaixo do topo). */
export function humeralHead(bounds: THREE.Box3) {
  return new THREE.Vector3(
    bounds.max.x - 0.025,
    bounds.max.y - 0.021,
    (bounds.min.z + bounds.max.z) / 2,
  );
}
const LIGAMENTOS_GLENOUMERAIS = [
  "ligamento-coracoumeral",
  "ligamento-glenoumeral-superior",
  "ligamento-glenoumeral-medio",
  "ligamento-glenoumeral-inferior",
];
const LIGAMENTOS_ESTERNOCLAVICULARES = [
  "ligamento-esternoclavicular-anterior",
  "ligamento-esternoclavicular-posterior",
  "ligamento-interclavicular",
  "ligamento-costoclavicular",
];
const LIGAMENTOS_ACROMIOCLAVICULARES = [
  "ligamento-acromioclavicular",
  "ligamento-conoide",
  "ligamento-trapezoide",
];

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
    weighting: "bones",
    tissues: TECIDOS_DA_CINTURA,
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
    weighting: "bones",
    tissues: TECIDOS_DA_CINTURA,
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
    weighting: "bones",
    tissues: TECIDOS_DA_CINTURA,
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
    bone: "vertebra-t1",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: ["Cabeça e pescoço"],
    chain: "cervical",
    spanning: [
      "ligamento-nucal",
      "ligamentos-amarelos",
      "ligamento-longitudinal-anterior",
    ],
    view: "lateral-direita",
  },
  cervicalrot: {
    bilateral: true,
    segment: "proximal",
    bone: "vertebra-t1",
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
    bone: "vertebra-t1",
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
    spanning: [
      "ligamento-temporomandibular-lateral",
      "ligamento-esfenomandibular",
    ],
    view: "lateral-direita",
  },
  spine: {
    bilateral: true,
    segment: "proximal",
    bone: "sacro",
    pivot: "superior",
    axis: [1, 0, 0],
    sign: -1,
    regions: [
      "Coluna vertebral",
      "Tronco",
      "Cabeça e pescoço",
      "Ombro",
      "Braço",
      "Cotovelo",
      "Antebraço",
      "Punho",
      "Mão",
    ],
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
    regions: [
      "Coluna vertebral",
      "Tronco",
      "Cabeça e pescoço",
      "Ombro",
      "Braço",
      "Cotovelo",
      "Antebraço",
      "Punho",
      "Mão",
    ],
    chain: "axial",
    spanning: ["ligamentos-interespinais", "ligamentos-intertransversarios"],
    view: "anterior",
  },
  // ---- complexo do ombro ----
  // Elevação/depressão da clavícula na esternoclavicular. A escápula e o braço
  // vão junto, como no encolher dos ombros.
  girdleelev: {
    bone: "esternoclavicular",
    pivot: "centro",
    strictAnchor: true,
    axis: [0, 0, -1],
    sign: 1,
    regions: ["Ombro", ...MEMBRO_SUPERIOR],
    chain: "cintura",
    weighting: "bones",
    carryArm: true,
    tissues: TECIDOS_DA_CINTURA,
    spanning: LIGAMENTOS_ESTERNOCLAVICULARES,
    view: "anterior",
  },
  // Protração/retração da clavícula na esternoclavicular, em torno do eixo
  // vertical: o ombro vai para a frente ou para trás.
  girdleprot: {
    bone: "esternoclavicular",
    pivot: "centro",
    strictAnchor: true,
    axis: [0, 1, 0],
    sign: 1,
    regions: ["Ombro", ...MEMBRO_SUPERIOR],
    chain: "cintura",
    weighting: "bones",
    carryArm: true,
    tissues: TECIDOS_DA_CINTURA,
    spanning: LIGAMENTOS_ESTERNOCLAVICULARES,
    view: "lateral-direita",
  },
  // Rotação superior/inferior da escápula na acromioclavicular. O eixo é
  // perpendicular ao plano da escápula, inclinado ~30° em relação ao frontal;
  // a clavícula fica parada e o ângulo inferior desliza para fora e para cima.
  scaprot: {
    bone: "acromioclavicular",
    pivot: "centro",
    axis: [-0.5, 0, -0.866],
    sign: 1,
    regions: MEMBRO_SUPERIOR,
    include: ["escapula"],
    chain: "cintura",
    weighting: "bones",
    carryArm: true,
    tissues: TECIDOS_DA_CINTURA,
    spanning: LIGAMENTOS_ACROMIOCLAVICULARES,
    view: "anterior",
  },
  // Inclinação anterior/posterior da escápula na acromioclavicular, em torno
  // do eixo médio-lateral do plano da escápula.
  scaptilt: {
    bone: "acromioclavicular",
    pivot: "centro",
    axis: [0.866, 0, -0.5],
    sign: 1,
    regions: MEMBRO_SUPERIOR,
    include: ["escapula"],
    chain: "cintura",
    weighting: "bones",
    carryArm: true,
    tissues: TECIDOS_DA_CINTURA,
    spanning: LIGAMENTOS_ACROMIOCLAVICULARES,
    view: "lateral-direita",
  },
  // Abdução/adução horizontal: o braço parte elevado a 90° à frente e gira
  // no plano transverso em torno do eixo vertical.
  shoulderhoriz: {
    bone: "umero",
    pivot: "superior",
    axis: [0, 1, 0],
    sign: 1,
    base: { axis: [1, 0, 0], angle: -90 },
    regions: MEMBRO_SUPERIOR,
    chain: "superior",
    spanning: LIGAMENTOS_GLENOUMERAIS,
    view: "anterior",
    lateralPivot: true,
    weighting: "bones",
    tissues: TECIDOS_DA_CINTURA,
  },
  spineinc: {
    bilateral: true,
    segment: "proximal",
    bone: "sacro",
    pivot: "superior",
    axis: [0, 0, -1],
    sign: 1,
    regions: [
      "Coluna vertebral",
      "Tronco",
      "Cabeça e pescoço",
      "Ombro",
      "Braço",
      "Cotovelo",
      "Antebraço",
      "Punho",
      "Mão",
    ],
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
    if (
      rig.strictAnchor
        ? m.userData.center.x >= 0
        : !onAnimatedSide(rig, m.userData.center.x)
    )
      continue;
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
  // No ombro, o eixo passa pelo centro da cabeça do úmero.
  if (rig.lateralPivot && rig.bone === "umero") return humeralHead(bounds);
  const pivot = new THREE.Vector3(center.x, y, center.z);
  if (rig.lateralPivot) pivot.x = bounds.max.x - 0.02;
  return pivot;
}

/** Pose de um movimento numa fração `amount` (0 a 1) da amplitude.
 *
 *  `quaternion` é o giro dos ossos do segmento em torno de `pivot`, já com a
 *  pose base. Em rigs com `carryArm`, `carry` é a contrarrotação aplicada em
 *  seguida aos ossos do braço livre, em torno da cabeça do úmero já
 *  deslocada, que mantém o braço pendurado. O motor e os testes usam esta
 *  mesma função. */
export function movementPose(
  rig: AnimationRig,
  move: { maxAngle: number; direction?: 1 | -1 },
  amount: number,
  pivot: THREE.Vector3,
  humerus: THREE.Box3 | null,
) {
  const axis = new THREE.Vector3(...rig.axis).normalize();
  const signedAngle =
    THREE.MathUtils.degToRad(move.maxAngle) *
    amount *
    rig.sign *
    (move.direction ?? 1);
  const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, signedAngle);
  const base = rig.base
    ? {
        axis: new THREE.Vector3(...rig.base.axis).normalize(),
        angle: THREE.MathUtils.degToRad(rig.base.angle),
      }
    : undefined;
  if (base)
    quaternion.multiply(
      new THREE.Quaternion().setFromAxisAngle(base.axis, base.angle),
    );
  const carry =
    rig.carryArm && humerus
      ? {
          pivot: humeralHead(humerus)
            .sub(pivot)
            .applyQuaternion(quaternion)
            .add(pivot),
          axis,
          angle: -signedAngle,
          quaternion: new THREE.Quaternion().setFromAxisAngle(
            axis,
            -signedAngle,
          ),
        }
      : null;
  return { axis, signedAngle, quaternion, base, carry };
}

/** Posição de um ponto de osso na pose: segmento girado em torno do pivô e,
 *  no braço livre, a contrarrotação em torno da cabeça do úmero. */
export function posedBonePoint(
  pose: ReturnType<typeof movementPose>,
  pivot: THREE.Vector3,
  point: THREE.Vector3,
  arm: boolean,
) {
  const out = point
    .clone()
    .sub(pivot)
    .applyQuaternion(pose.quaternion)
    .add(pivot);
  if (pose.carry && arm)
    out
      .sub(pose.carry.pivot)
      .applyQuaternion(pose.carry.quaternion)
      .add(pose.carry.pivot);
  return out;
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
