import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const storage = new Storage({ area: "sync" })

type word = {
  id: string
  originalText: string
  translatedText: string
  collectionId: string[] | null
  priority: number
  createdAt: number // new Date().toISOString()
}

type collection = {
  id: string
  name: string
  createdAt: number // new Date().toISOString()
}

type collections = Record<string, collection>

export const KEYS = {
  WORDS: "words",
  COLLECTIONS: "collections",
  COLLECTION_BY_DEFAULT: "collectionByDefault"
} as const

export const DEFAULTS = {
  [KEYS.WORDS]: {},
  [KEYS.COLLECTIONS]: {},
  [KEYS.COLLECTION_BY_DEFAULT]: null
}

function useSyncedState(
  key: string,
  def: boolean | number | string | collections
) {
  return useStorage<any>(key, def, { instance: storage })
}

export function useWords() {
  // Получаем текущее состояние списка слов (словарь id → word) и функцию обновления
  const [words, setWords] = useSyncedState(KEYS.WORDS, DEFAULTS[KEYS.WORDS])

  // Функция добавления нового слова
  function addWord(
    originalText: string,
    translatedText: string,
    collectionId: string | null
  ) {
    setWords((prevWords) => {
      const existingEntry = Object.entries(prevWords).find(
        ([_, w]) => w.originalText.toLowerCase() === originalText.toLowerCase()
      )

      // ✅ Если нашли
      if (existingEntry) {
        const [id, w] = existingEntry

        // если коллекция не передана — просто увеличим priority (или можно ничего не делать)
        if (!collectionId) {
          return {
            ...prevWords,
            [id]: { ...w, priority: w.priority + 1 }
          }
        }

        // ✅ дописываем collectionId в массив, но без дублей
        const hasCollection = w.collectionIds.includes(collectionId)
        const nextCollectionIds = hasCollection
          ? w.collectionIds
          : [...w.collectionIds, collectionId]

        return {
          ...prevWords,
          [id]: {
            ...w,
            // если хочешь увеличивать при любом повторе:
            priority: w.priority + 1,
            // или если хочешь увеличивать только при добавлении в новую коллекцию:
            // priority: hasCollection ? w.priority : w.priority + 1,
            collectionIds: nextCollectionIds
          }
        }
      }

      // ✅ Если не нашли — создаём новое
      const newWord: word = {
        id: crypto.randomUUID(),
        originalText,
        translatedText,
        collectionIds: collectionId ? [collectionId] : [],
        priority: 1,
        createdAt: Date.now()
      }

      return {
        ...prevWords,
        [newWord.id]: newWord
      }
    })
  }

  // Функция удаления слова по ID
  function deleteWord(id: string, collectId: string) {
    if (!(id in words)) return
    console.log("some", words[id].collectionIds)
    let word = {
      ...words[id],
      collectionIds: words[id].collectionIds.filter((el) => el != collectId)
    }
    if (word.collectionIds.length === 0) {
      const { [id]: _, ...rest } = words
      console.log("reset")
      setWords(rest)
    } else {
      console.log("word", word)
      console.log("words", {
        ...words,
        [word.id]: word
      })
       setWords({
        ...words,
        [word.id]: word
      });
    }
  }

  return { words, addWord, deleteWord }
}

// Хук для работы с коллекциями
export function useCollections() {
  // Текущее состояние коллекций (словарь id → collection) и функция обновления
  const [collections, setCollections] = useSyncedState(
    KEYS.COLLECTIONS,
    DEFAULTS[KEYS.COLLECTIONS]
  )

  async function getCollection(){
    console.log("storage" , storage);
    return storage.get('collections');
  }

  const [collectionByDefault, setCollectionByDefault] = useSyncedState(
    KEYS.COLLECTION_BY_DEFAULT,
    DEFAULTS[KEYS.COLLECTION_BY_DEFAULT]
  )
  // Добавление новой коллекции

  function addCollection(name: string) {
    const newCollection: collection = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now()
    }

    setCollections((prev) => {
      console.log("SetCollection: prev is", prev)
      if (prev === undefined) return;
      if (
        Object.values(prev)?.some((el) => {
          return el?.name === name
        })
      ) {
        return prev
      } else {
        setCollectionByDefault(newCollection.id)
        return {
          ...(prev ?? {}),
          [newCollection.id]: newCollection
        }
      }
    })
  }

  // Переименование существующей коллекции
  function renameCollection(id: string, newName: string) {
    if (!collections[id]) return
    setCollections({
      ...collections,
      [id]: { ...collections[id], name: newName }
    })
  }

  // Удаление коллекции по ID
  function deleteCollection(id: string) {
    if (!(id in collections)) return
    const { [id]: _, ...rest } = collections
    setCollections(rest)
  }

  return {
    collections,
    getCollection,
    collectionByDefault,
    setCollectionByDefault,
    addCollection,
    renameCollection,
    deleteCollection
  }
}
