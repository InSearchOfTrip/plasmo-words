import React, { useRef, useState } from "react";
import { AudioButton } from "../shared/AudioButton";
import { ResultFeedback } from "../shared/ResultFeedback";
import type { Word } from "../useLearnSession";

type Props = {
  word: Word;
  onCorrect: () => void;
  onWrong: () => void;
};

// H3: Hear EN word → type EN word (pure dictation)
export function AudioTypeWord({ word, onCorrect, onWrong }: Props) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (result) return;
    const answer = value.trim().toLowerCase();
    const correct = word.originalText.trim().toLowerCase();
    const isCorrect = answer === correct;
    setResult(isCorrect ? "correct" : "wrong");
    if (!isCorrect) onWrong();
  }

  function handleFeedbackDone() {
    if (result === "correct") {
      onCorrect();
    } else {
      setValue("");
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div className="exercise d-flex flex-column align-items-center gap-4">
      <p className="text-muted small mb-0">Послухайте та напишіть почуте слово</p>
      <AudioButton
        text={word.originalText}
        lang={word.originalLanguage}
        autoPlay
        size="lg"
      />
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            className={`form-control form-control-lg ${
              result === "wrong" ? "is-invalid" : result === "correct" ? "is-valid" : ""
            }`}
            placeholder="Type what you heard..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!!result}
          />
          <button className="btn btn-primary" type="submit" disabled={!value.trim() || !!result}>
            ОК
          </button>
        </div>
        {result === "wrong" && (
          <div className="text-danger mt-2 small">
            Правильна відповідь: <strong>{word.originalText}</strong>
          </div>
        )}
      </form>
      <ResultFeedback result={result} onDone={handleFeedbackDone} />
    </div>
  );
}
