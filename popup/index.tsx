import { useState } from "react"

import { useCollections, useWords } from "../assets/storage/collections"

import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

function IndexPopup() {
  const [data, setData] = useState("")
  const { words, deleteWord } = useWords()
  const { collections } = useCollections()

  function deleteTheWord(id) {
    deleteWord(id)
  }
  return (
    <div className="words p-2 shadow border-dark-subtle p-2 bg-white">
      <div className="container">
        <h2 className="fs-2 text-center">Words list</h2>
      </div>

      <div className="container">
        {Object.keys(words).length > 0 ? (
          Object.values(collections).map((collection) => {
            // слова, принадлежащие текущей коллекции
            // console.log("collection" , collection);
            const collectionWords = Object.values(words).filter((word) =>
              word.collectionIds.includes(collection.id)
            )
            // console.log("collectionWords" , collectionWords);
            // если слов нет — коллекцию не показываем
            if (collectionWords.length === 0) return null

            return (
              <div key={collection.id} className="mb-4">
                
                <div className="d-flex">
                  <h4 className="fs-4">{collection.name}</h4> <p>{collectionWords.length}</p>
                </div>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Original</th>
                      <th>Translation</th>
                      <th>Priority</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {collectionWords.map((value, key) => (
                      <tr key={value.id ?? key}>
                        <td>{value.originalText}</td>
                        <td>{value.translatedText}</td>
                        <td>{value.priority}</td>
                        <td className="text-end">
                          <button
                            onClick={() =>
                              deleteTheWord(value.id ?? String(key))
                            }
                            className="btn btn-close btn-danger"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })
        ) : (
          <div className="row">
            <p className="text p-0"> You don't have added words yet</p>
          </div>
        )}
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
