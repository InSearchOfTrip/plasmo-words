import { useState } from "react"

import { useCollections, useWords } from "../assets/storage/collections"

import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

function IndexPopup() {
  const [data, setData] = useState("");
  const { words, deleteWord } = useWords();
  const {collections} = useCollections();
  function deleteTheWord(id) {
    deleteWord(id);
  }
  return (
    <div className="words p-2 shadow border-dark-subtle p-2 bg-white">
      <div className="container">
        <h2 className="fs-2">Words list</h2>
      </div>
      { Object.keys(words).length > 0 ? <div className="container">
        <div className="mb-1 table-responsive">
          <table className="table align-middle table-striped">
            <thead>
              <tr>
                <td>Word</td>
                <td>Translation</td>
                <td>Rating</td>
                <td className="text-end">Delete</td>
              </tr>
            </thead>
            <tbody>
              { Object.keys(words).length > 0 && (Object.entries(words)
                .sort(([, a], [, b]) => b.priority - a.priority)
                .map(([key, value]) => (
                  <tr key={value.id ?? key}>
                    <td>{value.originalText}</td>
                    <td>{value.translatedText}</td>
                    <td>{value.priority}</td>
                    <td className="text-end">
                      <button
                        onClick={() => deleteTheWord(value.id ?? key)}
                        className="btn btn-close btn-danger"
                      />
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <a className="btn btn-primary" href="options.html">
            Settings
          </a>
        </div>
      </div> : <div className="container"><p className="text"> You don't have added words yet</p></div>} 
    </div>
  )
}

export default IndexPopup
