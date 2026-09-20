/**
 * Table de correspondance francais -> anglais. La cle est la chaine francaise
 * telle qu'ecrite dans le composant : `t('Carte Vivante')`. Le controle de
 * couverture (`npm run check:i18n`) echoue si un `t(...)` n'a pas son entree ici.
 * Les noms propres et les termes en langue nationale ne passent pas par cette table.
 */
export const EN: Record<string, string> = {
  'La Vibe Map Cultura': 'La Vibe Map Cultura',
  'Atlas Vivant du Patrimoine et des Savoirs du Bénin':
    "Living Atlas of Benin's Heritage and Knowledge",
  'Carte Vivante': 'Living Map',
  Récits: 'Stories',
  'Guides & Artisans': 'Guides & Artisans',
  Événements: 'Events',
  'Compagnon IA': 'AI Companion',
  'Mon Profil': 'My Profile',
  'Espace Admin': 'Admin Portal',
  'Espace Guide': 'Guide Portal',
  'Se connecter': 'Sign In',
  Déconnexion: 'Sign Out',
  'Connexion au Sanctuaire Culturel': 'Log In to the Cultural Sanctuary',
  'Accédez à vos itinéraires, réservations et gardiens de mémoire':
    'Access your itineraries, bookings and memory keepers',
  'Créer un compte': 'Create an Account',
  'Voyageur / Curieux': 'Traveler / Explorer',
  'Médiateur / Guide Certifié': 'Certified Cultural Guide',
  'Administrateur Patrimoine': 'Heritage Admin',
  'Rechercher Ouidah, Abomey, Ganvié, Porto-Novo...':
    'Search Ouidah, Abomey, Ganvié, Porto-Novo...',
  'Découvrir le lieu': 'Explore this Site',
  'Guides & Médiateurs Certifiés': 'Verified Guides & Keepers',
  'Histoire Ancestrale & Symboles': 'Ancestral History & Symbols',
  'Protocole & Éthique du Sanctuaire': 'Sacred Protocol & Etiquette',
  'Réserver une immersion': 'Book an Immersion',
  'Plan Interactif': 'Interactive Map',
  'Vue Satellite': 'Satellite View',
  'Carte Illustrée': 'Heritage Canvas',
  'Recherche en direct sur le web (Google Search)': 'Live web search (Google Search)',
  'Interroger les dernières actualités, horaires, événements au Bénin...':
    'Ask about the latest news, opening hours and events in Benin...',
  'Actualisation en direct des données du Bénin...': 'Refreshing live data for Benin...',
  'Écouter la prononciation authentique': 'Listen to the authentic pronunciation',
  'Langue du système': 'Language',
  'Poser une question au compagnon culturel': 'Ask the cultural companion',

  'Sites et sanctuaires réels du Bénin': 'Real sites and sanctuaries of Benin',
  'Bibliothèque Culturelle': 'Cultural Library',
  'Récits, proverbes et symboles royaux': 'Stories, proverbs and royal symbols',
  'Guides et maîtres de tradition agréés': 'Accredited guides and tradition keepers',
  'Tissez Votre Immersion': 'Weave Your Immersion',
  'Séquencement culturel et réservations': 'Cultural sequencing and bookings',
  'Passeport Culturel': 'Cultural Passport',
  'Sites visités et badges initiatiques': 'Sites visited and initiation badges',
  'Célébrations & Fêtes Traditionnelles': 'Celebrations & Traditional Festivals',
  'Vodun Days, Gaani et rituels sacrés': 'Vodun Days, Gaani and sacred rituals',
  'Compagnon Culturel IA': 'Cultural AI Companion',
  'Espace Administration du Patrimoine': 'Heritage Administration Portal',
  'Supervision des bases, scraping et validation': 'Database supervision, scraping and validation',
  'Portail Médiateur & Guide': 'Mediator & Guide Portal',
  'Réservations et catalogue d’expériences': 'Bookings and experience catalogue',
  'Patrimoine & Sanctuaires du Bénin': 'Heritage & Sanctuaries of Benin',
  'Profil non rattaché': 'Unlinked profile',
  'Connecté comme {who} : l’identité Firebase est valide mais le profil est illisible. Les réservations, RSVP et enregistrements restent bloqués jusqu’à la relecture du profil.':
    'Signed in as {who}: the Firebase identity is valid but the profile cannot be read. Bookings, RSVPs and saves stay blocked until the profile is reloaded.',
  Réessayer: 'Retry',
  'Se déconnecter': 'Sign out',
  'Chargement de l’espace…': 'Loading space…',

  Itinéraire: 'Itinerary',
  Retour: 'Back',
  'Patrimoine du Bénin': "Heritage of Benin",
  'Changer la langue': 'Change language',
  Langue: 'Language',
  'Assistant Culturel IA': 'Cultural AI Assistant',
  'Espace Administrateur': 'Admin Portal',
  'Espace Guide Agréé': 'Accredited Guide Portal',

  'Akwaba ! Je suis votre guide spirituel et culturel alimenté par Gemini & Search Grounding. Posez-moi des questions sur les sanctuaires sacrés de Ouidah, les palais royaux d’Abomey, les protocoles Vodun, la fête de la Gaani ou apprenez les salutations en Fon et Yoruba.':
    'Akwaba! I am your spiritual and cultural guide, powered by Gemini & Search Grounding. Ask me about the sacred sanctuaries of Ouidah, the royal palaces of Abomey, Vodun protocols, the Gaani festival, or learn greetings in Fon and Yoruba.',
  Maintenant: 'Now',
  'Bienvenue chaleureuse pour franchir le seuil d’un sanctuaire ou d’une concession familiale.':
    'A warm welcome as you cross the threshold of a sanctuary or a family compound.',
  'Dans les couvents et cours royales, saluez toujours avec la main droite et le regard bienveillant.':
    'In convents and royal courts, always greet with the right hand and a kind gaze.',
  'Quels sont les interdits du Temple des Pythons ?': 'What are the taboos at the Python Temple?',
  'Comment saluer un aîné ou un dignitaire en Fon ?': 'How do you greet an elder or a dignitary in Fon?',
  'Quelle est la signification du requin pour le Roi Béhanzin ?': "What does the shark mean for King Béhanzin?",
  'Pourquoi l’Iroko est-il sacré dans la forêt de Kpassè ?': 'Why is the Iroko sacred in the Kpassè forest?',
  'Dans la tradition béninoise et la culture Fon, la salutation est un acte sacré qui instaure la paix (Fífá). On salue toujours de la main droite, en s’inclinant légèrement face aux aînés.':
    'In Beninese tradition and Fon culture, greeting is a sacred act that establishes peace (Fífá). You always greet with the right hand, bowing slightly before elders.',
  'Vous êtes-vous réveillé dans la paix ? (Salutation matinale respectueuse)':
    'Did you wake in peace? (respectful morning greeting)',
  'Ne tendez jamais la main gauche lors d’un salut ou pour remettre un objet.':
    'Never offer the left hand when greeting or handing over an object.',
  'Au Temple des Pythons de Ouidah, les pythons royaux (Dangbé) sont tenus pour sacrés : le culte du python y est attesté depuis la fin du XVIIe siècle. On les observe sans les déplacer.':
    'At the Python Temple of Ouidah, the royal pythons (Dangbé) are held sacred: the python cult is attested there since the late 17th century. Observe them without moving them.',
  'Déchaussez-vous à l’entrée des petits sanctuaires intérieurs et demandez la permission avant de photographier les dignitaires.':
    'Take off your shoes at the entrance of small inner sanctuaries and ask permission before photographing dignitaries.',
  'Le requin (Gbêhanzin) symbolise le roi résistant : « Je suis le requin téméraire qui n’abandonne pas un pouce de ses eaux territoriales ». Cet emblème royal orne les tentures appliquées d’Abomey.':
    'The shark (Gbêhanzin) symbolises the resisting king: "I am the reckless shark who gives up not an inch of its territorial waters". This royal emblem adorns the applied tapestries of Abomey.',
  'Sur les tentures d’Abomey, les coutures en relief découpées à la main attestent de l’authenticité de l’artisan royal.':
    'On the tapestries of Abomey, the hand-cut raised seams attest to the authenticity of the royal artisan.',
  "Dans la Forêt Sacrée de Kpassè, l'iroko est tenu pour la métamorphose vivante du roi Kpassè, second souverain de Savi, au milieu du XVIIe siècle.":
    'In the Sacred Forest of Kpassè, the iroko is held to be the living metamorphosis of King Kpassè, second sovereign of Savi, in the mid-17th century.',
  'Parlez à voix basse dans la forêt sacrée et ne touchez pas les tissus blancs noués autour des troncs.':
    'Speak in low voices in the sacred forest and do not touch the white cloth tied around the trunks.',
  'Au Bénin, chaque sanctuaire et tradition vivante s’appuie sur le respect des ancêtres et de la nature. Concernant votre question sur « {query} », les gardiens recommandent la sincérité, la retenue et l’écoute avant d’immortaliser les cérémonies.':
    'In Benin, every sanctuary and living tradition rests on respect for the ancestors and nature. Regarding your question about "{query}", the keepers recommend sincerity, restraint and listening before filming ceremonies.',
  'La formule « Kou do agbé » (Que la paix soit avec vous) ouvre tous les cœurs.':
    'The phrase "Kou do agbé" (May peace be with you) opens every heart.',
  'Alimenté par Gemini 3.5 Flash & Données Culturelles du Bénin': 'Powered by Gemini 3.5 Flash & Benin cultural data',
  'Activer la recherche Google en direct sur le web': 'Enable live Google web search',
  'Recherche Web Active': 'Live Web Search On',
  'Mode Mémoire': 'Memory Mode',
  'Réponse du fonds culturel écrit — génération en ligne indisponible.':
    'Answer from the written cultural archive — online generation unavailable.',
  'Sources et références web vérifiées :': 'Verified web sources and references:',
  'Consultation des archives vivantes et du web...': 'Consulting the living archives and the web...',

  'Préférences enregistrées avec succès !': 'Preferences saved successfully!',
  'Préférences synchronisées avec Firestore !': 'Preferences synced with Firestore!',
  'Enregistrement refusé : une session vérifiée est requise.':
    'Save refused: a verified session is required.',
  'Demande d’agrément guide envoyée pour validation !': 'Guide accreditation request sent for approval!',
  'Envoi impossible. Vérifiez que votre session est toujours active.':
    'Could not send. Check that your session is still active.',
  'Profil & Accréditation': 'Profile & Accreditation',
  'Changer de Compte': 'Switch Account',
  'Administrateur / Conservateur': 'Administrator / Curator',
  'Médiateur Culturel Agréé': 'Accredited Cultural Mediator',
  'Voyageur du Patrimoine': 'Heritage Traveller',
  'Base Firestore & PostgreSQL Connectée': 'Firestore & PostgreSQL database connected',
  'Espace Conservateur du Patrimoine': 'Heritage Curator Portal',
  'Supervision des sanctuaires réels, scraping automatique de données, validation des réservations et gestion des guides agréés.':
    'Supervision of real sanctuaries, automated data collection, booking validation and management of accredited guides.',
  "Accéder à l'Administration": 'Open Administration',
  'Portail Guide & Médiateur Culturel': 'Guide & Cultural Mediator Portal',
  "Consultez vos demandes d'immersion reçues, mettez à jour votre tarif et gérez vos confirmations de visite.":
    'Review the immersion requests you received, update your rate and manage your visit confirmations.',
  'Ouvrir mon Espace Guide': 'Open my Guide Portal',
  'Vous êtes Guide ou Gardien de Tradition ?': 'Are you a guide or a tradition keeper?',
  "Rejoignez le réseau officiel des médiateurs culturels agréés de La Vibe Map pour faire rayonner l'histoire du Bénin et recevoir des réservations de voyageurs.":
    'Join the official network of La Vibe Map accredited cultural mediators to showcase the history of Benin and receive traveller bookings.',
  'Postuler comme Guide Agréé': 'Apply as an Accredited Guide',
  'Se connecter pour postuler': 'Sign in to apply',
  'Préférences Culturelles & Langue': 'Cultural Preferences & Language',
  'Langue du système (synchronisation temps réel)': 'System language (real-time sync)',
  "Rythme d'exploration": 'Exploration pace',
  Doux: 'Gentle',
  'Flâneries, sanctuaires et thé': 'Strolls, sanctuaries and tea',
  Explorateur: 'Explorer',
  'Découverte équilibrée et marchés': 'Balanced discovery and markets',
  'Immersion Profonde': 'Deep Immersion',
  'Maîtres artisans, rituels et cours royales': 'Master artisans, rituals and royal courts',

  'Alertes Cérémonies & Rassemblements': 'Ceremony & gathering alerts',
  'Notifications pour les Vodun Days, Fête de la Gaani et sorties Egungun':
    'Notifications for Vodun Days, the Gaani festival and Egungun processions',
  'Synchronisation…': 'Syncing…',
  'Enregistrer les Préférences': 'Save Preferences',
  'Accès Réservé au Conservatoire & Administration': 'Reserved for Curators & Administration',
  'Agrément Médiateur & Guide Culturel': 'Cultural Mediator & Guide Accreditation',
  'Formulaire officiel pour guides et conteurs du Bénin': 'Official form for guides and storytellers of Benin',
  'Dossier Transmis avec Succès !': 'Application Submitted!',
  "Votre demande d'agrément a été transmise aux conservateurs. Vous recevrez une notification dès validation.":
    'Your accreditation request has been sent to the curators. You will be notified once it is approved.',
  'Nom & Prénom du Guide': 'Guide full name',
  'Numéro Téléphone / WhatsApp': 'Phone / WhatsApp number',
  "Années d'Expérience": 'Years of experience',
  'Région & Circuits Principaux': 'Main region & circuits',
  'Ex: Ouidah, Grand-Popo, Abomey, Porto-Novo, Dassa...': 'E.g.: Ouidah, Grand-Popo, Abomey, Porto-Novo, Dassa...',
  'Langues Maîtrisées': 'Languages spoken',
  'Ex: Français, Fon, Anglais, Yorùbá...': 'E.g.: French, Fon, English, Yorùbá...',
  'Spécialités Culturelles & Domaines': 'Cultural specialties & fields',
  'Ex: Route des Esclaves, Vodun Days, Cités Lacustres Ganvié...':
    'E.g.: Slave Route, Vodun Days, Ganvié lake villages...',
  'Biographie & Démarche de Médiation': 'Biography & mediation approach',
  'Décrivez votre parcours, votre attachement aux traditions et la façon dont vous accompagnez les visiteurs...':
    'Describe your background, your attachment to the traditions and how you accompany visitors...',
  Annuler: 'Cancel',
  'Envoi en cours...': 'Sending...',
  'Soumettre mon Dossier': 'Submit my application'
};
