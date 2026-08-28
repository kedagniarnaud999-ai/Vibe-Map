import { Story } from '../types';

export const STORIES_DATA: Story[] = [
  {
    id: 'fon-applique-textiles',
    title: 'The Hidden Meaning of Fon Appliqué Textiles',
    subtitle: 'A vibrant tapestry of power, history, and proverb.',
    category: 'Heritage',
    readTime: '8 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvlDb0XuU_Cb4imwPnzeB5ynevor-y5iP5Ob-77rRPkwOCWMh5kUN8L-gIrdee1M7fawU7VYx8VhPOwlmbwQyGyJJOf-40SRG_4v_xTuuMTrgbofWxd2KMJHsmTLPUgUu1lslm4B3ASn8mGGR5af1UbDPZe3c4EWfLtfseDFwxLxmkiHy4B0frryKq-jHLmhWUa_a3FXcOFAZUB5Vwk669z_H1978s5UfhHpK3s0QdK-IAiGvCJu_N',
    author: {
      name: 'Dr. Oumiya Kouyaté',
      title: 'Curator of West African Arts',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO1ROpJ_SX0gat3q_xj03Qua1-odrpTOPNf8-7VObjXAvzCrdNrt2nzwpck18oZ4M0tBu80BNww4fREy_vouVdsCOH-fuLyZH7Ue-8fJUXzwuaY7BsdBCqaPrpzoGp1qnTg1EpKRoTAX0YvdQpEeB4LS0lRJ335GSfpIlWNqHS9RTw1sC71jz3ZRYpII-YyerJUmm4vyA8RgiVCfaH4PJx9s7p_9Jv7u3JsA1KwMzipQKOdQqDRykZ'
    },
    introduction: 'Long before the written word dominated historical records in the region, the Kingdom of Dahomey (present-day Benin) relied on a striking visual language to document its conquests, celebrate its kings, and convey complex proverbs. This language was sewn, not written.',
    secondParagraph: 'Fon appliqué, or kpoho, is a specialized textile art where vibrant, solid-colored cutouts of fabric are meticulously stitched onto a contrasting background cloth. These are not merely decorative wall hangings; they are vibrant historical documents.',
    audioTrack: {
      title: 'The Sound of the Stitch',
      subtitle: 'Master Artisan Koffi explains the process (Audio, 2:15)'
    },
    symbolsTitle: 'Decoding the Symbols',
    symbolsDescription: 'Every motif in a traditional appliqué holds specific meaning. A lion might represent a specific monarch (King Glele), while a shark denotes another (King Gbehanzin). The arrangement of these symbols tells a complete story. Tap the patterns below to reveal their meanings.',
    symbols: [
      {
        id: 'lion',
        title: 'The Lion',
        meaning: 'Represents King Glele (1858–1889). Signifies raw power, courage, fearlessness, and undisputed dominion over the kingdom.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApcHJqjrf9a7UAHSKcdGS2pUd4KZ2z103bOCPOc-EpMRzRk8MmJUwwlEKcgRSajzvZpLA3gkGvlH9PTgPInLZXZrm5XalSWSnz-nZc-QTJ6_gDxoCy8SrinwSSq_7EMiHhTTc6ZCdqFSqBjXE5MBmr0hOhCtzPP08iEwWB818G9sHTU4_yRUNE_KgZSKc6kdshXs50RpULbbH0AmOm-rjuynYUEld12GUD9vD6K-Z3HQ8c0Qsx82fU',
        colorClass: 'bg-primary'
      },
      {
        id: 'shark',
        title: 'The Shark',
        meaning: 'Represents King Gbehanzin (1889–1894): "The ferocious shark that troubles the ocean bars and defies colonizers."',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBKUIqZQ_docIjkim4YqQ5ZcQK47iCDU_V_A0LxlCCb2ZbZvxxbY4VB8IiUMhbTOLQZ8cksh_CY4UqHMNeiU4Qb7QlZBUZG0gXtnMBRtBgLArO9aw-eRTUv-XVOa8Krj6LqKlEchpvFuC1vGadmFmu2VpCz9huCSr1iK9-ou0KBU7AXFUpjAc3GLdzaevSrrrbtJgyICbE9s_mYEl1gN-qHvHRNfLKJc-vPghZgCKw8leKuBBz_IsK',
        colorClass: 'bg-tertiary'
      },
      {
        id: 'chameleon',
        title: 'The Chameleon',
        meaning: 'Represents King Akaba (1685–1708). Slow, wise, and steady, changing with context but inevitably reaching its goal.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8es5Ks7PwTPuD8_IKqa2MUMHKNLCqQqC38nj66gbYUqVZ77Fi7Z0eISjA6ZpaLUDFTgTD45R8JzaoigjRNYvi9eT23WhS5SiHc2muzw6b3ZI3B09pX1VOYDGpDEc6SJbxsv6mZ0UVvyjCsrU4mJ9JssmBMYmWzidhaMCCG8MaLtwU4kD1jurQzElVgOGgica9-Z5cjKNAYaCdQ-cfkMYuU9cTHUoJEnpHW-BdmSyI7M9VOtVowI81',
        colorClass: 'bg-secondary'
      },
      {
        id: 'swords',
        title: 'Crossed Swords',
        meaning: 'A general symbol of martial victory, unity in defense, and the prowess of Dahomey royal guards and the Agojie.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-CdHKAppEKZ96AOaQIUjDFUvsN1wWXHXcWM0hU8KzH_WSYGnwGR4hovNIQKaxTzCrhDp13YH0QGLPhJaOakQtjeOSep_0XwR4CutZlmokoyqldNBw1y-rumLE3O9tKlvdLYmodlFFnPanVjPRSoAZ54tos2UDncwy7NO01-ipR4cgoQRxmIquGetkViWLE1Nifo1zT1TLJUiS6DI-7nOdo8AvgWcMqmL5wxaFsnBiZ9_16Ip1p64Y',
        colorClass: 'bg-primary-container'
      }
    ],
    quote: {
      text: '"The needle is our pen, the cloth is our paper. We do not forget."',
      author: 'Artisan Collective Motto, Abomey'
    },
    conclusion: 'Today, while the royal courts no longer dictate the production of these cloths, the artisans of Abomey continue the tradition. The vibrant colors and bold graphics have even influenced modern graphic design, proving that this ancient visual language remains remarkably resilient and relevant.',
    workshopCTA: {
      title: 'Experience the Craft',
      description: 'Visit a master artisan workshop in Abomey and learn the basics of Fon appliqué stitching and symbol composition.'
    },
    relatedStories: [
      {
        id: 'sacred-groves-osun',
        title: 'The Sacred Groves of Osun-Osogbo',
        category: 'Mythology',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyN-uGI_cIzqBhDS5M5pe-DWXYP6dHJ1PMjfBVMdZ4RYbZSgO89BwxFC0aH9psgFP0ydKVDUpbpJOQk0On5vMaLsLiLnPXKX2peX8tNEc74NrDJgsK936ZlRdr40YQGQkDQUL_ZxHUG8B-J8b3HWTibVprFsYLt1GdYuuzoHs3aMb06oCeNohk8TCjsj2rrzUEGzaiT8Y5IvBdV7P0X33T83OSRkSlV4FjECvDA5fihl8wC6rZgfN3'
      },
      {
        id: 'kente-patterns',
        title: 'Reading the Loom: Kente Patterns',
        category: 'Textiles',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiNxmxarVAl0v9KPYhqZd5Nkcp_1-cZIsvqUqwfkLgEfbg9eqbckJErS9Z_f8hntw6kmlna4ns95wtymb8EPtvnNNwlgI99Vaqekd6Cae4cG72IrKrlYOtKT6wGBsga6HLoek0mjH3hEEFcXhNxfkyrdrf9sfEhZKa_NNiMkM-Z4bAE2CVA1uDa7-7-H7TKcbxlpnR3Mf6G8GmkdnMIzZaRM3nRfKAkmDqfyxWp7UPP03-xhOy24UE'
      }
    ]
  },
  {
    id: 'vodun-foundations',
    title: 'The Philosophy of Balance: Vodun Foundations',
    subtitle: 'An introduction to the core tenets of Vodun, focusing on harmony.',
    category: 'Spiritual',
    readTime: '6 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADLH3V8r4Pr7RNbdnXWAemOmUYN3c5ha6Jt1EASwRkMCGaxQPMDEdv-ycXYfCeHd--MzioYQhoJ5lGg1o8_f9aKapuW87fzBkyDL4fDNBeReiUhzPo2eA2RRkSyzsKswcapVVZ9G4y-NcBoTkt-R2L44OPUM8hO4aWk-gKjtryX7paw5_hNmJ_qbFaF6NiWgJgvsjSi_fvJ424ly4bSXnKoE-A4ZC20iMrzphthY1lb8ckGcvKGHvY',
    author: {
      name: 'Baba Ousmane',
      title: 'Cultural Mediator & Custodian',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0oM7E9hKBFHkAakmV0HrZZE4SZlACP0enQeNbCFdzQVg7m7tyD7viNibaLjgERt7vHIbbAc1JczHNZYFciIbYwWKtejcdBNShtVenhIQkE2BPYx_gREuDmQzidOkS5TG8RGOf3DxxjB4qeJiJYFgIIlJKKNdR57Z1xoEzuIxrrLLs9mO-OyWGktOgTOd0O9cEXJRpEnQY5pL7bhw1I62DueXK5hlQWjkf27YsTaNI1ZbnYCCMAei-'
    },
    introduction: 'In the West, Vodun is frequently clouded by sensationalized folklore and cinema tropes. In Benin, its ancestral birthplace, Vodun is an intricate cosmic philosophy celebrating the balance between human beings, the natural elements, and ancestral memory.',
    secondParagraph: 'At its core is Mawu-Lisa, the dual supreme deity representing the complementary harmony of sun and moon, day and night, male and female energies.',
    relatedStories: [
      {
        id: 'fon-applique-textiles',
        title: 'The Hidden Meaning of Fon Appliqué Textiles',
        category: 'Heritage',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvlDb0XuU_Cb4imwPnzeB5ynevor-y5iP5Ob-77rRPkwOCWMh5kUN8L-gIrdee1M7fawU7VYx8VhPOwlmbwQyGyJJOf-40SRG_4v_xTuuMTrgbofWxd2KMJHsmTLPUgUu1lslm4B3ASn8mGGR5af1UbDPZe3c4EWfLtfseDFwxLxmkiHy4B0frryKq-jHLmhWUa_a3FXcOFAZUB5Vwk669z_H1978s5UfhHpK3s0QdK-IAiGvCJu_N'
      }
    ]
  },
  {
    id: 'voices-of-the-griots',
    title: 'Voices of the Griots: Keepers of History',
    subtitle: 'Oral memory and music across centuries in West Africa.',
    category: 'Oral History',
    readTime: '7 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8ExmseZgnuR1MI7ru4RLuHXb-WCg_D5FImPSaMpToTRwI2e5ZLtcTxLzbaVy1z2fRnC-qXv6YS3o5jGX9zYt8v7__nXGKWUpTVcphAK4dEHf2Bl21m-e1CCvCH4NgdJ0A29Ko3t0cSH4AWbeu3Cma4p2Im9QKIOogVDbkQ_NXRGwdC3crl6ZqUkegkZq7Ag1StsavGdX9ZfPcydphsR54zt-ornuzgYfxsr8HtVCqfSjuEwU-yCBu',
    author: {
      name: 'Jean-Marc T.',
      title: 'Cultural Historian',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBwAO2hQQWAA9OHvGDKO4mWxpsFow-PevNyma39HaHhFrKO8upgdHcjhEjZep2cPMYofRNVXMhPuW3k6WB0N7O11q3jHzj5uOlb8pNAA_wMpPn7gSrpXnt39vxgzkJafdn8NA_XNHiun7EJlgO3z0S99C7WkzOlTnnjulIpxhSFZ4tGVu0kudyd4U_Q7IyPsp_dqgH2We7YnyGUa-IMNb1ju7fi8tvpuembDT0ri5mMrNwkbDUT4W'
    },
    introduction: 'In West African societies, the griot (or jeli) is not simply an entertainer. They are living libraries, genealogists, diplomats, and guardians of collective history through song, proverb, and the resonant strings of the kora.',
    secondParagraph: 'When an elder dies in this tradition, as the famous Malian writer Amadou Hampâté Bâ observed, a library burns to the ground. Discover how modern oral historians record and perpetuate these melodies.',
    relatedStories: [
      {
        id: 'fon-applique-textiles',
        title: 'The Hidden Meaning of Fon Appliqué Textiles',
        category: 'Heritage',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvlDb0XuU_Cb4imwPnzeB5ynevor-y5iP5Ob-77rRPkwOCWMh5kUN8L-gIrdee1M7fawU7VYx8VhPOwlmbwQyGyJJOf-40SRG_4v_xTuuMTrgbofWxd2KMJHsmTLPUgUu1lslm4B3ASn8mGGR5af1UbDPZe3c4EWfLtfseDFwxLxmkiHy4B0frryKq-jHLmhWUa_a3FXcOFAZUB5Vwk669z_H1978s5UfhHpK3s0QdK-IAiGvCJu_N'
      }
    ]
  }
];
