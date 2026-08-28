import { Actor } from '../types';

export const ACTORS_DATA: Actor[] = [
  {
    id: 'koffi-agbodjan',
    name: 'Maître Koffi Agbodjan',
    role: 'Guide Conférencier Certifié & Médiateur de Ouidah',
    badgeTitle: 'Guide Titulaire du Patrimoine',
    rating: 4.98,
    reviewsCount: 142,
    location: 'Ouidah, Atlantique, Bénin',
    experienceYears: 19,
    languages: ['Français (Courant)', 'Fon (Langue Maternelle)', 'Anglais (Professionnel)'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    heroImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
    quote: '"Le patrimoine de Ouidah n’est pas un vestige silencieux : c’est la mémoire vivante de nos ancêtres et le phare de notre dignité."',
    bio: 'Koffi est diplômé d’Histoire à l’Université d’Abomey-Calavi et membre de l’Association des Guides du Patrimoine de Ouidah. Il a conduit les visites officielles de l’UNESCO sur la Route de l’Esclave et dans le Temple des Pythons.',
    expertise: [
      {
        title: 'La Route des Esclaves & Mémoire Mémorielle',
        description: 'Parcours historique commenté du Fort Portugais jusqu’à la Porte du Non-Retour sur la plage de Djègbadji.',
        icon: 'map',
        color: 'primary'
      },
      {
        title: 'Cosmogonie Vodun & Temple de Dangbé',
        description: 'Explication respectueuse des alliances totémiques et de la philosophie de paix des divinités.',
        icon: 'account_balance',
        color: 'secondary'
      }
    ],
    experiences: [
      {
        id: 'circuit-complet-ouidah',
        title: 'Immersion Complète : Route Mémorielle & Sanctuaires',
        price: '25 000 FCFA (~38 €)',
        duration: 'Demi-journée (3h30)',
        description: 'Visite guidée exclusive à pied et en véhicule du Fort Portugais, de l’Arbre de l’Oubli, du Mémorial de Zoungbodji et de la Porte du Non-Retour.',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'visite-temple-foret',
        title: 'Sanctuaires Sacrés : Dangbé & Forêt de Kpassè',
        price: '15 000 FCFA (~23 €)',
        duration: '2h00',
        description: 'Rencontre avec les gardiens traditionnels, rituels d’accueil et découverte des sculptures mythologiques en forêt sacrée.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600'
      }
    ],
    reviews: [
      {
        id: 'rev-koffi-1',
        author: 'Arnaud Kedagni',
        date: 'Janvier 2025',
        comment: 'Une visite bouleversante et extrêmement documentée. Maître Koffi allie érudition universitaire et profonde spiritualité locale.',
        rating: 5
      },
      {
        id: 'rev-koffi-2',
        author: 'Sophie M.',
        date: 'Décembre 2024',
        comment: 'Le meilleur guide de Ouidah sans hésitation. Il vous ouvre les portes avec un respect immense pour les traditions.',
        rating: 5
      }
    ]
  },
  {
    id: 'dr-sylvain-kpanlingan',
    name: 'Pr. Sylvain Kpanlingan',
    role: 'Griot Royal & Conservateur des Palais Royaux',
    badgeTitle: 'Historien Émérite du Dahomey',
    rating: 4.96,
    reviewsCount: 118,
    location: 'Abomey, Zou, Bénin',
    experienceYears: 27,
    languages: ['Français', 'Fon Royal', 'Yoruba'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    heroImage: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=800',
    quote: '"Chaque bas-relief d’Abomey est une page de notre constitution royale : l’histoire s’écoute avec le cœur."',
    bio: 'Descendant direct de la lignée des panégyristes royaux Kpanlingan, le professeur Sylvain consacre sa vie à la conservation du site UNESCO d’Abomey et à la transmission des proverbes royaux et de l’épopée des Amazones Agojié.',
    expertise: [
      {
        title: 'Dynasties Royales d’Abomey',
        description: 'Généalogie des 12 rois du Danxomè, décodage des symboles de cour et des traités de guerre.',
        icon: 'account_balance',
        color: 'primary'
      },
      {
        title: 'Régiment des Amazones Agojié',
        description: 'Récit authentique de l’organisation militaire, du code d’honneur et des batailles des combattantes.',
        icon: 'military_tech',
        color: 'tertiary'
      }
    ],
    experiences: [
      {
        id: 'palais-abomey-secret',
        title: 'Dans l’Intimité des Rois du Dahomey',
        price: '30 000 FCFA (~45 €)',
        duration: '3h00',
        description: 'Accès commenté aux cours intérieures privées de Glèlè et Ghézo, explications des bas-reliefs et chants de louanges royaux.',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=600'
      }
    ],
    reviews: [
      {
        id: 'rev-syl-1',
        author: 'Marc-André L.',
        date: 'Février 2025',
        comment: 'Écouter le professeur réciter les devises des rois dans la cour d’honneur est une expérience inoubliable.',
        rating: 5
      }
    ]
  },
  {
    id: 'basile-toviho',
    name: 'Capitaine Basile Toviho',
    role: 'Piroguier Émérite & Guide Communautaire de Ganvié',
    badgeTitle: 'Guide Lacustre Agréé',
    rating: 4.94,
    reviewsCount: 89,
    location: 'Ganvié, Lac Nokoué, Bénin',
    experienceYears: 16,
    languages: ['Français', 'Tofinu', 'Fon'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    heroImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    quote: '"L’eau du lac Nokoué n’est pas seulement notre route, c’est le bouclier qui a sauvé nos aïeux."',
    bio: 'Né à Ganvié dans une famille de pêcheurs Tofinu, Basile pilote les embarcations motorisées et pirogues traditionnelles. Il coordonne les circuits écotouristiques respectueux des familles lacustres.',
    expertise: [
      {
        title: 'Écotourisme Lacustre & Pêche Acadja',
        description: 'Navigation douce entre les maisons sur pilotis, les canaux bordés de jacinthes d’eau et les viviers.',
        icon: 'sailing',
        color: 'primary'
      }
    ],
    experiences: [
      {
        id: 'pirogue-lacustre-ganvie',
        title: 'Navigation Fluviale & Marché Flottant de Ganvié',
        price: '20 000 FCFA (~30 €)',
        duration: '2h30',
        description: 'Traversée du lac Nokoué en pirogue, arrêt chez les artisans constructeurs de maisons en bambou et dégustation d’eau de coco.',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600'
      }
    ],
    reviews: [
      {
        id: 'rev-bas-1',
        author: 'Élodie G.',
        date: 'Janvier 2025',
        comment: 'Basile connaît chaque famille de Ganvié. La visite est très humaine et pleine de respect.',
        rating: 5
      }
    ]
  },
  {
    id: 'maman-solange',
    name: 'Maman Solange Dossou',
    role: 'Maîtresse Teinturière à l’Indigo & Tisseuse Kanvô',
    badgeTitle: 'Trésor Humain Vivant de Porto-Novo',
    rating: 4.97,
    reviewsCount: 76,
    location: 'Porto-Novo, Ouémé, Bénin',
    experienceYears: 32,
    languages: ['Français', 'Goun', 'Yoruba'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    quote: '"Le bleu de l’indigo végétal renferme la patience et la protection des mères."',
    bio: 'Héritière d’un savoir-faire de six générations à Porto-Novo, Solange préserve les cuves de fermentation naturelle de feuilles d’indigo et les métiers à tisser traditionnels à pédales.',
    expertise: [
      {
        title: 'Teinture Végétale à l’Indigo',
        description: 'Préparation des bains de teinture aux feuilles broyées et motifs en réserve à la cire et ligatures.',
        icon: 'palette',
        color: 'tertiary'
      }
    ],
    experiences: [
      {
        id: 'atelier-indigo-porto',
        title: 'Atelier de Création Textile & Teinture Indigo',
        price: '18 000 FCFA (~28 €)',
        duration: '2h00',
        description: 'Créez votre propre écharpe ou pagne en coton biologique teint selon les techniques ancestrales des cours de Porto-Novo.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600'
      }
    ],
    reviews: [
      {
        id: 'rev-sol-1',
        author: 'Claire D.',
        date: 'Décembre 2024',
        comment: 'Un moment de pure magie artisanale. On repart avec une pièce unique et une leçon de vie.',
        rating: 5
      }
    ]
  },
  {
    id: 'nathalie-sossa',
    name: 'Nathalie Sossa',
    role: 'Historienne de l’Art & Médiatrice Contemporaine',
    badgeTitle: 'Médiatrice Culturelle Fondation Zinsou',
    rating: 4.95,
    reviewsCount: 64,
    location: 'Cotonou, Littoral, Bénin',
    experienceYears: 11,
    languages: ['Français', 'Anglais', 'Fon'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    quote: '"Le Bénin est le laboratoire mondial du renouveau de l’art africain."',
    bio: 'Diplômée en muséologie, Nathalie guide les visiteurs à travers les expositions internationales de la Fondation Zinsou et les galeries contemporaines de Cotonou.',
    expertise: [
      {
        title: 'Art Contemporain et Restitution des Trésors Royaux',
        description: 'Parcours critique liant les 26 œuvres restituées par la France aux œuvres d’artistes vivants.',
        icon: 'brush',
        color: 'primary'
      }
    ],
    experiences: [
      {
        id: 'safari-galeries-cotonou',
        title: 'Parcours Art & Galeries de Cotonou',
        price: '22 000 FCFA (~34 €)',
        duration: '3h00',
        description: 'Visite guidée des expositions de la Fondation Zinsou, de l’Esplanade de l’Amazone et des ateliers d’artistes émergents.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600'
      }
    ],
    reviews: [
      {
        id: 'rev-nat-1',
        author: 'Thomas V.',
        date: 'Février 2025',
        comment: 'Des explications brillantes qui donnent un regard neuf sur la créativité béninoise !',
        rating: 5
      }
    ]
  }
];
