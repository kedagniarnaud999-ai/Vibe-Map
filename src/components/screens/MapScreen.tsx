import React, { useState, useEffect, useMemo } from 'react';
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
  Satellite,
  LocateFixed,
  Loader2,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { Place, Category } from '../../types';
import { LeafletMapView } from '../LeafletMapView';
import { GoogleMapView } from '../GoogleMapView';
import { calculateDistanceKm, formatDistance, getProximityBadge, UserCoordinates } from '../../lib/geo';

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
  
  // Geolocation states
  const [userPosition, setUserPosition] = useState<UserCoordinates | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'granted' | 'denied' | 'error'>('idle');
  const [geoErrorMsg, setGeoErrorMsg] = useState<string | null>(null);
  const [sortByProximity, setSortByProximity] = useState<boolean>(false);
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number | null>(null); // e.g. 30km
  const [showNearbyDrawer, setShowNearbyDrawer] = useState<boolean>(false);

  // Request browser Geolocation API
  const handleLocateUser = (showNotification = true) => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoErrorMsg("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setGeoStatus('locating');
    setGeoErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: UserCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp
        };
        setUserPosition(coords);
        setGeoStatus('granted');
        setSortByProximity(true);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus('denied');
          setGeoErrorMsg("Autorisation de localisation refusée.");
        } else {
          setGeoStatus('error');
          setGeoErrorMsg("Impossible de récupérer votre position actuelle.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  // Attempt initial location request on load
  useEffect(() => {
    handleLocateUser(false);
  }, []);

  // Preset location setter (useful for travelers wanting to explore specific regions or testing)
  const handleSetPresetLocation = (lat: number, lng: number, name: string) => {
    setUserPosition({
      lat,
      lng,
      accuracy: 15,
      timestamp: Date.now()
    });
    setGeoStatus('granted');
    setSortByProximity(true);
    setGeoErrorMsg(null);
  };

  // Dynamically extract unique categories and place counts directly from Firestore collection
  const dynamicCategories = useMemo(() => {
    const map = new Map<string, number>();
    places.forEach((p) => {
      const cat = p.category?.trim() || 'Patrimoine';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    const getCatVisual = (cat: string) => {
      const lower = cat.toLowerCase();
      if (lower.includes('spirit') || lower.includes('vodun') || lower.includes('sanctuaire')) {
        return { label: 'Spirituel & Sanctuaires', icon: '🕊️' };
      }
      if (lower.includes('histor') || lower.includes('palais') || lower.includes('royaume') || lower.includes('monument')) {
        return { label: 'Histoire & Royaumes', icon: '🏛️' };
      }
      if (lower.includes('nature') || lower.includes('lac') || lower.includes('forêt') || lower.includes('parc')) {
        return { label: 'Nature & Écotourisme', icon: '🌿' };
      }
      if (lower.includes('art') || lower.includes('métier') || lower.includes('artisan')) {
        return { label: 'Arts & Artisanat', icon: '🎨' };
      }
      if (lower.includes('food') || lower.includes('gastro') || lower.includes('culinaire')) {
        return { label: 'Gastronomie & Terroir', icon: '🍲' };
      }
      return { label: cat, icon: '📍' };
    };

    const dynamicItems = Array.from(map.entries()).map(([cat, count]) => {
      const visual = getCatVisual(cat);
      return {
        id: cat,
        label: visual.label,
        icon: visual.icon,
        count
      };
    });

    dynamicItems.sort((a, b) => b.count - a.count);

    return [
      { id: 'All', label: 'Tous les sites', icon: '✨', count: places.length },
      ...dynamicItems
    ];
  }, [places]);

  // Enrich places with calculated distance to user's real GPS position
  const enrichedPlaces = useMemo(() => {
    return places.map((place) => {
      let calculatedDistanceKm: number | undefined = undefined;
      if (userPosition && place.coordinates?.lat && place.coordinates?.lng) {
        calculatedDistanceKm = calculateDistanceKm(
          userPosition.lat,
          userPosition.lng,
          place.coordinates.lat,
          place.coordinates.lng
        );
      }
      return {
        ...place,
        calculatedDistanceKm: calculatedDistanceKm ?? place.distanceKm
      };
    });
  }, [places, userPosition]);

  // Filter and Sort places
  const filteredPlaces = useMemo(() => {
    let result = enrichedPlaces.filter((p) => {
      const matchesCat = 
        selectedCategory === 'All' || 
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDistance = 
        maxDistanceFilter === null || 
        (p.calculatedDistanceKm !== undefined && p.calculatedDistanceKm <= maxDistanceFilter);

      return matchesCat && matchesSearch && matchesDistance;
    });

    if (sortByProximity && userPosition) {
      result.sort((a, b) => (a.calculatedDistanceKm || 9999) - (b.calculatedDistanceKm || 9999));
    }

    return result;
  }, [enrichedPlaces, selectedCategory, searchQuery, maxDistanceFilter, sortByProximity, userPosition]);

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
      <div className="absolute top-3 left-3 right-3 z-20 space-y-2 max-w-lg mx-auto pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 shadow-md rounded-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher Ouidah, Abomey, Ganvié, Porto-Novo..."
              className="w-full pl-10 pr-4 py-2 bg-white/95 backdrop-blur-md text-[#2c2926] placeholder-[#8c867c] text-xs sm:text-sm rounded-2xl border border-[#e8e2d5] focus:border-[#c14e2f] focus:outline-none transition-all shadow-sm"
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
              onClick={() => setViewEngine('google-maps')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                viewEngine === 'google-maps'
                  ? 'bg-[#c14e2f] text-white shadow-sm'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
              title="Google Maps"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google</span>
            </button>
          </div>
        </div>

        {/* Category & Proximity Quick Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          {/* Nearby Sites Filter Pill */}
          <button
            onClick={() => {
              if (!userPosition) {
                handleLocateUser(true);
              } else {
                setSortByProximity(!sortByProximity);
              }
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md flex items-center gap-1.5 transition-all ${
              sortByProximity && userPosition
                ? 'bg-blue-600 text-white ring-2 ring-blue-400/40 shadow-blue-500/20'
                : 'bg-white/95 text-blue-700 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            {geoStatus === 'locating' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5" />
            )}
            <span>
              {userPosition 
                ? (sortByProximity ? '🎯 Plus proches d’abord' : 'Trier par proximité')
                : 'Me localiser'
              }
            </span>
          </button>

          {/* Distance Radius Filter (when located) */}
          {userPosition && (
            <button
              onClick={() => {
                if (maxDistanceFilter === null) setMaxDistanceFilter(25);
                else if (maxDistanceFilter === 25) setMaxDistanceFilter(50);
                else setMaxDistanceFilter(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur-md transition-all ${
                maxDistanceFilter !== null
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-white/90 text-[#6b665e] hover:bg-white'
              }`}
            >
              {maxDistanceFilter ? `Rayon < ${maxDistanceFilter} km` : 'Tous les rayons'}
            </button>
          )}

          {dynamicCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#c14e2f] text-white font-semibold ring-2 ring-[#c14e2f]/30'
                    : 'bg-white/90 text-[#6b665e] hover:bg-white hover:text-[#2c2926]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#f0ece1] text-[#8c867c]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Location Status Message & Simulator helper if user is denied or testing */}
        {geoErrorMsg && (
          <div className="bg-amber-50/95 border border-amber-200 text-amber-800 text-[11px] px-3 py-2 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{geoErrorMsg}</span>
            </div>
            <button 
              onClick={() => handleSetPresetLocation(6.3622, 2.0864, 'Ouidah')}
              className="underline font-semibold ml-2 text-amber-900"
            >
              Simuler Ouidah
            </button>
          </div>
        )}
      </div>

      {/* Floating Geolocation & Nearby Sites Action Bar (Right side) */}
      <div className="absolute right-4 top-36 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Locate Me Floating Action Button */}
        <button
          onClick={() => handleLocateUser(true)}
          disabled={geoStatus === 'locating'}
          className={`w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
            userPosition
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 ring-4 ring-blue-500/20'
              : 'bg-white text-[#2c2926] hover:bg-[#f5f1e8] active:scale-95 border border-[#e8e2d5]'
          }`}
          title={userPosition ? "Vous êtes localisé" : "Me géolocaliser"}
        >
          {geoStatus === 'locating' ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <LocateFixed className={`w-5 h-5 ${userPosition ? 'text-white' : 'text-[#c14e2f]'}`} />
          )}
        </button>

        {/* Nearby Sites List Quick Drawer Toggle */}
        <button
          onClick={() => setShowNearbyDrawer(!showNearbyDrawer)}
          className={`w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
            showNearbyDrawer 
              ? 'bg-[#c14e2f] text-white'
              : 'bg-white text-[#2c2926] hover:bg-[#f5f1e8] border border-[#e8e2d5]'
          }`}
          title="Liste des sites à proximité"
        >
          <ListFilter className="w-5 h-5" />
        </button>
      </div>

      {/* Main Map Rendering Area */}
      <div className="relative flex-1 w-full h-full">
        {viewEngine === 'interactive-map' ? (
          <LeafletMapView
            places={filteredPlaces}
            selectedPlace={activePlace}
            userPosition={userPosition}
            onSelectPlace={onSelectPlace}
            onOpenPlaceDetail={onOpenPlaceDetail}
            layerType={layerType}
          />
        ) : viewEngine === 'google-maps' ? (
          <GoogleMapView
            places={filteredPlaces}
            selectedPlace={activePlace}
            userPosition={userPosition}
            onSelectPlace={onSelectPlace}
            onOpenPlaceDetail={onOpenPlaceDetail}
            onSwitchToInteractiveMap={() => {
              setViewEngine('interactive-map');
              setLayerType('voyager');
            }}
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

      {/* Nearby Sites Quick Drawer (Overlay) */}
      {showNearbyDrawer && (
        <div className="absolute top-28 bottom-32 left-4 right-4 max-w-md mx-auto z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#e8e2d5] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-3.5 border-b border-[#f0ece1] flex items-center justify-between bg-[#fbf9f4]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <LocateFixed className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#2c2926]">
                  Sites culturels à proximité
                </h3>
                <p className="text-[11px] text-[#8c867c]">
                  {filteredPlaces.length} sanctuaires & monuments découverts
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNearbyDrawer(false)}
              className="p-1.5 rounded-lg text-[#8c867c] hover:text-[#2c2926] hover:bg-[#efece2]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick preset selector for instant exploration */}
          <div className="px-3.5 py-2 bg-[#f5f1e8]/60 border-b border-[#e8e2d5] flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            <span className="text-[10px] font-semibold text-[#8c867c] uppercase tracking-wider flex-shrink-0">
              Explorer depuis :
            </span>
            <button
              onClick={() => handleSetPresetLocation(6.3622, 2.0864, 'Ouidah')}
              className="px-2.5 py-1 rounded-lg bg-white text-[11px] font-medium text-[#2c2926] border border-[#e8e2d5] hover:border-[#c14e2f] flex-shrink-0 shadow-2xs"
            >
              📍 Ouidah
            </button>
            <button
              onClick={() => handleSetPresetLocation(6.3676, 2.4252, 'Cotonou')}
              className="px-2.5 py-1 rounded-lg bg-white text-[11px] font-medium text-[#2c2926] border border-[#e8e2d5] hover:border-[#c14e2f] flex-shrink-0 shadow-2xs"
            >
              📍 Cotonou
            </button>
            <button
              onClick={() => handleSetPresetLocation(7.1828, 1.9912, 'Abomey')}
              className="px-2.5 py-1 rounded-lg bg-white text-[11px] font-medium text-[#2c2926] border border-[#e8e2d5] hover:border-[#c14e2f] flex-shrink-0 shadow-2xs"
            >
              📍 Abomey
            </button>
            <button
              onClick={() => handleSetPresetLocation(6.4969, 2.6289, 'Porto-Novo')}
              className="px-2.5 py-1 rounded-lg bg-white text-[11px] font-medium text-[#2c2926] border border-[#e8e2d5] hover:border-[#c14e2f] flex-shrink-0 shadow-2xs"
            >
              📍 Porto-Novo
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPlaces.map((place) => {
              const badge = getProximityBadge(place.calculatedDistanceKm || place.distanceKm);
              return (
                <div
                  key={place.id}
                  onClick={() => {
                    onSelectPlace(place);
                    setShowNearbyDrawer(false);
                  }}
                  className="p-2.5 rounded-xl border border-[#e8e2d5] bg-white hover:border-[#c14e2f] hover:shadow-sm cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={place.image}
                      alt={place.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-[#e8e2d5]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-[#2c2926] truncate">
                          {place.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#8c867c] truncate">
                        {place.location}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-[#6b665e]">
                          {place.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="font-bold text-xs text-blue-600 block">
                      {formatDistance(place.calculatedDistanceKm || place.distanceKm)}
                    </span>
                    <span className="text-[10px] text-[#8c867c]">
                      de vous
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Place Bottom Sheet Card */}
      {activePlace && !showNearbyDrawer && (
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
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#2c2926] truncate">
                      {activePlace.name}
                    </h4>
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 border border-blue-100">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>
                        {formatDistance(activePlace.calculatedDistanceKm || activePlace.distanceKm)}
                      </span>
                    </div>
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
