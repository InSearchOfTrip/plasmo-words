import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const storage = new Storage({ area: "sync" })

type word = {
    id: string;
    originalText: string;
    translatedText: string;
    collectionId: string | null;
    priority: number;
    createdAt: number; // new Date().toISOString()
}

type collection = {
    id: string;
    name: string;
    createdAt: number; // new Date().toISOString()
}

type collections = Record<string, collection>;

export const KEYS = {
    WORDS: "words",
    COLLECTIONS: "collections",
    COLLECTION_BY_DEFAULT: "collectionByDefault",
} as const


const id = crypto.randomUUID();
export const DEFAULTS = {
    [KEYS.WORDS]: {},
    [KEYS.COLLECTIONS]: {
        [id]: {
            id,
            name: "General",
            createdAt: Date.now()
        },
        "main": {
            id: "main",
            name: "Main",
            createdAt: Date.now()
        }
    },
    [KEYS.COLLECTION_BY_DEFAULT]: id,
};



function useSyncedState(key: string, def: boolean | number | string | collections) {
    return useStorage<any>(key, def, { area: "sync" })
}


export function useWords() {
    // Получаем текущее состояние списка слов (словарь id → word) и функцию обновления
    const [words, setWords] = useSyncedState(KEYS.WORDS, DEFAULTS[KEYS.WORDS]);

    // Функция добавления нового слова
    function addWord(originalText: string, translatedText: string, collectionId: string | null) {
        // Ищем существующее слово
        const existingEntry = Object.entries(words).find(
            ([_, word]) => word.originalText.toLowerCase() === originalText.toLowerCase()
        );

        // Если нашли — увеличиваем priority
        if (existingEntry) {
            const [id, word] = existingEntry;

            setWords({
                ...words,
                [id]: {
                    ...word,
                    priority: word.priority + 1
                }
            });

            return;
        }

        // Если не нашли — создаём новое
        const newWord: word = {
            id: crypto.randomUUID(),
            originalText,
            translatedText,
            collectionId,
            priority: 1,
            createdAt: Date.now()
        };

        setWords({
            ...words,
            [newWord.id]: newWord
        });
    }


    // Функция удаления слова по ID
    function deleteWord(id: string) {
        if (!(id in words)) return;
        const { [id]: _, ...rest } = words;
        setWords(rest);
    }


    return { words, addWord, deleteWord };
}

// Хук для работы с коллекциями
export function useCollections() {
    // Текущее состояние коллекций (словарь id → collection) и функция обновления
    const [collections, setCollections] = useSyncedState(KEYS.COLLECTIONS, DEFAULTS[KEYS.COLLECTIONS]);
    const [collectionByDefault, setCollectionByDefault] = useSyncedState(KEYS.COLLECTION_BY_DEFAULT, DEFAULTS[KEYS.COLLECTION_BY_DEFAULT])
    // Добавление новой коллекции
    function addCollection(name: string) {
        const newCollection: collection = {
            id: crypto.randomUUID(),
            name,
            createdAt: Date.now()
        };
        setCollections({
            ...collections,
            [newCollection.id]: newCollection
        });
    }

    // Переименование существующей коллекции
    function renameCollection(id: string, newName: string) {
        if (!collections[id]) return;
        setCollections({
            ...collections,
            [id]: { ...collections[id], name: newName }
        });
    }

    // Удаление коллекции по ID
    function deleteCollection(id: string) {
        if (!(id in collections)) return;
        const { [id]: _, ...rest } = collections;
        setCollections(rest);
    }

    return { collections, collectionByDefault , setCollectionByDefault, addCollection, renameCollection, deleteCollection };
}