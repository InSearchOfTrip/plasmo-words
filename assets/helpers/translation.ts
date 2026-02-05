export async function fetchTranslation(word:string): Promise<string> {
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${encodeURIComponent(word)}`);
  const data = await response.json();
  return data[0][0][0];
}