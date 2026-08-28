import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Info,
  Compass,
  Map as MapIcon,
  Globe
} from 'lucide-react';
import { Place, Category } from '../../types';
import { GoogleMapView } from '../GoogleMapView';

interface MapScreenProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onOpenPlaceDetail: (place: Place) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenPlaceDetail
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'google-maps' | 'heritage-canvas'>('google-maps');

  const categories = ['All', 'Spiritual', 'Historical', 'Nature', 'Arts'];

  const filteredPlaces = places.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activePlace = selectedPlace || filteredPlaces[0] || places[0];

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'Spiritual':
        return 'bg-[#c14e2f] text-white ring-[#c14e2f]/30';
      case 'Historical':
        return 'bg-[#5a5a40] text-white ring-[#5a5a40]/30';
      case 'Nature':
        return 'bg-[#3f4e4f] text-white ring-[#3f4e4f]/30';
      case 'Arts':
        return 'bg-[#d9822b] text-white ring-[#d9822b]/30';
      default:
        return 'bg-[#2c2926] text-white ring-black/20';
    }
  };

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden bg-[#e8e2d5] flex flex-col">
      {/* Floating Top Filter & Search Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-2.5 max-w-lg mx-auto pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 shadow-md rounded-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher sanctuaires, palais, forêts sacrées..."
              className="w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-md text-[#2c2926] placeholder-[#8c867c] text-sm rounded-2xl border border-[#e8e2d5] focus:border-[#c14e2f] focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Switch Google Maps / Illustrated View */}
          <div className="flex bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-[#e8e2d5] shadow-md">
            <button
              onClick={() => setViewMode('google-maps')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'google-maps'
                  ? 'bg-[#c14e2f] text-white shadow-sm'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
              title="Vue Google Maps Réelle"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Google Maps</span>
            </button>
            <button
              onClick={() => setViewMode('heritage-canvas')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'heritage-canvas'
                  ? 'bg-[#c14e2f] text-white shadow-sm'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
              title="Carte Patrimoniale Stylisée"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Illustrée</span>
            </button>
          </div>
        </div>

        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all ${
                selectedCategory === cat
                  ? 'bg-[#c14e2f] text-white'
                  : 'bg-white/90 text-[#6b665e] hover:bg-white'
              }`}
            >
              {cat === 'All' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Rendering: Google Maps or Heritage Stylized Canvas */}
      {viewMode === 'google-maps' ? (
        <GoogleMapView
          places={filteredPlaces}
          selectedPlace={activePlace}
          onSelectPlace={onSelectPlace}
          onOpenPlaceDetail={onOpenPlaceDetail}
        />
      ) : (
        /* Stylized Interactive Map Canvas */
        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
          {/* Map Background with Geographical Elements */}
          <div 
            className="absolute inset-0 bg-[#ebe7df] transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Subtle topo lines / road grid illustration */}
            <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#cfc9be" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Coastal Atlantic ocean line */}
              <path
                d="M 0 520 Q 250 500 500 530 T 1000 540 L 1000 1000 L 0 1000 Z"
                fill="#e2dfc8"
                opacity="0.6"
              />
              {/* Lake Nokoué */}
              <ellipse cx="72%" cy="60%" rx="70" ry="40" fill="#dfdbcb" opacity="0.7" />
              {/* Highway / Route des Esclaves */}
              <path
                d="M 200 100 Q 300 300 370 510"
                fill="none"
                stroke="#d8d1c2"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
            </svg>

            {/* Regional Labels */}
            <div className="absolute top-[18%] left-[28%] text-[#8c867c] text-xs font-serif italic tracking-widest pointer-events-none">
              ROYAUME DU DAHOMEY (ABOMEY)
            </div>
            <div className="absolute top-[68%] left-[15%] text-[#8c867c] text-xs font-serif italic tracking-widest pointer-events-none">
              SANCTUAIRE DE OUIDAH
            </div>
            <div className="absolute top-[52%] left-[72%] text-[#5a5a40] text-xs font-serif italic tracking-widest pointer-events-none">
              LAC NOKOUÉ (GANVIÉ)
            </div>
            <div className="absolute bottom-[8%] right-[10%] text-[#5a5a40] text-xs font-semibold tracking-wider pointer-events-none">
              GOLFE DE GUINÉE (ATLANTIQUE)
            </div>

            {/* Custom Interactive Place Pins */}
            {filteredPlaces.map((place) => {
              const isSelected = activePlace?.id === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  style={{
                    left: `${place.coordinates.x}%`,
                    top: `${place.coordinates.y}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  {/* Pulsing ring if selected */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-[#c14e2f]/30 animate-ping" />
                  )}

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg transition-all duration-200 ${
                      isSelected
                        ? 'scale-110 ring-4 ring-[#c14e2f]/40 z-20 ' + getCategoryColor(place.category)
                        : 'bg-white text-[#2c2926] hover:scale-105 border border-[#e8e2d5]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold whitespace-nowrap">
                      {place.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Floating Controls (Right Side) */}
          <div className="absolute right-4 top-24 z-20 flex flex-col gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#2c2926] hover:bg-white active:scale-95 transition-all"
              aria-label="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#2c2926] hover:bg-white active:scale-95 transition-all"
              aria-label="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#c14e2f] hover:bg-white active:scale-95 transition-all"
              title="Recentrer la carte"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Place Bottom Sheet Card */}
      {activePlace && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-lg mx-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#e8e2d5] transition-all">
            <div className="flex gap-3.5">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#e8e2d5] flex-shrink-0 relative">
                <img
                  src={activePlace.image}
                  alt={activePlace.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                  {activePlace.category}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-[#2c2926] truncate">
                      {activePlace.name}
                    </h4>
                    <span className="text-[11px] font-medium text-[#8c867c] flex-shrink-0">
                      {activePlace.distanceKm} km
                    </span>
                  </div>
                  <p className="text-xs text-[#6b665e] line-clamp-2 mt-0.5 font-sans">
                    {activePlace.description}
                  </p>
                </div>

                {/* Etiquette pill */}
                {activePlace.etiquette?.[0] && (
                  <div className="flex items-center gap-1 text-[11px] text-[#5a5a40] bg-[#efece2] px-2 py-0.5 rounded-md w-fit mt-1">
                    <ShieldAlert className="w-3 h-3 text-[#5a5a40]" />
                    <span className="truncate">{activePlace.etiquette[0].title}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#f0ece1] flex items-center justify-between">
              <div className="text-xs text-[#6b665e]">
                <span className="font-semibold text-[#c14e2f]">
                  {activePlace.verifiedGuideIds.length} Guides Vérifiés
                </span>{' '}
                disponibles
              </div>

              <button
                onClick={() => onOpenPlaceDetail(activePlace)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-semibold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
              >
                <span>Comprendre le lieu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
