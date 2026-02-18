// import editSVG from "data-base64:~assets/icons/pen-fill.svg"
import { useRef, useState } from "react"
import EditSVG from "react:~assets/icons/pen-fill.svg"

import { useCollections, useWords } from "../assets/storage/collections"

function WordsTable(props) {
  const { collection, collectionWords } = props
  const [doShow, setDoShow] = useState(false)
  const [doEdit, setDoEdit] = useState(false)
  const { words, deleteWord } = useWords()
  const { renameCollection } = useCollections()
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="mb-3 border border-dark border-top-0 border-start-0 border-end-0">
      <div
        className="d-flex justify-content-between align-items-center pointer"
        onClick={() => {
          setDoShow(!doShow)
        }}>
        <div className="d-flex align-items-center gap-2">
          {doEdit ? (
            <input
              className="fs-4 m-0 p-0 border-0 outline-0 caret-color-primary"
              type="text"
              value={collection.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => renameCollection(collection.id, e.target.value)}
              onKeyDown={keyDown}
              size={collection.name.length}
              ref={inputRef}
            />
          ) : (
            <h4 className="fs-4 m-0">{collection.name}</h4>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();

              if(!doEdit){
              console.log("inputRef.current", inputRef.current)
                setTimeout(() => {inputRef.current?.focus();
                }, 300);
              }

              setDoEdit(!doEdit);
            }}
            className={`btn btn-sm ${doEdit ? "btn-close": "btn-primary"}`}
            style={{ transform: "scale(0.8)" }}>
            {doEdit ? null : <EditSVG className="edit" />}
            
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
              <td>{value.originalText}</td>
              <td>{value.translatedText}</td>
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
