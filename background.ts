import { fetchTranslation } from "~assets/helpers/translation"

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TRANSLATE") {
    const { word, translateFrom, translateTo } = message.payload
    fetchTranslation(word, translateFrom, translateTo)
      .then((translation) => sendResponse({ success: true, translation }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true // keep channel open for async response
  }
})
