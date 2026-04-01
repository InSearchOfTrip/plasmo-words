import React, { useEffect, useState } from "react";

type Props = {
  result: "correct" | "wrong" | null;
  onDone?: () => void;
};

export function ResultFeedback({ result, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!result) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 900);
    return () => clearTimeout(timer);
  }, [result]);

  if (!result || !visible) return null;

  const isCorrect = result === "correct";

  return (
    <div
      className={`result-feedback position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center`}
      style={{ zIndex: 1050, pointerEvents: "none" }}
    >
      <div
        className={`result-feedback__badge rounded-circle d-flex align-items-center justify-content-center ${
          isCorrect ? "bg-success" : "bg-danger"
        }`}
        style={{
          width: 100,
          height: 100,
          animation: "feedback-pop 0.9s ease-out forwards",
        }}
      >
        <span style={{ fontSize: 48, color: "#fff" }}>
          {isCorrect ? "✓" : "✗"}
        </span>
      </div>
    </div>
  );
}
