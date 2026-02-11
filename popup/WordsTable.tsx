import { useState } from "react"

import { useCollections, useWords } from "../assets/storage/collections"

function WordsTable(props) {
  const { collection, collectionWords } = props
  const [doShow, setDoShow] = useState(false)
  const { words, deleteWord } = useWords()

  function deleteTheWord(id , collectionId) {
    deleteWord(id , collectionId);
  }
  return (
    <div className="mb-3 border border-dark border-top-0 border-start-0 border-end-0">
      <div
        className="d-flex justify-content-between align-items-center pointer"
        onClick={() => {
          setDoShow(!doShow)
        }}>
        <h4 className="fs-4">{collection.name}</h4>{" "}
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
                  onClick={() => deleteTheWord(value.id , collection.id)}
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
