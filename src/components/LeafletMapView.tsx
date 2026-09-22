import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place, Category } from '../types';
import { ShieldAlert, ArrowRight, Compass, Sparkles, Navigation, Layers } from 'lucide-react';
import { UserCoordinates } from '../lib/geo';
import { useI18n } from '../lib/i18n';

interface LeafletMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  userPosition: UserCoordinates | null;
  onSelectPlace: (place: Place) => void;
  layerType: 'street' | 'satellite' | 'terrain' | 'voyager';
  focusToken: number;
  onPanToUser?: () => void;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  places,
  selectedPlace,
  userPosition,
  onSelectPlace,
  layerType,
  focusToken
}) => {
  const { t } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

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

  const createUserLocationIcon = () => {
    const html = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-3 rounded-full bg-blue-500/30 animate-ping"></div>
        <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white ring-4 ring-blue-500/20">
          <div class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'user-location-marker',
      html,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Benin historical southern coastal & royal corridor
      const initialLat = userPosition ? userPosition.lat : 6.45;
      const initialLng = userPosition ? userPosition.lng : 2.25;
      const initialZoom = userPosition ? 12 : 9;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Imagerie &copy; Esri')
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

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let subdomains = 'abc';
    let maxZoom = 19;

    if (layerType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = '';
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
      subdomains,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [layerType]);

  // Update User Location Marker & Accuracy Halo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userCircleRef.current) {
      userCircleRef.current.remove();
      userCircleRef.current = null;
    }

    if (userPosition && userPosition.lat && userPosition.lng) {
      const userIcon = createUserLocationIcon();
      const marker = L.marker([userPosition.lat, userPosition.lng], { 
        icon: userIcon,
        zIndexOffset: 1000 
      }).addTo(map);

      const userPopup = document.createElement('div');
      userPopup.className = 'p-1 font-sans text-center text-[#2c2926]';
      userPopup.innerHTML = `
        <div class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          ${t('Vous êtes ici')}
        </div>
        <p class="text-[10px] text-[#6b665e]">
          ${t('Précision GPS: ~{distance}m', { distance: Math.round(userPosition.accuracy || 20) })}
        </p>
      `;
      marker.bindPopup(userPopup);
      userMarkerRef.current = marker;

      // Draw accuracy radius circle if accuracy is known
      if (userPosition.accuracy && userPosition.accuracy > 10) {
        const circle = L.circle([userPosition.lat, userPosition.lng], {
          radius: Math.min(userPosition.accuracy, 2000),
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1.5,
          dashArray: '4, 4'
        }).addTo(map);
        userCircleRef.current = circle;
      }
    }
  }, [userPosition, t]);

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
  }, [selectedPlace]);

  // Recadrer sur la sélection filtrée. Déclaré après le vol vers le lieu choisi : un clic sur
  // une puce modifie les deux dépendances dans le même rendu, et Leaflet garde l'animation
  // émise en dernier. Sans ce recadrage, filtrer sur « Nature » laissait la caméra posée sur la
  // côte pendant que les puces du Pendjari apparaissaient hors champ.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || focusToken === 0) return;

    const points = places
      .filter((p) => p.coordinates?.lat && p.coordinates?.lng)
      .map((p) => [p.coordinates.lat, p.coordinates.lng] as [number, number]);

    if (points.length === 0) return;
    if (points.length === 1) {
      map.flyTo(points[0], 13, { duration: 1.2, easeLinearity: 0.25 });
      return;
    }

    map.flyToBounds(L.latLngBounds(points).pad(0.2), {
      duration: 1.2,
      easeLinearity: 0.25,
      paddingTopLeft: [40, 116],
      paddingBottomRight: [40, 224],
      maxZoom: 14
    });
  }, [focusToken, places]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
