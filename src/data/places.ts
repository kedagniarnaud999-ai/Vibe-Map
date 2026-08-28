import { Place } from '../types';

export const PLACES_DATA: Place[] = [
  {
    id: 'temple-of-pythons',
    name: 'Temple of Pythons',
    location: 'Ouidah, Benin',
    category: 'Spiritual',
    distanceKm: 1.2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYRkhFIC1UIMj-wtR3I2XflFdCO4hl5uPhcPGbvRkTjpiupKomSdzy3oo91TkhEp5znDF7GUsnzhwI1Tb3NaXMkqsJpLYV7I4ht9-mR8hdPlIbBKMe2JQ8mEUNWM_VqEKLJZn28-7BRg28B58wrYmEjfM2yLwgCOdEzi83Z1eBW09qhceR6NiPLnTaZigYp1YysTL60qKBmJsfMLygRB5nMeKXu2BgAdXiqv4xsLXwyTumG8egnF91',
    description: 'A revered site in Vodun culture where royal pythons are housed and venerated. Visitors are invited to learn about the harmony between humans and nature.',
    deepHistory: 'According to legend, during a tribal war in the 18th century, King Kpassè fled and sought refuge in a forest where pythons protected him from his enemies. To honor this divine protection, the sanctuary was established opposite the basilica in Ouidah. Today, dozens of royal pythons (Python regius) roam freely within its courtyard, symbolizing an unbroken covenant between the spiritual realm and the community.',
    badges: ['Spiritual Site', 'Verified Guide Available'],
    etiquette: [
      {
        title: 'Ask Before Photographing',
        description: 'Do not photograph the priests or specific inner shrines without explicit permission.',
        icon: 'no_photography'
      },
      {
        title: 'Remove Footwear',
        description: 'Certain inner sanctums and prayer thresholds require bare feet as a sign of respect.',
        icon: 'footprint'
      }
    ],
    audioGuide: {
      title: 'The Covenant of Dangbé',
      narrator: 'Narrated by Koffi A., Local Historian & Priest',
      duration: '6:45',
      durationSeconds: 405
    },
    visualGuides: [
      {
        title: 'Royal Pythons',
        description: 'Harmless to humans, they move freely and are handled with quiet reverence.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE6cpdDYkzNWKI43r2xmCVVA9bu2V__QAs3-mOZIF4B-AId1elW_xvCHlTtP9Cb07TMz_RK3DjAu-mXCN2kaBppYdTna4Mu-saZKx89-j8mL789JOgh1ukQju1cQMhlKMHk3IeF_f0Enq0gebTtYjJluLjK6f0YBbTB-98zRdUIuWAFD-MURjynGvW_pP2lzmg5lT0oH0ddfXVekqWjFfyecxTLu8dhZ4vOzbJnGC2BFGbqO773h4K'
      },
      {
        title: 'Sacred Tree',
        description: 'A focal point for ancestral prayers with white fabric tied around its ancient roots.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnYRndaLqMu84mdd-goyc3TOlxstwDPOReEJNhHKrVdSOD2m5i2y3-ApjbcPaSc5LPpL431Aa7LDEmBL-HY6zXb043mmQT3CUYqoecPwTiZIiF4BAvj6XXgIMy4TsNvyEsGXz3e4YmAIlkQwyWBshZCltfdEeVsk9U2D1-3X0dZymL82y_7i9i2aC8vOTC0aYrjxsWO6GaPtCOiazN53lXCi1f02sAachliP1NuE1Uy5Zs63PXyzv0'
      }
    ],
    verifiedGuideIds: ['koffi-ahou', 'ama-t'],
    vocabulary: [
      {
        term: 'Vodun',
        phonetic: '/voʊˈduːn/',
        meaning: 'Often misunderstood, it translates simply to "spirit" or "force of nature" in the Fon language.'
      },
      {
        term: 'Dangbé',
        phonetic: '/dæŋˈbeɪ/',
        meaning: 'The sacred royal python, revered as a symbol of peace, wisdom, and agricultural fertility.'
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
    id: 'sacred-forest-kpasse',
    name: 'Sacred Forest of Kpassè',
    location: 'Ouidah, Benin',
    category: 'Nature',
    distanceKm: 0.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz4pW-TC6UFl1352t-ea2ghynI5zIfjELHu2-mfQpqHyH7L4IBLdZshkH4j42Ti4sSEvHqqUFRLpRT8IDEQl1HMbzuKgZ-9VhezF7KrHKd8r2MXJR44VzKwiQKWVKWa3Otm_j6eHiTzUxPn5AXLIwNmqdTmsVWe2yCfS4oCbBjheA4E6RTe8ccMbNbjg0aQtRcsCT70YHWPpgakopDs7RPOVM17-E6NudZj1Iqp1fyM5tHHiGtiZA_',
    description: 'Wander through ancient groves where history and spirituality intertwine. Discover the hidden sculptures and sacred Iroko tree of Ouidah founding king.',
    deepHistory: 'The sacred grove preserves the spot where King Kpassè, the founder of Ouidah in the 14th century, is said to have mysteriously vanished and metamorphosed into a giant Iroko tree to avoid capture. The forest is protected by traditional initiates and houses expressive wooden and cement statues representing Vodun divinities.',
    badges: ['Vodun Heritage', 'Verified Sanctuary'],
    etiquette: [
      {
        title: 'Lower Your Voice',
        description: 'Keep discussions at a whisper; locals believe the ancient trees listen to human speech.',
        icon: 'volume_mute'
      },
      {
        title: 'Walk Only on Cleared Paths',
        description: 'Do not step off paths into sacred undergrowth marked by raffia leaves.',
        icon: 'forest'
      }
    ],
    audioGuide: {
      title: 'Echoes of King Kpassè',
      narrator: 'Narrated by Baba Ousmane',
      duration: '4:20',
      durationSeconds: 260
    },
    visualGuides: [
      {
        title: 'The Ancestral Iroko',
        description: 'Over 400 years old, honored with regular libations and white cotton cloths.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnYRndaLqMu84mdd-goyc3TOlxstwDPOReEJNhHKrVdSOD2m5i2y3-ApjbcPaSc5LPpL431Aa7LDEmBL-HY6zXb043mmQT3CUYqoecPwTiZIiF4BAvj6XXgIMy4TsNvyEsGXz3e4YmAIlkQwyWBshZCltfdEeVsk9U2D1-3X0dZymL82y_7i9i2aC8vOTC0aYrjxsWO6GaPtCOiazN53lXCi1f02sAachliP1NuE1Uy5Zs63PXyzv0'
      }
    ],
    verifiedGuideIds: ['baba-ousmane'],
    vocabulary: [
      {
        term: 'Lokotin',
        phonetic: '/loʊ-koʊ-tiːn/',
        meaning: 'The sacred Iroko tree, home to spiritual guardians and ancestral energies.'
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
    id: 'fondation-zinsou',
    name: 'Fondation Zinsou',
    location: 'Cotonou & Ouidah, Benin',
    category: 'Arts',
    distanceKm: 35,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5cTSQic_-7o3mcQmJm0bXCEKebsK1gOapG2gt8G-OQLLhg1NldQjqIpZVvI1Ocdx557G5l1eFrOiKlzaXJuIZBQME1g39qvNAvXKpBiKWjFtwevzojXtXdiNYKNTz_8-WEoPPscaavpAK9iLaxI1N6j4l5kXwNDHuBy6XWo3QURH67i77PAF9_Ls8xmVUZmnVgEvvDeICUlT5FMWX7yfpVBC-MOYy9IelHTQYGORLXg0rnfwm6w_a',
    description: 'A pioneering museum and cultural foundation showcasing modern African contemporary art, photography, and community arts education.',
    deepHistory: 'Created in 2005, Fondation Zinsou is the first private structure in Benin dedicated to contemporary African art. Free for all visitors, it bridges ancestral iconography with avant-garde sculpture, textiles, and photography.',
    badges: ['Contemporary Art', 'Free Entry'],
    etiquette: [
      {
        title: 'Photography Encouraged',
        description: 'Non-flash photography of exhibitions is welcomed to share African artistic innovation.',
        icon: 'photo_camera'
      }
    ],
    visualGuides: [
      {
        title: 'Textile Assemblages',
        description: 'Vibrant tapestries fusing Fon appliqués with reclaimed contemporary denim and wax prints.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5cTSQic_-7o3mcQmJm0bXCEKebsK1gOapG2gt8G-OQLLhg1NldQjqIpZVvI1Ocdx557G5l1eFrOiKlzaXJuIZBQME1g39qvNAvXKpBiKWjFtwevzojXtXdiNYKNTz_8-WEoPPscaavpAK9iLaxI1N6j4l5kXwNDHuBy6XWo3QURH67i77PAF9_Ls8xmVUZmnVgEvvDeICUlT5FMWX7yfpVBC-MOYy9IelHTQYGORLXg0rnfwm6w_a'
      }
    ],
    verifiedGuideIds: ['dr-amma-mensah'],
    vocabulary: [
      {
        term: 'Aladagbe',
        phonetic: '/a-la-dag-be/',
        meaning: 'Creativity and craftsmanship executed with intentional beauty.'
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
    id: 'door-of-no-return',
    name: 'The Door of No Return',
    location: 'Ouidah Beach, Benin',
    category: 'Historical',
    distanceKm: 4.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOfLg3vlYntAGVqNGYBAYMgUIunATduBVj2RxkmeM4bD--V6of3HCwNRoZnNNMDfUTO0246rnyH-ejASqtnPf6MalcGQyDJ4Vggb1mr64i8gcR9MsgOe98BvYYXMD3kZZmI9T3lV5y0fwqz9-iHB5Y91PCeGn9TzY2tbvbWHK7kpel_eQpS-JH-3Jf0wQC7Iwa2UNPmA6QK30emQnVa2nGXVu7VmzUt6Xjw4FC7aiWYK3OWGLuLyjE',
    description: 'The monumental memorial archway on the Atlantic beach commemorating millions of enslaved Africans who were shipped across the ocean.',
    deepHistory: 'Erected in 1995 under UNESCO auspices, this imposing arch designed by Beninese architect Yves Ahouen-Gnimon and artist Fortuné Bandeira stands at the terminus of the 4-kilometer Slave Route from the Portuguese fort to the coastline.',
    badges: ['UNESCO Memory of the World', 'Historical Memorial'],
    etiquette: [
      {
        title: 'Maintain Reverence',
        description: 'Treat the monument with dignity as a place of historical reflection and mourning.',
        icon: 'info'
      }
    ],
    visualGuides: [
      {
        title: 'Bronze Bas-Reliefs',
        description: 'Intricate bronze panels depicting bound captives and ancestors looking back toward mother Africa.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOfLg3vlYntAGVqNGYBAYMgUIunATduBVj2RxkmeM4bD--V6of3HCwNRoZnNNMDfUTO0246rnyH-ejASqtnPf6MalcGQyDJ4Vggb1mr64i8gcR9MsgOe98BvYYXMD3kZZmI9T3lV5y0fwqz9-iHB5Y91PCeGn9TzY2tbvbWHK7kpel_eQpS-JH-3Jf0wQC7Iwa2UNPmA6QK30emQnVa2nGXVu7VmzUt6Xjw4FC7aiWYK3OWGLuLyjE'
      }
    ],
    verifiedGuideIds: ['jean-marc-t', 'koffi-ahou'],
    vocabulary: [
      {
        term: 'Agonve',
        phonetic: '/a-gon-veh/',
        meaning: 'The Tree of Forgetfulness, around which male and female captives were forced to walk.'
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
    id: 'royal-palaces-abomey',
    name: 'Royal Palaces of Abomey',
    location: 'Abomey, Zou, Benin',
    category: 'Historical',
    distanceKm: 110,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY6LkOsqTxvJVcB7xR1ENLHRJI-WWH0a14xXdm2oqLhUrAMw0ir0qVWGo1iz881AYYEz-eOVotTlVO5msUVh6V0hvaAgHUmpEtgU79BwlJVqJMWVVx2WiQc4LF7WyqlE2EApCT3ZhfdlXBNRL-zHbxr19j9CGyOOUJMzCNq0SANOSOGmaIzmJkLqLWA2o3fj5iMAPfMplkfzftkL9-dOgfsySnmb1hF2Q55mP6ZqvAESmDB4Zsr5KQ',
    description: 'The fortified seat of the 12 kings of the Dahomey Kingdom, featuring earthen bas-reliefs, throne rooms, and royal tombs.',
    deepHistory: 'From 1625 to 1900, 12 successive kings ruled Dahomey from Abomey. Each king built a new palace adjacent to his predecessor. UNESCO recognized the complex in 1985.',
    badges: ['UNESCO World Heritage', 'Royal Legacy'],
    etiquette: [
      {
        title: 'Respect Royal Thresholds',
        description: 'Never step onto royal dais platforms or touch ancestral bas-reliefs.',
        icon: 'account_balance'
      }
    ],
    visualGuides: [
      {
        title: 'Polychrome Bas-Reliefs',
        description: 'Clay wall carvings illustrating the king’s symbols, proverbs, and military victories.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY6LkOsqTxvJVcB7xR1ENLHRJI-WWH0a14xXdm2oqLhUrAMw0ir0qVWGo1iz881AYYEz-eOVotTlVO5msUVh6V0hvaAgHUmpEtgU79BwlJVqJMWVVx2WiQc4LF7WyqlE2EApCT3ZhfdlXBNRL-zHbxr19j9CGyOOUJMzCNq0SANOSOGmaIzmJkLqLWA2o3fj5iMAPfMplkfzftkL9-dOgfsySnmb1hF2Q55mP6ZqvAESmDB4Zsr5KQ'
      }
    ],
    verifiedGuideIds: ['dr-amma-mensah', 'jean-marc-t'],
    vocabulary: [
      {
        term: 'Agojie',
        phonetic: '/a-go-ji-eh/',
        meaning: 'The fearsome female warriors (the Dahomey Amazons) who guarded the king.'
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
    id: 'ganvie-stilt-village',
    name: 'Ganvié Stilt Village',
    location: 'Lake Nokoué, Benin',
    category: 'Nature',
    distanceKm: 28,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzRqeFjT8ELmDt0ohsVLUUaG7IJB2-CpifHtPsLnxLCZphm1-iGsk7rA5HbJCSE7WAk8X6yrbd1Ypzr0nigcL8EZ8EErry3-1VhHb-EDbe7VtyyDvyknlvDWpIa7r4SSW5Lmdmgzir2aLY7G8J16jT86Cz2NE8B-nyPzpbB_8VPCYHClW2AK89tpOamyFSwyvsy1gsP4y6rWJ5qz5bNsFJo8cnfnTgjU1oS_Izr0_A34kxJ_IegTIy',
    description: 'Often dubbed the "Venice of Africa", Ganvié is a 400-year-old lake settlement entirely built on wooden stilts above Lake Nokoué.',
    deepHistory: 'Established in the 17th century by the Tofinu people seeking refuge from slave raiders whose religious beliefs forbade entering open water.',
    badges: ['Living Heritage', 'Lake Community'],
    etiquette: [
      {
        title: 'Ask Before Photographing Residents',
        description: 'Life takes place openly on the water; kindly greet people before taking portraits.',
        icon: 'photo_camera'
      }
    ],
    visualGuides: [
      {
        title: 'Floating Market',
        description: 'Women trading fresh fish, cassava, and fruits directly from dugout canoes.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzRqeFjT8ELmDt0ohsVLUUaG7IJB2-CpifHtPsLnxLCZphm1-iGsk7rA5HbJCSE7WAk8X6yrbd1Ypzr0nigcL8EZ8EErry3-1VhHb-EDbe7VtyyDvyknlvDWpIa7r4SSW5Lmdmgzir2aLY7G8J16jT86Cz2NE8B-nyPzpbB_8VPCYHClW2AK89tpOamyFSwyvsy1gsP4y6rWJ5qz5bNsFJo8cnfnTgjU1oS_Izr0_A34kxJ_IegTIy'
      }
    ],
    verifiedGuideIds: ['baba-ousmane'],
    vocabulary: [
      {
        term: 'Ganvié',
        phonetic: '/gan-vi-ay/',
        meaning: 'Literally "we survived" in the Tofin dialect.'
      }
    ],
    coordinates: {
      x: 70,
      y: 58,
      lat: 6.4667,
      lng: 2.4167
    }
  }
];
