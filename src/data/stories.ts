import { Story } from '../types';
import { commonsThumb } from '../lib/media';

/**
 * Corpus documentaire. Le français est la langue de référence : c'est lui qui porte
 * les faits, l'anglais en est dérivé (surcharge côté données, jamais l'inverse).
 *
 * Trois règles, héritées de la revue des sources :
 *  - chaque affirmation engageante (date, règne, technique, institution) vient d'un
 *    document public ; ce qui relève de l'attribution discutée est écrit avec sa réserve
 *    (« la littérature muséographique retient… », « dont la réalité historique est discutée ») ;
 *  - aucune signature inventée : ces récits ne sont pas attribués à un chercheur ou à un
 *    gardien imaginaire, ils sont signés par le projet, qui en assume les sources ;
 *  - chaque visuel vient de Wikimedia Commons sous licence libre, est servi par son nom de
 *    fichier (Special:FilePath) et est accompagné de son auteur : sans crédit visible, une
 *    licence CC BY-SA n'est pas respectée.
 */
export const STORIES_DATA: Story[] = [
  {
    id: 'fon-applique-textiles',
    title: 'Les tissus appliqués d’Abomey, une histoire cousue',
    subtitle:
      'Emblèmes royaux, conquêtes et proverbes de cour : ce que racontent les appliqués fon.',
    category: 'Heritage',
    readMinutes: 8,
    heroImage: commonsThumb('Abomey-Tissus appliqués.jpg', 1600),
    imageCredit: {
      file: 'Abomey-Tissus appliqués.jpg',
      author: 'Ji-Elle',
      license: 'CC BY-SA 4.0'
    },
    author: {
      name: 'La rédaction de La Vibe Map',
      title: 'Récit documenté, sources publiques'
    },
    introduction:
      'À Abomey, une figure de tissu découpée et cousue sur une toile de fond claire n’est pas un simple ornement. Chaque motif engagé dans une tenture renvoie à un roi, à une victoire, à un proverbe de cour : l’appliqué fon est un compte rendu, et il se lit dans un ordre.',
    secondParagraph:
      'La technique est cousue, non tissée. Des pièces de coton aux couleurs franches sont appliquées sur le fond puis surpiquées au fil ; le contour reste net parce que la surpiqûre masque la coupe. Les ateliers d’Abomey produisent toujours ces tentures, pour les cérémonies familiales comme pour les collectionneurs, et le marché en vend aux visiteurs.',
    symbolsTitle: 'Décoder les emblèmes',
    symbolsDescription:
      'Les emblèmes ci-dessous sont ceux que les règnes ont laissés à Abomey, en tenture comme en bas-relief. Les attributions royales sont celles que la littérature muséographique retient le plus souvent : elles éclairent une lecture, elles ne ferment pas un débat. Touchez un emblème pour en lire la signification.',
    symbols: [
      {
        id: 'lion',
        title: 'Le lion',
        meaning:
          'Emblème retenu pour le règne de Glèlè (1858-1889) : force assumée et primauté sur le royaume. Une statue mi-homme mi-lion, aujourd’hui conservée au musée du quai Branly, lui est associée.',
        image: commonsThumb(
          'Statue royale mi-homme mi-lion du roi Glèlè, Musée du quai Branly.jpg',
          640
        ),
        imageCredit: {
          file: 'Statue royale mi-homme mi-lion du roi Glèlè, Musée du quai Branly.jpg',
          author: 'Anonyme',
          license: 'Domaine public'
        }
      },
      {
        id: 'requin',
        title: 'Le requin',
        meaning:
          'Emblème associé à Gbèhanzin (1889-1894), le roi qui affronta l’avance française en 1890 puis en 1892-1894. Déporté en Martinique puis en Algérie, il meurt à Blida en 1906.'
      },
      {
        id: 'cameleon',
        title: 'Le caméléon',
        meaning:
          'Emblème que la tradition d’Abomey rattache au roi Akaba, dont la réalité historique est discutée : animal lent et prudent, qui change de couleur selon le terrain mais atteint son but.'
      },
      {
        id: 'glaives',
        title: 'Les glaives croisés',
        meaning:
          'Figure de victoire militaire et de défense du royaume, présente dans le décor des palais royaux d’Abomey.'
      }
    ],
    conclusion:
      'Le musée historique d’Abomey, aménagé dans les palais royaux, conserve trônes, portes sculptées et tentures ; le site est inscrit au patrimoine mondial depuis 1985. Dans le centre-ville, les ateliers continuent de coudre : on peut y voir un appliqué se monter pièce après pièce, à condition de demander avant de photographier l’ouvrage en cours.',
    workshopCTA: {
      title: 'Préparer la visite d’Abomey',
      description:
        'Adresses officielles pour vérifier les horaires du musée, connaître les conditions d’accès aux ateliers et s’orienter vers un encadrement reconnu.'
    },
    relatedStories: [
      {
        id: 'vodun-foundations',
        title: 'Vodun : des forces, des ancêtres, un équilibre',
        category: 'Spiritual',
        image: commonsThumb('Zangbeto au Bénin 03.png', 320)
      },
      {
        id: 'voices-of-the-griots',
        title: 'Voix des griots : la mémoire chantée',
        category: 'Oral History',
        image: commonsThumb('Joueur de kora à Toubab Dialaw.jpg', 320)
      }
    ]
  },
  {
    id: 'vodun-foundations',
    title: 'Vodun : des forces, des ancêtres, un équilibre',
    subtitle:
      'Ce que le mot vodun veut dire dans le sud du Bénin, et ce qu’un visiteur risque à l’oublier.',
    category: 'Spiritual',
    readMinutes: 6,
    heroImage: commonsThumb('Zangbeto au Bénin 03.png', 1600),
    imageCredit: {
      file: 'Zangbeto au Bénin 03.png',
      author: 'Romario COFFI',
      license: 'CC BY-SA 4.0'
    },
    author: {
      name: 'La rédaction de La Vibe Map',
      title: 'Récit documenté, sources publiques'
    },
    introduction:
      'En fon, vodun désigne une force, une puissance capable d’agir sur le monde des vivants. Dans le sud du Bénin, le vodun n’est pas un folklore survivant : il organise des lignages, des calendriers de fête, des interdits et des obligations précises envers les anciens et envers certains lieux — une souche, une rivière, une place de village.',
    secondParagraph:
      'La cosmologie la plus couramment avancée place en amont Mawu-Lisa, double principe où Mawu, la lune, porte la nuit, le froid et la douceur, et Lisa, le soleil, le jour et la chaleur. Legba ouvre les chemins : sans lui, dit-on, aucune prière ne parvient aux autres vodun. Zangbeto, présenté comme le gardien de la nuit, balaie les rues de Porto-Novo et de Godomey sous un costume de fibres — sur cette image, sa sortie masque le danseur et ne laisse voir que la ronce.',
    conclusion:
      'Le 10 janvier est, au Bénin, la journée des vodun : les rues du sud se remplissent de masques et de danses. Un visiteur y est accueilli à une condition simple : on ne photographie pas une cérémonie sans l’accord des participants, on n’entre pas dans un espace consacré sans y être invité, on ne prélève rien — et l’on accepte qu’une partie du rite ne lui soit pas destinée.',
    workshopCTA: {
      title: 'Avant d’assister à une sortie de masque',
      description:
        'Les structures de l’annuaire renseignent sur les périodes de fête, les usages des lieux et les autorisations à demander.'
    },
    relatedStories: [
      {
        id: 'fon-applique-textiles',
        title: 'Les tissus appliqués d’Abomey, une histoire cousue',
        category: 'Heritage',
        image: commonsThumb('Abomey-Tissus appliqués.jpg', 320)
      }
    ]
  },
  {
    id: 'voices-of-the-griots',
    title: 'Voix des griots : la mémoire chantée',
    subtitle:
      'Généalogies, louanges et proverbes : une partie de l’histoire ouest-africaine se transmet sans archive écrite.',
    category: 'Oral History',
    readMinutes: 7,
    heroImage: commonsThumb('Joueur de kora à Toubab Dialaw.jpg', 1600),
    imageCredit: {
      file: 'Joueur de kora à Toubab Dialaw.jpg',
      author: 'M. GADJ',
      license: 'CC BY-SA 4.0'
    },
    author: {
      name: 'La rédaction de La Vibe Map',
      title: 'Récit documenté, sources publiques'
    },
    introduction:
      'Du Sénégal au Nigeria, le griot — jeli en pays mandingue — n’est pas un simple musicien. Il tient les généalogies, les louanges et le souvenir des traités ; sa parole fait foi dans une négociation comme dans une cérémonie, et elle s’appuie sur un instrument : kora, balafon ou ngoni.',
    secondParagraph:
      'Le répertoire change de nom selon les langues et les régions, la fonction reste : dire d’où l’on vient, et dans quel ordre. Cette mémoire n’est pas libre — elle se transmet dans des lignages de praticiens, avec des droits et des devoirs de part et d’autre, y compris celui de ne pas dire n’importe quoi sur n’importe qui.',
    quote: {
      text: '« Quand un vieillard meurt, c’est une bibliothèque qui brûle. »',
      author: 'Amadou Hampâté Bâ'
    },
    conclusion:
      'Une part de ce répertoire a été fixée par les collections de recherche au XXe siècle ; l’enquête orale reste aujourd’hui la principale source pour les périodes anciennes. Pour un visiteur, la bonne manière d’écouter est de commencer par une cérémonie publique annoncée — un festival, une sortie de masque, une louange commandée — plutôt que par une question posée à brûle-pourpoint à un aîné.',
    workshopCTA: {
      title: 'Organiser une écoute',
      description:
        'L’office national du tourisme et les directions départementales indiquent les festivals en cours et peuvent orienter vers un accompagnement.'
    },
    relatedStories: [
      {
        id: 'vodun-foundations',
        title: 'Vodun : des forces, des ancêtres, un équilibre',
        category: 'Spiritual',
        image: commonsThumb('Zangbeto au Bénin 03.png', 320)
      }
    ]
  }
];
