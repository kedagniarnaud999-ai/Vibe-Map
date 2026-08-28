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
  Star, 
  Calendar,
  Layers
} from 'lucide-react';
import { Place, Story, Actor, Category, ScreenId } from '../../types';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Spiritual', 'Historical', 'Nature', 'Arts', 'Food'];

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
              Current Zone
            </span>
            <h2 className="text-sm font-semibold text-[#2c2926]">Ouidah & Coastal Hub</h2>
          </div>
        </div>

        <button
          onClick={() => onNavigate('journal')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0ece1] hover:bg-[#e8e2d5] text-xs font-semibold text-[#6b665e] transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-[#c14e2f]" />
          <span>My Passport</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search places, proverbs, temples, artisans..."
          className="w-full pl-10 pr-4 py-3 bg-[#f0ece1] text-[#2c2926] placeholder-[#8c867c] text-sm rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Curate Your Vibe Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c14e2f] via-[#5a5a40] to-[#3f4e4f] p-5 text-white shadow-md">
        <div className="relative z-10 space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white">
            <Sparkles className="w-3 h-3 text-[#d9822b]" />
            <span>AI Vibe Weaving</span>
          </div>
          <h3 className="font-serif text-xl font-bold leading-tight">
            Curate Your Cultural Journey in Minutes
          </h3>
          <p className="text-xs text-white/90 font-sans leading-relaxed">
            Select your available time, depth level, and passions to generate an etiquette-aware cultural route.
          </p>
          <button
            onClick={() => onNavigate('itinerary-builder')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#c14e2f] text-xs font-bold shadow hover:bg-[#fdfcf8] active:scale-95 transition-all"
          >
            <span>Weave Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'bg-[#f0ece1] text-[#6b665e] hover:bg-[#e8e2d5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Nearby Cultural Discoveries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2c2926]">
              Nearby Discoveries
            </h3>
            <p className="text-xs text-[#6b665e]">Sites contextualized with rituals and etiquette</p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-[#c14e2f] hover:underline flex items-center gap-1"
          >
            <span>View Map</span>
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
                  <span>{place.category}</span>
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-sm">
                  {place.distanceKm} km away
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
                    <span className="text-[11px]">Etiquette Guided</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#c14e2f] flex items-center gap-0.5">
                    Explore <ArrowRight className="w-3 h-3" />
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
                Digital Cultural Library
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2c2926]">
                Featured In-Depth Story
              </h3>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-[#c14e2f] hover:underline"
            >
              All Articles
            </button>
          </div>

          <div
            onClick={() => onSelectStory(featuredStory)}
            className="group bg-white rounded-2xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 p-4 sm:p-5 flex flex-col md:flex-row gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <div className="md:w-1/3 h-48 rounded-xl overflow-hidden bg-[#e8e2d5]">
              <img
                src={featuredStory.heroImage}
                alt={featuredStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="md:w-2/3 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-[#fceee9] text-[#c14e2f] font-semibold text-[10px]">
                    {featuredStory.category}
                  </span>
                  <span className="text-[#8c867c] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featuredStory.readTime}
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
                  <img
                    src={featuredStory.author.avatar}
                    alt={featuredStory.author.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-[#6b665e] font-medium">
                    {featuredStory.author.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#c14e2f] flex items-center gap-1">
                  Read Story <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Cultural Mediators */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2c2926]">
              Verified Cultural Mediators
            </h3>
            <p className="text-xs text-[#6b665e]">Scholars, custodians & master artisans</p>
          </div>
          <button
            onClick={() => onNavigate('actors')}
            className="text-xs font-semibold text-[#c14e2f] hover:underline"
          >
            Directory
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actors.slice(0, 2).map((actor) => (
            <div
              key={actor.id}
              onClick={() => onSelectActor(actor)}
              className="bg-white rounded-2xl p-4 border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3.5"
            >
              <img
                src={actor.avatar}
                alt={actor.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#c14e2f]/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="font-serif font-bold text-sm text-[#2c2926] truncate">
                    {actor.name}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c14e2f] flex-shrink-0" />
                </div>
                <p className="text-xs text-[#5a5a40] truncate font-medium">{actor.role}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6b665e]">
                  <span className="flex items-center gap-0.5 text-[#5a5a40] font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {actor.rating}
                  </span>
                  <span>• {actor.experienceYears} yrs exp</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
