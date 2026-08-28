import { Actor } from '../types';

export const ACTORS_DATA: Actor[] = [
  {
    id: 'jean-marc-t',
    name: 'Jean-Marc T.',
    role: 'Cultural Historian',
    badgeTitle: 'Verified Scholar',
    rating: 4.9,
    reviewsCount: 128,
    location: 'Ouidah, Benin',
    experienceYears: 18,
    languages: ['English (Fluent)', 'French (Native)', 'Fon (Native)'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBwAO2hQQWAA9OHvGDKO4mWxpsFow-PevNyma39HaHhFrKO8upgdHcjhEjZep2cPMYofRNVXMhPuW3k6WB0N7O11q3jHzj5uOlb8pNAA_wMpPn7gSrpXnt39vxgzkJafdn8NA_XNHiun7EJlgO3z0S99C7WkzOlTnnjulIpxhSFZ4tGVu0kudyd4U_Q7IyPsp_dqgH2We7YnyGUa-IMNb1ju7fi8tvpuembDT0ri5mMrNwkbDUT4W',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBwAO2hQQWAA9OHvGDKO4mWxpsFow-PevNyma39HaHhFrKO8upgdHcjhEjZep2cPMYofRNVXMhPuW3k6WB0N7O11q3jHzj5uOlb8pNAA_wMpPn7gSrpXnt39vxgzkJafdn8NA_XNHiun7EJlgO3z0S99C7WkzOlTnnjulIpxhSFZ4tGVu0kudyd4U_Q7IyPsp_dqgH2We7YnyGUa-IMNb1ju7fi8tvpuembDT0ri5mMrNwkbDUT4W',
    quote: '"History is not just facts; it is the rhythm of the soil." Specialized in pre-colonial West African states, bridging archival research with deep oral traditions.',
    bio: 'Jean-Marc holds a Master’s degree in African History from the University of Abomey-Calavi and has worked as a consultant for UNESCO. He specializes in the historiography of the Kingdom of Dahomey and the Atlantic memorial routes.',
    expertise: [
      {
        title: 'Kingdom of Dahomey',
        description: 'Royal court structures, dynastic succession, and military history of the Agojie.',
        icon: 'account_balance',
        color: 'primary'
      },
      {
        title: 'The Slave Route',
        description: 'Tracing the historical stations from the Portuguese fort to the Door of No Return.',
        icon: 'map',
        color: 'tertiary'
      }
    ],
    experiences: [
      {
        id: 'private-heritage-tour',
        title: 'Private Heritage Tour',
        price: 'From $120',
        duration: 'Half-day',
        description: "A personalized walk through Ouidah's historical sites, tailored to your interests.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk7Ksphb4eiZEt7qCqAyNwN88JHlRCgTjCMoKQDG6jKh2I0gejDBJ5NC76Zc5ynEQQbik3tty88GNcGKwjNnVgOy56dmB2jSTOli362YIG-YmX_7bYhX5U604Upb4nxXKx3kch3x93SrZpG0Gdgz2f7wipUfMuB0ET2MjfFNYSs4TLA6u3dg9QIxGzs6LrHdN8_D24ho98221wURSgpxkO4uh_st426lohOx_MA15vx7Ln3YjbSQl9'
      },
      {
        id: 'virtual-storytelling',
        title: 'Virtual Storytelling',
        price: '$45',
        duration: '1 Hour • Zoom',
        description: 'An interactive online session delving into the myths and realities of the Agojie.',
        isVirtual: true
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Sarah Jenkins',
        date: 'October 2023',
        comment: 'Jean-Marc brought the ruins to life. His knowledge of the Royal Court is unmatched, and his storytelling is captivating. A must-do experience.',
        rating: 5
      },
      {
        id: 'rev-2',
        author: 'Marcus L.',
        date: 'September 2023',
        comment: "Deeply moving and educational. We learned things that aren't in any guidebook. Thank you, Jean-Marc!",
        rating: 5
      }
    ]
  },
  {
    id: 'baba-ousmane',
    name: 'Baba Ousmane',
    role: 'Certified Cultural Mediator',
    badgeTitle: 'Verified Cultural Mediator',
    rating: 4.9,
    reviewsCount: 94,
    location: 'Ouidah, Benin',
    experienceYears: 25,
    languages: ['EN', 'FR', 'FON'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0oM7E9hKBFHkAakmV0HrZZE4SZlACP0enQeNbCFdzQVg7m7tyD7viNibaLjgERt7vHIbbAc1JczHNZYFciIbYwWKtejcdBNShtVenhIQkE2BPYx_gREuDmQzidOkS5TG8RGOf3DxxjB4qeJiJYFgIIlJKKNdR57Z1xoEzuIxrrLLs9mO-OyWGktOgTOd0O9cEXJRpEnQY5pL7bhw1I62DueXK5hlQWjkf27YsTaNI1ZbnYCCMAei-',
    quote: '"The sanctuary welcomes all who step with pure heart and quiet listening."',
    expertise: [
      {
        title: 'Vodun Cosmology',
        description: 'Philosophy of nature deities and ancestor reverence in southern Benin.',
        icon: 'self_improvement',
        color: 'secondary'
      }
    ],
    experiences: [
      {
        id: 'sacred-grove-walk',
        title: 'Sacred Forest Immersion',
        price: 'From $80',
        duration: '2 Hours',
        description: 'Guided quiet walk through Kpassè forest with respectful rituals explanation.'
      }
    ],
    reviews: [
      {
        id: 'rev-baba-1',
        author: 'Clara M.',
        date: 'November 2023',
        comment: 'Baba Ousmane shared profound cultural wisdom without ever making it feel like a lecture.',
        rating: 5
      }
    ]
  },
  {
    id: 'dr-amma-mensah',
    name: 'Dr. Amma Mensah',
    role: 'Academic Historian',
    badgeTitle: 'Verified Historian',
    rating: 5.0,
    reviewsCount: 76,
    location: 'Abomey, Benin',
    experienceYears: 12,
    languages: ['EN', 'FR'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMM0e80K49DPXSLqrL2rDE40HcQFVW9DLqwA9dzSl45jrW-EoxU-lkKjYqfGD24jrlrnfF71VpBF15d2sSf3-45P3fWinWe82jbxXRMUT_Ws7Ui51tsx96kWBWgX5SGAqv4ZbHR1hcaZQmZSE5TEx-Zv5ee_qkfyrHmlNuIkmgYxTGxRi2IR490LQKkezfma5GFZXUpQG7YFp8WRV_7NYfgLm8bzLh0MrwJFNr1odquQTy2MMcSVRH',
    quote: '"Architecture is frozen memory; every earthen wall tells what our ancestors valued."',
    expertise: [
      {
        title: 'Abomey Palaces',
        description: 'Royal metallurgy, earthen architecture, and bas-relief decoding.',
        icon: 'account_balance',
        color: 'primary'
      }
    ],
    experiences: [
      {
        id: 'abomey-deep-dive',
        title: 'Abomey Royal Deep Dive',
        price: 'From $110',
        duration: '4 Hours',
        description: 'In-depth architectural analysis and archival chronicles.'
      }
    ],
    reviews: [
      {
        id: 'rev-amma-1',
        author: 'David R.',
        date: 'December 2023',
        comment: 'Dr. Mensah’s depth of knowledge is breathtaking. Outstanding experience.',
        rating: 5
      }
    ]
  },
  {
    id: 'atelier-d-applique',
    name: "Atelier d'Appliqué",
    role: 'Master Weavers & Artisans',
    badgeTitle: 'Verified Artisan Collective',
    rating: 4.8,
    reviewsCount: 52,
    location: 'Porto-Novo, Benin',
    experienceYears: 40,
    languages: ['FR', 'YOR'],
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIS1gGfc8odjCAg7i0iwem83uy8_QCaXm5IiiTbG1-72N00xaMFrSZNm-AjWZeVCboxAUC3Wl0X6Lnth0PQfDdu_f-B4opjHyf8LQkyIvEA3H_92IE6PSJDxxmmm-LM-46fdNaLHyB7450o5xh9Kp6n3eRHdiY4TmUc_it2RRUgJ64JWitEaAqBFFiqHWiWbMSphckC4tqC_5GtBMhzTpFofDhtcEGeQvSb4XXHjdWdx4bxs23HvUD',
    isCollective: true,
    membersCount: 15,
    quote: '"Each thread honors the kingdom symbols passed down from generation to generation."',
    expertise: [
      {
        title: 'Traditional Appliqué',
        description: 'Hand-cut fabric assembly and ancient royal insignia embroidery.',
        icon: 'palette',
        color: 'secondary'
      }
    ],
    experiences: [
      {
        id: 'hands-on-applique',
        title: 'Hands-on Appliqué Workshop',
        price: 'From $65',
        duration: '3 Hours',
        description: 'Create your own personalized Fon symbol textile panel under master supervision.'
      }
    ],
    reviews: [
      {
        id: 'rev-artisan-1',
        author: 'Helene T.',
        date: 'January 2024',
        comment: 'Incredible patience and mastery from the weavers. Loved bringing home my own craft piece.',
        rating: 5
      }
    ]
  }
];
