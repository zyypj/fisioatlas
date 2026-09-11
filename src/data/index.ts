import raw from "./structures.json";
import type { Kind, Structure } from "../types";
export const structures = raw as unknown as Structure[];
export const byId = Object.fromEntries(
  structures.map((x) => [x.id, x]),
) as Record<string, Structure>;
export const labels: Record<Kind, string> = {
  ossos: "Ossos",
  musculos: "Músculos",
  articulacoes: "Articulações",
  ligamentos: "Ligamentos",
  tendoes: "Tendões",
  nervos: "Nervos",
};
export const colors: Record<Kind, string> = {
  ossos: "#d9cbb0",
  musculos: "#b65f58",
  articulacoes: "#87b9c6",
  ligamentos: "#c6ac7b",
  tendoes: "#e7e0d6",
  nervos: "#d3ae42",
};
export const regions = [
  "Cabeça e pescoço",
  "Tronco",
  "Ombro",
  "Braço",
  "Cotovelo",
  "Antebraço",
  "Punho",
  "Mão",
  "Pelve",
  "Quadril",
  "Coxa",
  "Joelho",
  "Perna",
  "Tornozelo",
  "Pé",
  "Coluna vertebral",
];
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function searchStructures(q: string, kind?: string, region?: string) {
  const words = normalize(q).trim().split(/\s+/);
  const matching = structures.filter(
    (s) =>
      (!kind || s.kind === kind) &&
      (!region || s.region === region) &&
      words.every((w) =>
        normalize([s.name, ...s.aliases, s.region].join(" ")).includes(w),
      ),
  );
  const term = normalize(q).trim();
  const score = (s: Structure) =>
    normalize(s.name) === term || s.aliases.some((a) => normalize(a) === term)
      ? 100
      : normalize(s.name).startsWith(term)
        ? 50
        : 0;
  return term ? matching.sort((a, b) => score(b) - score(a)) : matching;
}
export const structurePath = (s: Structure) => `/anatomia/${s.kind}/${s.id}`;
