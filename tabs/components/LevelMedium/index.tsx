import React from "react";
import type { Word } from "../useLearnSession";
import { AudioReverseChoice } from "./AudioReverseChoice";
import { LetterAssembly } from "./LetterAssembly";
import { AudioLetterAssembly } from "./AudioLetterAssembly";

type Props = {
  word: Word;
  exercise: "M1" | "M2" | "M3";
  distractors: Array<{ originalText: string; translatedText: string }>;
  onCorrect: () => void;
  onWrong: () => void;
};

export function LevelMedium({ word, exercise, distractors, onCorrect, onWrong }: Props) {
  if (exercise === "M1")
    return <AudioReverseChoice word={word} distractors={distractors} onCorrect={onCorrect} onWrong={onWrong} />;
  if (exercise === "M2")
    return <LetterAssembly word={word} onCorrect={onCorrect} onWrong={onWrong} />;
  return <AudioLetterAssembly word={word} onCorrect={onCorrect} onWrong={onWrong} />;
}
