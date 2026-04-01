import React, { useMemo, useState } from "react";
import { ChoiceGrid, type ChoiceOption } from "../shared/ChoiceGrid";
import { AudioButton } from "../shared/AudioButton";
import { ResultFeedback } from "../shared/ResultFeedback";
import type { Word } from "../useLearnSession";

type Props = {
  word: Word;
  distractors: Array<{ originalText: string; translatedText: string }>;
  onCorrect: () => void;
  onWrong: () => void;
};

// M1: Hear translation → choose EN word
export function AudioReverseChoice({ word, distractors, onCorrect, onWrong }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const options: ChoiceOption[] = useMemo(() => {
    const items: ChoiceOption[] = [
      { id: word.id, text: word.originalText },
      ...distractors.map((d, i) => ({ id: `d-${i}`, text: d.originalText })),
    ];
    return items.sort(() => Math.random() - 0.5);
  }, [word, distractors]);

  function handleSelect(id: string) {
    if (selectedId) return;
    setSelectedId(id);
    const isCorrect = id === word.id;
    setResult(isCorrect ? "correct" : "wrong");
    if (!isCorrect) onWrong();
  }

  function handleFeedbackDone() {
    if (result === "correct") onCorrect();
    else {
      setSelectedId(null);
      setResult(null);
    }
  }

  return (
    <div className="exercise d-flex flex-column align-items-center gap-4">
      <p className="text-muted small mb-0">Послухайте переклад та виберіть англійське слово</p>
      <AudioButton
        text={word.translatedText}
        lang={word.translatedLanguage}
        autoPlay
        size="lg"
      />
      <ChoiceGrid
        options={options}
        selectedId={selectedId}
        correctId={word.id}
        onSelect={handleSelect}
        disabled={!!selectedId}
      />
      <ResultFeedback result={result} onDone={handleFeedbackDone} />
    </div>
  );
}
