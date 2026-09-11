/** Reduced, normalized mechanics under prescribed joint kinematics.
 * Parameters are teaching assumptions, not fitted human tissue properties.
 * See BIOMECANICA.md for equations, units and exclusions.
 */
export interface MechanicsOptions {
  enabled: boolean;
  activation: number;
  coactivation: number;
  stiffness: number;
  slack: number;
  tendonCompliance: number;
  nerveReserve: number;
  heatmap: boolean;
}
export const defaultMechanics: MechanicsOptions = {
  enabled: true, activation: 0.65, coactivation: 0.1, stiffness: 1,
  slack: 0.02, tendonCompliance: 0.04, nerveReserve: 0.008, heatmap: true,
};
export interface TissueReading {
  id: string;
  kind: string;
  length: number;
  restLength: number;
  strain: number;
  force: number;
  activation: number;
  fiberRatio: number;
  tendonStrain: number;
  excursion: number;
  residual: number;
  limited: boolean;
}
export interface MechanicsReport { movementId: string; rows: TissueReading[] }
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export function activationStep(a: number, excitation: number, dt: number) {
  const target = clamp(excitation, 0, 1);
  const tau = target > a ? 0.015 : 0.05;
  return target + (a - target) * Math.exp(-Math.max(0, dt) / tau);
}

/** Blankevoort-style toe + linear spring; output normalized by an arbitrary F0.
 * k/F0 = 1/0.03 makes force=1 at strain=0.06, for stiffness=1.
 * Damping acts only during tensile lengthening, never in compression.
 */
export function ligamentForce(strain: number, strainRate = 0, stiffness = 1) {
  if (strain <= 0) return 0;
  const toe = 0.06;
  const elastic = strain <= toe ? strain * strain / (2 * toe) : strain - toe / 2;
  return Math.max(0, stiffness) * (elastic / 0.03 + 0.01 * Math.max(0, strainRate));
}
export function tendonForce(strain: number, compliance: number) {
  return Math.pow(Math.max(0, strain) / Math.max(0.005, compliance), 2);
}
export function forceVelocity(normalizedVelocity: number) {
  const v = clamp(normalizedVelocity, -1, 1);
  return v <= 0 ? (1 + v) / (1 - v / 0.25) : 1 + 0.8 * v / (v + 0.25);
}
export function fiberForce(ratio: number, activation: number, velocity = 0) {
  const active = clamp(activation, 0, 1) * Math.exp(-Math.pow((ratio - 1) / 0.45, 2)) * forceVelocity(velocity);
  const passive = ratio <= 1 ? 0 : Math.expm1(4 * Math.min(2, (ratio - 1) / 0.6)) / Math.expm1(4);
  return active + passive;
}

/** Quasi-static series equilibrium, Ffiber=Ftendon, with zero pennation.
 * Velocity factor uses prescribed path velocity (not contraction dynamics).
 */
export function muscleEquilibrium(pathLength: number, restLength: number, activation: number, compliance: number, velocity = 0) {
  const optimal = Math.max(1e-5, restLength * 0.7);
  const slack = Math.max(1e-5, restLength * 0.3);
  const length = Math.max(1e-5, pathLength);
  if (length <= slack) return { fiberRatio: Math.max(0.05, (length - slack) / optimal), force: 0, tendonStrain: 0, residual: 0, limited: true };
  const gap = (fiber: number) => fiberForce(fiber / optimal, activation, velocity) - tendonForce((length - fiber - slack) / slack, compliance);
  let lo = Math.max(1e-8, optimal * 0.05), hi = length;
  if (gap(lo) > 0) return { fiberRatio: lo / optimal, force: 0, tendonStrain: 0, residual: gap(lo), limited: true };
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (gap(mid) > 0) hi = mid; else lo = mid;
  }
  const fiber = (lo + hi) / 2;
  const tendonStrain = Math.max(0, (length - fiber - slack) / slack);
  const force = tendonForce(tendonStrain, compliance);
  return { fiberRatio: fiber / optimal, force, tendonStrain, residual: Math.abs(gap(fiber)), limited: fiber / optimal < 0.5 || fiber / optimal > 1.6 };
}

/** Geometric reserve shared between both ends. Not an empirical nerve law. */
export function nerveResponse(length: number, restLength: number, reserve: number) {
  const change = length - restLength;
  const excursion = clamp(change / 2, -Math.max(0, reserve), Math.max(0, reserve));
  return { excursion, strain: Math.max(0, change - 2 * excursion) / Math.max(restLength, 1e-5) };
}
