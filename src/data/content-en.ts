/**
 * Variantes anglaises du corpus editorial. Le francais de `src/data` reste la
 * source de verite : ces tables ne remplacent que les champs de texte a
 * l'affichage, champ par champ et par id. Les noms propres, les termes en
 * langue nationale (`vocabulary.term`) et les credits photo ne se traduisent
 * pas. Une entree incomplete est rejetee au profit du francais, jamais melangee.
 */

export interface PairContentEn {
  title: string;
  description: string;
}

export interface PlaceContentEn {
  description: string;
  deepHistory?: string;
  badges: string[];
  etiquette: PairContentEn[];
  visualGuides: PairContentEn[];
  /** `term` reste tel quel : c'est le mot national, seul le sens est traduit. */
  vocabulary: { term: string; meaning: string }[];
}

export interface StoryContentEn {
  title: string;
  subtitle: string;
  introduction: string;
  secondParagraph: string;
  authorTitle: string;
  symbolsTitle?: string;
  symbolsDescription?: string;
  symbols: { title: string; meaning: string }[];
  quote?: string;
  conclusion?: string;
  workshopCta?: PairContentEn;
  relatedStories: { title: string }[];
}

export interface ActorContentEn {
  role: string;
  badgeTitle?: string;
  quote?: string;
  bio?: string;
  languages?: string[];
  expertise: PairContentEn[];
}

export interface EventContentEn {
  title: string;
  date: string;
  location: string;
  accessType: string;
  description: string;
}

export const PLACE_CONTENT_EN: Record<string, PlaceContentEn> = {
  'temple-des-pythons': {
    description: 'A sanctuary dedicated to Dangbé, the royal python.',
    deepHistory:
      'The cult of the royal python (Python regius) has been documented in Ouidah since the late 17th century. The animal is regarded as sacred there: it is not killed, moves freely within the compound and is returned to safety when it crosses a road. The temple stands in the Dangbé Xwé neighbourhood, opposite Ouidah’s Basilica of the Immaculate Conception. Visits are conducted with the site’s caretakers, and a contribution is requested to photograph the snakes.',
    badges: ['Active Vodun sanctuary'],
    etiquette: [
      {
        title: 'Ask before taking photographs',
        description:
          'The caretakers’ permission is required inside the compound and for any photograph taken with a python.'
      },
      {
        title: 'Do not handle the pythons',
        description: 'Observe the animal without moving it; only a caretaker may handle it.'
      }
    ],
    visualGuides: [
      {
        title: 'Sacred enclosure',
        description: 'The temple courtyard where the pythons move freely.'
      },
      {
        title: 'Sacred jar',
        description: 'One of the ritual vessels placed within the compound.'
      }
    ],
    vocabulary: [
      { term: 'Dangbé', meaning: 'The royal python, regarded as sacred in Ouidah.' },
      {
        term: 'Vodun',
        meaning: 'The spiritual forces and deities honoured in sanctuaries in southern Benin.'
      }
    ]
  },
  'foret-sacree-kpasse': {
    description:
      'A sacred grove now reduced to a few hectares, where a millennium-old iroko is venerated amid contemporary works.',
    deepHistory:
      'Kpassè was the second ruler of Savi and the founder of the kingdom of Hueda in the mid-17th century. To escape his enemies, he is said to have taken refuge in this grove and transformed into an iroko (Milicia excelsa), the tree the forest still honours. Originally around thirty hectares, only a few remain. It is protected as one of Benin’s classified sacred forests (joint ministerial order of 2012 and decree No. 2017-331). Wooden and cement sculptures line the paths.',
    badges: ['Classified sacred forest', 'Spiritual heritage'],
    etiquette: [
      {
        title: 'Speak in low voices',
        description:
          'The forest is an active place of worship: services and libations still take place there.'
      },
      {
        title: 'Do not pick anything',
        description: 'Bark, tied cloths and roots belong to the keepers of the forest.'
      }
    ],
    visualGuides: [
      {
        title: 'Entrance gateway',
        description: 'The monumental entrance to the forest, on the road to Tovè.'
      },
      {
        title: 'The white champions',
        description: 'White sculptures raised along the paths.'
      }
    ],
    vocabulary: [
      { term: 'Kpassè', meaning: 'The ruler of Savi to whom the forest is dedicated.' },
      {
        term: 'Iroko',
        meaning: 'Milicia excelsa, a monumental tree often held sacred in southern Benin.'
      }
    ]
  },
  'porte-du-non-retour': {
    description:
      'Monument raised on Ouidah beach at the end of the memorial path, from the auction square to the ocean.',
    deepHistory:
      'The Door of No Return was created in 1995 under UNESCO’s international project “The Route of Slaves”. It is the work of architect Yves Ahouen-Gnimon, with bas-reliefs by Fortuné Bandeira, bronzes by Dominique Kouas Gnonnou and egungun masks carved by Yves Kpede. The renovated trail links the Auction Square to the Door, along the route captives took before being loaded onto ships. The site was closed to visitors from August 2020 to March 2025 for renovation.',
    badges: ['Memorial to the slave trade', 'Route of Slaves (UNESCO project)'],
    etiquette: [
      {
        title: 'Place of remembrance',
        description:
          'The beach is a memorial: no festive photo shoots or amplified music are held there.'
      },
      {
        title: 'Check that the site is open',
        description:
          'The monument remained closed for years due to works; access must be verified before travelling.'
      }
    ],
    visualGuides: [
      {
        title: 'Ocean-side esplanade',
        description: 'The Door open onto the Atlantic, toward the ships anchored offshore.'
      },
      {
        title: 'Road-side esplanade',
        description: 'The pediment decorated with bas-reliefs, on the captives’ path side.'
      }
    ],
    vocabulary: [
      {
        term: 'Route de l’Esclave',
        meaning: 'The memorial route marked in Ouidah, from the auction square to the beach.'
      },
      {
        term: 'Egungun',
        meaning: 'Ancestor mask and dance; the figures on the esplanade come from this repertoire.'
      }
    ]
  },
  'palais-royaux-abomey': {
    description:
      'A single earthen enclosure grouping the successive palaces of the kings of Dahomey, inscribed on the World Heritage List.',
    deepHistory:
      'Twelve rulers reigned in succession from 1625 to 1900, each having his palace built within the same earthen enclosure, with the exception of Akaba. The site was inscribed on the UNESCO World Heritage List in 1985 under number 323, under criteria (iii) and (iv); the property grew from 44 to 47.6 hectares, with a 181.4-hectare buffer zone, and its boundaries were modified in 2007. The buildings host a history museum where royal altars and applied tapestries can be seen.',
    badges: ['UNESCO World Heritage (No. 323)', 'History museum'],
    etiquette: [
      {
        title: 'Fragile earthen structure',
        description:
          'Do not touch the rammed-earth walls or the decorations, and stay on the marked routes.'
      },
      {
        title: 'Photography varies by room',
        description: 'Some rooms forbid flash; ask the museum’s keepers.'
      }
    ],
    visualGuides: [
      {
        title: 'Royal enclosure',
        description: 'The successive courtyards built of earth around the kings’ altars.'
      },
      {
        title: 'Earthen structure',
        description: 'Walls, porches and shaped decorations of the palace complex.'
      }
    ],
    vocabulary: [
      {
        term: 'Dahomey',
        meaning: 'The kingdom founded at Abomey in the 17th century, with Abomey as its capital.'
      },
      {
        term: 'Gbêhanzin',
        meaning: 'King Behanzin’s name, tied to water and the shark, emblem of his resistance.'
      }
    ]
  },
  'cite-lacustre-ganvie': {
    description:
      'A stilt village on Lake Nokoué, where every trip is made by pirogue, from dawn to nightfall.',
    deepHistory:
      'Ganvié was founded in the 18th century by Tofinu who refused raids from neighbouring kingdoms and found refuge on Lake Nokoué, out of reach of slave traders. Stilt housing and lake fishing make it one of the largest lake villages in Africa: about 40,000 people live in Ganvié and nearby Sô-Tchanhoué. Lake Nokoué is fed by the Ouémé and Sô rivers. Ganvié has been on UNESCO’s tentative list since 1996, without being inscribed on the World Heritage List.',
    badges: ['Lake village', 'UNESCO tentative list (since 1996)'],
    etiquette: [
      {
        title: 'Ask before filming families',
        description: 'Homes are dwellings: do not pass beneath the stilts without permission.'
      },
      {
        title: 'Do not throw anything into the lake',
        description: 'The lake provides fish and household water; waste stays there.'
      }
    ],
    visualGuides: [
      {
        title: 'Lake pirogues',
        description: 'The canoes that act as taxi, market and playground.'
      },
      {
        title: 'Pupils heading home',
        description: 'Schoolchildren return home by pirogue at the end of class.'
      }
    ],
    vocabulary: [
      { term: 'Tofinu', meaning: 'The lake people, founders of Ganvié.' },
      {
        term: 'Nokoué',
        meaning: 'The lake where the city is built, fed by the Ouémé and the Sô.'
      }
    ]
  },
  'mosquee-porto-novo': {
    description:
      'Historic mosque in central Porto-Novo, recognisable by its dome rising above Rue Victor Ballot.',
    deepHistory:
      'The first mosque of Porto-Novo was built in the 1880s on land granted by King Sodji; Islam arrived with Hausa and Yoruba traders from neighbouring Nigeria. The present building, begun around 1910 and completed in 1935, owes its silhouette to an indirect inspiration from the churches of Salvador de Bahia, relayed through Lagos. It is not the work of the Agudás — the descendants of Catholic returnees from Brazil often cited in Porto-Novo. The Honmè Palace, a former royal palace turned museum, is another site in the city.',
    badges: ['Historic monument', 'Active place of worship'],
    etiquette: [
      {
        title: 'Covered dress',
        description: 'Shoulders and knees covered, and shoes removed where the keeper asks.'
      },
      {
        title: 'Visit outside prayer times',
        description: 'The mosque remains a place of prayer: wait for the service to end before moving around.'
      }
    ],
    visualGuides: [
      {
        title: 'Mosque entrance',
        description: 'The gateway opening onto Rue Victor Ballot.'
      },
      {
        title: 'Façade and dome',
        description: 'The volumes that made the monument famous.'
      }
    ],
    vocabulary: [
      {
        term: 'Sodji',
        meaning: 'The king of Porto-Novo who granted the site of the first mosque.'
      },
      {
        term: 'Agudá',
        meaning: 'Descendant of Africans who returned from Brazil; they did not build this mosque.'
      }
    ]
  },
  'fondation-zinsou': {
    description:
      'A contemporary art foundation with two faces: the LAB gallery in Cotonou and the Ouidah museum, housed in Villa Ajavon.',
    deepHistory:
      'Founded in June 2005 by Marie-Cécile Zinsou with Lionel Zinsou and Émile Derlin Zinsou, the foundation placed its museum in Ouidah inside Villa Ajavon, an Afro-Brazilian house from 1922, then opened LAB, a contemporary art gallery in Cotonou. It reports over four million visitors in eight years of programming, including 23,211 in 2007. Opening hours, access and free entry vary with the exhibitions and must be confirmed with the foundation.',
    badges: ['Contemporary art', 'Villa Ajavon (1922)'],
    etiquette: [
      {
        title: 'Confirm the programme',
        description: 'Exhibitions rotate and the two sites do not share the same hours.'
      },
      {
        title: 'Photographing works',
        description: 'It depends on the exhibited artists: ask at the desk before publishing.'
      }
    ],
    visualGuides: [
      {
        title: 'Villa Ajavon',
        description: 'The 1922 house that hosts the Ouidah museum.'
      },
      {
        title: 'Afro-Brazilian architecture',
        description: 'The proportions of the villa, typical of the coast’s return heritage.'
      }
    ],
    vocabulary: [
      { term: 'Ajavon', meaning: 'The trader whose 1922 villa still bears the name.' },
      { term: 'LAB', meaning: 'The foundation’s contemporary art gallery in Cotonou.' }
    ]
  },
  'place-amazone-cotonou': {
    description:
      'A monumental square in Cotonou overlooked by a thirty-metre bronze Amazon, between the Boulevard de la Marina and the ocean.',
    deepHistory:
      'The Amazone Esplanade was inaugurated on 30 July 2022 by President Patrice Talon, in Cotonou’s 12th arrondissement, between the Boulevard de la Marina and the ocean, facing Independence Square and the presidential palace. The Amazone Monument, by sculptor Li Xiangqun, is a steel structure clad in bronze, about 30 metres tall and 150 tonnes: the warrior holds a rifle and a saber, head raised. It honours the woman-soldiers of the kingdom of Dahomey. The Bio Guéra monument, often confused with it, is a different work raised in Parakou.',
    badges: ['Public monument', 'Republic esplanade'],
    etiquette: [
      {
        title: 'Cross with care',
        description:
          'The esplanade borders the Boulevard de la Marina, one of Cotonou’s busiest roads.'
      },
      {
        title: 'Commemorative monument',
        description: 'Official ceremonies close off access to the statue’s base.'
      }
    ],
    visualGuides: [
      {
        title: 'The esplanade',
        description: 'The open square between the ocean and the boulevard.'
      },
      {
        title: 'Amazone Square',
        description: 'The statue seen from the square, during preparations for Independence Day.'
      }
    ],
    vocabulary: [
      { term: 'Amazone', meaning: 'The name given to the woman-soldiers of the kingdom of Dahomey.' },
      {
        term: 'Mino',
        meaning: '“Our mothers”: the Fon and Yoruba name for these woman-soldiers.'
      }
    ]
  },
  'sanctuaire-dassa-arigbo': {
    description:
      'A Catholic sanctuary set on a hill in Dassa-Zoumé, where a lit cross watches over the pilgrimage site.',
    deepHistory:
      'The Arigbo pilgrimage was born on 11 February 1954, in the Marian year, after the discovery of a statue of the Virgin; the first ceremony was presided over by Bishop Louis Parisot, first bishop of Dahomey, before about 6,000 people. Development of the site resumed under Bishop Lucien Monsi-Agboka of Abomey. Around it, Dassa-Zoumé — Igbo Idaasha — is a town of hills, whose highest point reaches 465 metres on Mount Tangbé.',
    badges: ['Pilgrimage site', 'First gathering in 1954'],
    etiquette: [
      {
        title: 'Respect the services',
        description: 'At mass and procession hours, visit in silence and from the aisles.'
      },
      {
        title: 'Ask before photographing',
        description: 'Pilgrims at prayer and votive candles are not photographed without permission.'
      }
    ],
    visualGuides: [
      {
        title: 'Marian grotto',
        description: 'The grotto built on the site, place of devotion for the pilgrimage.'
      },
      {
        title: 'Grotto forecourt',
        description: 'The open space where pilgrimage groups gather.'
      }
    ],
    vocabulary: [
      {
        term: 'Igbo Idaasha',
        meaning: 'The local name of Dassa-Zoumé, a hill town in central Benin.'
      },
      {
        term: 'Année mariale',
        meaning: 'The year 1954, at the origin of the Arigbo pilgrimage.'
      }
    ]
  },
  'koutammakou-tata-somba': {
    description:
      'A two-storey earthen tower-house of the Batammariba, the architectural gesture that gave Koutammakou its landscape.',
    deepHistory:
      'Koutammakou, land of the Batammariba — “those who shape the earth” — is on the UNESCO World Heritage List under reference 1140 bis: inscribed in 2004 for Togo, the property was extended to Benin with boundary changes in 2023, under criteria (v) and (vi), over 271,826 hectares shared across the two countries. The takienta (plural siken), often called Tata Somba, are earthen fortified houses: the ground floor houses the animals, kitchen and granary, while the upper floor, reached by a ladder, holds the bedrooms and millet granaries. On the Benin side, the Batammariba country stretches in the Atakora around Boukoumbé and Cobly.',
    badges: ['UNESCO World Heritage (No. 1140 bis)', 'Living cultural landscape'],
    etiquette: [
      {
        title: 'Do not cross the threshold',
        description:
          'The tower-houses are dwellings and family granaries: ask permission before entering.'
      },
      {
        title: 'The village is visited with a guide',
        description: 'A village guide explains the roofs, silhouettes and rules for moving about.'
      }
    ],
    visualGuides: [
      {
        title: 'Village of tower-houses',
        description: 'The scattered Batammariba habitat over the Ouémé valley.'
      },
      {
        title: 'Otamari',
        description: 'The tower-house close up: shaped walls, ladders and earthen roofs.'
      }
    ],
    vocabulary: [
      {
        term: 'Batammariba',
        meaning: '“Those who shape the earth”: the people of Koutammakou.'
      },
      {
        term: 'Takienta',
        meaning: 'The Batammariba tower-house; the plural is siken.'
      }
    ]
  },
  'pendjari-mare-sacree': {
    description:
      'Wide savannas of western Benin where the Sacred Pool gathers hippos and caïmans, at the gate of the W-Arly-Pendjari complex.',
    deepHistory:
      'The area became a partial hunting reserve in 1954, a total reserve in 1955, a cyngetic zone in 1959, then a national park in 1961. It was classified as an UNESCO biosphere reserve on 16 June 1986, then included in 2017 in the extension of the “W-Arly-Pendjari” property inscribed on the World Heritage List in Benin, Burkina Faso and Niger; the Benin share covers 965,901 hectares. Management is entrusted to CENAGREF under a delegated management scheme involving surrounding villages. The Sacred Pool, in the northern part of the park, is an emblematic water point.',
    badges: [
      'National park (1961)',
      'UNESCO biosphere reserve',
      'W-Arly-Pendjari World Heritage'
    ],
    etiquette: [
      {
        title: 'Go out with a licensed guide',
        description: 'The park is visited with an escort and a vehicle from the reception post.'
      },
      {
        title: 'No feeding, no approach',
        description: 'Wildlife is not fed and hippos must be kept at a distance from the pool.'
      }
    ],
    visualGuides: [
      {
        title: 'Baobab and wading birds',
        description: 'The monumental trees and birds of the park’s pools.'
      },
      {
        title: 'Park trail',
        description: 'Game-tracking trails connecting the posts of Pendjari.'
      }
    ],
    vocabulary: [
      {
        term: 'CENAGREF',
        meaning: 'The Benin agency in charge of managing protected areas.'
      },
      {
        term: 'W-Arly-Pendjari',
        meaning: 'The protected-area complex shared by Benin, Burkina Faso and Niger.'
      }
    ]
  },
  'ketou-gelede': {
    description:
      'Capital of the old Kétu kingdom, where Gèlèdé masks dance for the departed and for mothers.',
    deepHistory:
      'Gèlèdé is a Yoruba-Nago danced expression honouring Iyá Nlá, the primordial mother, and the role of women in the community. The “oral heritage of Gelede” was proclaimed in 2001 a masterpiece of the oral and intangible heritage of humanity, then inscribed in 2008 on the Representative List of the Intangible Cultural Heritage of Humanity, as a joint nomination of Benin, Nigeria and Togo (UNESCO element No. 00002). Kétou is held to be the cradle of this tradition. Masks come out mostly after the harvest, as well as for births, marriages and mourning, or when the community is hit by drought or epidemic; the dance is carried by Yoruba songs and an orchestra of four drums.',
    badges: ['UNESCO intangible cultural heritage', 'Kétu kingdom', 'Living masks'],
    etiquette: [
      {
        title: 'Ask before photographing',
        description:
          'The mask is a ritual presence: ask permission before photographing it head-on.'
      },
      {
        title: 'Stay in the audience circle',
        description: 'The dancing space is marked out; crossing it breaks the ceremony.'
      }
    ],
    visualGuides: [
      {
        title: 'Guèlèdè Efè',
        description: 'A mask seen in profile: raffia, painted cloth and a beaded ornament.'
      },
      {
        title: 'Portrait of a chief of Kétou (1900)',
        description:
          'Hairstyle and necklaces that marked the chief’s authority at the start of the colonial period.'
      }
    ],
    vocabulary: [
      {
        term: 'Gèlèdé',
        meaning:
          'Raffia and painted-cloth mask embodying the ancestor and honouring the primordial mother.'
      },
      {
        term: 'Kétu',
        meaning: 'The kingdom whose capital was Kétou, related to the Yoruba lineages of the east.'
      },
      {
        term: 'Iyá Nlá',
        meaning: '“The great mother”: the maternal power Gèlèdé comes to honour.'
      }
    ]
  },
  'dantokpa-marche-fetiche': {
    description:
      'The great market of Cotonou, considered the largest open-air market in West Africa: staple foods, cloth, smoked fish — and nearby, an altar to the serpent Dan.',
    deepHistory:
      'The name means “on the banks of the Dan lagoon”: Dan is the serpent of prosperity, and a fetish altar still standing at the heart of the market recalls that word. The market was built in 1963 on 12 hectares; its surface reached 18.7 hectares by 2010. The main hall measures 66 by 44 metres and has three levels for 1,100 stalls; management is entrusted to SOGEMA. A single major fire is documented: that of the night of 30–31 October 2015, the worst since 1963, with no casualties and attributed to a kpayo tanker truck.',
    badges: ['1963 hall', '18.7 hectares', 'Managed by SOGEMA'],
    etiquette: [
      {
        title: 'Ask before photographing',
        description: 'Traders and ritual objects are not photographed without the persons’ consent.'
      },
      {
        title: 'Keep your distance from altars',
        description: 'The consecrated spaces of the market are for observation: do not touch or take anything.'
      }
    ],
    visualGuides: [
      {
        title: 'The spice footbridge',
        description: 'The spice sellers set up on the market’s footbridge.'
      },
      {
        title: 'Arrival by pirogue',
        description: 'Goods landed on the banks of the lagoon.'
      }
    ],
    vocabulary: [
      {
        term: 'Dantokpa',
        meaning: '“On the banks of the lagoon of Dan”: Dan is the serpent of prosperity.'
      },
      {
        term: 'Kpayo',
        meaning: 'Locally refined fuel cited as the likely cause of the 2015 fire.'
      },
      { term: 'SOGEMA', meaning: 'The company in charge of managing the market.' }
    ]
  },
  'lac-aheme': {
    description:
      'A long lake in the Mono country, fed by the Couffo and bordered by the Bouche du Roy community reserve.',
    deepHistory:
      'The lake stretches over about 78 km², up to around a hundred square kilometres in the rainy season. The Couffo, which crosses it before joining the Mono, is its main inflow; it drains to the ocean through the Tinyiemè, the Aho and the Mahémé, then through the Grand-Popo lagoon. The stilt fishing platforms called acadja are characteristic, but their use retreats as the lake silts up. Part of the shore belongs to the Mono transboundary biosphere reserve: since 2016 the Bouche du Roy management community has protected a 9,678-hectare territory spread across the Avloh and Gbéhoué arrondissements (Grand-Popo) and that of Agatogbo (Comè).',
    badges: [
      'Mono wetland',
      'Bouche du Roy',
      'Mono transboundary biosphere reserve'
    ],
    etiquette: [
      {
        title: 'Board at reception points',
        description: 'The crossing is made from the shores of the lakeside villages, with a local ferryman.'
      },
      {
        title: 'Take nothing from the reserve',
        description:
          'Bouche du Roy is a protected area: observe, do not remove plants or animals.'
      }
    ],
    visualGuides: [
      {
        title: 'Lake pirogues',
        description: 'Pirogues moored along the shore at low-water season.'
      },
      {
        title: 'Bouche du Roy',
        description: 'The lagoon strip and waters of the community reserve.'
      }
    ],
    vocabulary: [
      { term: 'Ahémé', meaning: 'The long lake of the Mono country, between Comè and Grand-Popo.' },
      { term: 'Couffo', meaning: 'The river feeding the lake before it joins the Mono.' },
      {
        term: 'Acadja',
        meaning: 'Stilt fishing platform, whose use recedes as the lake silts up.'
      }
    ]
  }
};

export const STORY_CONTENT_EN: Record<string, StoryContentEn> = {
  'fon-applique-textiles': {
    title: 'The applied textiles of Abomey, a stitched history',
    subtitle:
      'Royal emblems, conquests and court proverbs: what the Fon applied cloths tell.',
    introduction:
      'In Abomey, a figure cut from cloth and sewn onto a light ground is not a mere ornament. Every motif committed to a hanging refers to a king, a victory or a court proverb: the Fon applied textile is a record, and it is read in a set order.',
    secondParagraph:
      'The technique is stitched, not woven. Pieces of brightly coloured cotton are applied to the ground and then topstitched with thread; the outline stays crisp because the topstitching hides the cut. Abomey workshops still produce these hangings, for family ceremonies as well as for collectors, and the market sells them to visitors.',
    authorTitle: 'Documented narrative, public sources',
    symbolsTitle: 'Decoding the emblems',
    symbolsDescription:
      'The emblems below are those the reigns left at Abomey, in cloth as in bas-relief. Royal attributions are those most often retained by the museographic literature: they inform a reading, they do not close a debate. Tap an emblem to read its meaning.',
    symbols: [
      {
        title: 'The lion',
        meaning:
          'Emblem retained for the reign of Glèlè (1858-1889): force assumed and primacy over the kingdom. A half-man, half-lion statue, now held at the Musée du quai Branly, is associated with him.'
      },
      {
        title: 'The shark',
        meaning:
          'Emblem associated with Gbèhanzin (1889-1894), the king who faced the French advance in 1890 and again in 1892-1894. Deported to Martinique and then to Algeria, he died in Blida in 1906.'
      },
      {
        title: 'The chameleon',
        meaning:
          'Emblem that the Abomey tradition links to king Akaba, whose historical reality is debated: a slow, careful animal, which changes colour with the ground yet still reaches its goal.'
      },
      {
        title: 'The crossed blades',
        meaning:
          'Figure of military victory and of the defence of the kingdom, present in the décor of the royal palaces of Abomey.'
      }
    ],
    conclusion:
      'The historical museum of Abomey, set up inside the royal palaces, keeps thrones, carved doors and applied hangings; the site has been on the World Heritage list since 1985. In the town centre, the workshops keep stitching: an applied cloth can be seen being mounted piece by piece, provided one asks before photographing work in progress.',
    workshopCta: {
      title: 'Preparing a visit to Abomey',
      description:
        'Official addresses to check the museum’s opening hours, learn the conditions of access to the workshops, and be directed towards recognised guidance.'
    },
    relatedStories: [
      { title: 'Vodun: forces, ancestors, a balance' },
      { title: 'Voices of the griots: memory sung' }
    ]
  },
  'vodun-foundations': {
    title: 'Vodun: forces, ancestors, a balance',
    subtitle:
      'What the word vodun means in southern Benin, and what a visitor risks by forgetting it.',
    introduction:
      'In Fon, vodun designates a force, a power capable of acting on the world of the living. In southern Benin, vodun is not a surviving folklore: it organises lineages, festival calendars, taboos and precise obligations toward the ancestors and toward certain places — a stump, a river, a village square.',
    secondParagraph:
      'The cosmology most commonly put forward places Mawu-Lisa upstream, a double principle in which Mawu, the moon, carries night, cold and softness, and Lisa, the sun, day and heat. Legba opens the paths: without him, it is said, no prayer reaches the other vodun. Zangbeto, presented as the guardian of the night, sweeps the streets of Porto-Novo and Godomey under a costume of fibres — in this image, his appearance hides the dancer and lets only the bramble be seen.',
    authorTitle: 'Documented narrative, public sources',
    symbols: [],
    conclusion:
      'The 10th of January is, in Benin, the day of the vodun: the streets of the south fill with masks and dances. A visitor is welcomed on one simple condition: one does not photograph a ceremony without the participants’ consent, one does not enter a consecrated space unless invited, one takes nothing away — and one accepts that part of the rite is not meant for him.',
    workshopCta: {
      title: 'Before attending a mask outing',
      description:
        'The listings in the directory inform on festival periods, uses of the places and the authorisations to request.'
    },
    relatedStories: [
      { title: 'The applied textiles of Abomey, a stitched history' }
    ]
  },
  'voices-of-the-griots': {
    title: 'Voices of the griots: memory sung',
    subtitle:
      'Genealogies, praises and proverbs: part of West African history is transmitted without a written archive.',
    introduction:
      'From Senegal to Nigeria, the griot — jeli in Manding-speaking country — is not a mere musician. He holds genealogies, praises and the memory of treaties; his word makes faith in a negotiation as in a ceremony, and it rests on an instrument: kora, balafon or ngoni.',
    secondParagraph:
      'The repertoire changes name according to languages and regions, the function remains: to say where one comes from, and in which order. This memory is not free — it is transmitted within lineages of practitioners, with rights and duties on both sides, including that of not saying just anything about just anyone.',
    authorTitle: 'Documented narrative, public sources',
    symbols: [],
    quote: '“When an elder dies, it is a library that burns.”',
    conclusion:
      'Part of this repertoire was fixed by research collections in the 20th century; oral inquiry remains today the primary source for the older periods. For a visitor, the right way to listen is to start from an announced public ceremony — a festival, a mask outing, a commissioned praise — rather than from a question asked point-blank to an elder.',
    workshopCta: {
      title: 'Organising a listening',
      description:
        'The national tourism office and the departmental directorates indicate ongoing festivals and can guide towards support.'
    },
    relatedStories: [{ title: 'Vodun: forces, ancestors, a balance' }]
  }
};

export const ACTOR_CONTENT_EN: Record<string, ActorContentEn> = {
  anpt: {
    role: 'National agency for the promotion of heritage and tourism',
    badgeTitle: 'Public actor',
    bio: 'Public service in charge of promoting Benin’s cultural heritage and tourism offering. It is the institutional contact for preparing a visit to the major sites and for checking that reception complies with the rules in force.',
    expertise: [
      {
        title: 'Major cultural sites',
        description:
          'Public reference for organising visits and for information on heritage sites.'
      },
      {
        title: 'Traveller information',
        description:
          'Entry point to check opening hours, access and visiting conditions before setting off.'
      }
    ]
  },
  'fondation-zinsou': {
    role: 'Contemporary art museum · Ouidah and Cotonou',
    badgeTitle: 'Cultural foundation',
    bio: 'Foundation created in June 2005 by Marie-Cécile Zinsou, with Lionel Zinsou and Émile Derlin Zinsou. Its museum is installed in Ouidah at the Villa Ajavon, a 1922 residence in Afro-Brazilian architecture; the LAB, a contemporary art gallery, is located in Cotonou. Opening hours, access and free entry vary with the exhibitions and are confirmed with the foundation.',
    expertise: [
      {
        title: 'The Ouidah museum',
        description:
          'African contemporary art exhibitions at the Villa Ajavon, along the route of the Ouidah sites.'
      },
      {
        title: 'The LAB in Cotonou',
        description: 'Contemporary art gallery and mediation programme in the economic capital.'
      }
    ]
  },
  'cenagref-pendjari': {
    role: 'Protected-area management · Pendjari branch',
    badgeTitle: 'Public agency',
    bio: 'The Beninese agency in charge of managing protected areas. In Pendjari National Park, management is delegated and involves the surrounding villages: game drives are taken at the reception post, with an escort and a park vehicle.',
    expertise: [
      {
        title: 'Game drives',
        description:
          'Tracking routes depart from the park posts, led by a licensed escort.'
      },
      {
        title: 'Visiting regulations',
        description:
          'Sector openings, visiting seasons and rules of conduct toward the wildlife.'
      }
    ]
  },
  'musee-abomey': {
    role: 'History museum inside the royal palaces',
    badgeTitle: 'Heritage site',
    bio: 'History museum set up within the enclosure of the royal palaces of Abomey, listed as UNESCO World Heritage since 1985 (property n° 323). It holds the royal altars, the applied hangings and the bas-reliefs of the courts built by twelve rulers from 1625 to 1900.',
    expertise: [
      {
        title: 'Royal courts and bas-reliefs',
        description:
          'Guided visit of the earthen enclosures, altars and applied décor of the palaces.'
      },
      {
        title: 'On-site reception',
        description:
          'Site desk for access conditions and for pairing with a palace guide.'
      }
    ]
  },
  'ddt-tourisme': {
    role: 'Public administration · tourism development',
    badgeTitle: 'Public actor',
    bio: 'Public administration in charge of developing the tourism offering and structuring the hospitality trades in Benin. Its services handle licensing and visiting-condition questions.',
    expertise: [
      {
        title: 'Licensing the hospitality trades',
        description:
          'Administrative route through which a guide or an organisation obtains a recognised status.'
      },
      {
        title: 'Developing the offering',
        description:
          'Support for itineraries, reception infrastructure and destination promotion.'
      }
    ]
  }
};

export const EVENT_CONTENT_EN: Record<string, EventContentEn> = {
  'vodun-days-ouidah': {
    title: 'Vodun Days (National Festival of Vodun Arts and Traditions)',
    date: '9 & 10 January (Annual)',
    location: 'Djègbadji Beach & Historic City, Ouidah',
    accessType: 'Public and free access',
    description:
      'Benin’s largest cultural and spiritual gathering, bringing together Vodun dignitaries, sacred convents, Zangbéto night guardians and the spectacular dances of Egungun masks facing the Atlantic Ocean.'
  },
  'fete-de-la-gaani': {
    title: 'Imperial Festival of the Gaani',
    date: 'Lunar month of Gaani (Nikki)',
    location: 'Imperial Palace of the King of Nikki, Borgou, Benin',
    accessType: 'Public access & Baatonu nobility',
    description:
      'Great equestrian and identity festival of the Baatonu people and the horsemen of northern Benin. Majestic procession of the princes on horseback, royal Kakaki trumpets and tribute to the Sinaboko (Emperor of Nikki).'
  },
  'fete-du-nonvitcha-grand-popo': {
    title: 'Centenary Festival of the Nonvitcha',
    date: 'Pentecost weekend',
    location: 'Grand-Popo, Mono, Benin',
    accessType: 'Open to all',
    description:
      'Founded in 1923, the oldest festival of union and solidarity in West Africa, bringing together the Xwla and Xwéla peoples on the banks of the Mono river and the ocean.'
  },
  'ceremonie-egungun-ouidah': {
    title: 'Ritual Outing of the Ancestral Egungun Masks',
    date: 'Every Sunday afternoon',
    location: 'Zomaï neighbourhood & Royal Courts, Ouidah',
    accessType: 'By invitation, with protocol observed',
    description:
      'Ancestral spirits embodied in sumptuous costumes of embroidered and sequinned cloth, dancing to the rhythm of the Bata drums under the guidance of the Alagba.'
  },
  'atelier-teinture-indigo': {
    title: 'Master Dyer Workshop & Kanvô Weaving',
    date: 'Wednesday & Saturday, 10:00',
    location: 'Adjina historic quarter, Porto-Novo',
    accessType: 'By booking (18,000 FCFA)',
    description:
      'Hands-on introduction to the fermentation of plant indigo in ancestral vats, and the making of Beninese geometric motifs on cotton cloth.'
  }
};
