import { useState } from "react"

import { useCollections, useWords } from "../assets/storage/collections"
import WordsTable from "./WordsTable"

import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

function IndexPopup() {
  const [data, setData] = useState("")
  const { words, deleteWord } = useWords()
  const { collections } = useCollections()

  return (
    <div className="words p-2 shadow border-dark-subtle bg-white">
      <div className="scroll py-2">
        <h2 className="fs-4 text-center mb-3">FreqWords</h2>
        {Object.keys(words).length > 0 ? (
          Object.values(collections)
            .sort((a, b) => a.order - b.order)
            .map((collection) => {
            const collectionWords = Object.values(words).filter((word) =>
              word.collectionIds.includes(collection.id)
            )

            if (collectionWords.length === 0) return null
            const sortedCollectionWords = collectionWords.sort((a, b) => b.priority - a.priority);
            return (
              <WordsTable
                key={collection.id}
                collection={collection}
                collectionWords={sortedCollectionWords}
              />
            )
          })
        ) : (
          <p className="text-secondary text-center p-3 m-0">You don't have added words yet</p>
        )}
      </div>
      <div className="d-flex gap-2 pt-2 border-top">
        <a className="btn btn-outline-secondary flex-fill" href="options.html">
          Settings
        </a>
        <a className="btn btn-primary flex-fill" href="tabs/learn.html" target="_blank">
          Learn
        </a>
      </div>
    </div>
  )
}

export default IndexPopup
