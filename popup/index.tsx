import { useState } from "react"

import { useCollections, useWords } from "../assets/storage/collections"

import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

function IndexPopup() {
  const [data, setData] = useState("")
  const { words, deleteWord } = useWords()
  console.log(Object.entries(words))
  function deleteTheWord(id) {
    deleteWord(id)
  }
  return (
    <div className="words p-2 bg">
      <div className="container">
        <h2 className="fs-2">Words</h2>
      </div>
      <div className="container">
        <div className="mb-1">
          {Object.entries(words)
          .sort(([, a], [, b]) => (b.priority) - (a.priority))
          .map(([key, value]) => (
            <div className="row" key={value.id ?? key}>
              <div className="col-5 d-fex align-items-center">{value.originalText}</div>
              <div className="col-5 d-fex align-items-center">{value.translatedText}</div>
              <div className="col-1 d-fex align-items-center">{value.priority}</div>
              <div className="col-1 d-fex align-items-center">
                <button
                  onClick={() => deleteTheWord(value.id ?? key)}
                  className="btn btn-close btn-danger"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <a className="btn btn-primary" href="options.html">
            Settings
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
