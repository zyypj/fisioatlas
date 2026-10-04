import type { Structure } from "../../types";

/** Uma ficha do catálogo pode agrupar componentes de membros diferentes, como
 * os septos intermusculares (braço, coxa e perna numa ficha só, classificada
 * como "Perna"). Resolve a região de cada componente pelo objeto de origem no
 * Z-Anatomy antes de decidir se ele acompanha um movimento. */
export function componentStructure(
  structure: Structure,
  sourceObject: string,
): Structure {
  if (structure.id !== "septos-intermusculares") return structure;
  const region = /intermuscular septum of arm\.[rl]$/i.test(sourceObject)
    ? "Braço"
    : /femoral intermuscular septum\.[rl]$/i.test(sourceObject)
      ? "Coxa"
      : /intermuscular septum of leg\.[rl]$/i.test(sourceObject)
        ? "Perna"
        : structure.region;
  return region === structure.region ? structure : { ...structure, region };
}
