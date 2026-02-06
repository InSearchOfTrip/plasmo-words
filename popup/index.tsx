import { useState } from "react"
import { useWords , useCollections } from "../assets/storage/collections"

import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

function IndexPopup() {
  const [data, setData] = useState("");
  const { words, deleteWord } = useWords();
  console.log( Object.entries(words));
  return (
    <div className="words bg">
       <h2 className="fs-2">Words</h2>
      {
        Object.entries(words).map(([key, value]) => {
          return (
            <div className="row" key={value.id ?? key}>
              <div className="col-4">{value.originalText}</div>
              <div className="col-4">{value.translatedText}</div>
              <div className="col-2">{value.priority}</div>
            </div>
          );
        })
      }
      <a  className="btn btn-primary" href="options.html">Settings</a> 
    </div>
  )
}

export default IndexPopup
