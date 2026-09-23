import { Actor } from '../types';

/**
 * Annuaire des ressources d’accueil. Les structures sont toutes existantes et décrites
 * par ce que leurs propres documents publient.
 *
 * Les profils de médiateurs inventés avec notes, avis et tarifs (et leurs photos Unsplash)
 * avaient été retirés : sans personne vérifiable derrière, ils transformaient une promesse
 * commerciale en fiction. Dérogation accordée le 2026-09-23 par le fondateur, qui veut voir
 * la mise en page d’un profil guide avant d’avoir des guides répartis : les quelques lignes
 * marquées `isDemo: true` sont des modèles, pas des personnes. Elles n’ont ni contact, ni
 * note, ni avis, ni tarif, ni photo, et l’interface doit les signaler comme démonstration.
 * Un vrai profil guide passe par le portail d’agrément puis par le rattachement décidé par un
 * administrateur (`user.guideProfile.actorId`) ; la ligne de démonstration correspondante est
 * alors supprimée, jamais écrasée.
 */
export const ACTORS_DATA: Actor[] = [
  {
    id: 'anpt',
    name: 'ANPT',
    role: 'Agence nationale de promotion des patrimoines et du tourisme',
    kind: 'structure',
    badgeTitle: 'Acteur public',
    location: 'Bénin',
    bio: 'Service public chargé de la promotion des patrimoines culturels et de l’offre touristique du Bénin. C’est l’interlocuteur institutionnel pour préparer la visite des grands sites et s’assurer que l’accueil est conforme aux règles en vigueur.',
    contact: {
      phone: '+229 21 30 91 44',
      email: 'secretariat-anpt@presidence.bj',
      url: 'https://www.anpt.bj/'
    },
    expertise: [
      {
        title: 'Grands sites culturels',
        description:
          'Référence publique pour l’organisation des visites et l’information sur les sites patrimoniaux.',
        icon: 'account_balance',
        color: 'primary'
      },
      {
        title: 'Information des voyageurs',
        description:
          'Point d’entrée pour vérifier horaires, accès et conditions de visite avant de se déplacer.',
        icon: 'info',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'fondation-zinsou',
    name: 'Fondation Zinsou',
    role: 'Musée d’art contemporain · Ouidah et Cotonou',
    kind: 'structure',
    badgeTitle: 'Fondation culturelle',
    location: 'Ouidah & Cotonou, Bénin',
    bio: 'Fondation créée en juin 2005 par Marie-Cécile Zinsou, avec Lionel Zinsou et Émile Derlin Zinsou. Son musée est installé à Ouidah dans la Villa Ajavon, une demeure de 1922 à l’architecture afro-brésilienne ; le LAB, galerie d’art contemporain, se trouve à Cotonou. Les horaires, l’accès et la gratuité varient selon les expositions et se confirment auprès de la fondation.',
    contact: {
      url: 'https://www.fondation-zinsou.org/'
    },
    expertise: [
      {
        title: 'Musée de Ouidah',
        description:
          'Expositions d’art contemporain africain dans la Villa Ajavon, sur la route des sites de Ouidah.',
        icon: 'account_balance',
        color: 'primary'
      },
      {
        title: 'Le LAB à Cotonou',
        description:
          'Galerie d’art contemporain et programme de médiation dans la capitale économique.',
        icon: 'palette',
        color: 'tertiary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'cenagref-pendjari',
    name: 'CENAGREF',
    role: 'Gestion des aires protégées · antenne du Pendjari',
    kind: 'structure',
    badgeTitle: 'Agence publique',
    location: 'Tanguiéta, Atakora, Bénin',
    bio: 'L’agence béninoise en charge de la gestion des aires protégées. Dans le Parc national de la Pendjari, la gestion est déléguée et associe les villages riverains : les sorties animalières se prennent au poste d’accueil, avec un accompagnateur et un véhicule du parc.',
    expertise: [
      {
        title: 'Sorties animalières',
        description:
          'Départ des pistes de suivi depuis les postes du parc, encadré par un accompagnateur agréé.',
        icon: 'forest',
        color: 'primary'
      },
      {
        title: 'Réglementation de la visite',
        description:
          'Ouverture des secteurs, saisons de fréquentation et règles de conduite envers la faune.',
        icon: 'info',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'musee-abomey',
    name: 'Musée d’Abomey',
    role: 'Musée d’histoire dans les palais royaux',
    kind: 'structure',
    badgeTitle: 'Site patrimonial',
    location: 'Abomey, Zou, Bénin',
    bio: 'Musée d’histoire aménagé dans l’enceinte des palais royaux d’Abomey, inscrits au patrimoine mondial de l’UNESCO depuis 1985 (bien n° 323). On y voit les autels royaux, les tentures appliquées et les bas-reliefs des cours bâties par douze souverains succédés de 1625 à 1900.',
    expertise: [
      {
        title: 'Cours royales et bas-reliefs',
        description:
          'Visite commentée des enceintes de terre, des autels et des décors appliqués des palais.',
        icon: 'account_balance',
        color: 'primary'
      },
      {
        title: 'Accueil sur site',
        description:
          'Guichet du site pour les conditions d’accès et l’accompagnement par un guide du palais.',
        icon: 'groups',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'ddt-tourisme',
    name: 'Direction du Tourisme',
    role: 'Administration publique · développement touristique',
    kind: 'structure',
    badgeTitle: 'Acteur public',
    location: 'Bénin',
    bio: 'Administration publique en charge du développement de l’offre touristique et de la structuration des métiers de l’accueil au Bénin. Ses services instruisent les questions d’agrément et de conditions de visite.',
    expertise: [
      {
        title: 'Agrément des métiers de l’accueil',
        description:
          'Voie administrative par laquelle un guide ou une structure obtient un statut reconnu.',
        icon: 'verified',
        color: 'primary'
      },
      {
        title: 'Développement de l’offre',
        description:
          'Appui aux itinéraires, aux infrastructures d’accueil et à la promotion de la destination.',
        icon: 'map',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'guide-demo-abomey',
    name: 'Migan Hounsaï',
    role: 'Guide des palais royaux · Abomey',
    kind: 'guide',
    isDemo: true,
    location: 'Abomey, Zou, Bénin',
    quote: 'Les murs de terre racontent douze règnes : il suffit de savoir où regarder.',
    bio: 'Modèle de mise en page, sans personne joignable derrière. Il montre ce qu’un guide d’Abomey pourrait présenter : les cours bâties par douze souverains de 1625 à 1900, les tentures appliquées et les bas-reliefs, et le protocole dû aux autels encore en usage.',
    languages: ['Français', 'Fon', 'Anglais'],
    expertise: [
      {
        title: 'Cours royales',
        description:
          'Lecture des enceintes de terre, des autels et des décors appliqués des palais d’Abomey.',
        icon: 'account_balance',
        color: 'primary'
      },
      {
        title: 'Protocole de visite',
        description:
          'Usages devant les sites encore vivants, droit de photographie et accompagnement demandé par le musée.',
        icon: 'info',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'guide-demo-ouidah',
    name: 'Aïchatou Bolarinwa',
    role: 'Mémoire de Ouidah · route des esclaves',
    kind: 'guide',
    isDemo: true,
    location: 'Ouidah, Atlantique, Bénin',
    quote: 'La route est courte de la place des enchères à l’océan : elle se marche en silence.',
    bio: 'Modèle de mise en page, sans personne joignable derrière. Il montre ce qu’un guide de Ouidah pourrait présenter : le chemin mémoriel jusqu’à la Porte du Non-Retour, le temple des pythons de Dangbé, et ce que la plage interdit comme gestes.',
    languages: ['Français', 'Fon', 'Anglais'],
    expertise: [
      {
        title: 'Chemin mémoriel',
        description:
          'Parcours de la place des enchères à la plage, avec les étapes qui le jalonnent et les temps de silence.',
        icon: 'route',
        color: 'primary'
      },
      {
        title: 'Sites vodun de Ouidah',
        description:
          'Temple des pythons et cases afro-brésiliennes : usages du lieu et contribution demandée pour photographier.',
        icon: 'local_florist',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  },
  {
    id: 'guide-demo-ganvie',
    name: 'Zossou Camou',
    role: 'Guide de la cité lacustre · Ganvié',
    kind: 'guide',
    isDemo: true,
    location: 'Sô-Ava, lac Nokoué, Atlantique, Bénin',
    quote: 'Sur le lac, on ne visite pas une ville : on traverse la vie de quarante mille personnes.',
    bio: 'Modèle de mise en page, sans personne joignable derrière. Il montre ce qu’un guide de Ganvié pourrait présenter : l’habitat sur pilotis du lac Nokoué, la pêche lacustre, la langue tofinu entendue sur place, et les accords à demander avant de filmer une famille.',
    languages: ['Français', 'Tofinu', 'Anglais'],
    expertise: [
      {
        title: 'Ville sur l’eau',
        description:
          'Quartiers sur pilotis, déplacements en pirogue et mémoire tofinu d’un refuge du XVIIIe siècle.',
        icon: 'water_drop',
        color: 'primary'
      },
      {
        title: 'Lac et pêche',
        description:
          'Journées de pêche lacustre, gestes qui protègent le lac et règles de passage devant les domiciles.',
        icon: 'eco',
        color: 'secondary'
      }
    ],
    experiences: [],
    reviews: []
  }
];
