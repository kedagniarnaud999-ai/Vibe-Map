import { AppLanguage } from '../types';

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  navMap: string;
  navDiscover: string;
  navActors: string;
  navEvents: string;
  navAssistant: string;
  navProfile: string;
  navAdmin: string;
  navGuide: string;
  signIn: string;
  signOut: string;
  loginTitle: string;
  loginSubtitle: string;
  createAccount: string;
  roleTraveler: string;
  roleGuide: string;
  roleAdmin: string;
  searchPlaceholder: string;
  explorePlace: string;
  verifiedGuides: string;
  heritageStory: string;
  etiquetteRules: string;
  bookGuide: string;
  liveMap: string;
  satelliteMap: string;
  heritageMap: string;
  liveSearchTitle: string;
  liveSearchPlaceholder: string;
  scrapingData: string;
  audioPronunciation: string;
  systemLang: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  fr: {
    appName: "La Vibe Map Cultura",
    appSubtitle: "Atlas Vivant du Patrimoine et des Savoirs du Bénin",
    navMap: "Carte Vivante",
    navDiscover: "Récits",
    navActors: "Guides & Artisans",
    navEvents: "Événements",
    navAssistant: "Compagnon IA",
    navProfile: "Mon Profil",
    navAdmin: "Espace Admin",
    navGuide: "Espace Guide",
    signIn: "Se connecter",
    signOut: "Déconnexion",
    loginTitle: "Connexion au Sanctuaire Culturel",
    loginSubtitle: "Accédez à vos itinéraires, réservations et gardiens de mémoire",
    createAccount: "Créer un compte",
    roleTraveler: "Voyageur / Curieux",
    roleGuide: "Médiateur / Guide Certifié",
    roleAdmin: "Administrateur Patrimoine",
    searchPlaceholder: "Rechercher Ouidah, Abomey, Ganvié, Porto-Novo...",
    explorePlace: "Découvrir le lieu",
    verifiedGuides: "Guides & Médiateurs Certifiés",
    heritageStory: "Histoire Ancestrale & Symboles",
    etiquetteRules: "Protocole & Éthique du Sanctuaire",
    bookGuide: "Réserver une immersion",
    liveMap: "Plan Interactif",
    satelliteMap: "Vue Satellite",
    heritageMap: "Carte Illustrée",
    liveSearchTitle: "Recherche en direct sur le web (Google Search)",
    liveSearchPlaceholder: "Interroger les dernières actualités, horaires, événements au Bénin...",
    scrapingData: "Actualisation en direct des données du Bénin...",
    audioPronunciation: "Écouter la prononciation authentique",
    systemLang: "Langue du système"
  },
  en: {
    appName: "La Vibe Map Cultura",
    appSubtitle: "Living Atlas of Benin’s Heritage & Sacred Traditions",
    navMap: "Living Map",
    navDiscover: "Stories",
    navActors: "Guides & Artisans",
    navEvents: "Events",
    navAssistant: "AI Companion",
    navProfile: "My Profile",
    navAdmin: "Admin Portal",
    navGuide: "Guide Portal",
    signIn: "Sign In",
    signOut: "Sign Out",
    loginTitle: "Log In to the Cultural Sanctuary",
    loginSubtitle: "Access your custom itineraries, bookings, and cultural lore",
    createAccount: "Create an Account",
    roleTraveler: "Traveler / Explorer",
    roleGuide: "Certified Cultural Guide",
    roleAdmin: "Heritage Admin",
    searchPlaceholder: "Search Ouidah, Abomey, Ganvié, Porto-Novo...",
    explorePlace: "Explore this Site",
    verifiedGuides: "Verified Guides & Keepers",
    heritageStory: "Ancestral History & Symbols",
    etiquetteRules: "Sacred Protocol & Etiquette",
    bookGuide: "Book an Immersion",
    liveMap: "Interactive Map",
    satelliteMap: "Satellite View",
    heritageMap: "Heritage Canvas",
    liveSearchTitle: "Live Web & Grounding Search (Google Search)",
    liveSearchPlaceholder: "Search live verified cultural news, fees, and updates in Benin...",
    scrapingData: "Refreshing live verified data across Benin...",
    audioPronunciation: "Listen to authentic pronunciation",
    systemLang: "System Language"
  },
  fon: {
    appName: "La Vibe Map Cultura",
    appSubtitle: "Benin to mɛ sín hwɛndó kpo nùnywɛ́ kpo sín wèmá",
    navMap: "Tòdó Wéma (Carte)",
    navDiscover: "Hwɛndó Tan",
    navActors: "Mɛ̌ e nɔ xlɛ́ ali lɛ (Guides)",
    navEvents: "Hwɛndó Hwe",
    navAssistant: "Nùnywɛ́ Nɔ́ví (IA)",
    navProfile: "Gbɛtɔ́ Ce",
    navAdmin: "Gǎn Lɛ Sín Tɛn (Admin)",
    navGuide: "Ali-Xlɛ́tɔ́ Sín Tɛn",
    signIn: "Byɔ Xɔmɛ",
    signOut: "Tɔ́nkùn",
    loginTitle: "Byɔ Hwɛndó sín Xɔmɛ",
    loginSubtitle: "Yí gbe bo mɔ tòxó, ali-xlɛ́tɔ́ lɛ kpo nùnywɛ́ kpo",
    createAccount: "Dó Nyikɔ Ayǐ",
    roleTraveler: "Tomɛyitɔ́ (Voyageur)",
    roleGuide: "Ali-Xlɛ́tɔ́ Dáhó (Guide)",
    roleAdmin: "Kɔmɛ Gǎn (Admin)",
    searchPlaceholder: "Ba Wida, Gbɛxɔco, Ganvié, Xɔgbonu...",
    explorePlace: "Kpɔ́n Fí É Lɔ",
    verifiedGuides: "Ali-Xlɛ́tɔ́ Titewungbe Lɛ",
    heritageStory: "Tɔ́gbó Lɛ Sín Otàn",
    etiquetteRules: "Sɛ́n Kpo Sísí Kpo",
    bookGuide: "Ylɔ Ali-Xlɛ́tɔ́ Dókpó",
    liveMap: "Tòdó Xlɛ́mɛ",
    satelliteMap: "Agbé sín Jǐ Kpɔ́n",
    heritageMap: "Danxomɛ Tòdó",
    liveSearchTitle: "Gbɛtɛ́ yɔyɔ́ lɛ biba ɖò tò mɛ (Google Search)",
    liveSearchPlaceholder: "Ba nùxixo yɔyɔ́ lɛ ɖò Benɛɛtò mɛ...",
    scrapingData: "É ɖò nùyɔyɔ́ lɛ ba wɛ...",
    audioPronunciation: "Sè gbe ɖagbe lɔ",
    systemLang: "Gbe e è na zán é"
  },
  goun: {
    appName: "La Vibe Map Cultura",
    appSubtitle: "Hogbonu po Benɛ gbéji sín osó po lée po",
    navMap: "Aigba Wema (Carte)",
    navDiscover: "Otàn Lɛ",
    navActors: "Ali-Díetɔ Lɛ",
    navEvents: "Húnhwɛ Lɛ",
    navAssistant: "Nǔnywɛ́tɔ Gbéjizɔ́n (IA)",
    navProfile: "Mɛɖé tɔn",
    navAdmin: "Gǎn Tɛn (Admin)",
    navGuide: "Ali-Díetɔ Tɛn",
    signIn: "Bíɔ Xɔmɛ",
    signOut: "Tɔ́n sɔ́n Mɛ",
    loginTitle: "Bíɔ Húnhwɛ sín Xɔmɛ",
    loginSubtitle: "Hogbonu, Wida po Abomey po sín osó",
    createAccount: "Dó Nǔjló Nyikɔ",
    roleTraveler: "Tomɛditɔ (Voyageur)",
    roleGuide: "Ali-Díetɔ Kpɛví (Guide)",
    roleAdmin: "Hwɛndótɔ Gǎn (Admin)",
    searchPlaceholder: "Dín Xɔgbonu, Wida, Ganvié, Kútɔnu...",
    explorePlace: "Kpɔ́n Fí Éhe",
    verifiedGuides: "Ali-Díetɔ Kpó-Kpó Lɛ",
    heritageStory: "Ahɔ́lú Lɛ Sín Otàn",
    etiquetteRules: "Sísí sín Gbetakɛn",
    bookGuide: "Kán Húnhwɛ Xɛ́ Ali-Díetɔ",
    liveMap: "Tòdó Wéma",
    satelliteMap: "Agbé Jǐ Tɔn",
    heritageMap: "Gungbe Tòdó",
    liveSearchTitle: "Dín nǔ yɔyɔ́ lɔlɔ lɛ",
    liveSearchPlaceholder: "Dín nǔhe to jijɔ to Benɛ...",
    scrapingData: "Nǔyɔyɔ́ sísɛ́...",
    audioPronunciation: "Dótó gbe he sọgbe lɔ",
    systemLang: "Gbe he a jlo"
  },
  yoruba: {
    appName: "La Vibe Map Cultura",
    appSubtitle: "Àtẹ Àwòrán Àṣà àti Ìtàn Ilẹ̀ Benin",
    navMap: "Mápù Àyè",
    navDiscover: "Ìtàn Ìbílẹ̀",
    navActors: "Àwọn Atọ́sọ̀nà (Guides)",
    navEvents: "Àwọn Ayẹyẹ",
    navAssistant: "Olùrànlọ́wọ́ Ọlọ́gbọ́n (IA)",
    navProfile: "Profaili Mi",
    navAdmin: "Ibùdó Alákòóso (Admin)",
    navGuide: "Ibùdó Atọ́sọ̀nà",
    signIn: "Wọlé",
    signOut: "Jáde",
    loginTitle: "Wọlé sí Gbọ̀ngàn Àṣà",
    loginSubtitle: "Wọle lati wo gbogbo irin-ajo ati itan ilẹ wa",
    createAccount: "Ṣẹ̀dá Àkọọ́lẹ̀",
    roleTraveler: "Arìnrìn-àjò (Traveler)",
    roleGuide: "Atọ́sọ̀nà Àṣà (Guide)",
    roleAdmin: "Alákòóso Àṣà (Admin)",
    searchPlaceholder: "Wá Ouidah, Abomey, Ganvié, Kétou, Porto-Novo...",
    explorePlace: "Ṣàwárí Ibí Yìí",
    verifiedGuides: "Àwọn Atọ́sọ̀nà Tó Dájú",
    heritageStory: "Ìtàn Àwọn Baba Ńlá",
    etiquetteRules: "Àwọn Ìlànà àti Ọ̀wọ̀",
    bookGuide: "Fipamọ́ Atọ́sọ̀nà",
    liveMap: "Mápù Alààyè",
    satelliteMap: "Àwòrán Òkè (Satellite)",
    heritageMap: "Mápù Àṣà Dahomey",
    liveSearchTitle: "Ìwádìí lórí Íńtánẹ́ẹ̀tì (Google Search)",
    liveSearchPlaceholder: "Wá àwọn ìròyìn tuntun nípa Benin...",
    scrapingData: "Ń gba àwọn ìròyìn tuntun wọlé...",
    audioPronunciation: "Gbọ́ bí a ṣe ń pè é ní tòótọ́",
    systemLang: "Èdè Ètò"
  }
};

/**
 * Phonetic audio pronunciation synthesiser
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
