import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, MapPin, Search, Navigation, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveLocationPickerProps {
  onLocationCreate: (locationData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => void;
  onClose: () => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to handle map view updates
const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.0 });
  }, [map, center, zoom]);
  
  return null;
};

const InteractiveLocationPicker: React.FC<InteractiveLocationPickerProps> = ({ onLocationCreate, onClose }) => {
  const [locationData, setLocationData] = useState({
    name: '',
    coordinates: { lat: 0, lng: 0 },
    description: ''
  });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Handle map click to select location
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    const coordinates = { lat, lng };
    setSelectedLocation(coordinates);
    setLocationData(prev => ({ ...prev, coordinates }));
    
    // Reverse geocode to get location name suggestion
    reverseGeocode(lat, lng);
  }, []);

  // Reverse geocoding using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Extract relevant location parts
        const address = data.address || {};
        const locationParts = [
          address.village || address.town || address.city,
          address.state || address.region,
          address.country
        ].filter(Boolean);
        
        const suggestedName = locationParts.join(', ');
        if (suggestedName && !locationData.name) {
          setLocationData(prev => ({ ...prev, name: suggestedName }));
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  // Search for locations using Nominatim
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results || []);
    } catch (error) {
      console.error('Location search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const coordinates = { lat, lng };
    
    setSelectedLocation(coordinates);
    setLocationData(prev => ({ 
      ...prev, 
      coordinates,
      name: prev.name || result.display_name.split(',')[0]
    }));
    setMapCenter([lat, lng]);
    setMapZoom(14);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordinates = { lat, lng };
          
          setSelectedLocation(coordinates);
          setLocationData(prev => ({ ...prev, coordinates }));
          setMapCenter([lat, lng]);
          setMapZoom(15);
          
          reverseGeocode(lat, lng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your current location. Please click on the map or search for a location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationData.name && locationData.coordinates.lat && locationData.coordinates.lng) {
      onLocationCreate(locationData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Location</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Location</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click on the map, search for a location, or use your current location
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchLocation(e.target.value);
                      }}
                      placeholder="Search for a location..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Navigation className="h-4 w-4" />
                    <span className="hidden sm:inline">Current</span>
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchResultSelect(result)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900 truncate">
                          {result.display_name.split(',')[0]}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {result.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Map */}
              <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapViewController center={mapCenter} zoom={mapZoom} />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                  )}
                </MapContainer>
              </div>

              {selectedLocation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-800">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Location Selected</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationData.name}
                    onChange={(e) => setLocationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Secret Spot, Bali"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={locationData.coordinates.lat || ''}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value) || 0;
                        setLocationData(prev => ({
                          ...prev,
                          coordinates: { ...prev.coordinates, lat }
                        }));
                        if (lat && locationData.coordinates.lng) {
                          setSelectedLocation({ lat, lng: locationData.coordinates.lng });
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="-8.8290"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={locationData.coordinates.lng || ''}
                      onChange={(e) => {
                        const lng = parseFloat(e.target.value) || 0;
                        setLocationData(prev => ({
                          ...prev,
                          coordinates: { ...prev.coordinates, lng }
                        }));
                        if (locationData.coordinates.lat && lng) {
                          setSelectedLocation({ lat: locationData.coordinates.lat, lng });
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="115.0840"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={locationData.description}
                    onChange={(e) => setLocationData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                    placeholder="Brief description of the location..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click anywhere on the map to set the location</li>
                    <li>• Use the search bar to find known places quickly</li>
                    <li>• The location will be added to all dropdown menus</li>
                    <li>• Be as specific as possible with the name</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!locationData.name || !locationData.coordinates.lat || !locationData.coordinates.lng}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Location</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLocationPicker;