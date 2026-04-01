import React from "react";
import type { Word } from "../useLearnSession";
import { TypeTranslation } from "./TypeTranslation";
import { TypeWord } from "./TypeWord";
import { AudioTypeWord } from "./AudioTypeWord";

type Props = {
  word: Word;
  exercise: "H1" | "H2" | "H3";
  onCorrect: () => void;
  onWrong: () => void;
};

export function LevelHigh({ word, exercise, onCorrect, onWrong }: Props) {
  if (exercise === "H1") return <TypeTranslation word={word} onCorrect={onCorrect} onWrong={onWrong} />;
  if (exercise === "H2") return <TypeWord word={word} onCorrect={onCorrect} onWrong={onWrong} />;
  return <AudioTypeWord word={word} onCorrect={onCorrect} onWrong={onWrong} />;
}
