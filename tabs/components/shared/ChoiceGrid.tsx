import React from "react";

export type ChoiceOption = {
  id: string;
  text: string;
};

type Props = {
  options: ChoiceOption[];
  selectedId: string | null;
  correctId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

export function ChoiceGrid({ options, selectedId, correctId, onSelect, disabled }: Props) {
  return (
    <div className="row g-3" style={{ maxWidth: 600, margin: "0 auto" }}>
      {options.map((opt) => {
        let variant = "btn-outline-secondary";
        if (selectedId) {
          if (opt.id === correctId) variant = "btn-success";
          else if (opt.id === selectedId) variant = "btn-danger";
        }

        return (
          <div className="col-6" key={opt.id}>
            <button
              type="button"
              className={`btn ${variant} w-100 py-3 fs-6`}
              onClick={() => !disabled && onSelect(opt.id)}
              disabled={disabled && opt.id !== correctId && opt.id !== selectedId}
              style={{ minHeight: 64, transition: "all 0.2s" }}
            >
              {opt.text}
            </button>
          </div>
        );
      })}
    </div>
  );
}
