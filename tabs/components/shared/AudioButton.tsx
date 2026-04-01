import React, { useEffect } from "react";
import { speakWord } from "~assets/helpers/speech";

type Props = {
  text: string;
  lang: string;
  autoPlay?: boolean;
  size?: "sm" | "md" | "lg";
};

export function AudioButton({ text, lang, autoPlay = false, size = "md" }: Props) {
  useEffect(() => {
    if (autoPlay && text) {
      speakWord(text, lang);
    }
  }, [text, lang, autoPlay]);

  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type="button"
      className={`btn btn-outline-primary ${sizeClass} d-flex align-items-center gap-2`}
      onClick={() => speakWord(text, lang)}
      title={`Прослухати: ${text}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06C18.01 19.86 21 16.28 21 12c0-4.28-2.99-7.86-7-8.77z" />
      </svg>
      Слухати
    </button>
  );
}
