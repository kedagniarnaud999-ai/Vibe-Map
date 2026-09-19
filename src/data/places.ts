import { Place } from '../types';

export const PLACES_DATA: Place[] = [
  {
    id: 'temple-des-pythons',
    name: 'Temple des Pythons',
    location: 'Ouidah, Atlantique, Bénin',
    category: 'Spiritual',
    distanceKm: 1.2,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
    description: 'Sanctuaire tutélaire de la divinité Dangbé où les pythons royaux circulent en totale liberté dans la cour sacrée.',
    deepHistory: 'Érigé au XVIIIe siècle face à la basilique de l’Immaculée Conception de Ouidah, le Temple des Pythons commémore la protection divine accordée au roi Kpassè lors des guerres régionales. Le python royal (Python regius), symbole d’abondance, de sagesse et de fertilité, n’est jamais chassé : il est nourri et honoré par la communauté des initiés.',
    badges: ['Haut-Lieu Vodun', 'Guides Traditionnels Certifiés', 'Monuments Historiques'],
    etiquette: [
      {
        title: 'Demander la permission avant de photographier',
        description: 'Ne photographiez pas l’intérieur du sanctuaire secret sans l’accord express du prêtre gardien.',
        icon: 'no_photography'
      },
      {
        title: 'Retirer chaussures et lunettes sombres',
        description: 'Le seuil des espaces de prière requiert le respect pieds nus et le regard découvert.',
        icon: 'footprint'
      }
    ],
    audioGuide: {
      title: 'L’Alliance de Dangbé et du Roi Kpassè',
      narrator: 'Dah Agbodjan, Dignitaire et Gardien de Ouidah',
      duration: '5:40',
      durationSeconds: 340
    },
    visualGuides: [
      {
        title: 'Pythons Royaux Sacrés',
        description: 'Inoffensifs pour l’homme, ils sont manipulés avec douceur et bénédiction par les visiteurs consentants.',
        image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=800'
      },
      {
        title: 'Autel Sacré des Libations',
        description: 'Point central où se pratiquent les rituels d’apaisement avec huile de palme et eau de source.',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['koffi-agbodjan'],
    vocabulary: [
      {
        term: 'Dangbé',
        phonetic: '/dan-gbeh/',
        meaning: 'Le serpent python sacré, symbole de continuité vitale et d’harmonie cosmique.'
      },
      {
        term: 'Kou do agbé',
        phonetic: '/kou doh ah-gbeh/',
        meaning: 'Salutation sacrée de respect : Que la vie et la paix soient avec vous.'
      }
    ],
    coordinates: {
      x: 38,
      y: 68,
      lat: 6.3622,
      lng: 2.0864
    }
  },
  {
    id: 'foret-sacree-kpasse',
    name: 'Forêt Sacrée de Kpassè Zoun',
    location: 'Ouidah Centre, Bénin',
    category: 'Nature',
    distanceKm: 0.8,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    description: 'Bocage sacré pluriséculaire abritant l’Iroko mystique où le roi fondateur Kpassè se serait métamorphosé.',
    deepHistory: 'Au XIVe siècle, pour échapper aux envahisseurs, le roi fondateur de Ouidah Kpassè disparut dans cette forêt et se changea en Iroko géant. La forêt conserve des arbres géants centenaires, un couvent d’initiés et de majestueuses sculptures contemporaines en ciment et bois taillé représentant les divinités Panthéon Vodun (Lègba, Héviosso, Sakpata, Mami Wata).',
    badges: ['Patrimoine Naturel & Spirituel', 'Sanctuaire Écologique'],
    etiquette: [
      {
        title: 'Parler à voix basse',
        description: 'Les arbres ancestraux et les esprits gardiens écoutent : la quiétude est de rigueur.',
        icon: 'volume_mute'
      },
      {
        title: 'Ne pas quitter les sentiers balisés',
        description: 'Les sous-bois marqués d’étoffes blanches et de feuilles de raphia sont strictement réservés aux rites.',
        icon: 'forest'
      }
    ],
    audioGuide: {
      title: 'L’Iroko et la métamorphose royale',
      narrator: 'Baba Ousmane, Médiateur en Forêt Sacrée',
      duration: '4:15',
      durationSeconds: 255
    },
    visualGuides: [
      {
        title: 'L’Iroko Fondateur',
        description: 'Arbre protecteur de plus de 400 ans enveloppé de pagnes immaculés.',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['koffi-agbodjan'],
    vocabulary: [
      {
        term: 'Lokotin',
        phonetic: '/lo-ko-tine/',
        meaning: 'L’arbre Iroko (Chlorophora excelsa), réceptacle de la force vitale des ancêtres.'
      }
    ],
    coordinates: {
      x: 35,
      y: 72,
      lat: 6.3578,
      lng: 2.0812
    }
  },
  {
    id: 'porte-du-non-retour',
    name: 'La Porte du Non-Retour & Route des Esclaves',
    location: 'Plage de Djègbadji, Ouidah, Bénin',
    category: 'Historical',
    distanceKm: 4.5,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800',
    description: 'Monument mémoriel national marquant l’embarquement des captifs africains vers les Amériques et les Caraïbes.',
    deepHistory: 'Conçu en 1995 dans le cadre du projet UNESCO "La Route de l’Esclave", ce haut monument de bronze et de béton de l’architecte Yves Ahouen-Gnimon clôture le parcours initiatique et douloureux de 4 km débutant au Fort Portugais São João Baptista de Ajudá, passant par l’Arbre de l’Oubli, la Case Zomaï et le Mémorial de Zoungbodji.',
    badges: ['Mémoire Mondiale UNESCO', 'Lieu de Pèlerinage International'],
    etiquette: [
      {
        title: 'Recueillement et dignité',
        description: 'Ce site est un mémorial solennel à la mémoire de millions d’ancêtres déportés.',
        icon: 'info'
      }
    ],
    audioGuide: {
      title: 'Le Chant des Déportés de l’Atlantique',
      narrator: 'Dr. Sylvain Kpanlingan, Historien',
      duration: '7:30',
      durationSeconds: 450
    },
    visualGuides: [
      {
        title: 'Frises en Bas-Relief de Bronze',
        description: 'Fresques de Fortuné Bandeira représentant les cohortes enchaînées marchant vers l’Océan.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['koffi-agbodjan', 'dr-sylvain-kpanlingan'],
    vocabulary: [
      {
        term: 'Zomaï',
        phonetic: '/zoh-mah-yee/',
        meaning: 'Là où la lumière ne pénètre point : les cases d’obscurité où étaient parqués les captifs.'
      },
      {
        term: 'Agonve',
        phonetic: '/ah-gon-veh/',
        meaning: 'L’Arbre de l’Oubli autour duquel les déportés devaient tourner pour effacer leurs souvenirs.'
      }
    ],
    coordinates: {
      x: 36,
      y: 85,
      lat: 6.3312,
      lng: 2.0888
    }
  },
  {
    id: 'palais-royaux-abomey',
    name: 'Palais Royaux d’Abomey (UNESCO)',
    location: 'Abomey, Zou, Bénin',
    category: 'Historical',
    distanceKm: 110,
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=800',
    description: 'Enceinte impériale fortifiée des 12 souverains du puissant Royaume du Dahomey avec trônes en crânes et bas-reliefs royaux.',
    deepHistory: 'Classé au Patrimoine Mondial de l’UNESCO depuis 1985, le site s’étend sur 44 hectares et témoigne du génie architectural, militaire et diplomatique du Dahomey de 1625 à 1900 (des rois Houégbadja, Agadja, Tegbessou, Ghézo, Glèlè au roi résistant Béhanzin). Les murs en pisé intègrent des bas-reliefs polychromes uniques illustrant proverbes, victoires et armoiries.',
    badges: ['Patrimoine Mondial UNESCO', 'Cité des Amazones Agojié'],
    etiquette: [
      {
        title: 'Respect absolu des cours royales et sépulcres',
        description: 'Interdiction formelle de s’asseoir sur les estrades royales ou de toucher les parois historiques.',
        icon: 'account_balance'
      }
    ],
    audioGuide: {
      title: 'L’Épopée du Roi Béhanzin et des Amazones Agojié',
      narrator: 'Pr. Sylvain Kpanlingan, Descendant des Griots Royaux',
      duration: '9:15',
      durationSeconds: 555
    },
    visualGuides: [
      {
        title: 'Bas-Reliefs Royaux en Argile',
        description: 'Sculptures murales originales figurant la jarre percée du roi Ghézo et le requin de Béhanzin.',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['dr-sylvain-kpanlingan'],
    vocabulary: [
      {
        term: 'Agojié',
        phonetic: '/ah-goh-jee-eh/',
        meaning: 'Le régiment d’élite des guerrières femmes (Amazones du Dahomey) dévouées au Roi.'
      },
      {
        term: 'Nondichao',
        phonetic: '/non-dee-chah-oh/',
        meaning: 'La jarre percée du roi Ghézo : si chaque fils bouche un trou de son doigt, l’eau restera dans la jarre.'
      }
    ],
    coordinates: {
      x: 32,
      y: 42,
      lat: 7.1856,
      lng: 1.9912
    }
  },
  {
    id: 'cite-lacustre-ganvie',
    name: 'Cité Lacustre de Ganvié',
    location: 'Lac Nokoué, Sô-Ava, Atlantique, Bénin',
    category: 'Nature',
    distanceKm: 28,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    description: 'La plus grande cité sur pilotis d’Afrique, vieille de 400 ans, abritant 40 000 habitants sur les eaux du lac Nokoué.',
    deepHistory: 'Fondée au XVIIe siècle par le peuple Tofinu pour échapper aux razzias esclavagistes (les croyances religieuses des ravisseurs leur interdisant d’attaquer sur l’eau), Ganvié signifie "Nous avons trouvé le salut". Toute la vie s’y déroule sur l’eau : marché flottant, maisons en bambou sur pilotis d’acacia, école et pirogues familiales.',
    badges: ['Venise de l’Afrique', 'Site Culturel Vivant'],
    etiquette: [
      {
        title: 'Demander l’autorisation aux vendeuses du marché flottant',
        description: 'Saluez les habitantes avant toute prise de vue et privilégiez les échanges bienveillants.',
        icon: 'photo_camera'
      }
    ],
    audioGuide: {
      title: 'Le Chant des Piroguiers du Lac Nokoué',
      narrator: 'Capitaine Basile Toviho, Barquier de Ganvié',
      duration: '5:10',
      durationSeconds: 310
    },
    visualGuides: [
      {
        title: 'Marché Flottant Matinal',
        description: 'Les femmes vendent poissons pêchés dans les Acadjas, maïs et ignames directement de pirogue à pirogue.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['basile-toviho'],
    vocabulary: [
      {
        term: 'Gan-vié',
        phonetic: '/gahn-vee-eh/',
        meaning: 'Traduction littérale Tofinu : "La collectivité est sauvée / Nous avons survécu".'
      },
      {
        term: 'Acadja',
        phonetic: '/ah-cah-jah/',
        meaning: 'Parc à poissons écologique fait de branchages immergés créant un biotope naturel riche.'
      }
    ],
    coordinates: {
      x: 70,
      y: 58,
      lat: 6.4667,
      lng: 2.4167
    }
  },
  {
    id: 'mosquee-porto-novo',
    name: 'Grande Mosquée Afro-Brésilienne & Musée Honmè',
    location: 'Porto-Novo (Hogbonou), Ouémé, Bénin',
    category: 'Historical',
    distanceKm: 32,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    description: 'Chef-d’œuvre d’architecture baroque luso-brésilienne érigé par les Agudas (anciens esclaves affranchis revenus du Brésil).',
    deepHistory: 'Construite entre 1912 et 1925, la Grande Mosquée de Porto-Novo est inspirée des cathédrales baroques de Salvador de Bahia, symbole de la réappropriation architecturale des Agudas. À quelques minutes se trouve le Palais Honmè, résidence historique du Roi Toffa Ier ayant signé le traité avec la France.',
    badges: ['Architecture Afro-Brésilienne', 'Capitale Historique'],
    etiquette: [
      {
        title: 'Tenue décente requise',
        description: 'Épaules et jambes couvertes pour la visite des abords et cours historiques de Porto-Novo.',
        icon: 'info'
      }
    ],
    audioGuide: {
      title: 'L’Héritage des Agudas et le Palais du Roi Toffa',
      narrator: 'Maman Solange Dossou, Maîtresse Teinturière',
      duration: '6:00',
      durationSeconds: 360
    },
    visualGuides: [
      {
        title: 'Façade Polyptique Baroque',
        description: 'Corniches moulurées peintes aux couleurs ocres et pistaches avec arcs en plein cintre.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['maman-solange'],
    vocabulary: [
      {
        term: 'Aguda',
        phonetic: '/ah-goo-dah/',
        meaning: 'Descendants des Afro-Brésiliens réinstallés au Golfe de Guinée au XIXe siècle.'
      },
      {
        term: 'Hogbonou',
        phonetic: '/hog-boh-noo/',
        meaning: 'Nom traditionnel et authentique en langue Goun de la ville de Porto-Novo.'
      }
    ],
    coordinates: {
      x: 82,
      y: 56,
      lat: 6.4969,
      lng: 2.6289
    }
  },
  {
    id: 'fondation-zinsou',
    name: 'Fondation Zinsou d’Art Contemporain',
    location: 'Cotonou & Ouidah, Bénin',
    category: 'Arts',
    distanceKm: 35,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    description: 'Pôle muséal majeur d’Afrique de l’Ouest gratuit pour tous, valorisant artistes plasticiens et photographes du continent.',
    deepHistory: 'Fondée en 2005 par Marie-Cécile Zinsou, cette institution rayonne à Cotonou et dans la sublime villa coloniale de Ouidah. Elle a accueilli plus de 6 millions de visiteurs et fait dialoguer les créations contemporaines avec les trésors royaux restitués.',
    badges: ['Entrée 100% Gratuite', 'Art Contemporain Africain'],
    etiquette: [
      {
        title: 'Photographies sans flash bienvenues',
        description: 'Le partage et la diffusion des œuvres d’artistes béninois et africains sont activement encouragés.',
        icon: 'photo_camera'
      }
    ],
    audioGuide: {
      title: 'Renaissance Plastique et Trésors Royaux',
      narrator: 'Nathalie Sossa, Conservatrice adjointe',
      duration: '4:45',
      durationSeconds: 285
    },
    visualGuides: [
      {
        title: 'Tapisseries & Kanvô Contemporain',
        description: 'Œuvres monumentales mêlant tissage royal traditionnel Kanvô et toiles textiles contemporaines.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['nathalie-sossa'],
    vocabulary: [
      {
        term: 'Kanvô',
        phonetic: '/kan-voh/',
        meaning: 'Tissu traditionnel béninois tissé à la main, autrefois réservé à la parure des rois et dignitaires.'
      }
    ],
    coordinates: {
      x: 75,
      y: 65,
      lat: 6.3677,
      lng: 2.4333
    }
  },
  {
    id: 'place-amazone-cotonou',
    name: 'Esplanade de l’Amazone & Monument Bio Guéra',
    location: 'Boulevard de la Marina, Cotonou, Bénin',
    category: 'Historical',
    distanceKm: 34,
    image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&q=80&w=800',
    description: 'Statue monumentale en bronze de 30 mètres rendant hommage à la bravoure légendaire des guerrières Agojié.',
    deepHistory: 'Inaugurée en 2022 face à l’Océan Atlantique et au Palais de la Présidence de la République, cette statue majestueuse réalisée en bronze célèbre le courage patriotique des femmes guerrières du Dahomey et l’héroïsme de la nation béninoise.',
    badges: ['Symbole National', 'Vue Océane'],
    etiquette: [
      {
        title: 'Espace public de fierté républicaine',
        description: 'Accès libre jour et nuit, idéal au coucher du soleil pour les promenades citoyennes.',
        icon: 'info'
      }
    ],
    audioGuide: {
      title: 'L’Hymne aux Combattantes de la Liberté',
      narrator: 'Dah Agbodjan, Historien',
      duration: '3:50',
      durationSeconds: 230
    },
    visualGuides: [
      {
        title: 'Statue Géante en Bronze',
        description: 'La guerrière représentée tenant sa lance avec fierté et détermination face au large.',
        image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['nathalie-sossa', 'koffi-agbodjan'],
    vocabulary: [
      {
        term: 'Agojié',
        phonetic: '/ah-goh-jee-eh/',
        meaning: 'Les soldates du régiment féminin royal, surnommées Minon ("Nos Mères") par le peuple.'
      }
    ],
    coordinates: {
      x: 76,
      y: 66,
      lat: 6.3572,
      lng: 2.4278
    }
  },
  {
    id: 'sanctuaire-dassa-arigbo',
    name: 'Sanctuaire Marial d’Arigbo & Les 41 Collines',
    location: 'Dassa-Zoumè, Collines, Bénin',
    category: 'Spiritual',
    distanceKm: 180,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    description: 'Haut lieu de pèlerinage catholique niché au creux d’une grotte granitique sacrée au cœur des 41 collines de Dassa.',
    deepHistory: 'Depuis 1954, cette grotte naturelle au pied des monts granitiques est le plus grand sanctuaire de pèlerinage marial d’Afrique subsaharienne. Le site réalise un syncrétisme pacifique avec les divinités protectrices locales des collines d’Idatcha.',
    badges: ['Pèlerinage International', 'Paysage Géologique Remarquable'],
    etiquette: [
      {
        title: 'Silence et recueillement dans la grotte',
        description: 'Prière continue des pèlerins : préservez la sérénité des lieux.',
        icon: 'volume_mute'
      }
    ],
    audioGuide: {
      title: 'Mystères des 41 Collines et Grotte d’Arigbo',
      narrator: 'Père Jean-Baptiste, Recteur du Sanctuaire',
      duration: '5:15',
      durationSeconds: 315
    },
    visualGuides: [
      {
        title: 'Grotte Mariale Naturelle',
        description: 'Cavité rocheuse millénaire abritant la statue de la Vierge sous les dômes de granit.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['dr-sylvain-kpanlingan'],
    vocabulary: [
      {
        term: 'Idatcha',
        phonetic: '/ee-dah-chah/',
        meaning: 'Peuple autochtone des collines de Dassa réputé pour sa tolérance religieuse.'
      }
    ],
    coordinates: {
      x: 45,
      y: 30,
      lat: 7.7500,
      lng: 2.1833
    }
  },
  {
    id: 'koutammakou-tata-somba',
    name: 'Pays Batammariba & Châteaux Tata Somba (UNESCO)',
    location: 'Boukoumbé & Natitingou, Atacora, Bénin',
    category: 'Historical',
    distanceKm: 520,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    description: 'Châteaux-forts miniatures en terre à deux étages, chefs-d’œuvre d’architecture défensive et cosmique.',
    deepHistory: 'Inscrit au Patrimoine Mondial de l’UNESCO, le pays Batammariba ("ceux qui sont les vrais bâtisseurs de la terre") abrite les Tata Somba : forteresses d’argile où le bétail dort au rez-de-chaussée, la famille habite au premier et les greniers sacrés couronnent la terrasse sous les étoiles.',
    badges: ['Patrimoine Mondial UNESCO', 'Architecture Vivante'],
    etiquette: [
      {
        title: 'Demander la bénédiction du chef de famille avant d’entrer',
        description: 'La porte d’entrée du Tata est toujours orientée vers l’ouest et protégée par des autels tutélaires.',
        icon: 'account_balance'
      }
    ],
    audioGuide: {
      title: 'Cosmologie et Bâtisseurs de Tata Somba',
      narrator: 'N’Dah Kouagou, Maître Bâtisseur Batammariba',
      duration: '8:20',
      durationSeconds: 500
    },
    visualGuides: [
      {
        title: 'Greniers Coniques Sacrés',
        description: 'Tourelles de séchage coiffées de paille tressée protégeant le sorgho et le mil.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'
      }
    ],
    verifiedGuideIds: ['dr-sylvain-kpanlingan'],
    vocabulary: [
      {
        term: 'Takyienta',
        phonetic: '/tah-kee-yen-tah/',
        meaning: 'Le nom authentique en langue Ditammari désignant la maison-forteresse à étage Tata.'
      }
    ],
    coordinates: {
      x: 20,
      y: 12,
      lat: 10.1742,
      lng: 1.3789
    }
  },
  {
    id: 'pendjari-mare-sacree',
    name: 'Parc National de la Pendjari & Mare Sacrée',
    location: 'Matéri & Touga, Atacora, Bénin',
    category: 'Nature',
    distanceKm: 650,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Parc_national_de_la_Pendjari-Hippopotames_%C3%A0_la_Mare_Sacr%C3%A9e_%283%29.jpg/1280px-Parc_national_de_la_Pendjari-Hippopotames_%C3%A0_la_Mare_Sacr%C3%A9e_%283%29.jpg',
    description: 'Savane inondable où les hippopotames de la Mare Sacrée cohabitent avec les éléphants et les buffles de la vallée.',
    deepHistory: 'Créé en 1961, le parc protège près de deux mille kilomètres carrés de mosaïque soudano-sahélienne et forme, avec l’Arly et le W, l’un des plus vastes complexes protégés d’Afrique de l’Ouest. Les villages riverains gardent les « zanga », boisés sacrés où la chasse est interdite depuis les serments des chefs de terre.',
    badges: ['Réserve de Biosphère', 'Complexe W-Arly-Pendjari', 'Observer Sans Approcher'],
    etiquette: [
      {
        title: 'Ne jamais sortir du véhicule sans l’écogarde',
        description: 'Les pistes ne sont pas balisées hors saison sèche et la faune circule librement.',
        icon: 'directions_car'
      },
      {
        title: 'Aucun feu ni plastique laissé',
        description: 'La savane brûle vite en saison sèche : emportez vos déchets jusqu’à Matéri.',
        icon: 'local_fire_department'
      }
    ],
    audioGuide: {
      title: 'Les Hippopotames de la Mare Sacrée',
      narrator: 'Écogarde du Parc National de la Pendjari',
      duration: '6:10',
      durationSeconds: 370
    },
    visualGuides: [
      {
        title: 'Troupeaux de la Mare Sacrée',
        description: 'Les troupeaux se déplacent entre les mares permanentes au rythme de la décrue.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Parc_national_de_la_Pendjari-Hippopotames_%C3%A0_la_Mare_Sacr%C3%A9e_%284%29.jpg/1280px-Parc_national_de_la_Pendjari-Hippopotames_%C3%A0_la_Mare_Sacr%C3%A9e_%284%29.jpg'
      }
    ],
    verifiedGuideIds: [],
    vocabulary: [
      {
        term: 'Zanga',
        phonetic: '/dzan-ga/',
        meaning: 'Boisé sacré mis en défens par serment : la chasse et la coupe y sont interdites.'
      },
      {
        term: 'Tounga',
        phonetic: '/toun-ga/',
        meaning: 'Mare permanente de la vallée, point d’eau qui concentre la faune en saison sèche.'
      }
    ],
    coordinates: {
      x: 22,
      y: 6,
      lat: 10.4500,
      lng: 1.7200
    }
  },
  {
    id: 'ketou-gelede',
    name: 'Kétou, Berceau du Gèlèdé',
    location: 'Kétou, Plateau, Bénin',
    category: 'Historical',
    distanceKm: 120,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/G%C3%A8l%C3%A8d%C3%A9_masked_dancer%2C_K%C3%A9tou%2C_Benin.jpg/1280px-G%C3%A8l%C3%A8d%C3%A9_masked_dancer%2C_K%C3%A9tou%2C_Benin.jpg',
    description: 'Capitale de l’ancien royaume Kétu, où les masques Gèlèdé viennent danser les défunts et apaiser les mères.',
    deepHistory: 'Kétou se veut plus ancienne que le Dahomey et garde la mémoire de la dynastie Ajassé. Le Gèlèdé, masque de raphia et de tissu peint dansé par les sociétés féminines Gunukpégan et Guenehounsa, est inscrit au patrimoine culturel immatériel de l’humanité pour le Bénin : il honore les ancêtres et répare les torts faits aux femmes.',
    badges: ['Patrimoine Immatériel UNESCO', 'Ville Historique', 'Masques Vivants'],
    etiquette: [
      {
        title: 'Ne pas photographier le masque de face sans accord',
        description: 'Le Gèlèdé est un esprit en danse : la demande se fait auprès du chef de la société.',
        icon: 'no_photography'
      },
      {
        title: 'Rester dans le cercle des spectateurs',
        description: 'L’espace de danse est délimité ; le franchir interrompt le rituel.',
        icon: 'groups'
      }
    ],
    audioGuide: {
      title: 'Pourquoi les Masques Dansent pour les Mères',
      narrator: 'Conservateur des traditions du royaume Kétu',
      duration: '7:05',
      durationSeconds: 425
    },
    visualGuides: [
      {
        title: 'Portrait d’un Chef de Kétou (1900)',
        description: 'Coiffure et colliers de perles qui marquent l’autorité de la dynastie Ajassé.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Chef_de_K%C3%A9tou_%281900%29.jpg'
      }
    ],
    verifiedGuideIds: ['dr-sylvain-kpanlingan'],
    vocabulary: [
      {
        term: 'Gèlèdé',
        phonetic: '/ghe-leh-deh/',
        meaning: 'Masque de raphia et d’étoffe peinte qui incarne l’ancêtre revenu danser parmi les siens.'
      },
      {
        term: 'Kétu',
        phonetic: '/keh-tou/',
        meaning: 'Le royaume dont Kétou fut la capitale, parent des lignages yoruba de l’est.'
      }
    ],
    coordinates: {
      x: 80,
      y: 40,
      lat: 7.2600,
      lng: 2.6200
    }
  },
  {
    id: 'dantokpa-marche-fetiche',
    name: 'Marché Dantokpa & son Espace Fétiche',
    location: 'Cotonou, Littoral, Bénin',
    category: 'Spiritual',
    distanceKm: 3,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue_panoramique_march%C3%A9_Dantokpa_au_B%C3%A9nin1.jpg/1280px-Vue_panoramique_march%C3%A9_Dantokpa_au_B%C3%A9nin1.jpg',
    description: 'Immense marché populaire de Cotonou où la pharmacopée vodun se vend au grand jour, entre féticheurs et marchandes.',
    deepHistory: 'Détruit par deux incendies, reconstruit et agrandi sur les berges de la lagune, Dantokpa est l’un des plus grands marchés d’Afrique de l’Ouest. Son espace fétiche rassemble herboristes, marchands d’asen et de gris-gris, et préparateurs de « bokono » : là on consulte autant qu’on achète, et ce qui est préparé pour un client ne se marchande pas.',
    badges: ['Marché Historique', 'Pharmacopée Vodun', 'Économie Informelle'],
    etiquette: [
      {
        title: 'Demander avant toute photo d’un autel',
        description: 'Photographier un fétiche en cours de préparation est une offense, pas un souvenir.',
        icon: 'no_photography'
      },
      {
        title: 'Ne pas toucher aux préparations',
        description: 'Les produits de la pharmacopée sont manipulés par le vendeur seul.',
        icon: 'back_hand'
      }
    ],
    audioGuide: {
      title: 'Ce que Vend le Marché Fétiche',
      narrator: 'Maman du marché, Dantokpa',
      duration: '5:25',
      durationSeconds: 325
    },
    visualGuides: [
      {
        title: 'Passerelle des Marchandes',
        description: 'Étalages de condiments et de tissus suspendus sur la passerelle du marché.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/VENDEUSE_DE_CONDIMENTS_SUR_LA_PASSERELLE_MARCHE_DANTOKPA-COTONOU_BENIN.jpg/1280px-VENDEUSE_DE_CONDIMENTS_SUR_LA_PASSERELLE_MARCHE_DANTOKPA-COTONOU_BENIN.jpg'
      }
    ],
    verifiedGuideIds: ['maman-solange'],
    vocabulary: [
      {
        term: 'Bokono',
        phonetic: '/bo-ko-no/',
        meaning: 'Préparation rituelle et pharmacopée vendues dans l’espace fétiche du marché.'
      },
      {
        term: 'Asen',
        phonetic: '/ah-sen/',
        meaning: 'Autel-mémoire de terre ou de métal érigé pour un défunt et entretenu par sa famille.'
      }
    ],
    coordinates: {
      x: 78,
      y: 62,
      lat: 6.3615,
      lng: 2.4290
    }
  },
  {
    id: 'lac-aheme-gansu',
    name: 'Lac Ahémé & Village Sur Pilotis de Gansu',
    location: 'Comè & Avrankou, Mono, Bénin',
    category: 'Nature',
    distanceKm: 65,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/LE_LAC_AHEME_AU_BENIN_en_2018.jpg',
    description: 'Lagune d’eau douce de quatre-vingts kilomètres carrés, bordée de villages de pêcheurs Tofinu et de la forêt sacrée d’Agamè.',
    deepHistory: 'Le lac Ahémé vit au rythme des crues de la rivière Sô et de son chenal vers l’océan. Les Tofinu, longtemps réquisitionnés comme esclaves par leurs voisins, ont bâti leur sécurité sur l’eau : cases sur pilotis, greniers sur pieux et pirogues à perche. Les masques des sociétés Eglegan et Kokozia continuent d’y parcourir les rives.',
    badges: ['Écotourisme Communautaire', 'Réserves de Pêche', 'Hippopotames'],
    etiquette: [
      {
        title: 'Gilets et brassières fournis par la coopérative',
        description: 'La navigation se fait avec les piroguiers agréés de Comè et de Djègbèkpodji.',
        icon: 'sailing'
      },
      {
        title: 'Pas de baignade près des zones de pêche',
        description: 'Les filets et les nasses sont tendus sous l’eau, invisibles depuis la surface.',
        icon: 'swim'
      }
    ],
    audioGuide: {
      title: 'Gens de l’Eau du Lac Ahémé',
      narrator: 'Capitaine Basile Toviho, Piroguier Émérite',
      duration: '6:40',
      durationSeconds: 400
    },
    visualGuides: [
      {
        title: 'Pirogues au Rivage',
        description: 'Les pirogues à perche sont amarrées devant les cases, prêtes pour la pêche du matin.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Pirogues_gar%C3%A9es_en_bordure_du_Lac_Ah%C3%A9m%C3%A9..jpg/1280px-Pirogues_gar%C3%A9es_en_bordure_du_Lac_Ah%C3%A9m%C3%A9..jpg'
      }
    ],
    verifiedGuideIds: ['basile-toviho'],
    vocabulary: [
      {
        term: 'Kpamela',
        phonetic: '/kpa-me-la/',
        meaning: 'La pirogue creusée dans un tronc unique, moyen de transport des villages du lac.'
      },
      {
        term: 'Ganvié',
        phonetic: '/gan-vie/',
        meaning: '« Nous sommes trouvés » en Tofinu : la mémoire d’un peuple refuge, comme sur l’Ahémé.'
      }
    ],
    coordinates: {
      x: 30,
      y: 76,
      lat: 6.6300,
      lng: 1.9900
    }
  }
];
