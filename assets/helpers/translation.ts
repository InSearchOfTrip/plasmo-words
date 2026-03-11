export async function fetchTranslation(word:string ,translateFrom:string , translateTo:string): Promise<string> {
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${translateFrom}&tl=${translateTo}&dt=t&q=${encodeURIComponent(word)}`);
  const data = await response.json();
  return data[0][0][0];
  // const response = await fetch(`https://lingva.ml/api/v1/${translateFrom}/${translateTo}/${encodeURIComponent(word)}`);
  // const data = await response.json();
  // return data.translation;
}