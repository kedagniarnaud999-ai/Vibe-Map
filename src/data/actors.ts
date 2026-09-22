import { Actor } from '../types';

/**
 * Annuaire des ressources d’accueil : uniquement des institutions existantes, décrites
 * par ce que leurs propres documents publient. Les profils de médiateurs inventés avec
 * notes, avis et tarifs (et leurs photos Unsplash) ont été retirés : sans personne
 * vérifiable derrière, ils transformaient une promesse commerciale en fiction.
 * Les profils individuels reviendront par le portail guide, attribués un à un par un
 * administrateur (voir `user.guideProfile.actorId`), jamais par cette table.
 */
export const ACTORS_DATA: Actor[] = [
  {
    id: 'anpt',
    name: 'ANPT',
    role: 'Agence nationale de promotion des patrimoines et du tourisme',
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
  }
];
