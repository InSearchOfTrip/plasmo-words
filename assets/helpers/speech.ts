import { debounce } from './debounce';

const LANG_MAP = {
  'en': 'en-US',
  'uk': 'uk-UA',
  'de': 'de-DE',
  'fr': 'fr-FR',
  'hi': 'hi-IN'
};

function _speakWord(text: string, lang?: string): void {
  if (!text) return;
  // Зупиняємо попередню озвучку, якщо вона є
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (lang && LANG_MAP[lang]) {
    utterance.lang = LANG_MAP[lang];
  }
  
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 2;

  console.log("utterance", utterance);
  
  window.speechSynthesis.speak(utterance);
}

// Експортуємо debounced версію з затримкою 300ms
export const speakWord = debounce(_speakWord, 300);
