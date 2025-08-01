import React from 'react';
import { MapPin } from 'lucide-react';

interface WorldMapProps {
  onLocationClick: (location: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ onLocationClick }) => {
  const locations = [
    { name: 'Pipeline, Hawaii', x: 15, y: 40, count: 68 },
    { name: 'Gold Coast, Australia', x: 85, y: 70, count: 40 },
    { name: 'Jeffreys Bay, South Africa', x: 55, y: 75, count: 30 },
    { name: 'Ericeira, Portugal', x: 45, y: 35, count: 90 },
    { name: 'Uluwatu, Bali', x: 80, y: 60, count: 30 },
    { name: 'Tavarua, Fiji', x: 92, y: 60, count: 20 },
    { name: 'Mavericks, California', x: 12, y: 32, count: 90 }
  ];

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 my-8">
      {/* World Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Simplified world map paths */}
          <path
            d="M10 15 L25 12 L30 18 L35 15 L40 20 L45 18 L50 22 L55 20 L60 25 L65 22 L70 28 L75 25 L80 30 L85 27 L90 32"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M15 25 L20 22 L25 28 L30 25 L35 30 L40 27 L45 32 L50 29 L55 35 L60 32 L65 38"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Location Markers */}
      {locations.map((location, index) => (
        <button
          key={index}
          onClick={() => onLocationClick(location.name)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
        >
          <div className="relative">
            {/* Ping Animation */}
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            
            {/* Marker */}
            <div className="relative bg-white rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            
            {/* Count Badge */}
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium">
              {location.count}
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              <div className="font-medium">{location.name}</div>
              <div className="text-gray-300">{location.count} photos</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm font-medium text-gray-900 mb-2">Photo Locations</div>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Number of photos available</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;