import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { Place, Category } from '../types';
import { ShieldAlert, ArrowRight, Compass, Sparkles, Navigation, Layers, AlertCircle } from 'lucide-react';

interface GoogleMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onOpenPlaceDetail: (place: Place) => void;
}

// Sub-component to handle programmatically controlling camera pan
const MapController: React.FC<{ selectedPlace: Place | null }> = ({ selectedPlace }) => {
  const map = useMap();

  useEffect(() => {
    if (map && selectedPlace?.coordinates?.lat && selectedPlace?.coordinates?.lng) {
      map.panTo({
        lat: selectedPlace.coordinates.lat,
        lng: selectedPlace.coordinates.lng
      });
      map.setZoom(13);
    }
  }, [map, selectedPlace]);

  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenPlaceDetail
}) => {
  const [activeMarkerPlace, setActiveMarkerPlace] = useState<Place | null>(selectedPlace);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');
  const [hasError, setHasError] = useState(false);

  // Injected Google Maps Platform API Key
  const apiKey = 
    ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || 
    'AIzaSyC7Sjhb4l7AyU69Pi6Nmyf5odSZcIDFfFg';

  // Default center around Ouidah / Cotonou / Abomey historical axis in Benin
  const defaultCenter = { 
    lat: selectedPlace?.coordinates?.lat || 6.3622, 
    lng: selectedPlace?.coordinates?.lng || 2.0864 
  };

  const getPinColors = (category: Category) => {
    switch (category) {
      case 'Spiritual':
        return { background: '#c14e2f', glyphColor: '#ffffff', borderColor: '#802610' };
      case 'Historical':
        return { background: '#5a5a40', glyphColor: '#ffffff', borderColor: '#333320' };
      case 'Nature':
        return { background: '#2e5a44', glyphColor: '#ffffff', borderColor: '#193426' };
      case 'Arts':
        return { background: '#d9822b', glyphColor: '#ffffff', borderColor: '#8a4b08' };
      default:
        return { background: '#2c2926', glyphColor: '#ffffff', borderColor: '#000000' };
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f5f1e8] p-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#c14e2f] mb-3" />
        <h3 className="font-serif font-bold text-lg text-[#2c2926]">Affichage Google Maps Optimisé</h3>
        <p className="text-xs text-[#6b665e] max-w-sm mt-1">
          Basculez sur la Carte Interactive Haute Définition ou Satellite pour explorer les sites sans interruption.
        </p>
        <button
          onClick={() => setHasError(false)}
          className="mt-4 px-4 py-2 bg-[#c14e2f] text-white text-xs font-semibold rounded-xl"
        >
          Réessayer le chargement
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <APIProvider 
        apiKey={apiKey} 
        language="fr" 
        region="BJ"
        onLoad={() => setHasError(false)}
        onError={() => setHasError(true)}
      >
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={11}
          mapId="DEMO_MAP_ID"
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
        >
          <MapController selectedPlace={selectedPlace} />

          {/* Place Markers */}
          {places.map((place) => {
            if (!place.coordinates?.lat || !place.coordinates?.lng) return null;
            const colors = getPinColors(place.category);
            const isSelected = selectedPlace?.id === place.id;

            return (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
                title={place.name}
                onClick={() => {
                  setActiveMarkerPlace(place);
                  onSelectPlace(place);
                }}
              >
                <div className={`transition-transform duration-200 cursor-pointer ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}`}>
                  <Pin
                    background={colors.background}
                    glyphColor={colors.glyphColor}
                    borderColor={colors.borderColor}
                    scale={isSelected ? 1.25 : 1.0}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Info Window on Selected Place */}
          {activeMarkerPlace && activeMarkerPlace.coordinates?.lat && (
            <InfoWindow
              position={{
                lat: activeMarkerPlace.coordinates.lat,
                lng: activeMarkerPlace.coordinates.lng
              }}
              onCloseClick={() => setActiveMarkerPlace(null)}
              maxWidth={300}
            >
              <div className="p-1 font-sans text-[#2c2926]">
                <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-[#e8e2d5]">
                  <img
                    src={activeMarkerPlace.image}
                    alt={activeMarkerPlace.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                    {activeMarkerPlace.category}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#2c2926] leading-tight">
                  {activeMarkerPlace.name}
                </h4>
                <p className="text-[11px] text-[#6b665e] mt-1 line-clamp-2">
                  {activeMarkerPlace.description}
                </p>

                {activeMarkerPlace.etiquette?.[0] && (
                  <div className="flex items-center gap-1 text-[10px] text-[#5a5a40] bg-[#efece2] px-1.5 py-0.5 rounded mt-1.5">
                    <ShieldAlert className="w-3 h-3 text-[#5a5a40] flex-shrink-0" />
                    <span className="truncate">{activeMarkerPlace.etiquette[0].title}</span>
                  </div>
                )}

                <button
                  onClick={() => onOpenPlaceDetail(activeMarkerPlace)}
                  className="w-full mt-2.5 py-1.5 px-3 rounded-lg bg-[#c14e2f] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm hover:bg-[#a83f23] transition-all cursor-pointer"
                >
                  <span>Explorer le lieu</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Map Layer Switcher Floating Pill */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-[#e8e2d5]">
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
            mapType === 'roadmap' ? 'bg-[#c14e2f] text-white shadow-sm' : 'text-[#6b665e] hover:bg-[#f5f1e8]'
          }`}
        >
          Plan
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
            mapType === 'satellite' ? 'bg-[#c14e2f] text-white shadow-sm' : 'text-[#6b665e] hover:bg-[#f5f1e8]'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapType('terrain')}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
            mapType === 'terrain' ? 'bg-[#c14e2f] text-white shadow-sm' : 'text-[#6b665e] hover:bg-[#f5f1e8]'
          }`}
        >
          Relief
        </button>
      </div>
    </div>
  );
};
