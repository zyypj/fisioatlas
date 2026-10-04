import * as THREE from "three";
import { byId } from "../../data";
import { armBone, onAnimatedSide, rigMoves } from "./animationRigs";
import type { AnimationRig } from "./animationRigs";

/** Pontos de um osso, em coordenadas do modelo (x, y, z intercalados). */
export interface FieldBone {
  positions: ArrayLike<number>;
  moving: boolean;
}

/**
 * Peso de deformação por proximidade óssea, para movimentos em que o segmento
 * móvel não fica simplesmente abaixo do pivô, como a escápula deslizando sobre
 * o tórax.
 *
 * Um tecido mole acompanha o movimento na medida em que está mais perto dos
 * ossos que se movem (clavícula, escápula, úmero...) do que dos que ficam
 * (costelas, esterno, coluna). Assim o romboide, o serrátil e o trapézio
 * deformam entre a coluna ou as costelas e a escápula, sem que ninguém precise
 * marcar inserções à mão. É uma aproximação geométrica, não um mapa validado
 * de inserções.
 *
 * As distâncias vêm de uma transformada de distância (chanfro 3D) numa grade
 * regular; fora da grade o peso é zero.
 */
export function boneField(bones: FieldBone[], box: THREE.Box3, cell = 0.01) {
  const nx = Math.max(1, Math.ceil((box.max.x - box.min.x) / cell) + 1),
    ny = Math.max(1, Math.ceil((box.max.y - box.min.y) / cell) + 1),
    nz = Math.max(1, Math.ceil((box.max.z - box.min.z) / cell) + 1);
  const size = nx * ny * nz;
  const moving = new Float32Array(size).fill(Infinity),
    fixed = new Float32Array(size).fill(Infinity);
  const index = (i: number, j: number, k: number) => (k * ny + j) * nx + i;
  for (const bone of bones) {
    const target = bone.moving ? moving : fixed,
      p = bone.positions;
    for (let v = 0; v + 2 < p.length; v += 3) {
      const i = Math.round((p[v] - box.min.x) / cell),
        j = Math.round((p[v + 1] - box.min.y) / cell),
        k = Math.round((p[v + 2] - box.min.z) / cell);
      if (i < 0 || j < 0 || k < 0 || i >= nx || j >= ny || k >= nz) continue;
      target[index(i, j, k)] = 0;
    }
  }
  for (const field of [moving, fixed]) chamfer(field, nx, ny, nz, cell);

  const sample = (field: Float32Array, x: number, y: number, z: number) => {
    const fx = (x - box.min.x) / cell,
      fy = (y - box.min.y) / cell,
      fz = (z - box.min.z) / cell;
    const i = Math.min(nx - 2, Math.max(0, Math.floor(fx))),
      j = Math.min(ny - 2, Math.max(0, Math.floor(fy))),
      k = Math.min(nz - 2, Math.max(0, Math.floor(fz)));
    const tx = THREE.MathUtils.clamp(fx - i, 0, 1),
      ty = THREE.MathUtils.clamp(fy - j, 0, 1),
      tz = THREE.MathUtils.clamp(fz - k, 0, 1);
    let value = 0;
    for (let c = 0; c < 8; c++) {
      const di = c & 1,
        dj = (c >> 1) & 1,
        dk = (c >> 2) & 1;
      const weight =
        (di ? tx : 1 - tx) * (dj ? ty : 1 - ty) * (dk ? tz : 1 - tz);
      if (weight) value += weight * field[index(i + di, j + dj, k + dk)];
    }
    return value;
  };

  return {
    /** Peso entre 0 (fica com os ossos parados) e 1 (segue os que se movem). */
    weightAt(x: number, y: number, z: number) {
      if (
        x < box.min.x ||
        y < box.min.y ||
        z < box.min.z ||
        x > box.max.x ||
        y > box.max.y ||
        z > box.max.z
      )
        return 0;
      const toMoving = sample(moving, x, y, z),
        toFixed = sample(fixed, x, y, z);
      if (!Number.isFinite(toMoving)) return 0;
      if (!Number.isFinite(toFixed)) return 1;
      const ratio = toFixed / Math.max(1e-6, toFixed + toMoving);
      const weight = THREE.MathUtils.smoothstep(ratio, 0.3, 0.7);
      // Contato: o que encosta num osso fica preso a ele. Sem isso, o lábio
      // glenoidal, entre a glenoide e a cabeça do úmero a poucos milímetros
      // de cada uma, ganharia meio peso e se soltaria da escápula.
      return toMoving < toFixed
        ? Math.max(
            weight,
            1 - THREE.MathUtils.smoothstep(toMoving, 0.002, 0.006),
          )
        : Math.min(weight, THREE.MathUtils.smoothstep(toFixed, 0.002, 0.006));
    },
  };
}

/** Monta o campo de um rig a partir das malhas ósseas carregadas. Movem-se os
 *  ossos do lado animado que o rig carrega (clavícula, escápula, braço...);
 *  todos os demais, dos dois lados, ficam. Com `part = "arm"`, só o braço
 *  livre conta como móvel: é o peso da contrarrotação que mantém o braço
 *  pendurado. A grade cobre os ossos móveis com 12 cm de folga, o bastante
 *  para alcançar romboides, serrátil e trapézio. */
export function rigBoneField(
  rig: AnimationRig,
  meshes: {
    userData: Record<string, any>;
    positions: ArrayLike<number>;
  }[],
  part: "segment" | "arm" = "segment",
) {
  const bones: FieldBone[] = [],
    box = new THREE.Box3();
  for (const mesh of meshes) {
    const s = byId[mesh.userData.structureId];
    if (s?.kind !== "ossos") continue;
    const moving =
      onAnimatedSide(rig, mesh.userData.center.x) &&
      rigMoves(rig, s.id, s.region) &&
      (part === "segment" || armBone(s.id, s.region));
    bones.push({ positions: mesh.positions, moving });
    if (moving) box.union(mesh.userData.bounds);
  }
  return boneField(bones, box.expandByScalar(0.12));
}

/** Transformada de distância em duas passagens com vizinhança 3×3×3. */
function chamfer(
  field: Float32Array,
  nx: number,
  ny: number,
  nz: number,
  cell: number,
) {
  const offsets: [number, number, number, number][] = [];
  for (let dk = -1; dk <= 1; dk++)
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        const order = dk * 9 + dj * 3 + di;
        if (order < 0)
          offsets.push([di, dj, dk, cell * Math.hypot(di, dj, dk)]);
      }
  const relax = (i: number, j: number, k: number, sign: 1 | -1) => {
    const at = (k * ny + j) * nx + i;
    let best = field[at];
    for (const [di, dj, dk, cost] of offsets) {
      const a = i + di * sign,
        b = j + dj * sign,
        c = k + dk * sign;
      if (a < 0 || b < 0 || c < 0 || a >= nx || b >= ny || c >= nz) continue;
      const candidate = field[(c * ny + b) * nx + a] + cost;
      if (candidate < best) best = candidate;
    }
    field[at] = best;
  };
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) relax(i, j, k, 1);
  for (let k = nz - 1; k >= 0; k--)
    for (let j = ny - 1; j >= 0; j--)
      for (let i = nx - 1; i >= 0; i--) relax(i, j, k, -1);
}
