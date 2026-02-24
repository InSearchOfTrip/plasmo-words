import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const storage = new Storage({ area: "sync" })

// Centralized keys and defaults
export const KEYS = {
  SAVE_WORDS: "saveWords",
  TRANSLATION: "translation",
  AUTO_ADD: "autoAdd",
  DEFAULT_GROUP: "defaultGroup",
  TRANSLATE_FROM: "translateFrom",
  TRANSLATE_TO: "translateTo"
} as const

export const DEFAULTS = {
  [KEYS.SAVE_WORDS]: true,
  [KEYS.TRANSLATION]: true,
  [KEYS.AUTO_ADD]: false,
  [KEYS.DEFAULT_GROUP]: 0,
  [KEYS.TRANSLATE_FROM]: "en",
  [KEYS.TRANSLATE_TO]: "uk"
}

// React hook wrapper
function useSyncedState(key: string, def: boolean | number | string) {
  return useStorage<any>(key, def, { area: "sync" })
}

// React hook that returns ALL settings
export function useSettings() {
  const [doSaveWords, setSaveWords] = useSyncedState(KEYS.SAVE_WORDS, DEFAULTS[KEYS.SAVE_WORDS])
  const [doTranslation, setTranslation] = useSyncedState(KEYS.TRANSLATION, DEFAULTS[KEYS.TRANSLATION])
  const [doAutoAdd, setAutoAdd] = useSyncedState(KEYS.AUTO_ADD, DEFAULTS[KEYS.AUTO_ADD])
  const [defaultGroup, setDefaultGroup] = useSyncedState(KEYS.DEFAULT_GROUP, DEFAULTS[KEYS.DEFAULT_GROUP])
  const [translateFrom, setTranslateFrom] = useSyncedState(KEYS.TRANSLATE_FROM, DEFAULTS[KEYS.TRANSLATE_FROM])
  const [translateTo, setTranslateTo] = useSyncedState(KEYS.TRANSLATE_TO, DEFAULTS[KEYS.TRANSLATE_TO])

  return {
    doSaveWords, setSaveWords,
    doTranslation, setTranslation,
    doAutoAdd, setAutoAdd,
    defaultGroup, setDefaultGroup,
    translateFrom, setTranslateFrom,
    translateTo, setTranslateTo
  }
}
