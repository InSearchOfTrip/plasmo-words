import React, { useState, useMemo } from "react";
import { useWords, useCollections } from "~assets/storage/collections";
import { useLearnSession } from "./components/useLearnSession";
import { CollectionPicker } from "./components/CollectionPicker";
import { LevelLow } from "./components/LevelLow";
import { LevelMedium } from "./components/LevelMedium";
import { LevelHigh } from "./components/LevelHigh";
import type { Word } from "./components/useLearnSession";

import "~assets/styles/normalize.css";
import "~assets/styles/bootstrap.min.css";
import "./style.scss";

const STREAK_MAX = 10;

// Separate component so pool reinitializes on remount (key changes on every start)
function LearnSession({
  words,
  onBack,
}: {
  words: Record<string, Word>;
  onBack: () => void;
}) {
  const {
    currentWord,
    exercise,
    getDistractors,
    onCorrect,
    onWrong,
    sessionStats,
    activeCount,
    totalCount,
    isFinished,
  } = useLearnSession(words);

  if (isFinished) {
    return (
      <div className="text-center">
        <h2 className="display-5">🎉 Всі слова вивчено!</h2>
        <p className="text-muted">
          Усі {totalCount} слів пройшли всі рівні. Повертайтесь завтра або додайте нові слова.
        </p>
        <button className="btn btn-primary mt-3" onClick={onBack}>
          ← Обрати категорію
        </button>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="w-100 d-flex flex-column" style={{ maxWidth: 640 }}>
      {/* Header row */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={onBack}>
          ← Категорії
        </button>
        <span className="text-muted small">
          ✓ {sessionStats.correct} &nbsp;✗ {sessionStats.wrong}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="small text-muted">
            Залишилось слів: <strong>{activeCount}</strong> / {totalCount}
          </span>
          <span className="small text-muted">
            streak {currentWord.good_streak}/{STREAK_MAX} &middot;{" "}
            <span className={`badge ${
              currentWord.level === "low" ? "bg-success" :
              currentWord.level === "medium" ? "bg-warning text-dark" : "bg-danger"
            }`}>
              {currentWord.level}
            </span>
          </span>
        </div>
        <div className="progress" style={{ height: 6 }}>
          <div
            className="progress-bar bg-primary"
            style={{
              width: `${(currentWord.good_streak / STREAK_MAX) * 100}%`,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Exercise */}
      {currentWord.level === "low" && (
        <LevelLow
          word={currentWord}
          exercise={exercise as "L1" | "L2" | "L3"}
          distractors={getDistractors(currentWord)}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
      {currentWord.level === "medium" && (
        <LevelMedium
          word={currentWord}
          exercise={exercise as "M1" | "M2" | "M3"}
          distractors={getDistractors(currentWord)}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
      {currentWord.level === "high" && (
        <LevelHigh
          word={currentWord}
          exercise={exercise as "H1" | "H2" | "H3"}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
    </div>
  );
}

function LearnGround() {
  const { words } = useWords();
  const { collections } = useCollections();

  // null = picker screen; string[] = session started (empty = all collections)
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[] | null>(null);
  // sessionKey changes on every start so LearnSession remounts and pool reinitialises
  const [sessionKey, setSessionKey] = useState(0);

  const filteredWords = useMemo(() => {
    if (selectedCollectionIds === null) return {};
    if (selectedCollectionIds.length === 0) return words;
    return Object.fromEntries(
      Object.entries(words).filter(([, w]) => {
        const word = w as { collectionIds: string[] };
        return word.collectionIds.some((cid) => selectedCollectionIds.includes(cid));
      })
    ) as typeof words;
  }, [words, selectedCollectionIds]);

  function handleStart(ids: string[]) {
    setSelectedCollectionIds(ids);
    setSessionKey((k) => k + 1);
  }

  function handleBack() {
    setSelectedCollectionIds(null);
  }

  const hasWords = Object.keys(words).length > 0;
  const sessionStarted = selectedCollectionIds !== null;

  return (
    <div className="learnground container-fluid vh-100 d-flex flex-column">
      <div className="header p-3 border-bottom">
        <h1 className="fs-2 m-0">LearnGround</h1>
      </div>

      <div className="content flex-grow-1 p-4 d-flex flex-column align-items-center justify-content-center">
        {!hasWords && (
          <p className="text-muted">Додайте слова, щоб почати навчання</p>
        )}

        {hasWords && !sessionStarted && (
          <CollectionPicker
            onStart={handleStart}
          />
        )}

        {hasWords && sessionStarted && (
          <LearnSession
            key={sessionKey}
            words={filteredWords}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default LearnGround;
