import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place, Category } from '../types';
import { ShieldAlert, ArrowRight, Compass, Sparkles, Navigation, Layers } from 'lucide-react';

interface LeafletMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onOpenPlaceDetail: (place: Place) => void;
  layerType: 'street' | 'satellite' | 'terrain' | 'voyager';
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenPlaceDetail,
  layerType
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Helper for pin styling
  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'Spiritual':
        return '#c14e2f'; // Terracotta sacred
      case 'Historical':
        return '#5a5a40'; // Olive Dahomey
      case 'Nature':
        return '#2e5a44'; // Forest green
      case 'Arts':
        return '#d9822b'; // Indigo / bronze gold
      default:
        return '#2c2926';
    }
  };

  const createCustomIcon = (place: Place, isSelected: boolean) => {
    const color = getCategoryColor(place.category);
    const size = isSelected ? 42 : 34;
    const pulseRing = isSelected ? `<div class="absolute -inset-2.5 rounded-full border-2 border-[${color}] animate-ping opacity-75"></div>` : '';

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}">
        ${pulseRing}
        <div style="background-color: ${color}; width: ${size}px; height: ${size}px;" class="rounded-full shadow-lg flex items-center justify-center text-white border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? 20 : 16}" height="${isSelected ? 20 : 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Benin historical southern coastal & royal corridor
      const map = L.map(mapContainerRef.current, {
        center: [6.45, 2.25],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
      });

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & CartoDB')
        .addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance intact across minor renders, cleanup if container detached
    };
  }, []);

  // Update Tile Layer based on layerType
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;

    if (layerType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 18;
    } else if (layerType === 'terrain') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
    } else if (layerType === 'street') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    }

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [layerType]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: L.Marker) => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    });
    markersRef.current = {};

    places.forEach((place) => {
      if (!place.coordinates?.lat || !place.coordinates?.lng) return;

      const isSelected = selectedPlace?.id === place.id;
      const icon = createCustomIcon(place, isSelected);

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => {
          onSelectPlace(place);
        });

      // Bind popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-[#2c2926] max-w-[240px]';
      popupContent.innerHTML = `
        <div class="relative h-20 w-full rounded-lg overflow-hidden mb-1.5 bg-[#e8e2d5]">
          <img src="${place.image}" alt="${place.name}" class="w-full h-full object-cover" />
          <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
            ${place.category}
          </span>
        </div>
        <h4 class="font-bold text-xs text-[#2c2926] leading-snug">${place.name}</h4>
        <p class="text-[11px] text-[#6b665e] line-clamp-2 mt-0.5">${place.description}</p>
        <button id="btn-explore-${place.id}" class="w-full mt-2 py-1 px-2 rounded-lg bg-[#c14e2f] text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm hover:bg-[#a83f23]">
          Explorer le lieu &rarr;
        </button>
      `;

      popupContent.querySelector(`#btn-explore-${place.id}`)?.addEventListener('click', () => {
        onOpenPlaceDetail(place);
      });

      marker.bindPopup(popupContent, { offset: [0, -10] });
      markersRef.current[place.id] = marker;
    });
  }, [places, selectedPlace]);

  // Pan to selected place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace?.coordinates?.lat || !selectedPlace?.coordinates?.lng) return;

    map.flyTo([selectedPlace.coordinates.lat, selectedPlace.coordinates.lng], 13, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const marker = markersRef.current[selectedPlace.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
