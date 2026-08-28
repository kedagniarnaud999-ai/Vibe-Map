import { CulturalEvent } from '../types';

export const EVENTS_DATA: CulturalEvent[] = [
  {
    id: 'vodun-days-ouidah',
    title: 'Vodun Days (Fête Nationale des Arts & Traditions Vodun)',
    type: 'Festival',
    date: '9 & 10 Janvier (Annuel)',
    location: 'Plage de Djègbadji & Cité Historique, Ouidah',
    image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isHappeningThisWeek: true,
    accessType: 'Accès Public & Gratuit',
    description: 'Le plus grand rassemblement culturel et spirituel du Bénin réunissant dignitaires Vodun, couvents sacrés, gardiens de nuit Zangbéto et danses spectaculaires des masques Egungun face à l’océan Atlantique.'
  },
  {
    id: 'fete-de-la-gaani',
    title: 'Fête Impériale de la Gaani',
    type: 'Ceremony',
    date: 'Mois Lunaire de Gaani (Nikki)',
    location: 'Palais Impérial du Roi de Nikki, Borgou, Bénin',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isHappeningThisWeek: false,
    accessType: 'Accès Public & Noblesse Baatonu',
    description: 'Grande fête équestre et identitaire du peuple Baatonu et des cavaliers du Nord-Bénin. Défilé majestueux des princes à cheval, trompes royales Kakaki et hommage au Sinaboko (Empereur de Nikki).'
  },
  {
    id: 'fete-du-nonvitcha-grand-popo',
    title: 'Fête Centenaire du Nonvitcha',
    type: 'Festival',
    date: 'Week-end de la Pentecôte',
    location: 'Grand-Popo, Mono, Bénin',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    isHappeningThisWeek: false,
    accessType: 'Accès Ouvert à Tous',
    description: 'Fondée en 1923, la plus ancienne fête d’union et de solidarité d’Afrique de l’Ouest réunissant les peuples Xwla et Xwéla sur les rives du fleuve Mono et de l’océan.'
  },
  {
    id: 'ceremonie-egungun-ouidah',
    title: 'Sortie Rituelle des Masques Revenants Egungun',
    type: 'Ceremony',
    date: 'Chaque Dimanche après-midi',
    location: 'Quartier Zomaï & Cours Royales, Ouidah',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    isHappeningThisWeek: true,
    accessType: 'Sur Invitation & Respect du Protocole',
    description: 'Apparition des esprits ancêtres incarnés dans de somptueux costumes de tissus brodés et pailletés, dansant au rythme des tambours Bata sous la conduite des Alagba.'
  },
  {
    id: 'atelier-teinture-indigo',
    title: 'Atelier Maître Teinturier & Tissage Kanvô',
    type: 'Workshop',
    date: 'Mercredi & Samedi, 10h00',
    location: 'Quartier Historique d’Adjina, Porto-Novo',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    isHappeningThisWeek: true,
    accessType: 'Sur Réservation (18 000 FCFA)',
    description: 'Initiation pratique à la fermentation de l’indigo végétal dans des cuves ancestrales et création de motifs géométriques béninois sur étoffe de coton.'
  }
];
