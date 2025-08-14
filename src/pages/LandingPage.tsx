import React from 'react';
import { MapPin, Search, ChevronDown, Star, Award, Clock } from 'lucide-react';
import SatelliteWorldMap from '../components/SatelliteWorldMap';
import FloatingMenu from '../components/FloatingMenu';
import LocationPhotoRibbon from '../components/LocationPhotoRibbon';
import SurfSpotSearch from '../components/SurfSpotSearch';
import AlbumCreator from '../components/AlbumCreator';
import PhotoGrid from '../components/PhotoGrid';
import { User, SurfSpot, Album, Photo } from '../types';
import { getNearestSurfSpots, getUserCoordinates } from '../utils/locationUtils';

interface LandingPageProps {
  onExplore: () => void;
  onSearch: (filters: any) => void;
  onAboutClick: () => void;
  user: User | null;
  onTriggerOnboarding: () => void;
  surfSpots: SurfSpot[];
  onCreateSurfSpot: (spotData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => void;
  onCreateAlbum: (surfSpotId: string, albumData: Omit<Album, 'id' | 'createdAt'>) => void;
  allPhotos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onLikePhoto: (photoId: string, currentLikes: number) => void;
  likedPhotos: Set<string>;
  photoLikes: Record<string, number>;

  /** NEW (optional) */
  onUploadClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onSearch,
  onAboutClick,
  onUploadClick,
  user,
  onTriggerOnboarding,
  surfSpots,
  onCreateSurfSpot,
  onCreateAlbum,
  allPhotos,
  onPhotoClick,
  onLikePhoto,
  likedPhotos,
  photoLikes,
}) => {
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [selectedSpot, setSelectedSpot] = React.useState('');
  const [selectedDateRange, setSelectedDateRange] = React.useState('');
  const [selectedPhotographer, setSelectedPhotographer] = React.useState('');
  const [selectedSurfSpot, setSelectedSurfSpot] = React.useState<SurfSpot | null>(null);
  const [showAlbumCreator, setShowAlbumCreator] = React.useState(false);

  // Get today's featured photo (highest liked recent photo)
  const getTodaysFeaturedPhoto = () => {
    return allPhotos.sort(
      (a, b) => (photoLikes[b.id] || b.likes || 0) - (photoLikes[a.id] || a.likes || 0)
    )[0];
  };

  // Get location-based photos for the ribbon
  const getLocationPhotos = () => {
    if (!user?.location) return [];

    const userCoords = getUserCoordinates(user.location);
    if (!userCoords) return [];

    const nearestSpots = getNearestSurfSpots(userCoords, 3);
    const nearestSpotNames = nearestSpots.map((spot) => spot.name);

    return allPhotos
      .filter(
        (photo) =>
          nearestSpotNames.some((spotName) => photo.location.includes(spotName.split(',')[0])) ||
          photo.location.toLowerCase().includes(user.location.toLowerCase())
      )
      .sort((a, b) => (photoLikes[b.id] || b.likes || 0) - (photoLikes[a.id] || a.likes || 0))
      .slice(0, 6);
  };

  // Get recent uploads (last 7 photos by date)
  const getRecentUploads = () => {
    return [...allPhotos]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  };

  // Get top photographers
  const getTopPhotographers = () => {
    const photographerStats = allPhotos.reduce((acc, photo) => {
      const photographer = photo.photographer;
      if (!acc[photographer]) {
        acc[photographer] = { name: photographer, photos: 0, totalLikes: 0 };
      }
      acc[photographer].photos++;
      acc[photographer].totalLikes += photoLikes[photo.id] || photo.likes || 0;
      return acc;
    }, {} as Record<string, { name: string; photos: number; totalLikes: number }>);

    return Object.values(photographerStats).sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 3);
  };

  // ---- derive data ----
  const locationPhotos = getLocationPhotos();
  const featuredPhoto = getTodaysFeaturedPhoto();
  const recentUploads = getRecentUploads();
  const topPhotographers = getTopPhotographers();

  // HERO image: use featured photo, else fallback to /public/hero/hero.jpg (works with Vite base)
  const heroUrl =
    featuredPhoto?.imageUrl || new URL('/hero/hero.jpg', import.meta.env.BASE_URL).href;

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleSearchClick = () => {
    const filters = {
      location: selectedLocation,
      spot: selectedSpot,
      dateRange: selectedDateRange,
      photographer: selectedPhotographer,
    };
    onSearch(filters);
  };

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

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION - Full-screen stunning surf shot */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("${heroUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Epic Surf <span className="block text-orange-400">Photography</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover the world's most stunning surf photography from legendary breaks
          </p>

          {/* Buttons */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onExplore}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl"
            >
              Explore Photos
            </button>

            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="bg-white/90 hover:bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-2xl border border-white/40"
              >
                Upload your shot
              </button>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 2. SHOT OF THE DAY - Featured Photo */}
      {featuredPhoto && (
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="h-8 w-8 text-yellow-300 fill-current" />
                <h2 className="text-3xl font-bold text-white">Shot of the Day</h2>
                <Star className="h-8 w-8 text-yellow-300 fill-current" />
              </div>
              <p className="text-orange-100 text-lg">The most epic capture from our community</p>
            </div>

            <div
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => onPhotoClick(featuredPhoto)}
            >
              <img
                src={featuredPhoto.imageUrl}
                alt={featuredPhoto.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{featuredPhoto.title}</h3>
                  <p className="text-lg opacity-90 mb-2">by {featuredPhoto.photographer}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{featuredPhoto.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{photoLikes[featuredPhoto.id] || featuredPhoto.likes || 0} likes</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                  Featured
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. INSTANT PHOTO DISCOVERY - Best shots grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Most Epic Shots</h2>
            <p className="text-xl text-gray-600">
              Discover the most liked surf photography from around the world
            </p>
          </div>

          <PhotoGrid
            photos={allPhotos.slice(0, 6)}
            onPhotoClick={onPhotoClick}
            onLikePhoto={onLikePhoto}
            likedPhotos={likedPhotos}
            photoLikes={photoLikes}
          />

          <div className="text-center mt-8">
            <button
              onClick={onExplore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Photos
            </button>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE WORLD MAP */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Global Surf Spots</h2>
            <p className="text-xl text-gray-600">
              Click on any location to discover amazing surf photography
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 rounded-lg p-1.5 shadow-lg">
            <SatelliteWorldMap
              onLocationClick={(location) => {
                setSelectedLocation(location);
                onExplore();
              }}
              selectedLocation={selectedLocation}
              userLocation={user?.location}
              focusOnUserLocation={!!user?.location}
              surfSpots={surfSpots}
            />
          </div>
        </div>
      </section>

      {/* 5. LOCATION-BASED RECOMMENDATIONS */}
      {user?.location && locationPhotos.length > 0 && (
        <LocationPhotoRibbon
          photos={locationPhotos}
          location={user.location}
          onPhotoClick={onPhotoClick}
          onLikePhoto={onLikePhoto}
          likedPhotos={likedPhotos}
          photoLikes={photoLikes}
        />
      )}

      {/* 6. PHOTOGRAPHER SPOTLIGHTS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Award className="h-8 w-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900">Community Heroes</h2>
            </div>
            <p className="text-xl text-gray-600">Meet the talented photographers capturing the stoke</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {topPhotographers.map((photographer, index) => (
              <div key={photographer.name} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">
                      {photographer.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{photographer.name}</h3>
                <div className="space-y-1 text-gray-600">
                  <p>{photographer.photos} photos</p>
                  <p className="font-semibold text-orange-600">{photographer.totalLikes} total likes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RECENT UPLOADS - Fresh content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-8 w-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-gray-900">Fresh Uploads</h2>
            </div>
            <p className="text-xl text-gray-600">The latest surf photography from our community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentUploads.map((photo) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer"
                onClick={() => onPhotoClick(photo)}
              >
                <div className="aspect-square rounded-lg overflow-hidden shadow-md">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-semibold text-sm">{photo.title}</p>
                    <p className="text-xs opacity-90">{photo.photographer}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  NEW
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SEARCH & FILTERS - Advanced discovery */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Shot</h2>
            <p className="text-xl text-gray-600">Search by location, photographer, or surf spot</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchClick();
            }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for surf spots, locations, or photographers..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-lg"
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Location</option>
                  {surfSpots.map((spot) => (
                    <option key={spot.id} value={spot.name}>
                      {spot.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedSpot}
                  onChange={(e) => setSelectedSpot(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Surf Spot</option>
                  {surfSpots.map((spot) => (
                    <option key={spot.id} value={spot.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                      {spot.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Date</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedPhotographer}
                  onChange={(e) => setSelectedPhotographer(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Photographer</option>
                  {topPhotographers.map((photographer) => (
                    <option key={photographer.name} value={photographer.name}>
                      {photographer.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 text-lg"
            >
              <Search className="h-5 w-5" />
              <span>Search Epic Photos</span>
            </button>
          </form>
        </div>
      </section>

      {/* 9. MAJOR SURF EVENTS */}
      <section className="py-16 bg-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Major Surf Events & Competitions</h2>
            <p className="text-lg text-gray-700">Follow the world's best surf competitions and events</p>
          </div>

          <div className="flex justify-center items-center space-x-8 flex-wrap gap-y-4">
            <a
              href="https://www.worldsurfleague.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/World_Surf_League_Logo.png" alt="World Surf League" className="w-12 h-12 object-contain" />
              </div>
            </a>
            <a
              href="https://www.vanstriplecrownofsurfing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs">VANS</span>
              </div>
            </a>
            <a
              href="https://www.quiksilver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <span className="text-gray-800 font-bold text-xs">QUIK</span>
              </div>
            </a>
            <a
              href="https://www.ripcurl.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <span className="text-gray-800 font-bold text-xs">RIP</span>
              </div>
            </a>
            <a
              href="https://www.billabong.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <span className="text-gray-800 font-bold text-xs">BILL</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <FloatingMenu onAboutClick={onAboutClick} />

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

export default LandingPage;
