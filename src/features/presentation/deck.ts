import {
  clinicalCategories,
  clinicalKinds,
  clinicalQuadrants,
  clinicalTestById,
} from "../../data/clinicalTests";
import type { ClinicalTest } from "../../data/clinicalTests";
import { sources } from "../../data/sources";

export type DeckFormat = "completo" | "resumido";

export interface DeckOptions {
  title: string;
  subtitle: string;
  format: DeckFormat;
  cases: boolean;
  references: boolean;
}

type TestCase = ClinicalTest["cases"][number];

/** Um slide do modo apresentação. `notes` são as notas do apresentador. */
export type Slide = { notes?: string } & (
  | { kind: "cover"; title: string; subtitle: string; count: number }
  | {
      kind: "agenda";
      groups: { id: string; name: string; tests: string[] }[];
    }
  | {
      kind: "section";
      name: string;
      quadrant: string;
      description: string;
      tests: string[];
    }
  | { kind: "test"; test: ClinicalTest; order: number; total: number }
  | {
      kind: "list";
      test: ClinicalTest;
      title: string;
      lead?: string;
      items: string[];
      tone?: "safety" | "warning";
    }
  | {
      kind: "step";
      test: ClinicalTest;
      index: number;
      step: ClinicalTest["steps"][number];
    }
  | { kind: "steps"; test: ClinicalTest }
  | { kind: "interpretation"; test: ClinicalTest }
  | { kind: "reasoning"; test: ClinicalTest }
  | { kind: "evidence"; test: ClinicalTest }
  | { kind: "case"; test: ClinicalTest; item: TestCase }
  | {
      kind: "references";
      items: { id: string; name: string; url: string }[];
    }
  | { kind: "closing"; title: string; count: number }
);

/** Lê os ids de teste da URL (`testes=a,b`), sem repetir e sem desconhecidos. */
export function parseTestIds(value: string | null) {
  return [
    ...new Set(
      (value ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter((id) => clinicalTestById[id]),
    ),
  ];
}

/** Título padrão do deck conforme os quadrantes dos testes escolhidos. */
export function defaultDeckTitle(tests: ClinicalTest[]) {
  const quadrants = new Set(
    tests.map(
      (test) =>
        clinicalCategories.find((item) => item.id === test.category)!.quadrant,
    ),
  );
  if (tests.length === 1) return tests[0].name;
  if (quadrants.size === 1) {
    const [quadrant] = quadrants;
    return "Testes clínicos do " + clinicalQuadrants[quadrant].toLowerCase();
  }
  return "Testes clínicos em fisioterapia";
}

/** Ordena os testes pela ordem das regiões do catálogo, mantendo a ordem de
 *  escolha dentro de cada região. */
function grouped(tests: ClinicalTest[]) {
  return clinicalCategories
    .map((category) => ({
      ...category,
      tests: tests.filter((test) => test.category === category.id),
    }))
    .filter((group) => group.tests.length);
}

function testSlides(
  test: ClinicalTest,
  order: number,
  total: number,
  options: DeckOptions,
): Slide[] {
  const slides: Slide[] = [
    {
      kind: "test",
      test,
      order,
      total,
      notes: test.purpose,
    },
  ];
  const full = options.format === "completo";
  slides.push({
    kind: "list",
    test,
    title: "Quando usar",
    lead: full ? test.purpose : test.summary,
    items: test.indications,
    notes: test.position
      ? "Posição: " + test.position
      : "Retome a pergunta clínica que o teste ajuda a responder.",
  });
  if (full)
    slides.push({
      kind: "list",
      test,
      title: "Segurança antes de testar",
      items: test.safety,
      tone: "safety",
      notes:
        "Reforce consentimento, critérios de interrupção e sinais de alerta antes de demonstrar.",
    });
  if (full)
    test.steps.forEach((step, index) =>
      slides.push({
        kind: "step",
        test,
        index,
        step,
        notes: step.text,
      }),
    );
  else
    slides.push({
      kind: "steps",
      test,
      notes: test.steps.map((step) => step.cue).join(" "),
    });
  slides.push({
    kind: "interpretation",
    test,
    notes: test.caution,
  });
  if (full) {
    slides.push({
      kind: "reasoning",
      test,
      notes: test.caution,
    });
    if (test.evidence)
      slides.push({
        kind: "evidence",
        test,
        notes:
          "Destaque a população estudada e por que os números não valem para todos os contextos.",
      });
    slides.push({
      kind: "list",
      test,
      title: "Erros comuns",
      items: test.mistakes,
      tone: "warning",
      notes: "Exemplo de registro: " + test.record,
    });
  }
  if (options.cases && test.cases.length) {
    const cases = full ? test.cases : test.cases.slice(0, 1);
    for (const item of cases)
      slides.push({
        kind: "case",
        test,
        item,
        notes: item.explanation,
      });
  }
  return slides;
}

/** Monta o deck: capa, roteiro, uma seção por região e os slides de cada
 *  teste; no fim, referências e encerramento. */
export function buildDeck(tests: ClinicalTest[], options: DeckOptions) {
  const groups = grouped(tests);
  const ordered = groups.flatMap((group) => group.tests);
  const slides: Slide[] = [
    {
      kind: "cover",
      title: options.title.trim() || defaultDeckTitle(ordered),
      subtitle: options.subtitle.trim(),
      count: ordered.length,
      notes:
        "Apresente o objetivo: da manobra ao raciocínio clínico, com segurança e limites de interpretação.",
    },
  ];
  if (ordered.length > 1)
    slides.push({
      kind: "agenda",
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        tests: group.tests.map((test) => test.name),
      })),
    });
  let order = 0;
  for (const group of groups) {
    if (groups.length > 1 || group.tests.length > 1)
      slides.push({
        kind: "section",
        name: group.name,
        quadrant: clinicalQuadrants[group.quadrant],
        description: group.description,
        tests: group.tests.map((test) => test.name),
      });
    for (const test of group.tests)
      slides.push(...testSlides(test, ++order, ordered.length, options));
  }
  if (options.references) {
    const ids = [...new Set(ordered.flatMap((test) => test.sources))];
    const items = ids
      .map((id) => sources.find((source) => source.id === id))
      .filter((source) => !!source)
      .map((source) => ({ id: source.id, name: source.name, url: source.url }));
    if (items.length) slides.push({ kind: "references", items });
  }
  slides.push({
    kind: "closing",
    title: "Perguntas?",
    count: ordered.length,
    notes:
      "Conteúdo educativo: a aplicação clínica exige formação, supervisão e integração com o exame completo.",
  });
  return slides;
}

/** Rótulo curto do teste para cabeçalhos de slide. */
export function testLabel(test: ClinicalTest) {
  const category = clinicalCategories.find(
    (item) => item.id === test.category,
  )!;
  return category.name + " · " + clinicalKinds[test.kind];
}
