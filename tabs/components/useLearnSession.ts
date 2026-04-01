import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { storage } from "~assets/storage/collections";
import { wordBank } from "./wordBank";

export type ExerciseType =
  | "L1" | "L2" | "L3"
  | "M1" | "M2" | "M3"
  | "H1" | "H2" | "H3";

export type Word = {
  id: string;
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  translatedLanguage: string;
  collectionIds: string[];
  priority: number;
  createdAt: number;
  good_streak: number;
  level: "low" | "medium" | "high";
};

type SessionStats = {
  total: number;
  correct: number;
  wrong: number;
};

const LOW_EXERCISES: ExerciseType[] = ["L1", "L2", "L3"];
const MEDIUM_EXERCISES: ExerciseType[] = ["M1", "M2", "M3"];
const HIGH_EXERCISES: ExerciseType[] = ["H1", "H2", "H3"];

export const STREAK_TO_LEVEL_UP = 10;
const WRONG_PENALTY = 2;
const DISTRACTORS_COUNT = 5;

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function pickExercise(level: Word["level"]): ExerciseType {
  if (level === "low") return pickRandom(LOW_EXERCISES, 1)[0];
  if (level === "medium") return pickRandom(MEDIUM_EXERCISES, 1)[0];
  return pickRandom(HIGH_EXERCISES, 1)[0];
}

function isWordDone(word: Word): boolean {
  return word.level === "high" && word.good_streak >= STREAK_TO_LEVEL_UP;
}

export function useLearnSession(words: Record<string, Word>) {
  // Fixed pool sorted by priority (desc) at session start — never reorders
  const [pool] = useState<string[]>(() =>
    Object.keys(words).sort((a, b) => (words[b]?.priority ?? 0) - (words[a]?.priority ?? 0))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [exercise, setExercise] = useState<ExerciseType>(() => {
    const firstId = Object.keys(words)[0];
    const first = firstId ? words[firstId] : null;
    return first ? pickExercise(first.level) : "L1";
  });
  const [stats, setStats] = useState<SessionStats>({ total: 0, correct: 0, wrong: 0 });

  // Live active pool — words not yet done, order preserved from fixed pool
  const activePool = useMemo(
    () => pool.filter((id) => words[id] && !isWordDone(words[id])),
    [pool, words]
  );

  const isFinished = pool.length > 0 && activePool.length === 0;

  // Current word always read from live storage data
  const currentWordId = activePool.length > 0
    ? activePool[currentIndex % activePool.length]
    : null;
  const currentWord: Word | null = currentWordId ? (words[currentWordId] ?? null) : null;

  // Update exercise whenever we land on a new word or its level changes
  const seenWordKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!currentWord) return;
    const key = `${currentWord.id}:${currentWord.level}`;
    if (key !== seenWordKeyRef.current) {
      seenWordKeyRef.current = key;
      setExercise(pickExercise(currentWord.level));
    }
  }, [currentWord?.id, currentWord?.level]);

  const getDistractors = useCallback(
    (word: Word): Array<{ originalText: string; translatedText: string }> => {
      const otherUserWords = Object.values(words)
        .filter((w) => w.id !== word.id)
        .map((w) => ({ originalText: w.originalText, translatedText: w.translatedText }));

      const needed = DISTRACTORS_COUNT;

      if (otherUserWords.length >= needed) {
        return pickRandom(otherUserWords, needed);
      }

      const bankPool = wordBank.filter(
        (b) =>
          b.originalText.toLowerCase() !== word.originalText.toLowerCase() &&
          b.translatedText.toLowerCase() !== word.translatedText.toLowerCase()
      );

      const combined = [
        ...otherUserWords,
        ...pickRandom(bankPool, needed - otherUserWords.length + 5),
      ];
      return pickRandom(combined, needed);
    },
    [words]
  );

  const onCorrect = useCallback(async () => {
    if (!currentWord) return;

    setStats((s) => ({ ...s, total: s.total + 1, correct: s.correct + 1 }));

    const newStreak = currentWord.good_streak + 1;
    let newLevel = currentWord.level;
    let finalStreak = newStreak;

    if (newStreak >= STREAK_TO_LEVEL_UP) {
      if (currentWord.level === "low") {
        newLevel = "medium";
        finalStreak = 0;
      } else if (currentWord.level === "medium") {
        newLevel = "high";
        finalStreak = 0;
      }
      // high: keep streak at newStreak (marks word as done at 10)
    }

    const updatedWord: Word = {
      ...currentWord,
      good_streak: finalStreak,
      level: newLevel,
    };

    const allWords = await storage.get<Record<string, Word>>("words");
    if (allWords) {
      await storage.set("words", { ...allWords, [currentWord.id]: updatedWord });
    }

    setCurrentIndex((prev) => prev + 1);
  }, [currentWord]);

  const onWrong = useCallback(async () => {
    if (!currentWord) return;

    setStats((s) => ({ ...s, total: s.total + 1, wrong: s.wrong + 1 }));

    const newStreak = Math.max(0, currentWord.good_streak - WRONG_PENALTY);
    const updatedWord: Word = { ...currentWord, good_streak: newStreak };

    const allWords = await storage.get<Record<string, Word>>("words");
    if (allWords) {
      await storage.set("words", { ...allWords, [currentWord.id]: updatedWord });
    }

    setCurrentIndex((prev) => prev + 1);
  }, [currentWord]);

  return {
    currentWord,
    exercise,
    getDistractors,
    onCorrect,
    onWrong,
    sessionStats: stats,
    activeCount: activePool.length,
    totalCount: pool.length,
    isFinished,
  };
}
