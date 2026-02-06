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
    <div className="words bg">
      <div className="container">
        <h2 className="fs-2">Words</h2>
      </div>
      <div className="container">
        {Object.entries(words).map(([key, value]) => {
          return (
            <div className="row" key={value.id ?? key}>
              <div className="col-5">{value.originalText}</div>
              <div className="col-5">{value.translatedText}</div>
              <div className="col-1">{value.priority}</div>
              <div className="col-1">
                <button
                  onClick={(value) => {
                    deleteTheWord(value.id ?? key)
                  }}
                  className="btn btn-close"
                />
              </div>
            </div>
          )
        })}

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
