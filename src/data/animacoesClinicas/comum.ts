import type { Force } from "../../features/viewer/clinicalAnimation";
import type { LimbPose } from "../../features/viewer/clinicalRig";

/**
 * Convenções das animações 3D dos testes clínicos.
 *
 * Ângulos em graus a partir da posição anatômica; translações em mm (as da
 * tíbia e do tálus são ampliadas para ficarem visíveis). Lado testado:
 * direito. Direções das forças no referencial do atlas, antes da postura, e
 * girando junto com o segmento: +X medial no lado direito (lateral no
 * esquerdo), +Y cranial, +Z anterior.
 */
export type Dir = Force["dir"];

export const ANTERIOR: Dir = [0, 0, 1];
export const POSTERIOR: Dir = [0, 0, -1];
export const CRANIAL: Dir = [0, 1, 0];
export const CAUDAL: Dir = [0, -1, 0];
/** Medial e lateral do membro direito (o esquerdo é o espelho). */
export const MEDIAL: Dir = [1, 0, 0];
export const LATERAL: Dir = [-1, 0, 0];

/** Decúbito dorsal com o pé apoiado na maca (≈ quadril 45°, joelho 90°,
 *  ajustados às proporções do modelo para o calcanhar tocar a maca): a
 *  planta fica paralela à maca quando dorsiflexão = joelho − quadril − 90. */
export const PE_APOIADO: Partial<LimbPose> = {
  hipFlex: 40,
  kneeFlex: 95,
  ankleDorsi: -35,
};
export const ESTENDIDO: Partial<LimbPose> = {
  hipFlex: 0,
  kneeFlex: 0,
  ankleDorsi: 0,
};
/** Sentado na borda da maca, pernas pendentes. */
export const SENTADO: Partial<LimbPose> = { hipFlex: 90, kneeFlex: 90 };
