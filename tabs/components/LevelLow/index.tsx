import React from "react";
import type { Word } from "../useLearnSession";
import { MultipleChoiceCard } from "./MultipleChoiceCard";
import { AudioToChoice } from "./AudioToChoice";
import { ReverseChoiceCard } from "./ReverseChoiceCard";

type Props = {
  word: Word;
  exercise: "L1" | "L2" | "L3";
  distractors: Array<{ originalText: string; translatedText: string }>;
  onCorrect: () => void;
  onWrong: () => void;
};

export function LevelLow({ word, exercise, distractors, onCorrect, onWrong }: Props) {
  const sharedProps = { word, distractors, onCorrect, onWrong };

  if (exercise === "L1") return <MultipleChoiceCard {...sharedProps} />;
  if (exercise === "L2") return <AudioToChoice {...sharedProps} />;
  return <ReverseChoiceCard {...sharedProps} />;
}
