import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
  selectedLocation: string;
  selectedDate: string;
  selectedPhotographer: string;
  onLocationChange: (location: string) => void;
  onDateChange: (date: string) => void;
  onPhotographerChange: (photographer: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedLocation,
  selectedDate,
  selectedPhotographer,
  onLocationChange,
  onDateChange,
  onPhotographerChange
}) => {
  const locations = [
    'Pipeline, Hawaii',
    'Gold Coast, Australia',
    'Jeffreys Bay, South Africa',
    'Ericeira, Portugal',
    'Uluwatu, Bali',
    'Tavarua, Fiji',
    'Mavericks, California'
  ];

  const photographers = [
    'Alex Chen',
    'Maria Santos',
    'Jake Thompson',
    'Sophie Wilson',
    'Carlos Rodriguez'
  ];

  const dateRanges = [
    'Last 7 days',
    'Last 30 days',
    'Last 3 months',
    'Last year',
    'All time'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Location Filter */}
      <div className="relative">
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Location</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Date Filter */}
      <div className="relative">
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Date</option>
          {dateRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Photographer Filter */}
      <div className="relative">
        <select
          value={selectedPhotographer}
          onChange={(e) => onPhotographerChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Any photographer</option>
          {photographers.map((photographer) => (
            <option key={photographer} value={photographer}>
              {photographer}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default FilterBar;