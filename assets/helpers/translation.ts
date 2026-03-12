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

export async function fetchTranslation(word:string ,translateFrom:string , translateTo:string): Promise<string> {
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${translateFrom}&tl=${translateTo}&dt=t&q=${encodeURIComponent(word)}`);
  const data = await response.json();
  return data[0][0][0];
  // const response = await fetch(`https://lingva.ml/api/v1/${translateFrom}/${translateTo}/${encodeURIComponent(word)}`);
  // const data = await response.json();
  // return data.translation;
}