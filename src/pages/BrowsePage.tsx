import React, { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import SatelliteWorldMap from '../components/SatelliteWorldMap';
import PhotoGrid from '../components/PhotoGrid';
import SurfSpotSearch from '../components/SurfSpotSearch';
import AlbumCreator from '../components/AlbumCreator';
import ActiveFilters from '../components/ActiveFilters';
import { Photo, User, SurfSpot, Album } from '../types';

type FiltersShape = {
  location?: string;
  spot?: string;          // reserved for later (kept for parity with LandingPage)
  dateRange?: string;
  photographer?: string;
};

interface BrowsePageProps {
  onPhotoClick: (photo: Photo) => void;
  onTriggerOnboarding: () => void;
  onLikePhoto: (photoId: string, currentLikes: number) => void;
  likedPhotos: Set<string>;
  photoLikes: Record<string, number>;
  user: User | null;
  surfSpots: SurfSpot[];
  onCreateSurfSpot: (spotData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => void;
  onCreateAlbum: (surfSpotId: string, albumData: Omit<Album, 'id' | 'createdAt'>) => void;
  allPhotos: Photo[];
  initialFilters?: {
    location: string;
    spot: string;
    dateRange: string;
    photographer: string;
  };
}

const BrowsePage: React.FC<BrowsePageProps> = ({
  onPhotoClick,
  onTriggerOnboarding,
  onLikePhoto,
  likedPhotos,
  photoLikes,
  user,
  surfSpots,
  onCreateSurfSpot,
  onCreateAlbum,
  allPhotos,
  initialFilters
}) => {
  // Free text search
  const [searchTerm, setSearchTerm] = useState('');

  // Filter controls (kept separate for easy binding to selects)
  const [selectedLocation, setSelectedLocation] = useState(initialFilters?.location || '');
  const [selectedDate, setSelectedDate] = useState(initialFilters?.dateRange || '');
  const [selectedPhotographer, setSelectedPhotographer] = useState(initialFilters?.photographer || '');

  // Album creation state
  const [selectedSurfSpot, setSelectedSurfSpot] = useState<SurfSpot | null>(null);
  const [showAlbumCreator, setShowAlbumCreator] = useState(false);

  // Keep selects in sync when parent passes new initialFilters
  React.useEffect(() => {
    if (initialFilters) {
      setSelectedLocation(initialFilters.location || '');
      setSelectedDate(initialFilters.dateRange || '');
      setSelectedPhotographer(initialFilters.photographer || '');
    }
  }, [initialFilters]);

  // Derived filters object (used by chip bar)
  const filters: FiltersShape = useMemo(
    () => ({
      location: selectedLocation || undefined,
      spot: undefined, // not used yet on this page
      dateRange: selectedDate || undefined,
      photographer: selectedPhotographer || undefined
    }),
    [selectedLocation, selectedDate, selectedPhotographer]
  );

  // Clear one filter from the chip bar
  const clearFilterKey = (key: keyof FiltersShape) => {
    if (key === 'location') setSelectedLocation('');
    if (key === 'dateRange') setSelectedDate('');
    if (key === 'photographer') setSelectedPhotographer('');
    // if (key === 'spot') setSelectedSpot(''); // future
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedLocation('');
    setSelectedDate('');
    setSelectedPhotographer('');
    setSearchTerm('');
  };

  // Simple date range matcher
  const dateMatches = (photoDateISO: string) => {
    if (!selectedDate) return true;
    const now = Date.now();
    const ts = new Date(photoDateISO).getTime();
    if (Number.isNaN(ts)) return false;

    switch (selectedDate) {
      case 'Last 7 days':
        return ts >= now - 7 * 24 * 60 * 60 * 1000;
      case 'Last 30 days':
        return ts >= now - 30 * 24 * 60 * 60 * 1000;
      case 'Last 3 months':
        return ts >= now - 90 * 24 * 60 * 60 * 1000;
      case 'Last year':
        return ts >= now - 365 * 24 * 60 * 60 * 1000;
      case 'All time':
        return true;
      default:
        return true;
    }
  };

  // Filter the photos
  const filteredPhotos = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allPhotos.filter((photo) => {
      const matchesSearch =
        !q ||
        (photo.title && photo.title.toLowerCase().includes(q)) ||
        (photo.location && photo.location.toLowerCase().includes(q)) ||
        (photo.photographer && photo.photographer.toLowerCase().includes(q));

      const matchesLocation =
        !selectedLocation || (photo.location && photo.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      const matchesPhotographer =
        !selectedPhotographer || photo.photographer === selectedPhotographer;

      const matchesDate = dateMatches(photo.date);

      return matchesSearch && matchesLocation && matchesPhotographer && matchesDate;
    });
  }, [allPhotos, searchTerm, selectedLocation, selectedPhotographer, selectedDate]);

  const photographers = [
    'Alex Chen',
    'Maria Santos',
    'Jake Thompson',
    'Sophie Wilson',
    'Carlos Rodriguez'
  ];

  // Album creation handlers
  const handleSurfSpotSelect = (spot: SurfSpot) => {
    setSelectedSurfSpot(spot);
    if (!user) {
      onTriggerOnboarding();
      return;
    }
    setShowAlbumCreator(true);
  };

  const handleAlbumCreate = (albumData: Omit<Album, 'id' | 'createdAt'>) => {
    if (selectedSurfSpot) {
      onCreateAlbum(selectedSurfSpot.id, albumData);
      setShowAlbumCreator(false);
      setSelectedSurfSpot(null);
    }
  };

  // Submit search (Enter in the text box)
  const submitSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // nothing else needed—`searchTerm` already drives filtering
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Satellite World Map */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 rounded-lg p-1.5 shadow-lg">
            <SatelliteWorldMap
              onLocationClick={(location) => setSelectedLocation(location)}
              surfSpots={surfSpots}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-5">
            {/* Free-text search (submits on Enter) */}
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search photos, locations, or photographers…"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-lg"
              />
            </form>

            {/* Surf Spot Search & create album */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Surf Spots or Create New Album
              </label>
              <SurfSpotSearch
                surfSpots={surfSpots}
                onSpotSelect={handleSurfSpotSelect}
                onCreateNewSpot={onCreateSurfSpot}
                user={user}
                onTriggerOnboarding={onTriggerOnboarding}
              />
            </div>

            {/* Select filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Location</option>
                  {surfSpots.map((spot) => (
                    <option key={spot.id} value={spot.name}>
                      {spot.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Date</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 3 months">Last 3 months</option>
                  <option value="Last year">Last year</option>
                  <option value="All time">All time</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Photographer Filter */}
              <div className="relative">
                <select
                  value={selectedPhotographer}
                  onChange={(e) => setSelectedPhotographer(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any photographer</option>
                  {photographers.map((photographer) => (
                    <option key={photographer} value={photographer}>
                      {photographer}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters chip bar */}
            <ActiveFilters
              filters={filters}
              onClearKey={clearFilterKey}
              onClearAll={clearAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhotoGrid
          photos={filteredPhotos}
          onPhotoClick={onPhotoClick}
          onLikePhoto={onLikePhoto}
          likedPhotos={likedPhotos}
          photoLikes={photoLikes}
        />
      </div>

      {/* Album Creator Modal */}
      {showAlbumCreator && selectedSurfSpot && user && (
        <AlbumCreator
          surfSpot={selectedSurfSpot}
          user={user}
          onAlbumCreate={handleAlbumCreate}
          onClose={() => {
            setShowAlbumCreator(false);
            setSelectedSurfSpot(null);
          }}
        />
      )}
    </div>
  );
};

export default BrowsePage;
