import React, { useRef, useEffect, useState } from "react";
import Speak from "react:~assets/icons/volume-down-fill.svg";
import CaretUp from "react:~assets/icons/caret-up-fill.svg";
import CaretDown from "react:~assets/icons/caret-down-fill.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { speakWord } from "~assets/helpers/speech";
import { useCollections, useWords } from "~assets/storage/collections";

const LEVEL_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const LEVEL_COLOR: Record<string, string> = {
  low: "level-low",
  medium: "level-medium",
  high: "level-high",
};

type Props = {
  onStart: (selectedCollectionIds: string[]) => void;
};

type WordItem = {
  id: string;
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  translatedLanguage: string;
  collectionIds: string[];
  level: "low" | "medium" | "high";
  good_streak: number;
  priority: number;
};

type CollectionItem = {
  id: string;
  name: string;
  order: number;
  createdAt: number;
};

type CollectionRowProps = {
  col: CollectionItem;
  colWords: WordItem[];
  isChecked: boolean;
  isOpen: boolean;
  onToggleExpanded: (id: string) => void;
  onToggleSelected: (id: string, e: React.MouseEvent) => void;
  renameCollection: (id: string, name: string) => void;
  changeCollectionOrder: (id: string, direction: "up" | "down") => void;
  deleteWord: (id: string, collectionId: string) => void;
};

function CollectionRow({
  col,
  colWords,
  isChecked,
  isOpen,
  onToggleExpanded,
  onToggleSelected,
  renameCollection,
  changeCollectionOrder,
  deleteWord,
}: CollectionRowProps) {
  const [doEdit, setDoEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (doEdit) inputRef.current?.focus();
  }, [doEdit]);

  useEffect(() => {
    if (nameRef.current && inputRef.current) {
      inputRef.current.style.width = nameRef.current.getBoundingClientRect().width + "px";
    }
  }, [col.name, doEdit]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") setDoEdit(false);
  }

  return (
    <div className={`cp-item ${isChecked ? "cp-item--checked" : ""}`}>
      <div
        className="cp-item__header"
        onClick={() => onToggleExpanded(col.id)}
      >
        {/* Checkbox */}
        <div
          className="cp-item__checkbox"
          onClick={(e) => onToggleSelected(col.id, e)}
        >
          <div className={`cp-checkbox ${isChecked ? "cp-checkbox--checked" : ""}`}>
            {isChecked && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Name (editable) */}
        <div className="cp-item__info">
          <div className="cp-item__name-row">
            {doEdit && (
              <input
                className="cp-item__name border-0 p-0 bg-transparent caret-color-primary"
                type="text"
                value={col.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => renameCollection(col.id, e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
            )}
            <span
              ref={nameRef}
              className="cp-item__name"
              style={doEdit ? { visibility: "hidden", position: "absolute" } : undefined}
            >
              {col.name}
            </span>
            <button
              className="cp-item__edit-btn btn border-0 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setDoEdit((v) => !v);
              }}
              title="Rename"
            >
              <FontAwesomeIcon
                icon={faPen}
                className={`edit-btn__icon ${doEdit ? "primary" : ""}`}
              />
            </button>
          </div>
          <span className="cp-item__count">{colWords.length} words</span>
        </div>

        {/* Order buttons */}
        <div className="cp-item__order" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn_order border-0 p-0"
            onClick={() => changeCollectionOrder(col.id, "up")}
            title="Move up"
          >
            <CaretUp className="edit-btn__icon" />
          </button>
          <button
            className="btn btn_order border-0 p-0"
            onClick={() => changeCollectionOrder(col.id, "down")}
            title="Move down"
          >
            <CaretDown className="edit-btn__icon" />
          </button>
        </div>

        {/* Chevron */}
        <div className={`cp-item__chevron ${isOpen ? "cp-item__chevron--open" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Expanded words table */}
      {isOpen && (
        <div className="cp-item__words">
          {colWords.length === 0 ? (
            <p className="cp-item__words-empty">No words in this collection</p>
          ) : (
            <table className="cp-words-table w-100">
              <thead>
                <tr>
                  <th>Original</th>
                  <th>Translation</th>
                  <th className="text-center">Priority</th>
                  <th className="text-center">Level</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {colWords.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div className="cp-word__cell">
                        <span className="cp-word__original">{w.originalText}</span>
                        <Speak
                          className="cp-word__speak"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            speakWord(w.originalText, w.originalLanguage);
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="cp-word__cell">
                        <span className="cp-word__translated">{w.translatedText}</span>
                        <Speak
                          className="cp-word__speak"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            speakWord(w.translatedText, w.translatedLanguage);
                          }}
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="cp-word__priority">{w.priority}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${LEVEL_COLOR[w.level]}`}>
                        {LEVEL_LABEL[w.level]}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-close btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWord(w.id, col.id);
                        }}
                        title="Delete word"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export function CollectionPicker({ onStart }: Props) {
  const { collections, renameCollection, changeCollectionOrder } = useCollections();
  const { words, deleteWord } = useWords();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const sortedCollections = (Object.values(collections) as CollectionItem[]).sort(
    (a, b) => a.order - b.order
  );
  const wordList = Object.values(words) as WordItem[];

  function wordsFor(collectionId: string): WordItem[] {
    return wordList
      .filter((w) => w.collectionIds.includes(collectionId))
      .sort((a, b) => b.priority - a.priority);
  }

  function totalActiveWords(): number {
    return wordList.filter(
      (w) => !(w.level === "high" && w.good_streak >= 10)
    ).length;
  }

  function toggleSelected(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedWordsCount =
    selected.size === 0
      ? totalActiveWords()
      : wordList.filter(
          (w) =>
            w.collectionIds.some((cid) => selected.has(cid)) &&
            !(w.level === "high" && w.good_streak >= 10)
        ).length;

  return (
    <div className="cp-wrapper">
      <div className="cp-header">
        <h2 className="cp-title">Choose categories</h2>
        <p className="cp-subtitle">
          Select one or more collections to study, or start with everything
        </p>
      </div>

      <div className="cp-list">
        {sortedCollections.length === 0 ? (
          <p className="cp-empty">No collections yet</p>
        ) : (
          sortedCollections.map((col) => (
            <CollectionRow
              key={col.id}
              col={col}
              colWords={wordsFor(col.id)}
              isChecked={selected.has(col.id)}
              isOpen={expanded.has(col.id)}
              onToggleExpanded={toggleExpanded}
              onToggleSelected={toggleSelected}
              renameCollection={renameCollection}
              changeCollectionOrder={changeCollectionOrder}
              deleteWord={deleteWord}
            />
          ))
        )}
      </div>

      <div className="cp-footer">
        {selected.size > 0 && (
          <button
            className="cp-clear btn btn-link text-muted"
            onClick={() => setSelected(new Set())}
          >
            Clear selection
          </button>
        )}
        <button
          className="cp-start btn btn-primary"
          onClick={() => onStart(Array.from(selected))}
          disabled={selectedWordsCount === 0}
        >
          Start Learning
          {selectedWordsCount > 0 && (
            <span className="badge bg-white text-primary ms-2">
              {selectedWordsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
