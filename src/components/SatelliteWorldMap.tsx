import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SurfSpot } from '../types';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom surf spot marker icon
const createSurfSpotIcon = (count: number, isWSL: boolean = false) => {
  const bgColor = isWSL ? 'bg-yellow-500' : 'bg-orange-500';
  const pingColor = isWSL ? 'bg-yellow-400' : 'bg-orange-400';
  
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute inset-0 ${pingColor} rounded-full animate-ping opacity-40"></div>
        <div class="relative ${bgColor} rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
          ${isWSL ? 
            `<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>` :
            `<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>`
          }
        </div>
        <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold">
          ${count}
        </div>
        ${isWSL ? '<div class="absolute -bottom-1 -right-1 bg-yellow-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">WSL</div>' : ''}
      </div>
    `,
    className: 'custom-surf-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};


interface SatelliteWorldMapProps {
  onLocationClick: (location: string) => void;
  selectedLocation?: string;
  userLocation?: string;
  focusOnUserLocation?: boolean;
  surfSpots?: SurfSpot[];
}


// Component to set the map view
const MapController: React.FC<{ 
  selectedLocation?: string; 
  userLocation?: string;
  focusOnUserLocation?: boolean;
  surfSpots?: SurfSpot[];
}> = ({ selectedLocation, userLocation, focusOnUserLocation, surfSpots }) => {
  const map = useMap();
  
  useEffect(() => {
    if (focusOnUserLocation && userLocation) {
      // Focus on user's location area
      const userCoords = getUserCoordinates(userLocation);
      if (userCoords) {
        const mapView = getMapViewForLocation(userLocation);
        map.setView([mapView.center.lat, mapView.center.lng], mapView.zoom, { 
          animate: true, 
          duration: 1.5 
        });
        return;
      }
    }
    
    if (selectedLocation) {
      const spot = surfSpots?.find(s => s.name === selectedLocation);
      if (spot) {
        // Zoom to the selected location
        map.setView([spot.coordinates.lat, spot.coordinates.lng], 8, { animate: true, duration: 1.5 });
      }
    } else {
      // Set initial view to show the world
      map.setView([20, 0], 2);
    }
  }, [map, selectedLocation, userLocation, focusOnUserLocation, surfSpots]);

  return null;
};

// Import the utility functions
import { getUserCoordinates, getMapViewForLocation } from '../utils/locationUtils';

const SatelliteWorldMap: React.FC<SatelliteWorldMapProps> = ({ 
  onLocationClick, 
  selectedLocation, 
  userLocation,
  focusOnUserLocation,
  surfSpots = []
}) => {
  // Get initial map view based on user location
  const getInitialView = (): { center: [number, number]; zoom: number } => {
    if (focusOnUserLocation && userLocation) {
      const mapView = getMapViewForLocation(userLocation);
      return {
        center: [mapView.center.lat, mapView.center.lng],
        zoom: mapView.zoom
      };
    }
    return { center: [20, 0], zoom: 2 };
  };

  const initialView = getInitialView();

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={initialView.center}
        zoom={initialView.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        attributionControl={false}
        minZoom={2}
        maxZoom={18}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <MapController 
          selectedLocation={selectedLocation} 
          userLocation={userLocation}
          focusOnUserLocation={focusOnUserLocation}
          surfSpots={surfSpots}
        />
        
        {/* Satellite Tile Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          maxZoom={18}
        />
        
        {/* Surf Spot Markers */}
        {surfSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.coordinates.lat, spot.coordinates.lng]}
            icon={createSurfSpotIcon(spot.photoCount, spot.isWSL)}
            eventHandlers={{
              click: () => onLocationClick(spot.name)
            }}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{spot.name}</h3>
                  {spot.isWSL && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      WSL
                    </span>
                  )}
                  {spot.createdBy && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{spot.description}</p>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <span className={`${spot.isWSL ? 'bg-yellow-500' : 'bg-orange-500'} text-white px-2 py-1 rounded-full font-medium`}>
                    {spot.photoCount} photos
                  </span>
                </div>
                <button
                  onClick={() => onLocationClick(spot.name)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Photos
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Controls Info */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <div>Click markers to explore photos</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>WSL Championship Tour</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Famous surf spots</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>User-created spots</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteWorldMap;