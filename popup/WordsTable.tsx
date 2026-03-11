// import editSVG from "data-base64:~assets/icons/pen-fill.svg"
import { useRef, useState, useEffect } from "react"
import EditSVG from "react:~assets/icons/pen-fill.svg"
import Speak from "react:~assets/icons/volume-down-fill.svg"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';


import { useCollections, useWords } from "../assets/storage/collections"
import { speakWord } from "../assets/helpers/speech"

function WordsTable(props) {
  const { collection, collectionWords } = props
  const [doShow, setDoShow] = useState(false)
  const [doEdit, setDoEdit] = useState(false)
  const { words, deleteWord } = useWords()
  const { renameCollection } = useCollections()
  const inputRef = useRef<HTMLInputElement>(null);
  const h4Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (doEdit) {
      inputRef.current?.focus();
    }
  }, [doEdit]);

  useEffect(() => {
    if (h4Ref.current && inputRef.current) {
      const h4Width = h4Ref.current.offsetWidth;
      inputRef.current.style.width = h4Width + 'px';
    }
  }, [collection.name , doEdit]);

  function deleteTheWord(id, collectionId) {
    deleteWord(id, collectionId)
  }
  function keyDown(e) {
    if (e.key === "Enter") {
      setDoEdit(false)
      return
    }
  }

  return (
    <div className="mb-3 pb-1">
      <div
        className="d-flex justify-content-between align-items-center pointer animated-border-bottom"
        onClick={() => {
          setDoShow(!doShow)
        }}>
        <div className="d-flex align-items-center gap-2">
          {doEdit && (
            <input
              className="fs-4 m-0 p-0 border-0 outline-0 caret-color-primary"
              type="text"
              value={collection.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => renameCollection(collection.id, e.target.value)}
              onKeyDown={keyDown}
              ref={inputRef}
            />
          )}
          <h4 
            ref={h4Ref}
            className="fs-4 m-0"
            style={doEdit ? { visibility: 'hidden', position: 'absolute' } : undefined}
          >
            {collection.name}
          </h4>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDoEdit(!doEdit);
            }}
            className={`btn border-0 outline-0 p-1`}>
              <FontAwesomeIcon icon={faPen} className={`edit-btn__icon ${doEdit ? "primary" : ""}`} />
          </button>
        </div>

        <p className="text m-0">{collectionWords.length} words</p>
      </div>

      <table
        className={`table table-striped mb-0 ${doShow ? "table" : "d-none"}`}>
        <thead>
          <tr>
            <th>Original</th>
            <th>Translation</th>
            <th className="text-center">Priority</th>
            <th className="text-end">Delete</th>
          </tr>
        </thead>

        <tbody>
          {collectionWords.map((value, key) => (
            <tr key={value.id ?? key} className="align-middle">
              <td>
                <div className="d-flex align-items-center gap-2">
                  {value.originalText}
                  <Speak 
                    onClick={() => speakWord(value.originalText)} 
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                  />
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  {value.translatedText}
                  <Speak 
                    onClick={() => speakWord(value.translatedText)} 
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }} 
                  />
                </div>
              </td>
              <td className="text-center">{value.priority}</td>
              <td className="text-end">
                <button
                  onClick={() => deleteTheWord(value.id, collection.id)}
                  className="btn btn-close btn-danger"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WordsTable
