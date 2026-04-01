import React, { useMemo, useState } from "react";
import { LetterTiles } from "../shared/LetterTiles";
import { ResultFeedback } from "../shared/ResultFeedback";
import type { Word } from "../useLearnSession";

type Props = {
  word: Word;
  onCorrect: () => void;
  onWrong: () => void;
};

const EXTRA_LETTERS_COUNT = 4;

function buildLetterPool(target: string): string[] {
  const targetLetters = target.toLowerCase().split("").filter((c) => c !== " ");
  const alphabet = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
  const extras: string[] = [];
  for (let i = 0; i < EXTRA_LETTERS_COUNT; i++) {
    extras.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  return [...targetLetters, ...extras].sort(() => Math.random() - 0.5);
}

// M2: See EN word → assemble translation from letters
export function LetterAssembly({ word, onCorrect, onWrong }: Props) {
  const target = word.translatedText.toLowerCase().replace(/\s+/g, "");
  const initialPool = useMemo(() => buildLetterPool(target), [word]);

  const [pool, setPool] = useState<Array<{ letter: string; used: boolean }>>(
    () => initialPool.map((l) => ({ letter: l, used: false }))
  );
  const [assembled, setAssembled] = useState<Array<{ letter: string; poolIndex: number }>>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const availableLetters = pool
    .map((item, i) => (!item.used ? item.letter : ""))
    .filter(Boolean);

  const availableIndices = pool
    .map((item, i) => (!item.used ? i : -1))
    .filter((i) => i !== -1);

  function handleTileClick(visibleIndex: number) {
    if (result) return;
    const poolIndex = availableIndices[visibleIndex];
    setPool((prev) => prev.map((item, i) => (i === poolIndex ? { ...item, used: true } : item)));
    setAssembled((prev) => [...prev, { letter: pool[poolIndex].letter, poolIndex }]);
  }

  function handleAssembledClick(index: number) {
    if (result) return;
    const { poolIndex } = assembled[index];
    setPool((prev) => prev.map((item, i) => (i === poolIndex ? { ...item, used: false } : item)));
    setAssembled((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCheck() {
    const answer = assembled.map((a) => a.letter).join("");
    const isCorrect = answer === target;
    setResult(isCorrect ? "correct" : "wrong");
    if (!isCorrect) onWrong();
  }

  function handleFeedbackDone() {
    if (result === "correct") {
      onCorrect();
    } else {
      setPool(initialPool.map((l) => ({ letter: l, used: false })));
      setAssembled([]);
      setResult(null);
    }
  }

  return (
    <div className="exercise d-flex flex-column align-items-center gap-4">
      <p className="text-muted small mb-0">Складіть переклад із букв</p>
      <h2 className="display-5 fw-bold">{word.originalText}</h2>
      <LetterTiles
        letters={availableLetters}
        assembled={assembled.map((a) => a.letter)}
        onTileClick={handleTileClick}
        onAssembledClick={handleAssembledClick}
        disabled={!!result}
      />
      {assembled.length > 0 && !result && (
        <button className="btn btn-primary px-5" onClick={handleCheck}>
          Перевірити
        </button>
      )}
      <ResultFeedback result={result} onDone={handleFeedbackDone} />
    </div>
  );
}
