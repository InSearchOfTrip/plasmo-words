import { useRef, useState, useEffect } from "react"
import Speak from "react:~assets/icons/volume-down-fill.svg"
import CaretUp from "react:~assets/icons/caret-up-fill.svg"
import CaretDown from "react:~assets/icons/caret-down-fill.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { useCollections, useWords } from "../assets/storage/collections"
import { speakWord } from "../assets/helpers/speech"

const LEVEL_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

const LEVEL_COLOR: Record<string, string> = {
  low: "level-low",
  medium: "level-medium",
  high: "level-high",
};

function WordsTable(props) {
  const { collection, collectionWords } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [doEdit, setDoEdit] = useState(false);
  const { deleteWord } = useWords();
  const { renameCollection, changeCollectionOrder } = useCollections();
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (doEdit) inputRef.current?.focus();
  }, [doEdit]);

  useEffect(() => {
    if (nameRef.current && inputRef.current) {
      inputRef.current.style.width = nameRef.current.getBoundingClientRect().width + "px";
    }
  }, [collection.name, doEdit]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") setDoEdit(false);
  }

  return (
    <div className="wt-item">
      {/* Header */}
      <div className="wt-item__header" onClick={() => setIsOpen((v) => !v)}>
        {/* Name */}
        <div className="wt-item__info">
          <div className="wt-item__name-row">
            {doEdit && (
              <input
                className="wt-item__name border-0 p-0 bg-transparent caret-color-primary"
                type="text"
                value={collection.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => renameCollection(collection.id, e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
            )}
            <span
              ref={nameRef}
              className="wt-item__name"
              style={doEdit ? { visibility: "hidden", position: "absolute" } : undefined}
            >
              {collection.name}
            </span>
            <button
              className="wt-item__edit-btn btn border-0 p-0"
              onClick={(e) => { e.stopPropagation(); setDoEdit((v) => !v); }}
              title="Rename"
            >
              <FontAwesomeIcon icon={faPen} className={`edit-btn__icon ${doEdit ? "primary" : ""}`} />
            </button>
          </div>
          <span className="wt-item__count">{collectionWords.length} words</span>
        </div>

        {/* Order buttons */}
        <div className="wt-item__order" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn_order border-0 p-0" onClick={() => changeCollectionOrder(collection.id, "up")} title="Move up">
            <CaretUp className="edit-btn__icon" />
          </button>
          <button className="btn btn_order border-0 p-0" onClick={() => changeCollectionOrder(collection.id, "down")} title="Move down">
            <CaretDown className="edit-btn__icon" />
          </button>
        </div>

        {/* Chevron */}
        <div className={`wt-item__chevron ${isOpen ? "wt-item__chevron--open" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Words table */}
      {isOpen && (
        <div className="wt-item__words">
          {collectionWords.length === 0 ? (
            <p className="wt-item__words-empty">No words in this collection</p>
          ) : (
            <table className="wt-words-table w-100">
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
                {collectionWords.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div className="wt-cell">
                        <span>{w.originalText}</span>
                        <Speak
                          className="wt-speak"
                          onClick={(e) => { e.stopPropagation(); speakWord(w.originalText, w.originalLanguage); }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="wt-cell">
                        <span className="wt-translated">{w.translatedText}</span>
                        <Speak
                          className="wt-speak"
                          onClick={(e) => { e.stopPropagation(); speakWord(w.translatedText, w.translatedLanguage); }}
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="wt-priority">{w.priority}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${LEVEL_COLOR[w.level] ?? "level-low"}`}>
                        {LEVEL_LABEL[w.level] ?? w.level}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="wt-delete btn border-0 p-0"
                        onClick={(e) => { e.stopPropagation(); deleteWord(w.id, collection.id); }}
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default WordsTable
