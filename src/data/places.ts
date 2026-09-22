import { Place } from '../types';
import { commonsThumb } from '../lib/media';

/**
 * Socle documentaire de La Vibe Map. Chaque fait engageant (date, statut de
 * protection, auteur d'une oeuvre, dimension) est rattache a une source publiee ;
 * les superlatifs sans source et les biographies inventees n'ont pas leur place ici.
 * Les visuels viennent de Wikimedia Commons : le champ `imageCredit` porte le nom
 * du fichier, l'auteur et la licence, et doit rester affiche sous l'image.
 * `coordinates.x/y` est une place sur la carte illustrée ; `lat/lng` est la position
 * réelle vérifiée, utilisée par le calque Leaflet.
 */
export const PLACES_DATA: Place[] = [
  {
    id: 'temple-des-pythons',
    name: 'Temple des Pythons',
    location: 'Quartier Dangbé Xwé, Ouidah, Atlantique, Bénin',
    category: 'Spiritual',
    image: commonsThumb('Entrée du Temple des Pythons (Ouidah).jpg', 960),
    imageCredit: {
      file: 'Entrée du Temple des Pythons (Ouidah).jpg',
      author: 'Ji-Elle',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Sanctuaire dédié à Dangbé, le python royal, qui vit en liberté dans la cour du temple, à quelques pas de la basilique de Ouidah.',
    deepHistory:
      'Le culte du python royal (Python regius) est attesté à Ouidah depuis la fin du XVIIe siècle. L’animal y est tenu pour sacré : on ne le tue pas, il circule dans l’enceinte et on le remet en place lorsqu’il traverse la voirie. Le temple se dresse quartier Dangbé Xwé, face à la basilique de l’Immaculée Conception de Ouidah. La visite se fait avec les gardiens des lieux, et une participation est demandée pour photographier les serpents.',
    badges: ['Sanctuaire vodun en activité'],
    etiquette: [
      {
        title: 'Demander avant de photographier',
        description:
          'L’accord des gardiens est nécessaire dans l’enceinte et pour toute photo prise avec un python.',
        icon: 'no_photography'
      },
      {
        title: 'Ne pas saisir les pythons',
        description: 'On observe l’animal sans le déplacer ; la manipulation se fait avec un gardien.',
        icon: 'back_hand'
      }
    ],
    visualGuides: [
      {
        title: 'Enclos sacré',
        description: 'La cour du temple où évoluent les pythons.',
        image: commonsThumb('Ouidah-Temple des Pythons-Enclos.jpg', 640),
        credit: {
          file: 'Ouidah-Temple des Pythons-Enclos.jpg',
          author: 'Ji-Elle',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Jarre sacrée',
        description: 'Un des récipients rituels dressés dans l’enceinte.',
        image: commonsThumb('Ouidah-Temple des Pythons-Jarre sacrée.jpg', 640),
        credit: {
          file: 'Ouidah-Temple des Pythons-Jarre sacrée.jpg',
          author: 'Ji-Elle',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Dangbé',
        meaning: 'Le python royal, tenu pour sacré à Ouidah.'
      },
      {
        term: 'Vodun',
        meaning: 'Les forces et les divinités que l’on honore dans les sanctuaires du sud du Bénin.'
      }
    ],
    coordinates: {
      x: 38,
      y: 68,
      lat: 6.35997,
      lng: 2.08504
    }
  },
  {
    id: 'foret-sacree-kpasse',
    name: 'Forêt Sacrée de Kpassè Zoun',
    location: 'Tovè II, Ouidah, Atlantique, Bénin',
    category: 'Nature',
    image: commonsThumb('Forêt sacrée de Kpassè 01.jpg', 960),
    imageCredit: { file: 'Forêt sacrée de Kpassè 01.jpg', author: 'Chiemelacebelae', license: 'CC0' },
    description:
      'Bosquet sacré aujourd’hui réduit à quelques hectares, où l’on vénère un iroko millénaire entouré d’œuvres contemporaines.',
    deepHistory:
      'Kpassè est le second souverain de Savi et le fondateur du royaume de Hueda, au milieu du XVIIe siècle. Pour échapper à ses ennemis, il se serait réfugié dans ce bosquet et s’y serait métamorphosé en iroko (Milicia excelsa), l’arbre que la forêt honore encore. Vaste d’une trentaine d’hectares à l’origine, elle n’en compte plus que quelques-uns. Elle est protégée au titre des forêts sacrées classées du Bénin (arrêté interministériel de 2012 et décret n° 2017-331). Des sculptures en bois et en ciment jalonnent les allées.',
    badges: ['Forêt sacrée classée', 'Patrimoine spirituel'],
    etiquette: [
      {
        title: 'Parler à voix basse',
        description: 'La forêt est un lieu de culte actif : les offices et les libations y continuent.',
        icon: 'volume_mute'
      },
      {
        title: 'Ne rien cueillir',
        description: 'Écorces, tissus noués et racines relèvent des gardiens de la forêt.',
        icon: 'forest'
      }
    ],
    visualGuides: [
      {
        title: 'Portail d’entrée',
        description: 'L’entrée monumentale de la forêt, sur la route de Tovè.',
        image: commonsThumb("Portail d'entrée de la Forêt sacrée de KPASSE OUIDAH au Bénin.jpg", 640),
        credit: {
          file: "Portail d'entrée de la Forêt sacrée de KPASSE OUIDAH au Bénin.jpg",
          author: 'Yelouassi',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Les champions blancs',
        description: 'Sculptures blanches dressées le long des allées.',
        image: commonsThumb('Les champions blancs à la Forêt Sacrée de Kpassè.jpg', 640),
        credit: {
          file: 'Les champions blancs à la Forêt Sacrée de Kpassè.jpg',
          author: 'Rachad sanoussi',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Kpassè',
        meaning: 'Le souverain de Savi auquel la forêt est consacrée.'
      },
      {
        term: 'Iroko',
        meaning: 'Milicia excelsa, arbre monumental souvent sacré dans le sud du Bénin.'
      }
    ],
    coordinates: {
      x: 35,
      y: 72,
      lat: 6.36484,
      lng: 2.09637
    }
  },
  {
    id: 'porte-du-non-retour',
    name: 'La Porte du Non-Retour & Route des Esclaves',
    location: 'Plage de Ouidah, Atlantique, Bénin',
    category: 'Historical',
    image: commonsThumb('Porte du non-retour au Benin.jpg', 960),
    imageCredit: { file: 'Porte du non-retour au Benin.jpg', author: 'Borisghost', license: 'CC0' },
    description:
      'Monument dressé sur la plage de Ouidah au terme du chemin mémoriel, de la place aux enchères jusqu’à l’océan.',
    deepHistory:
      'La Porte du Non-Retour a été créée en 1995 dans le cadre du projet international « La Route de l’esclave » de l’UNESCO. Elle est l’œuvre de l’architecte Yves Ahouen-Gnimon, avec des bas-reliefs de Fortuné Bandeira, des bronzes de Dominique Kouas Gnonnou et des masques egungun sculptés par Yves Kpede. Le parcours réhabilité relie la Place aux enchères à la Porte, sur le tracé qu’empruntaient les captifs avant l’embarquement. Le site est fermé à la visite d’août 2020 à mars 2025 pour rénovation.',
    badges: ['Mémorial de la traite', 'Route de l’esclave (projet UNESCO)'],
    etiquette: [
      {
        title: 'Lieu de recueillement',
        description:
          'La plage est un mémorial : on n’y organise pas de séance photo festive ni de musique amplifiée.',
        icon: 'info'
      },
      {
        title: 'Confirmer l’ouverture',
        description:
          'Le monument est resté fermé de longues années pour travaux ; l’accès se vérifie avant le déplacement.',
        icon: 'photo_camera'
      }
    ],
    visualGuides: [
      {
        title: 'Esplanade côté océan',
        description: 'La Porte ouverte sur l’Atlantique, vers les navires ancrés au large.',
        image: commonsThumb('Ouidah-Esplanade de la Porte du Non-Retour-Côté océan (1).jpg', 640),
        credit: {
          file: 'Ouidah-Esplanade de la Porte du Non-Retour-Côté océan (1).jpg',
          author: 'Ji-Elle',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Esplanade côté route',
        description: 'Le fronton orné de bas-reliefs, du côté du chemin des captifs.',
        image: commonsThumb('Ouidah-Esplanade de la Porte du Non-Retour-Côté route (1).jpg', 640),
        credit: {
          file: 'Ouidah-Esplanade de la Porte du Non-Retour-Côté route (1).jpg',
          author: 'Ji-Elle',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Route de l’Esclave',
        meaning: 'Le parcours mémoriel balisé à Ouidah, de la place aux enchères à la plage.'
      },
      {
        term: 'Egungun',
        meaning: 'Masque et danse des ancêtres ; les figures de l’esplanade viennent de ce répertoire.'
      }
    ],
    coordinates: {
      x: 36,
      y: 85,
      lat: 6.32425,
      lng: 2.08958
    }
  },
  {
    id: 'palais-royaux-abomey',
    name: 'Palais Royaux d’Abomey',
    location: 'Abomey, Collines, Bénin',
    category: 'Historical',
    image: commonsThumb('Royal Palaces of Abomey-133469.jpg', 960),
    imageCredit: {
      file: 'Royal Palaces of Abomey-133469.jpg',
      author: 'Karalyn Monteil',
      license: 'CC BY-SA 3.0 IGO'
    },
    description:
      'Une même enceinte de pisé regroupant les palais successifs des rois du Dahomey, inscrite au patrimoine mondial.',
    deepHistory:
      'Douze souverains se sont succédé de 1625 à 1900, chacun faisant bâtir son palais dans la même enceinte de terre, à l’exception d’Akaba. Le site est inscrit au patrimoine mondial de l’UNESCO en 1985 sous le numéro 323, pour les critères (iii) et (iv) ; la superficie retenue passe de 44 à 47,6 hectares, avec une zone tampon de 181,4 hectares, et ses limites sont modifiées en 2007. Les bâtiments abritent un musée d’histoire où l’on voit les autels royaux et les tentures appliquées.',
    badges: ['Patrimoine mondial UNESCO (n° 323)', 'Musée d’histoire'],
    etiquette: [
      {
        title: 'Fragilité du bâti de terre',
        description: 'On ne touche pas les murs de pisé ni les décors, et on reste sur les circuits balisés.',
        icon: 'account_balance'
      },
      {
        title: 'Photographie selon les salles',
        description: 'Certaines salles interdisent le flash ; la question se pose aux gardiens du musée.',
        icon: 'no_photography'
      }
    ],
    visualGuides: [
      {
        title: 'Enceinte royale',
        description: 'Les cours successives bâties en terre autour des autels des rois.',
        image: commonsThumb('Royal Palaces of Abomey-133470.jpg', 640),
        credit: {
          file: 'Royal Palaces of Abomey-133470.jpg',
          author: 'Karalyn Monteil',
          license: 'CC BY-SA 3.0 IGO'
        }
      },
      {
        title: 'Bâti de terre',
        description: 'Murs, porches et décors modelés du complexe palatial.',
        image: commonsThumb('Royal Palaces of Abomey-133492.jpg', 640),
        credit: {
          file: 'Royal Palaces of Abomey-133492.jpg',
          author: 'Karalyn Monteil',
          license: 'CC BY-SA 3.0 IGO'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Dahomey',
        meaning: 'Le royaume fondé à Abomey au XVIIe siècle, dont la capitale était Abomey.'
      },
      {
        term: 'Gbêhanzin',
        meaning: 'Le nom du roi Béhanzin, rattaché à l’eau et au requin, emblème de sa résistance.'
      }
    ],
    coordinates: {
      x: 32,
      y: 42,
      lat: 7.18645,
      lng: 1.994003
    }
  },
  {
    id: 'cite-lacustre-ganvie',
    name: 'Cité Lacustre de Ganvié',
    location: 'Sô-Ava, lac Nokoué, Atlantique, Bénin',
    category: 'Nature',
    image: commonsThumb('Ganvie2.jpg', 960),
    imageCredit: { file: 'Ganvie2.jpg', author: 'Manu25', license: 'CC BY-SA 3.0' },
    description:
      'Village lacustre sur pilotis du lac Nokoué, où tout déplacement se fait en pirogue, du lever à la nuit.',
    deepHistory:
      'Ganvié est fondée au XVIIIe siècle par des Tofinu qui refusent les raids des royaumes voisins et trouvent refuge sur le lac Nokoué, hors de portée des marchands d’esclaves. L’habitat sur pilotis et la pêche lacustre en font l’un des plus grands villages lacustres d’Afrique : environ 40 000 personnes vivent à Ganvié et dans le voisin de Sô-Tchanhoué. Le lac Nokoué est alimenté par les fleuves Ouémé et Sô. Ganvié figure depuis 1996 sur la liste indicative de l’UNESCO, sans être inscrite au patrimoine mondial.',
    badges: ['Village lacustre', 'Liste indicative UNESCO (depuis 1996)'],
    etiquette: [
      {
        title: 'Demander avant de filmer les familles',
        description: 'Les maisons sont des domiciles : on ne pénètre pas sous les pilotis sans accord.',
        icon: 'no_photography'
      },
      {
        title: 'Ne rien jeter dans le lac',
        description: 'Le lac donne le poisson et sert d’eau de ménage ; les déchets y restent.',
        icon: 'swim'
      }
    ],
    visualGuides: [
      {
        title: 'Pirogues du lac',
        description: 'Les barques qui font office de taxi, de marché et d’école buissonnière.',
        image: commonsThumb(
          'Pirogue à voile ou pirogue à balancier de type béninois sur le fleuve de Ganvié 05.jpg',
          640
        ),
        credit: {
          file: 'Pirogue à voile ou pirogue à balancier de type béninois sur le fleuve de Ganvié 05.jpg',
          author: 'Adoscam',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Le retour des élèves',
        description: 'Les écoliers rentrent chez eux en pirogue, à la fin des classes.',
        image: commonsThumb('Les élèves rentrent chez eux en pirogue à Ganvié.jpg', 640),
        credit: {
          file: 'Les élèves rentrent chez eux en pirogue à Ganvié.jpg',
          author: 'Rachad sanoussi',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Tofinu',
        meaning: 'Le peuple du lac, fondateur de Ganvié.'
      },
      {
        term: 'Nokoué',
        meaning: 'Le lac où est bâtie la cité, alimenté par l’Ouémé et le Sô.'
      }
    ],
    coordinates: {
      x: 70,
      y: 58,
      lat: 6.467694,
      lng: 2.39125
    }
  },
  {
    id: 'mosquee-porto-novo',
    name: 'Grande Mosquée de Porto-Novo',
    location: 'Rue Victor Ballot, Porto-Novo, Ouémé, Bénin',
    category: 'Historical',
    image: commonsThumb('Grande Mosquee Porto-Novo Benin Joseph Herve Ahissou.jpg', 960),
    imageCredit: {
      file: 'Grande Mosquee Porto-Novo Benin Joseph Herve Ahissou.jpg',
      author: 'J. H. A. Gbetongninougbé',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Mosquée historique du centre de Porto-Novo, reconnaissable à sa coupole posée au-dessus de la rue Victor Ballot.',
    deepHistory:
      'La première mosquée de Porto-Novo est bâtie dans les années 1880 sur un terrain accordé par le roi Sodji, l’islam étant arrivé avec des marchands haoussa et yoruba venus du Nigeria voisin. L’édifice actuel, engagé vers 1910 et achevé en 1935, doit sa silhouette à une inspiration indirecte des églises de Salvador de Bahia, transmise par Lagos. Ce n’est pas une réalisation des Agudás, ces descendants de rapatriés catholiques revenus du Brésil, que l’on cite souvent à Porto-Novo. Le Palais Honmè, ancien palais royal converti en musée, est un autre site de la ville.',
    badges: ['Monument historique', 'Lieu de culte en activité'],
    etiquette: [
      {
        title: 'Tenue couvrante',
        description: 'Épaules et genoux couverts, et chaussures retirées là où le gardien le demande.',
        icon: 'footprint'
      },
      {
        title: 'Visiter hors des prières',
        description: 'La mosquée reste un lieu de prière : on attend la fin de l’office pour circuler.',
        icon: 'info'
      }
    ],
    visualGuides: [
      {
        title: 'Entrée de la mosquée',
        description: 'Le portail qui donne sur la rue Victor Ballot.',
        image: commonsThumb("Vue d'une entrée de la Grande mosquée de Porto-Novo au Bénin.jpg", 640),
        credit: {
          file: "Vue d'une entrée de la Grande mosquée de Porto-Novo au Bénin.jpg",
          author: 'Adoscam',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Façade et coupole',
        description: 'Les volumes qui ont fait la réputation du monument.',
        image: commonsThumb('Façade Grande Mosquée de Porto-Novo.jpg', 640),
        credit: {
          file: 'Façade Grande Mosquée de Porto-Novo.jpg',
          author: 'Gildaskiki',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Sodji',
        meaning: 'Le roi de Porto-Novo qui accorda l’emplacement de la première mosquée.'
      },
      {
        term: 'Agudá',
        meaning: 'Descendant d’Africains revenus du Brésil ; ce ne sont pas eux qui ont bâti cette mosquée.'
      }
    ],
    coordinates: {
      x: 82,
      y: 56,
      lat: 6.47174,
      lng: 2.62811
    }
  },
  {
    id: 'fondation-zinsou',
    name: 'Fondation Zinsou',
    location: 'Cotonou (LAB) & Ouidah (Villa Ajavon), Bénin',
    category: 'Arts',
    image: commonsThumb('Les lieux touristiques de Ouidah, Villa Ajavon.jpg', 960),
    imageCredit: {
      file: 'Les lieux touristiques de Ouidah, Villa Ajavon.jpg',
      author: 'Saliousoft',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Fondation d’art contemporain à deux visages : la galerie LAB à Cotonou et le musée de Ouidah, installé dans la Villa Ajavon.',
    deepHistory:
      'Créée en juin 2005 par Marie-Cécile Zinsou, avec Lionel Zinsou et Émile Derlin Zinsou, la fondation installe son musée à Ouidah dans la Villa Ajavon, une demeure de 1922 à l’architecture afro-brésilienne, puis ouvre le LAB, galerie d’art contemporain à Cotonou. Elle revendique plus de quatre millions de visiteurs en huit ans de programmation, dont 23 211 dès 2007. Les horaires, l’accès et la gratuité varient selon les expositions et se confirment auprès de la fondation.',
    badges: ['Art contemporain', 'Villa Ajavon (1922)'],
    etiquette: [
      {
        title: 'Confirmer le programme',
        description: 'Les expositions tournent et les deux sites n’ont pas les mêmes horaires.',
        icon: 'info'
      },
      {
        title: 'Photographie des œuvres',
        description: 'Elle dépend des artistes exposés : on demande à l’accueil avant de publier.',
        icon: 'photo_camera'
      }
    ],
    visualGuides: [
      {
        title: 'Villa Ajavon',
        description: 'La demeure de 1922 qui abrite le musée de Ouidah.',
        image: commonsThumb('Une vue de gauche de la Villa Ajavon 1922.jpg', 640),
        credit: {
          file: 'Une vue de gauche de la Villa Ajavon 1922.jpg',
          author: 'Rachad sanoussi',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Architecture afro-brésilienne',
        description: 'Les proportions de la villa, typiques du patrimoine return de la côte.',
        image: commonsThumb('Villa Ajavon de Ouidah 01.jpg', 640),
        credit: { file: 'Villa Ajavon de Ouidah 01.jpg', author: 'Gildaskiki', license: 'CC BY-SA 4.0' }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Ajavon',
        meaning: 'Le marchand dont la villa de 1922 a conservé le nom.'
      },
      {
        term: 'LAB',
        meaning: 'La galerie d’art contemporain de la fondation à Cotonou.'
      }
    ],
    coordinates: {
      x: 75,
      y: 65,
      lat: 6.36256,
      lng: 2.42069
    }
  },
  {
    id: 'place-amazone-cotonou',
    name: 'Esplanade des Amazones',
    location: '12e arrondissement, Cotonou, Littoral, Bénin',
    category: 'Historical',
    image: commonsThumb("Monument de l'amazone.jpg", 960),
    imageCredit: { file: "Monument de l'amazone.jpg", author: 'AKE Amazan', license: 'CC BY-SA 4.0' },
    description:
      'Place monumentale de Cotonou dominée par une amazone de bronze de trente mètres, entre le boulevard de la Marina et l’océan.',
    deepHistory:
      'L’Esplanade des Amazones est inaugurée le 30 juillet 2022 par le président Patrice Talon, au 12e arrondissement de Cotonou, entre le boulevard de la Marina et l’océan, face à la place de l’Indépendance et au palais présidentiel. Le Monument de l’Amazone, dû au sculpteur Li Xiangqun, est une structure métallique revêtue de bronze d’environ 30 mètres et 150 tonnes : la guerrière tient un fusil et un sabre, la tête levée. Il honore les femmes-soldats du royaume de Dahomey. Le monument de Bio Guéra, souvent confondu avec lui, est une œuvre différente érigée à Parakou.',
    badges: ['Monument public', 'Esplanade de la République'],
    etiquette: [
      {
        title: 'Traverser prudemment',
        description: 'L’esplanade borde le boulevard de la Marina, l’une des voies les plus chargées de Cotonou.',
        icon: 'directions_car'
      },
      {
        title: 'Monument commémoratif',
        description: 'Les cérémonies officielles y suspendent l’accès au pied de la statue.',
        icon: 'account_balance'
      }
    ],
    visualGuides: [
      {
        title: 'L’esplanade',
        description: 'La place ouverte entre l’océan et le boulevard.',
        image: commonsThumb(
          'Esplanade des Amazones, ville de Cotonou, département du Littoral au sud du Bénin 01.jpg',
          640
        ),
        credit: {
          file: 'Esplanade des Amazones, ville de Cotonou, département du Littoral au sud du Bénin 01.jpg',
          author: 'Saliousoft',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Place de l’Amazone',
        description: 'La statue vue de la place, lors des préparatifs de la fête de l’Indépendance.',
        image: commonsThumb(
          "Place de l'amazone aménagée pour la fête de l'indépendance au Bénin en 2023 03.jpg",
          640
        ),
        credit: {
          file: "Place de l'amazone aménagée pour la fête de l'indépendance au Bénin en 2023 03.jpg",
          author: 'Adoscam',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Amazone',
        meaning: 'Nom donné aux femmes-soldats du royaume de Dahomey.'
      },
      {
        term: 'Mino',
        meaning: '« Nos mères » : le nom fon et yoruba de ces femmes-soldats.'
      }
    ],
    coordinates: {
      x: 76,
      y: 66,
      lat: 6.3492,
      lng: 2.40756
    }
  },
  {
    id: 'sanctuaire-dassa-arigbo',
    name: 'Sanctuaire Marial d’Arigbo',
    location: 'Agbégbé, Dassa-Zoumé (Igbo Idaasha), Collines, Bénin',
    category: 'Spiritual',
    image: commonsThumb("Basilique Notre-Dame d'Arigbo.jpg", 960),
    imageCredit: { file: "Basilique Notre-Dame d'Arigbo.jpg", author: 'Élisabeth', license: 'CC0' },
    description:
      'Sanctuaire catholique perché sur une colline de Dassa-Zoumé, où une croix lumineuse veille sur le site du pèlerinage.',
    deepHistory:
      'Le pèlerinage d’Arigbo naît le 11 février 1954, en l’année mariale, après la découverte d’une statue de la Vierge : la première cérémonie est présidée par Mgr Louis Parisot, premier évêque du Dahomey, devant environ 6 000 personnes. Le développement du site est ensuite relancé sous Mgr Lucien Monsi-Agboka, évêque d’Abomey. Autour, Dassa-Zoumé — Igbo Idaasha — est une ville de collines, dont le point culminant atteint 465 mètres au mont Tangbé.',
    badges: ['Lieu de pèlerinage', 'Premier rassemblement en 1954'],
    etiquette: [
      {
        title: 'Respecter les célébrations',
        description: 'Aux heures de messe et de procession, la visite se fait en silence et sur les bas-côtés.',
        icon: 'volume_mute'
      },
      {
        title: 'Demander pour photographier',
        description: 'Les pèlerins en prière et les cierges ne se photographient pas sans accord.',
        icon: 'no_photography'
      }
    ],
    visualGuides: [
      {
        title: 'Grotte mariale',
        description: 'La grotte édifiée sur le site, lieu de dévotion du pèlerinage.',
        image: commonsThumb("Grotte mariale d'Arigbo 1.jpg", 640),
        credit: { file: "Grotte mariale d'Arigbo 1.jpg", author: 'Chedwiki', license: 'CC BY-SA 3.0' }
      },
      {
        title: 'Le parvis de la grotte',
        description: 'L’espace ouvert où se retrouvent les groupes de pèlerins.',
        image: commonsThumb("Grotte mariale d'Arigbo 3.jpg", 640),
        credit: { file: "Grotte mariale d'Arigbo 3.jpg", author: 'Chedwiki', license: 'CC BY-SA 3.0' }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Igbo Idaasha',
        meaning: 'Le nom local de Dassa-Zoumé, cité de collines au centre du Bénin.'
      },
      {
        term: 'Année mariale',
        meaning: 'L’année 1954, à l’origine du pèlerinage d’Arigbo.'
      }
    ],
    coordinates: {
      x: 45,
      y: 30,
      lat: 7.7757,
      lng: 2.18572
    }
  },
  {
    id: 'koutammakou-tata-somba',
    name: 'Koutammakou, pays des Tata Somba',
    location: 'Boukoumbé, Atakora, Bénin',
    category: 'Historical',
    image: commonsThumb('Tata somba, la maison traditionnelle à étage.jpg', 960),
    imageCredit: {
      file: 'Tata somba, la maison traditionnelle à étage.jpg',
      author: 'Justin ABADJAYE',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Maison-tour en terre à deux niveaux des Batammariba, le geste architectural qui a donné son paysage au Koutammakou.',
    deepHistory:
      'Le Koutammakou, pays des Batammariba — « ceux qui façonnent la terre » — est inscrit au patrimoine mondial de l’UNESCO sous la référence 1140 bis : inscrit en 2004 pour le Togo, le bien est étendu au Bénin avec des modifications de limites en 2023, pour les critères (v) et (vi), sur 271 826 hectares transfrontaliers. Les takienta (au pluriel siken), souvent appelées Tata Somba, sont des maisons-forteresses de terre battue : le rez-de-chaussée abrite les animaux, la cuisine et la réserve, tandis que l’étage, atteint par une échelle, reçoit les chambres et les greniers à mil. Côté béninois, le pays Batammariba s’étend dans l’Atakora, autour de Boukoumbé et de Cobly.',
    badges: ['Patrimoine mondial UNESCO (n° 1140 bis)', 'Paysage culturel vivant'],
    etiquette: [
      {
        title: 'On ne franchit pas le seuil',
        description: 'Les cases-tours sont des habitations et des greniers familiaux : la visite intérieure se demande.',
        icon: 'back_hand'
      },
      {
        title: 'Le village se visite accompagné',
        description: 'Un guide du village explique les toits, les silhouettes et les règles de circulation.',
        icon: 'groups'
      }
    ],
    visualGuides: [
      {
        title: 'Village de cases-tours',
        description: 'L’habitat dispersé des Batammariba sur la vallée de l’Ouémé.',
        image: commonsThumb('Tata-somba-Dorf.jpg', 640),
        credit: { file: 'Tata-somba-Dorf.jpg', author: 'Dominik Schwarz', license: 'CC BY-SA 3.0' }
      },
      {
        title: 'Otamari',
        description: 'La maison-tour vue de près : murs modelés, échelles et toits de terre.',
        image: commonsThumb('Tata somba otamari.jpg', 640),
        credit: { file: 'Tata somba otamari.jpg', author: 'Justin ABADJAYE', license: 'CC BY-SA 4.0' }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Batammariba',
        meaning: '« Ceux qui façonnent la terre » : le peuple du Koutammakou.'
      },
      {
        term: 'Takienta',
        meaning: 'La maison-tour Batammariba ; le pluriel est siken.'
      }
    ],
    coordinates: {
      x: 20,
      y: 12,
      lat: 10.18322,
      lng: 1.10005
    }
  },
  {
    id: 'pendjari-mare-sacree',
    name: 'Parc National de la Pendjari',
    location: 'Tanguiéta, Matéri et Kérou, Atakora & Borgou, Bénin',
    category: 'Nature',
    image: commonsThumb('Parc national de la Pendjari-Hippopotames à la Mare Sacrée (3).jpg', 960),
    imageCredit: {
      file: 'Parc national de la Pendjari-Hippopotames à la Mare Sacrée (3).jpg',
      author: 'Ji-Elle',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Grandes savanes de l’ouest béninois où la Mare Sacrée rassemble hippopotames et caïmans, aux portes du complexe W-Arly-Pendjari.',
    deepHistory:
      'Le territoire devient réserve de chasse partielle en 1954, réserve totale en 1955, zone cynégétique en 1959, puis parc national en 1961. Il est classé réserve de biosphère par l’UNESCO le 16 juin 1986, puis intégré en 2017 à l’extension du bien « W-Arly-Pendjari » inscrit au patrimoine mondial au Bénin, au Burkina Faso et au Niger ; la part béninoise du complexe couvre 965 901 hectares. La gestion est confiée au CENAGREF dans le cadre d’une gestion déléguée associant les villages riverains. La Mare Sacrée, dans la partie nord du parc, est un point d’eau emblématique.',
    badges: ['Parc national (1961)', 'Réserve de biosphère UNESCO', 'Patrimoine mondial W-Arly-Pendjari'],
    etiquette: [
      {
        title: 'Sortie avec un guide agréé',
        description: 'Le parc se visite avec un accompagnateur et un véhicule du poste d’accueil.',
        icon: 'groups'
      },
      {
        title: 'Ni nourriture ni rapprochement',
        description: 'On ne nourrit pas la faune et on reste à distance des hippopotames de la mare.',
        icon: 'info'
      }
    ],
    visualGuides: [
      {
        title: 'Baobab et échassiers',
        description: 'Les arbres-monuments et les oiseaux des mares du parc.',
        image: commonsThumb('Parc national de la Pendjari-Baobab et échassier.jpg', 640),
        credit: {
          file: 'Parc national de la Pendjari-Baobab et échassier.jpg',
          author: 'Ji-Elle',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Piste du parc',
        description: 'Les pistes de suivi animalier qui relient les postes du Pendjari.',
        image: commonsThumb('Parc national de la Pendjari-Route.jpg', 640),
        credit: {
          file: 'Parc national de la Pendjari-Route.jpg',
          author: 'Ji-Elle',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'CENAGREF',
        meaning: 'L’agence béninoise en charge de la gestion des aires protégées.'
      },
      {
        term: 'W-Arly-Pendjari',
        meaning: 'Le complexe d’aires protégées partagé par le Bénin, le Burkina Faso et le Niger.'
      }
    ],
    coordinates: {
      x: 22,
      y: 6,
      lat: 11.23294,
      lng: 1.49239
    }
  },
  {
    id: 'ketou-gelede',
    name: 'Kétou, Berceau du Gèlèdé',
    location: 'Kétou, Plateau, Bénin',
    category: 'Heritage',
    image: commonsThumb('Gèlèdé masked dancer, Kétou, Benin.jpg', 960),
    imageCredit: {
      file: 'Gèlèdé masked dancer, Kétou, Benin.jpg',
      author: 'Jonathanbwilson1',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Capitale de l’ancien royaume Kétu, où les masques Gèlèdé viennent danser pour les défunts et pour les mères.',
    deepHistory:
      'Le Gèlèdé est une expression dansée yoruba-nago qui honore Iyá Nlá, la mère primordiale, et le rôle des femmes dans la communauté. L’« héritage oral du Gelede » a été proclamé en 2001 chef-d’œuvre du patrimoine oral et immatériel de l’humanité, puis inscrit en 2008 sur la Liste représentative du patrimoine culturel immatériel, au titre d’une candidature commune du Bénin, du Nigéria et du Togo (élément n° 00002 de l’UNESCO). Kétou est tenu pour le berceau de cette tradition. Les masques sortent surtout à la fin des récoltes, ainsi qu’à l’occasion des naissances, des mariages et des deuils, ou lorsque la communauté traverse une sécheresse ou une épidémie ; la danse est portée par des chants en yoruba et un orchestre de quatre tambours.',
    badges: ['Patrimoine culturel immatériel UNESCO', 'Royaume Kétu', 'Masques vivants'],
    etiquette: [
      {
        title: 'Demander avant de photographier',
        description: 'Le masque est une présence rituelle : l’accord se demande avant de le photographier de face.',
        icon: 'no_photography'
      },
      {
        title: 'Rester dans le cercle des spectateurs',
        description: 'L’espace de danse est délimité ; le franchir interrompt la cérémonie.',
        icon: 'groups'
      }
    ],
    visualGuides: [
      {
        title: 'Guèlèdè Efè',
        description: 'Un masque vu de profil : raphia, étoffe peinte et parure de perles.',
        image: commonsThumb('Guèlèdè Efè.jpg', 640),
        credit: {
          file: 'Guèlèdè Efè.jpg',
          author: 'Frederic ademola',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Portrait d’un chef de Kétou (1900)',
        description: 'Coiffure et colliers qui marquaient l’autorité du chef au début de la période coloniale.',
        image: commonsThumb('Chef de Kétou (1900).jpg', 480),
        credit: {
          file: 'Chef de Kétou (1900).jpg',
          author: 'Jean Baptiste Joseph Marie Pascal Fonssagrives',
          license: 'Domaine public'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Gèlèdé',
        meaning: 'Masque de raphia et d’étoffe peinte qui incarne l’ancêtre et honore la mère primordiale.'
      },
      {
        term: 'Kétu',
        meaning: 'Le royaume dont Kétou fut la capitale, apparenté aux lignages yoruba de l’est.'
      },
      {
        term: 'Iyá Nlá',
        meaning: '« La grande mère » : la puissance maternelle que le Gèlèdé vient honorer.'
      }
    ],
    coordinates: {
      x: 80,
      y: 40,
      lat: 7.358056,
      lng: 2.6075
    }
  },
  {
    id: 'dantokpa-marche-fetiche',
    name: 'Marché Dantokpa',
    location: 'Boulevard Saint-Michel, 4e arrondissement, Cotonou, Littoral, Bénin',
    category: 'Food',
    image: commonsThumb('Vue panoramique marché Dantokpa au Bénin1.jpg', 960),
    imageCredit: {
      file: 'Vue panoramique marché Dantokpa au Bénin1.jpg',
      author: 'Adoscam',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Le grand marché de Cotonou, tenu pour le plus vaste marché à ciel ouvert d’Afrique de l’Ouest : vivriers, tissus, poissons fumés — et, tout près, un autel consacré au serpent Dan.',
    deepHistory:
      'Le nom signifie « sur les bords de la lagune de Dan » : Dan est le serpent de la prospérité, et un autel fétiche toujours debout au cœur du marché rappelle ce vocable. Le marché est édifié en 1963 sur 12 hectares ; sa surface atteint 18,7 hectares en 2010. La halle principale mesure 66 mètres sur 44 et compte trois niveaux pour 1 100 places ; la gestion en est confiée à la SOGEMA. Un seul incendie majeur lui est documenté : celui de la nuit du 30 au 31 octobre 2015, le plus grave depuis 1963, sans victime et imputé à un camion-citerne de kpayo.',
    badges: ['Halle de 1963', '18,7 hectares', 'Géré par la SOGEMA'],
    etiquette: [
      {
        title: 'Demander avant de photographier',
        description: 'Marchandes et objets rituels ne se photographient pas sans l’accord des personnes.',
        icon: 'photo_camera'
      },
      {
        title: 'Rester à distance des autels',
        description: 'Les espaces consacrés du marché s’observent : on n’y touche pas, on n’en prélève rien.',
        icon: 'info'
      }
    ],
    visualGuides: [
      {
        title: 'La passerelle des condiments',
        description: 'Les marchandes d’épices installées sur la passerelle du marché.',
        image: commonsThumb('VENDEUSE DE CONDIMENTS SUR LA PASSERELLE MARCHE DANTOKPA-COTONOU BENIN.jpg', 640),
        credit: {
          file: 'VENDEUSE DE CONDIMENTS SUR LA PASSERELLE MARCHE DANTOKPA-COTONOU BENIN.jpg',
          author: 'Adoscam',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'Arrivage en pirogue',
        description: 'Les marchandises débarquées sur les berges de la lagune.',
        image: commonsThumb('Pirogue déchargeant marchandises pour marché dantokpa à Cotonou Bénin.jpg', 640),
        credit: {
          file: 'Pirogue déchargeant marchandises pour marché dantokpa à Cotonou Bénin.jpg',
          author: 'Adoscam',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Dantokpa',
        meaning: '« Sur les bords de la lagune de Dan » : Dan désigne le serpent de prospérité.'
      },
      {
        term: 'Kpayo',
        meaning: 'Essence artisanale raffinée en ville, citée comme cause probable de l’incendie de 2015.'
      },
      {
        term: 'SOGEMA',
        meaning: 'La société chargée de la gestion du marché.'
      }
    ],
    coordinates: {
      x: 78,
      y: 62,
      lat: 6.37271,
      lng: 2.43351
    }
  },
  {
    id: 'lac-aheme',
    name: 'Lac Ahémé',
    location: 'Comè et Grand-Popo, Mono, Bénin',
    category: 'Nature',
    image: commonsThumb('LE LAC AHEME AU BENIN en 2018.jpg', 960),
    imageCredit: {
      file: 'LE LAC AHEME AU BENIN en 2018.jpg',
      author: 'Adoscam',
      license: 'CC BY-SA 4.0'
    },
    description:
      'Un lac allongé du pays Mono, alimenté par le Couffo et bordé par la réserve communautaire de la Bouche du Roy.',
    deepHistory:
      'Le lac s’étend sur environ 78 km², jusqu’à une centaine de kilomètres carrés en saison des pluies. Le Couffo, qui le traverse avant de rejoindre le Mono, en est le principal apport d’eau ; il se déverse vers l’océan par le Tinyiemè, l’Aho et le Mahémé, puis par la lagune de Grand-Popo. Les plates-formes de pêche sur pilotis dites acadja y sont caractéristiques, mais leur usage recule à mesure que le lac s’envase. Une partie des berges relève de la réserve de biosphère transfrontalière du Mono : la communauté de gestion de la Bouche du Roy protège depuis 2016 un territoire de 9 678 hectares réparti entre les arrondissements d’Avloh et de Gbéhoué (Grand-Popo) et celui d’Agatogbo (Comè).',
    badges: ['Zone humide du Mono', 'Bouche du Roy', 'Réserve de biosphère transfrontalière du Mono'],
    etiquette: [
      {
        title: 'Embarquer aux points d’accueil',
        description: 'La traversée se fait depuis les rivages des villages riverains, avec un passeur du lac.',
        icon: 'sailing'
      },
      {
        title: 'Ne rien prélever dans la réserve',
        description: 'La Bouche du Roy est une aire protégée : on observe, on n’emporte ni plante ni animal.',
        icon: 'forest'
      }
    ],
    visualGuides: [
      {
        title: 'Pirogues du lac',
        description: 'Les pirogues amarrées en bordure, à la saison des basses eaux.',
        image: commonsThumb('Pirogues garées en bordure du Lac Ahémé..jpg', 640),
        credit: {
          file: 'Pirogues garées en bordure du Lac Ahémé..jpg',
          author: 'Magnificat.229',
          license: 'CC BY-SA 4.0'
        }
      },
      {
        title: 'La Bouche du Roy',
        description: 'Le cordon lagunaire et les eaux de la réserve communautaire.',
        image: commonsThumb('Bouche du Roi in Grand Popo Benin.jpg', 640),
        credit: {
          file: 'Bouche du Roi in Grand Popo Benin.jpg',
          author: 'Kulttuurinavigaattori',
          license: 'CC BY-SA 4.0'
        }
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Ahémé',
        meaning: 'Le lac allongé du pays Mono, entre Comè et Grand-Popo.'
      },
      {
        term: 'Couffo',
        meaning: 'La rivière qui alimente le lac avant de rejoindre le Mono.'
      },
      {
        term: 'Acadja',
        meaning: 'Plate-forme de pêche sur pilotis, qui recule à mesure que le lac s’envase.'
      }
    ],
    coordinates: {
      x: 30,
      y: 76,
      lat: 6.49791,
      lng: 1.979
    }
  }
];
