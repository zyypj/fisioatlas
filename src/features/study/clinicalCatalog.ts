import { clinicalCategories, clinicalKinds } from "../../data/clinicalTests";
import type {
  ClinicalCategory,
  ClinicalKind,
  ClinicalTest,
} from "../../data/clinicalTests";

export interface ClinicalFilters {
  query: string;
  category: ClinicalCategory | "";
  kind: ClinicalKind | "";
}

/** Minúsculas e sem acentos: "lasegue" encontra "Lasègue". */
export function normalizeSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Lê os filtros da URL, descartando valores desconhecidos. */
export function parseClinicalFilters(params: URLSearchParams): ClinicalFilters {
  const category = params.get("regiao") ?? "",
    kind = params.get("tipo") ?? "";
  return {
    query: params.get("q") ?? "",
    category: clinicalCategories.some((item) => item.id === category)
      ? (category as ClinicalCategory)
      : "",
    kind: kind in clinicalKinds ? (kind as ClinicalKind) : "",
  };
}

function searchableText(test: ClinicalTest) {
  const category = clinicalCategories.find((item) => item.id === test.category);
  return normalizeSearch(
    [
      test.name,
      ...test.aliases,
      test.region,
      test.summary,
      category?.name ?? "",
      clinicalKinds[test.kind],
    ].join(" "),
  );
}

/** Cada palavra da busca precisa aparecer em algum campo do teste. */
export function filterClinicalTests(
  tests: ClinicalTest[],
  { query, category, kind }: ClinicalFilters,
) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return tests.filter((test) => {
    if (category && test.category !== category) return false;
    if (kind && test.kind !== kind) return false;
    const text = searchableText(test);
    return words.every((word) => text.includes(word));
  });
}

/** Agrupa na ordem das categorias; inclui categorias vazias. */
export function groupClinicalTests(tests: ClinicalTest[]) {
  return clinicalCategories.map((category) => ({
    ...category,
    tests: tests.filter((test) => test.category === category.id),
  }));
}
