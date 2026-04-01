import bootstrap from "data-text:../assets/styles/bootstrap.min.css"
import normalize from "data-text:../assets/styles/normalize.css"
import moduleStyles from "data-text:./style.scss"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
// import "./style.scss"

import Plus from "react:~assets/icons/plus-square-fill.svg"
import Speak from "react:~assets/icons/volume-down-fill.svg"

import { fetchTranslation, LANGUAGES } from "~assets/helpers/translation"
import { speakWord } from "~assets/helpers/speech"

import { useCollections, useWords } from "../assets/storage/collections"
import { useSettings } from "../assets/storage/settings"

export const getStyle = (): HTMLStyleElement => {
  const style = document.createElement("style")
  style.textContent = normalize + "\n" + bootstrap + "\n" + moduleStyles
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  css: ["./bootstrap.min.css"]
}

function uppercase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function SaveWord() {
  const {
    doSaveWords,
    setSaveWords,
    doTranslation,
    setTranslation,
    doAutoAdd,
    setAutoAdd,
    defaultGroup,
    setDefaultGroup,
    translateFrom,
    setTranslateFrom,
    translateTo,
    setTranslateTo
  } = useSettings()

  const { words, addWord, deleteWord } = useWords()
  const {
    collections,
    getCollection,
    collectionByDefault,
    setCollectionByDefault,
    addCollection
  } = useCollections()
  const [visible, setVisible] = useState<boolean>(false)
  const [showAddCollection, setShowAddCollection] = useState<boolean>(false)
  const [text, setText] = useState<string>("")
  const [newCollectionName, setNewCollectionName] = useState<string>("")
  const [translation, setTranslationText] = useState<string>("")
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })

  const timeoutRef = useRef(null)

  function addTheWord() {
    addWord(text, translateFrom, translation, translateTo, collectionByDefault)
    setVisible(false)
  }

  function createCollection() {
    addCollection(newCollectionName)
    setShowAddCollection(false)
  }
  async function translateTheWord(word) {
    const translated = await fetchTranslation(word, translateFrom, translateTo);
    setTranslationText(uppercase(translated));
  }

  useEffect(() => {
    const onDblClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const captionSegment = target.closest(".ytp-caption-segment")

      let selectedText = window.getSelection()?.toString().trim()

      if (!selectedText && captionSegment) {
        let node: Node | null = null
        let offset = 0

        const pos = document.caretPositionFromPoint(e.clientX, e.clientY)
        if (pos) {
          node = pos.offsetNode
          offset = pos.offset
        }

        if (node && node.nodeType === Node.TEXT_NODE) {
          const nodeText = node.textContent || ""
          let start = offset
          let end = offset
          while (start > 0 && /\w/.test(nodeText[start - 1])) start--
          while (end < nodeText.length && /\w/.test(nodeText[end])) end++
          selectedText = nodeText.slice(start, end).trim()
        }
        if (!selectedText) {
          selectedText = captionSegment.textContent?.trim()
        }
      }

      if (!selectedText) return

      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current)
      // }

      setPosition({ x: e.pageX, y: e.pageY })
      setText(uppercase(selectedText))
      setVisible(true)
      // timeoutRef.current = setTimeout(() => {
      //     setVisible(false)
      // }, 10000);
    }

    document.addEventListener("dblclick", onDblClick)

    return () => {
      setText("")
      setTranslationText("")
      document.removeEventListener("dblclick", onDblClick)
      // Очистка при размонтировании
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current)
      // }
    }
  }, [])

  useEffect(() => {
    if (text.length === 0) return

    setTranslationText("")
    translateTheWord(text)
  }, [text, translateFrom, translateTo, doTranslation])

  useEffect(
    function () {
      getCollection().then((res) => {
        if (res === undefined || Object.keys(res ? res : {}).length === 0) {
          addCollection("General")
        }
      })
    },
    [collections]
  )

  if (!visible) return null

  return (
    (doSaveWords || doTranslation) && (
      <div
        className="p-3 bg-transparent"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          zIndex: 999999,
          width: "400px"
        }}
        onDoubleClick={(e) => e.stopPropagation()}>
        <div className="rounded-3 border container shadow border-dark-subtle p-2 bg-white">
          <div className="row mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h3 className="fs-5 m-0">{text}</h3>
                <Speak 
                  className="speakIcon" 
                  onClick={(e) => {
                    speakWord(text, translateFrom);
                  }} 
                  style={{ cursor: 'pointer' }} 
                />
              </div>
              <div className="d-flex justify-content-between align-items-center ">
                {doTranslation && (
                  <div className="d-flex gap-2 pr-4px">
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto" }}
                      value={translateFrom ?? "en"}
                      onChange={(e) => setTranslateFrom(e.target.value)}>
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto" }}
                      value={translateTo ?? "uk"}
                      onChange={(e) => setTranslateTo(e.target.value)}>
                      {LANGUAGES.filter(
                        (lang) => lang.code !== translateFrom
                      ).map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  onClick={() => setVisible(false)}
                  className="btn btn-close"
                />
              </div>
            </div>
          </div>

          {(doTranslation && translation ) && (
            <div className="row mb-1">
              {/* <div className="container"> */}
              <div className="d-flex align-items-center">
                <p className="fs-5 m-0">{translation}</p>
                <Speak 
                  className="speakIcon" 
                  onClick={(e) => {
                    speakWord(translation, translateTo);
                  }} 
                  style={{ cursor: 'pointer' }} 
                />
              </div>
            </div>
            // </div>
          )}

          {doSaveWords && (
            <div className="mb-3 d-flex align-items-center">
              <div className="flex-grow-1">
                <select
                  className="form-select"
                  id=""
                  value={String(collectionByDefault ?? "")}
                  onChange={(e) => setCollectionByDefault(e.target.value)}>
                  {Object.entries(collections).map(([id, el]) => (
                    <option key={id} value={id}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn p-0"
                onClick={() => setShowAddCollection(!showAddCollection)}>
                <Plus className="addIcon" />
              </button>
            </div>
          )}
          {showAddCollection && doSaveWords && (
            <div className="d-flex mb-3 align-items-stretch">
              <div className="flex-grow-1 pr-2px">
                <input
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Name of the list"
                />
              </div>
              <button className="btn btn-primary" onClick={createCollection}>
                <b>Create</b>
              </button>
            </div>
          )}

          {doSaveWords && (
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-primary w-100"
                  disabled={showAddCollection || !translation}
                  onClick={addTheWord}>
                  <b>Add word</b>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  )
}
