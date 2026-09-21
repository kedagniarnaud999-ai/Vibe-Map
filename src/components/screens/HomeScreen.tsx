import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Volume2, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';
import { Place, Story, Actor, Category, ScreenId } from '../../types';
import { commonsPage, creditLine, monogram } from '../../lib/media';
import { useI18n } from '../../lib/i18n';
import { useCategoryLabel } from '../../lib/labels';

interface HomeScreenProps {
  places: Place[];
  stories: Story[];
  actors: Actor[];
  onSelectPlace: (place: Place) => void;
  onSelectStory: (story: Story) => void;
  onSelectActor: (actor: Actor) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  places,
  stories,
  actors,
  onSelectPlace,
  onSelectStory,
  onSelectActor,
  onNavigate
}) => {
  const { t } = useI18n();
  const categoryLabel = useCategoryLabel();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Les valeurs restent les enumerations persistees de Place : seuls les libelles passent par t().
  const categories = [
    { value: 'All', label: t('Tous') },
    { value: 'Spiritual', label: t('Spirituel') },
    { value: 'Historical', label: t('Historique') },
    { value: 'Nature', label: t('Nature') },
    { value: 'Arts', label: t('Arts') },
    { value: 'Food', label: t('Gastronomie') }
  ];

  const filteredPlaces = places.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredStory = stories[0];
  const featuredPlace = places[0];

  return (
    <div className="space-y-6 pb-24 px-4 max-w-3xl mx-auto pt-3">
      {/* Current Location Badge & Intro */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-[#fceee9] text-[#c14e2f]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a5a40] block">
              {t('Zone actuelle')}
            </span>
            <h2 className="text-sm font-semibold text-[#2c2926]">{t('Ouidah & zone côtière')}</h2>
          </div>
        </div>

        <button
          onClick={() => onNavigate('journal')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0ece1] hover:bg-[#e8e2d5] text-xs font-semibold text-[#6b665e] transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-[#c14e2f]" />
          <span>{t('Mon Passeport')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Rechercher des lieux, proverbes, temples, artisans...')}
          className="w-full pl-10 pr-4 py-3 bg-[#f0ece1] text-[#2c2926] placeholder-[#8c867c] text-sm rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Curate Your Vibe Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c14e2f] via-[#5a5a40] to-[#3f4e4f] p-5 text-white shadow-md">
        <div className="relative z-10 space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white">
            <Sparkles className="w-3 h-3 text-[#d9822b]" />
            <span>{t('Tissage de Vibe par IA')}</span>
          </div>
          <h3 className="font-serif text-xl font-bold leading-tight">
            {t('Composez votre parcours culturel en quelques minutes')}
          </h3>
          <p className="text-xs text-white/90 font-sans leading-relaxed">
            {t('Sélectionnez le temps dont vous disposez, votre niveau d’immersion et vos passions pour générer un itinéraire culturel respectueux des protocoles.')}
          </p>
          <button
            onClick={() => onNavigate('itinerary-builder')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#c14e2f] text-xs font-bold shadow hover:bg-[#fdfcf8] active:scale-95 transition-all"
          >
            <span>{t('Tisser mon itinéraire')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'bg-[#f0ece1] text-[#6b665e] hover:bg-[#e8e2d5]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Nearby Cultural Discoveries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2c2926]">
              {t('Découvertes autour de vous')}
            </h3>
            <p className="text-xs text-[#6b665e]">
              {t('Des sites contextualisés par les rituels et les protocoles')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-[#c14e2f] hover:underline flex items-center gap-1"
          >
            <span>{t('Voir la carte')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="relative h-44 bg-[#e8e2d5] overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#c14e2f]">
                  <span>{categoryLabel(place.category)}</span>
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-sm">
                  {t('{distance} km de vous', { distance: place.distanceKm })}
                </div>
                {place.audioGuide && (
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5a5a40]/90 text-white text-[10px] font-semibold backdrop-blur-sm">
                    <Volume2 className="w-3 h-3" />
                    <span>{place.audioGuide.duration}</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-serif font-bold text-[#2c2926] text-base group-hover:text-[#c14e2f] transition-colors">
                    {place.name}
                  </h4>
                  <p className="text-xs text-[#6b665e] line-clamp-2 mt-1">
                    {place.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-between text-xs text-[#5a5a40] font-medium">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c14e2f]" />
                    <span className="text-[11px]">{t('Protocole Vérifié')}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#c14e2f] flex items-center gap-0.5">
                    {t('Découvrir le lieu')} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Deep Cultural Story */}
      {featuredStory && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a5a40] block">
                {t('Bibliothèque Culturelle Numérique')}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2c2926]">
                {t('Récit approfondi à la une')}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-[#c14e2f] hover:underline"
            >
              {t('Tous les articles')}
            </button>
          </div>

          <div
            onClick={() => onSelectStory(featuredStory)}
            className="group bg-white rounded-2xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 p-4 sm:p-5 flex flex-col md:flex-row gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative md:w-1/3 h-48 rounded-xl overflow-hidden bg-[#e8e2d5]">
              <img
                src={featuredStory.heroImage}
                alt={featuredStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {featuredStory.imageCredit && (
                <a
                  href={commonsPage(featuredStory.imageCredit.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1 text-[9px] leading-tight text-white/85 hover:text-white"
                >
                  {t('Photo : {credit}', { credit: creditLine(featuredStory.imageCredit) })}
                </a>
              )}
            </div>
            <div className="md:w-2/3 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-[#fceee9] text-[#c14e2f] font-semibold text-[10px]">
                    {categoryLabel(featuredStory.category)}
                  </span>
                  <span className="text-[#8c867c] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {t('{n} min de lecture', { n: featuredStory.readMinutes })}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2c2926] group-hover:text-[#c14e2f] transition-colors leading-snug">
                  {featuredStory.title}
                </h4>
                <p className="text-xs text-[#6b665e] line-clamp-2">
                  {featuredStory.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f0ece1]">
                <div className="flex items-center gap-2">
                  {featuredStory.author.avatar ? (
                    <img
                      src={featuredStory.author.avatar}
                      alt={featuredStory.author.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full bg-[#efece2] flex items-center justify-center font-serif text-[9px] font-bold text-[#5a5a40] flex-shrink-0"
                    >
                      {monogram(featuredStory.author.name)}
                    </div>
                  )}
                  <span className="text-xs text-[#6b665e] font-medium">
                    {featuredStory.author.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#c14e2f] flex items-center gap-1">
                  {t('Lire le récit')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cultural Institutions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2c2926]">
              {t('Structures publiques et institutions culturelles')}
            </h3>
            <p className="text-xs text-[#6b665e]">
              {t('Adresses officielles et guichets de site')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('actors')}
            className="text-xs font-semibold text-[#c14e2f] hover:underline"
          >
            {t('Annuaire')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actors.slice(0, 2).map((actor) => (
            <div
              key={actor.id}
              onClick={() => onSelectActor(actor)}
              className="bg-white rounded-2xl p-4 border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3.5"
            >
              {actor.avatar ? (
                <img
                  src={actor.avatar}
                  alt={actor.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#c14e2f]/20 flex-shrink-0"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-14 h-14 rounded-full bg-[#efece2] border-2 border-[#c14e2f]/20 flex items-center justify-center font-serif text-base font-bold text-[#5a5a40] flex-shrink-0"
                >
                  {monogram(actor.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-[#2c2926] truncate">
                  {actor.name}
                </h4>
                <p className="text-xs text-[#5a5a40] truncate font-medium">{actor.role}</p>
                <p className="text-[11px] text-[#6b665e] flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-[#8c867c] flex-shrink-0" /> {actor.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
