import { smoothMotion } from "./lasegueRig";
import { applyPatch, lerpPose, restPose } from "./clinicalRig";
import type {
  Anchor,
  ClinicalBase,
  ClinicalPose,
  PosePatch,
  Side,
} from "./clinicalRig";

/** Seta de força do examinador: ponto de aplicação e direção no referencial
 *  do atlas (antes da postura), girando junto com o segmento. */
export interface Force {
  at: Anchor;
  side?: Side;
  dir: [number, number, number];
}

/** Quadro-chave: o que muda na pose (cumulativo) e as forças visíveis. */
export interface AnimationKey {
  pose?: PosePatch;
  forces?: Force[];
  /** Duração da transição até este quadro, em segundos (padrão 1,6). */
  duration?: number;
}

export type Focus =
  "corpo" | "lombar" | "pelve" | "quadril" | "joelho" | "tornozelo" | "pe";

export interface ClinicalAnimation {
  base: ClinicalBase;
  /** Em pé: pé(s) fixo(s) no chão. */
  stance?: Side | "ambos";
  /** Pose inicial, antes do primeiro passo. */
  start?: PosePatch;
  /** Maca: começo do tampo no lado dos pés (m, no eixo longo do corpo) e
   *  deslocamento lateral (m), para membros pendentes na borda. */
  table?: { from?: number; shift?: number };
  /** Parede à frente do pé de apoio (lunge). */
  wall?: boolean;
  focus: Focus;
  /** Lado examinado (padrão: direito). */
  side?: Side;
  /** Direção da câmera na cena, para a vista oblíqua. */
  view?: [number, number, number];
  /** Multiplica a distância da câmera ao foco (padrão 1). */
  zoom?: number;
  /** Um item por passo do roteiro, na mesma ordem. */
  steps: AnimationKey[][];
}

export interface Segment {
  from: ClinicalPose;
  to: ClinicalPose;
  duration: number;
  forces: Force[];
}

const DEFAULT_DURATION = 1.6;
const HOLD = 0.8;

/** Pose de repouso de cada passo: a do fim do passo anterior. */
export function stepEndPoses(animation: ClinicalAnimation) {
  let pose = applyPatch(restPose(), animation.start ?? {});
  const ends: ClinicalPose[] = [];
  for (const keys of animation.steps) {
    for (const key of keys) pose = applyPatch(pose, key.pose ?? {});
    ends.push(pose);
  }
  return ends;
}

/** Início do passo: o fim do anterior (ou a pose inicial). */
export function stepStartPose(animation: ClinicalAnimation, step: number) {
  return step === 0
    ? applyPatch(restPose(), animation.start ?? {})
    : stepEndPoses(animation)[step - 1];
}

/** Segmentos de um passo, partindo da pose em que o corpo está agora. */
export function stepSegments(
  animation: ClinicalAnimation,
  step: number,
  from: ClinicalPose,
): Segment[] {
  const keys = animation.steps[step] ?? [];
  let current = stepStartPose(animation, step);
  let previous = from;
  const segments: Segment[] = [];
  for (const key of keys) {
    current = applyPatch(current, key.pose ?? {});
    segments.push({
      from: previous,
      to: current,
      duration: key.duration ?? DEFAULT_DURATION,
      forces: key.forces ?? [],
    });
    previous = current;
  }
  if (!segments.length)
    segments.push({ from, to: current, duration: 1, forces: [] });
  return segments;
}

export function segmentsDuration(segments: Segment[]) {
  return segments.reduce((sum, s) => sum + s.duration, 0) + HOLD;
}

/** Pose e forças no instante `time` de um passo. */
export function sampleSegments(segments: Segment[], time: number) {
  let t = Math.max(0, time),
    previous: Force[] = [];
  for (const segment of segments) {
    if (t <= segment.duration)
      return {
        pose: lerpPose(
          segment.from,
          segment.to,
          smoothMotion(t / segment.duration),
        ),
        forces: segment.forces,
        // As setas aparecem aos poucos, mas não piscam entre quadros que
        // mantêm forças.
        force: previous.length ? 1 : Math.min(1, t / 0.4),
      };
    t -= segment.duration;
    previous = segment.forces;
  }
  const last = segments[segments.length - 1];
  return { pose: last.to, forces: last.forces, force: 1 };
}
