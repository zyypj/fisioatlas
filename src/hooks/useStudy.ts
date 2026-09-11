import { useRef, useState } from "react";
import type { StudyState } from "../types";
import { STORAGE_KEY, emptyStudy, parseStudy } from "../services/studyStorage";
function restore(): StudyState {
  try {
    return parseStudy(localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyStudy;
  }
}
export function useStudy() {
  const [study, setStudy] = useState<StudyState>(restore);
  const [storageError, setStorageError] = useState(false);
  const current = useRef(study);
  function update(fn: (s: StudyState) => StudyState) {
    const next = fn(current.current);
    current.current = next;
    setStudy(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  return {
    study,
    storageError,
    favorite: (id: string) =>
      update((s) => ({
        ...s,
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((x) => x !== id)
          : [...s.favorites, id],
      })),
    visit: (id: string) =>
      update((s) => ({
        ...s,
        history: [id, ...s.history.filter((x) => x !== id)].slice(0, 100),
      })),
    search: (q: string) =>
      update((s) => ({
        ...s,
        searches: [q, ...s.searches.filter((x) => x !== q)].slice(0, 12),
      })),
    answer: (correct: boolean) =>
      update((s) => ({
        ...s,
        quiz: {
          total: s.quiz.total + 1,
          correct: s.quiz.correct + Number(correct),
        },
      })),
    card: (id: string, correct: boolean) =>
      update((s) => ({
        ...s,
        cards: {
          ...s.cards,
          [id]: {
            correct: (s.cards[id]?.correct || 0) + Number(correct),
            wrong: (s.cards[id]?.wrong || 0) + Number(!correct),
          },
        },
      })),
    onboard: () => update((s) => ({ ...s, onboarded: true })),
  };
}
