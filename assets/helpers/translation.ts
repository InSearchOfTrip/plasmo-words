export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "uk", label: "UK" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "it", label: "IT" },
  { code: "pt", label: "PT" },
  { code: "pl", label: "PL" },
  { code: "nl", label: "NL" },
  { code: "tr", label: "TR" },
  { code: "ja", label: "JA" },
  { code: "zh-CN", label: "CN" },
  { code: "zh-TW", label: "TW" },
  { code: "ko", label: "KO" },
  { code: "ar", label: "AR" },
  { code: "hi", label: "HI" },
  { code: "cs", label: "CS" },
  { code: "sv", label: "SV" },
  { code: "da", label: "DA" },
  { code: "fi", label: "FI" },
  { code: "no", label: "NO" },
  { code: "ro", label: "RO" },
  { code: "bg", label: "BG" },
  { code: "el", label: "EL" },
  { code: "he", label: "HE" },
  { code: "th", label: "TH" },
  { code: "vi", label: "VI" },
  { code: "id", label: "ID" },
  { code: "ms", label: "MS" }
]
function getAuthToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(new Error(chrome.runtime.lastError?.message ?? "Failed to get auth token"))
      } else {
        resolve(token)
      }
    })
  })
}

export async function fetchTranslation(word: string, translateFrom: string, translateTo: string): Promise<string> {
  const token = await getAuthToken()
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?q=${encodeURIComponent(word)}&source=${translateFrom}&target=${translateTo}&format=text`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error.message)
  }
  return data.data.translations[0].translatedText
}