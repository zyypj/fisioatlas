import type { StudyState } from "../types";
export const STORAGE_KEY = "fisioatlas-study-v1";
export const emptyStudy: StudyState = {
  favorites: [],
  history: [],
  searches: [],
  quiz: { correct: 0, total: 0 },
  cards: {},
  onboarded: false,
};
const strings = (v: unknown): string[] =>
  Array.isArray(v)
    ? [...new Set(v.filter((x): x is string => typeof x === "string"))]
    : [];
const count = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
export function parseStudy(raw: string | null): StudyState {
  try {
    const d = JSON.parse(raw || "null");
    if (!d || typeof d !== "object") return emptyStudy;
    const cards: StudyState["cards"] = {};
    if (d.cards && typeof d.cards === "object" && !Array.isArray(d.cards))
      for (const [id, value] of Object.entries(d.cards)) {
        if (value && typeof value === "object") {
          const v = value as Record<string, unknown>;
          cards[id] = { correct: count(v.correct), wrong: count(v.wrong) };
        }
      }
    const total = count(d.quiz?.total);
    return {
      favorites: strings(d.favorites),
      history: strings(d.history).slice(0, 100),
      searches: strings(d.searches).slice(0, 12),
      quiz: { total, correct: Math.min(total, count(d.quiz?.correct)) },
      cards,
      onboarded: d.onboarded === true,
    };
  } catch {
    return emptyStudy;
  }
}
