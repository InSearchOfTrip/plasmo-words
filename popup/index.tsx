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
    <div className="words p-2 shadow border-dark-subtle pr-0 bg-white">
      <div className="scroll">
        <h2 className="fs-2 text-center">FreqWords</h2>
        {Object.keys(words).length > 0 ? (
          Object.values(collections).map((collection) => {
            const collectionWords = Object.values(words).filter((word) =>
              word.collectionIds.includes(collection.id)
            )

            if (collectionWords.length === 0) return 
            const sortedCollectionWords = collectionWords.sort( (a, b) => b.priority - a.priority);
            return (
              <WordsTable
                key={collection.id}
                collection={collection}
                collectionWords={sortedCollectionWords}
              />
            )
          })
        ) : (
          <p className="text p-0"> You don't have added words yet</p>
        )}
      </div>
      <div className="d-flex gap-2">
        <a className="btn btn-primary flex-fill" href="options.html">
          Settings
        </a>
        <a className="btn btn-secondary flex-fill" href="tabs/learn.html" target="_blank">
          LearnGround
        </a>
      </div>
    </div>
  )
}

export default IndexPopup
