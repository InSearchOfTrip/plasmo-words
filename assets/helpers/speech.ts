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
      console.log(`Using voice: ${voice.name} (${voice.lang})`);
    } else {
      // Якщо не знайшли точний голос, спробуємо встановити мову
      utterance.lang = lang;
      console.log(`No specific voice found for ${lang}, using default`);
    }
  }
  
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 2;

  console.log("Speaking:", text, "Language:", utterance.lang);
  
  window.speechSynthesis.speak(utterance);
}

// Ініціалізація голосів (для Chrome/Safari)
if (window.speechSynthesis.getVoices().length === 0) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    console.log('Available voices:', window.speechSynthesis.getVoices().map(v => `${v.name} (${v.lang})`));
  }, { once: true });
}

// Експортуємо debounced версію з затримкою 300ms
export const speakWord = debounce(_speakWord, 300);
