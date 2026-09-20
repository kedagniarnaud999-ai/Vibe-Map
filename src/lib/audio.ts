/**
 * Synthese vocale des termes en langue nationale. Sans lien avec la langue de
 * l'interface : la prononciation conserve le phonetique tel qu'ecrit.
 */
export function playCulturalTermAudio(term: string, phonetic?: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const textToSpeak = phonetic ? `${term}. Se prononce : ${phonetic}` : term;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
