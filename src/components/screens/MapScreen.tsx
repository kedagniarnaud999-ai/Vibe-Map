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
  Globe,
  Mountain,
  Satellite
} from 'lucide-react';
import { Place, Category } from '../../types';
import { LeafletMapView } from '../LeafletMapView';
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
  const [layerType, setLayerType] = useState<'voyager' | 'satellite' | 'terrain' | 'street'>('voyager');
  const [viewEngine, setViewEngine] = useState<'interactive-map' | 'google-maps' | 'heritage-canvas'>('interactive-map');

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
        return 'bg-[#2e5a44] text-white ring-[#2e5a44]/30';
      case 'Arts':
        return 'bg-[#d9822b] text-white ring-[#d9822b]/30';
      default:
        return 'bg-[#2c2926] text-white ring-black/20';
    }
  };

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden bg-[#e8e2d5] flex flex-col">
      {/* Floating Top Filter & Search Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-2 max-w-lg mx-auto pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 shadow-md rounded-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher Ouidah, Abomey, Ganvié, Porto-Novo..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/95 backdrop-blur-md text-[#2c2926] placeholder-[#8c867c] text-xs sm:text-sm rounded-2xl border border-[#e8e2d5] focus:border-[#c14e2f] focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Map Layer / Engine Controls */}
          <div className="flex bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-[#e8e2d5] shadow-md gap-0.5">
            <button
              onClick={() => {
                setViewEngine('interactive-map');
                setLayerType('voyager');
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                viewEngine === 'interactive-map' && layerType === 'voyager'
                  ? 'bg-[#c14e2f] text-white shadow-sm'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
              title="Carte Détaillée"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plan</span>
            </button>

            <button
              onClick={() => {
                setViewEngine('interactive-map');
                setLayerType('satellite');
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                viewEngine === 'interactive-map' && layerType === 'satellite'
                  ? 'bg-[#c14e2f] text-white shadow-sm'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
              title="Vue Satellite"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Satellite</span>
            </button>

            <button
              onClick={() => setViewEngine('heritage-canvas')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                viewEngine === 'heritage-canvas'
                  ? 'bg-[#c14e2f] text-white shadow-sm'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
              title="Carte Illustrée du Dahomey"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Illustrée</span>
            </button>
          </div>
        </div>

        {/* Category horizontal scroll pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          {categories.map((cat) => {
            const label = cat === 'All' ? 'Tous les sites' :
                          cat === 'Spiritual' ? '🕊️ Spirituel & Vodun' :
                          cat === 'Historical' ? '🏛️ Histoire & Royaumes' :
                          cat === 'Nature' ? '🌿 Nature & Lacs' : '🎨 Arts & Métiers';
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur-md transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#c14e2f] text-white font-semibold'
                    : 'bg-white/90 text-[#6b665e] hover:bg-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Rendering Area */}
      <div className="relative flex-1 w-full h-full">
        {viewEngine === 'interactive-map' ? (
          <LeafletMapView
            places={filteredPlaces}
            selectedPlace={activePlace}
            onSelectPlace={onSelectPlace}
            onOpenPlaceDetail={onOpenPlaceDetail}
            layerType={layerType}
          />
        ) : viewEngine === 'google-maps' ? (
          <GoogleMapView
            places={filteredPlaces}
            selectedPlace={activePlace}
            onSelectPlace={onSelectPlace}
            onOpenPlaceDetail={onOpenPlaceDetail}
          />
        ) : (
          /* Heritage Stylized Canvas */
          <div className="relative w-full h-full bg-[#eadecb] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full opacity-40 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#b8ad96" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 0 450 Q 250 420 500 460 T 1000 480 L 1000 1000 L 0 1000 Z" fill="#d0c4aa" opacity="0.6" />
            </svg>

            {/* Cultural Pins on Stylized Map */}
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
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg transition-all ${
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
        )}
      </div>

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
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                  {activePlace.category}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#2c2926] truncate">
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
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#5a5a40] bg-[#efece2] px-2 py-0.5 rounded-md w-fit mt-1">
                    <ShieldAlert className="w-3 h-3 text-[#5a5a40] flex-shrink-0" />
                    <span className="truncate">{activePlace.etiquette[0].title}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#f0ece1] flex items-center justify-between">
              <div className="text-xs text-[#6b665e]">
                <span className="font-semibold text-[#c14e2f]">
                  {activePlace.verifiedGuideIds.length} Guides Certifiés
                </span>{' '}
                disponibles
              </div>

              <button
                onClick={() => onOpenPlaceDetail(activePlace)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#c14e2f] text-white text-xs font-semibold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
              >
                <span>Découvrir le lieu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
