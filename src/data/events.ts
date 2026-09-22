import { CulturalEvent } from '../types';
import { commonsThumb } from '../lib/media';

/**
 * Agenda des rassemblements. Les visuels viennent de Wikimedia Commons sous licence
 * libre et sont servis par leur nom de fichier (`Special:FilePath`) avec leur auteur :
 * sans crédit visible, une licence CC BY-SA n'est pas respectée. N'est listé ici qu'un
 * rassemblement dont on peut vérifier la date. Des horaires et un tarif qu'aucune
 * source ne publie ne décrivent pas un événement mais une offre commerciale inventée :
 * le quartier des tisserands de Porto-Novo mérite une fiche de lieu documentée, pas une
 * ligne d'agenda.
 */
export const EVENTS_DATA: CulturalEvent[] = [
  {
    id: 'vodun-days-ouidah',
    title: 'Vodun Days (Fête Nationale des Arts & Traditions Vodun)',
    type: 'Festival',
    date: '9 & 10 Janvier (Annuel)',
    location: 'Plage de Djègbadji & Cité Historique, Ouidah',
    image: commonsThumb('Rituel de Zangbéto au Bénin.jpg', 960),
    imageCredit: {
      file: 'Rituel de Zangbéto au Bénin.jpg',
      author: 'Richmond Dakpogan',
      license: 'CC BY-SA 4.0'
    },
    isFeatured: true,
    accessType: 'Accès public',
    description:
      'Le plus grand rassemblement culturel et spirituel du Bénin réunissant dignitaires Vodun, couvents sacrés, gardiens de nuit Zangbéto et danses spectaculaires des masques Egungun face à l’océan Atlantique.'
  },
  {
    id: 'fete-de-la-gaani',
    title: 'Fête Impériale de la Gaani',
    type: 'Ceremony',
    date: 'Mois Lunaire de Gaani (Nikki)',
    location: 'Palais Impérial du Roi de Nikki, Borgou, Bénin',
    image: commonsThumb('Fête de la Gaani 2026.jpg', 960),
    imageCredit: {
      file: 'Fête de la Gaani 2026.jpg',
      author: 'Azogbonon',
      license: 'CC0'
    },
    isFeatured: true,
    accessType: 'Accès Public & Noblesse Baatonu',
    description:
      'Grande fête équestre et identitaire du peuple Baatonu et des cavaliers du Nord-Bénin. Défilé majestueux des princes à cheval, trompes royales Kakaki et hommage au Sinaboko (Empereur de Nikki).'
  },
  {
    id: 'fete-du-nonvitcha-grand-popo',
    title: 'Fête Centenaire du Nonvitcha',
    type: 'Festival',
    date: 'Week-end de la Pentecôte',
    location: 'Grand-Popo, Mono, Bénin',
    image: commonsThumb('Nonvitcha Grand Popo Benin 2017.jpg', 960),
    imageCredit: {
      file: 'Nonvitcha Grand Popo Benin 2017.jpg',
      author: 'Kulttuurinavigaattori',
      license: 'CC BY-SA 4.0'
    },
    isFeatured: false,
    accessType: 'Accès Ouvert à Tous',
    description:
      'Fondée en 1923, la plus ancienne fête d’union et de solidarité d’Afrique de l’Ouest réunissant les peuples Xwla et Xwéla sur les rives du fleuve Mono et de l’océan.'
  },
  {
    id: 'ceremonie-egungun-ouidah',
    title: 'Sortie Rituelle des Masques Revenants Egungun',
    type: 'Ceremony',
    date: 'Chaque Dimanche après-midi',
    location: 'Quartier Zomaï & Cours Royales, Ouidah',
    image: commonsThumb('Benin- Egungun masquerade.jpg', 960),
    imageCredit: {
      file: 'Benin- Egungun masquerade.jpg',
      author: 'Ahmzzywilmakeit',
      license: 'CC BY-SA 4.0'
    },
    isFeatured: false,
    accessType: 'Sur Invitation & Respect du Protocole',
    description:
      'Apparition des esprits ancêtres incarnés dans de somptueux costumes de tissus brodés et pailletés, dansant au rythme des tambours Bata sous la conduite des Alagba.'
  }
];
