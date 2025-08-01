import React, { useState } from 'react';
import { Search, MapPin, Plus, X } from 'lucide-react';
import { SurfSpot } from '../types';
import InteractiveSpotCreator from './InteractiveSpotCreator';

interface SurfSpotSearchProps {
  surfSpots: SurfSpot[];
  onSpotSelect: (spot: SurfSpot) => void;
  onCreateNewSpot: (spotData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => void;
  user: any;
  onTriggerOnboarding: () => void;
}

const SurfSpotSearch: React.FC<SurfSpotSearchProps> = ({
  surfSpots,
  onSpotSelect,
  onCreateNewSpot,
  user,
  onTriggerOnboarding
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInteractiveCreator, setShowInteractiveCreator] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const filteredSpots = surfSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSpot = () => {
    if (!user) {
      onTriggerOnboarding();
      return;
    }
    setShowInteractiveCreator(true);
  };

  const handleSpotCreate = (spotData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => {
    onCreateNewSpot(spotData);
    setShowInteractiveCreator(false);
  };

  const handleSpotClick = (spot: SurfSpot) => {
    onSpotSelect(spot);
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onFocus={() => setShowResults(searchTerm.length > 0)}
          placeholder="Search surf spots..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        <button
          onClick={handleCreateSpot}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
          title="Add new surf spot"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
          {filteredSpots.length > 0 ? (
            <div className="py-2">
              {filteredSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <MapPin className={`h-4 w-4 ${spot.isWSL ? 'text-yellow-500' : 'text-orange-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{spot.name}</span>
                      {spot.isWSL && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          WSL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{spot.description}</p>
                    <p className="text-xs text-gray-500">{spot.photoCount} photos</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-4 px-4 text-center text-gray-500">
              <p>No surf spots found</p>
              <button
                onClick={handleCreateSpot}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create new surf spot
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Spot Creator */}
      {showInteractiveCreator && (
        <InteractiveSpotCreator
          onSpotCreate={handleSpotCreate}
          onClose={() => setShowInteractiveCreator(false)}
        />
      )}

      {/* Click outside to close results */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default SurfSpotSearch;