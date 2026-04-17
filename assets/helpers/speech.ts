import { debounce } from './debounce';

function _speakWord(text: string, lang?: string): void {
  if (!text) return;
  // Зупиняємо попередню озвучку, якщо вона є
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (lang) {
    // Отримуємо всі доступні голоси
    const voices = window.speechSynthesis.getVoices();
    
    // Шукаємо голос, який починається з потрібної мови
    const voice = voices.find(v => v.lang.toLowerCase().startsWith(lang));
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Якщо не знайшли точний голос, спробуємо встановити мову
      utterance.lang = lang;
    }
  }
  
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 2;

  
  window.speechSynthesis.speak(utterance);
}

// Експортуємо debounced версію з затримкою 300ms
export const speakWord = debounce(_speakWord, 300);
