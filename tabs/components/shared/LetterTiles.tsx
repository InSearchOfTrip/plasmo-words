import React from "react";

type Props = {
  letters: string[];          // available tiles
  assembled: string[];        // currently placed tiles (by letter value)
  onTileClick: (index: number) => void;   // click available tile → add to answer
  onAssembledClick: (index: number) => void; // click placed tile → return it
  disabled?: boolean;
};

export function LetterTiles({
  letters,
  assembled,
  onTileClick,
  onAssembledClick,
  disabled,
}: Props) {
  return (
    <div className="letter-tiles d-flex flex-column gap-3 align-items-center">
      {/* Answer area */}
      <div
        className="letter-tiles__answer d-flex flex-wrap justify-content-center gap-2"
        style={{
          minHeight: 56,
          borderBottom: "2px solid var(--bs-primary)",
          paddingBottom: 8,
          width: "100%",
          maxWidth: 480,
        }}
      >
        {assembled.length === 0 && (
          <span className="text-muted fst-italic small align-self-center">
            Натисніть на букви нижче
          </span>
        )}
        {assembled.map((letter, i) => (
          <button
            key={i}
            type="button"
            className="btn btn-primary px-3 py-2 fs-5 fw-semibold"
            onClick={() => !disabled && onAssembledClick(i)}
            disabled={disabled}
            style={{ minWidth: 44 }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Available tiles */}
      <div className="letter-tiles__pool d-flex flex-wrap justify-content-center gap-2" style={{ maxWidth: 480 }}>
        {letters.map((letter, i) => (
          <button
            key={i}
            type="button"
            className="btn btn-outline-secondary px-3 py-2 fs-5 fw-semibold"
            onClick={() => !disabled && onTileClick(i)}
            disabled={disabled}
            style={{ minWidth: 44 }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
