
import { useEffect, useRef, useState } from "react";
import { fetchTranslation } from "~assets/helpers/translation";

import { useSettings } from "../assets/storage/settings";
import { useWords , useCollections } from "../assets/storage/collections"

import bootstrap from "data-text:../assets/styles/bootstrap.min.css";
import normalize from "data-text:../assets/styles/normalize.css";

export const getStyle = () : HTMLStyleElement => {
    const style = document.createElement("style");
    style.textContent = normalize + "\n" + bootstrap;
    return style
}

import type { PlasmoCSConfig } from "plasmo";
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  css: ["./bootstrap.min.css"]
}


function uppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Popup() {
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
    } = useSettings();

    const { words, addWord, deleteWord } = useWords();
    const { collections, addCollection } = useCollections();

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState<string>("");
    const [translation, setTranslationText] = useState<string>("");
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const timeoutRef = useRef(null);



    useEffect(() => {
        const onDblClick = async (e: MouseEvent) => {
            const selectedText = window.getSelection()?.toString().trim()
            if (!selectedText) return;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setPosition({ x: e.pageX, y: e.pageY });
            setText(uppercase(selectedText));
            setVisible(true);
            // timeoutRef.current = setTimeout(() => {
            //     setVisible(false)
            // }, 10000);

            if (doTranslation) {
                setTranslationText(uppercase(await fetchTranslation(selectedText)));
            }
        }

        document.addEventListener("dblclick", onDblClick);
        return () => {
            document.removeEventListener("dblclick", onDblClick);
            // Очистка при размонтировании
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }

    }, [])

    if (!visible) return null;

    return (
        <div className="p-3 bg-transparent"  style={{
                    position: "absolute",
                    top: position.y,
                    left: position.x,
                    zIndex: 999999,
                    width: "300px"
                }}>
            <div
                className="rounded-3 border shadow border-dark-subtle p-2 bg-white">
                <div className="row mb-3">
                    <div className="container d-flex justify-content-end">  
                        <h3 className="fs-5 me-auto">{text}</h3>
                        <button onClick={() => setVisible(false)} className="btn btn-close" />
                    </div>
                </div>

                {doTranslation && (
                    <div className="row">
                        <div className="container">
                            <p className="fs-5">{translation}</p>
                        </div>
                    </div>
                )}

                

                {doSaveWords && (
                    <div className="row">
                        <div className="container">
                            <button className="btn btn-primary w-100">Add word</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}