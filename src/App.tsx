import { Analytics, track } from '@vercel/analytics/react';
import React, { useState } from 'react';
import { Camera, MapPin, Upload, Search, Filter, ShoppingCart, User, Waves as Wave } from 'lucide-react';
import Navigation from './components/Navigation';
import UserOnboarding from './components/UserOnboarding';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import UploadPage from './pages/UploadPage';
import AboutPage from './pages/AboutPage';
import { Photo, User as UserType, SurfSpot, Album } from './types';
import { defaultSurfSpots } from './data/surfSpotsData';
import { samplePhotos } from './data/sampleData';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'browse' | 'photo' | 'upload' | 'about'>('landing');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [cartItems, setCartItems] = useState<Photo[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewedPhotos, setViewedPhotos] = useState<Set<string>>(new Set());
  const [sessionStartTime] = useState<number>(Date.now());
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [photoLikes, setPhotoLikes] = useState<Record<string, number>>({});
  const [surfSpots, setSurfSpots] = useState<SurfSpot[]>(defaultSurfSpots);
  const [allPhotos, setAllPhotos] = useState<Photo[]>(samplePhotos);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    spot: '',
    dateRange: '',
    photographer: ''
  });

  const handleCreateSurfSpot = (spotData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => {
    const newSpot: SurfSpot = {
      id: Date.now().toString(),
      ...spotData,
      photoCount: 0,
      isWSL: false,
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
      albums: []
    };
    
    setSurfSpots(prev => [...prev, newSpot]);
    const updatedSpots = [...surfSpots, newSpot];
    localStorage.setItem('surfSpotterCustomSpots', JSON.stringify(updatedSpots.filter(spot => spot.createdBy)));
  };

  const handleCreateAlbum = (surfSpotId: string, albumData: Omit<Album, 'id' | 'createdAt'>) => {
    const newAlbum: Album = {
      ...albumData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setAllPhotos(prev => [...prev, ...newAlbum.photos]);

    setSurfSpots(prev => prev.map(spot => {
      if (spot.id === surfSpotId) {
        const updatedAlbums = [...(spot.albums || []), newAlbum];
        return {
          ...spot,
          albums: updatedAlbums,
          photoCount: spot.photoCount + newAlbum.photos.length
        };
      }
      return spot;
    }));

    localStorage.setItem('surfSpotterCustomAlbums', JSON.stringify([newAlbum]));
  };

  const handleLikePhoto = (photoId: string, currentLikes: number) => {
    if (!user) {
      setShowOnboarding(true);
      return;
    }

    const isLiked = likedPhotos.has(photoId);
    const newLikedPhotos = new Set(likedPhotos);
    const newPhotoLikes = { ...photoLikes };

    if (isLiked) {
      newLikedPhotos.delete(photoId);
      newPhotoLikes[photoId] = Math.max(0, (newPhotoLikes[photoId] || currentLikes) - 1);
    } else {
      newLikedPhotos.add(photoId);
      newPhotoLikes[photoId] = (newPhotoLikes[photoId] || currentLikes) + 1;
    }

    setLikedPhotos(newLikedPhotos);
    setPhotoLikes(newPhotoLikes);

    localStorage.setItem('surfSpotterLikedPhotos', JSON.stringify(Array.from(newLikedPhotos)));
    localStorage.setItem('surfSpotterPhotoLikes', JSON.stringify(newPhotoLikes));
  };

  const addToCart = (photo: Photo) => {
    if (!user) {
      setShowOnboarding(true);
      return;
    }
    setCartItems(prev => [...prev, photo]);
  };

  const navigateToPhoto = (photo: Photo) => {
    setViewedPhotos(prev => new Set([...prev, photo.id]));

    if (!user && viewedPhotos.size >= 2) {
      setShowOnboarding(true);
    }

    // ✅ Custom tracking: photo view
    track('view_photo', {
      photoId: photo.id,
      title: photo.title || '',
      spot: photo.spot || '',
      user: user?.id || 'guest'
    });

    setSelectedPhoto(photo);
    setCurrentPage('photo');
  };

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    setCurrentPage('browse');
  };

  React.useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 3 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleOnboardingComplete = (userData: any) => {
    const newUser: UserType = {
      id: Date.now().toString(),
      ...userData,
      interests: [],
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setShowOnboarding(false);
    localStorage.setItem('surfSpotterUser', JSON.stringify(newUser));
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('surfSpotterOnboardingSkipped', Date.now().toString());
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('surfSpotterUser');
    const savedLikedPhotos = localStorage.getItem('surfSpotterLikedPhotos');
    const savedPhotoLikes = localStorage.getItem('surfSpotterPhotoLikes');
    const savedCustomSpots = localStorage.getItem('surfSpotterCustomSpots');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const skippedTime = localStorage.getItem('surfSpotterOnboardingSkipped');
      if (skippedTime) {
        const timeSinceSkip = Date.now() - parseInt(skippedTime);
        if (timeSinceSkip < 24 * 60 * 60 * 1000) {
          return;
        }
      }
    }

    if (savedLikedPhotos) {
      setLikedPhotos(new Set(JSON.parse(savedLikedPhotos)));
    }

    if (savedPhotoLikes) {
      setPhotoLikes(JSON.parse(savedPhotoLikes));
    }

    if (savedCustomSpots) {
      const customSpots = JSON.parse(savedCustomSpots);
      setSurfSpots(prev => [...prev, ...customSpots]);
    }
  }, []);

  const triggerOnboarding = () => {
    if (!user) {
      setShowOnboarding(true);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onExplore={() => setCurrentPage('browse')} 
            onSearch={handleSearch}
            onAboutClick={() => setCurrentPage('about')} 
            onUploadClick={() => setCurrentPage('upload')} 
            user={user}
            onTriggerOnboarding={triggerOnboarding}
            surfSpots={surfSpots}
            onCreateSurfSpot={handleCreateSurfSpot}
            onCreateAlbum={handleCreateAlbum}
            allPhotos={allPhotos}
            onPhotoClick={navigateToPhoto}
            onLikePhoto={handleLikePhoto}
            likedPhotos={likedPhotos}
            photoLikes={photoLikes}
          />
        );
      case 'browse':
        return (
          <BrowsePage 
            onPhotoClick={navigateToPhoto}
            onTriggerOnboarding={triggerOnboarding}
            initialFilters={searchFilters}
            onLikePhoto={handleLikePhoto}
            likedPhotos={likedPhotos}
            photoLikes={photoLikes}
            user={user}
            surfSpots={surfSpots}
            onCreateSurfSpot={handleCreateSurfSpot}
            onCreateAlbum={handleCreateAlbum}
            allPhotos={allPhotos}
          />
        );
      case 'photo':
        return selectedPhoto ? (
          <PhotoDetailPage 
            photo={selectedPhoto} 
            onAddToCart={addToCart}
            onBack={() => setCurrentPage('browse')}
            onTriggerOnboarding={triggerOnboarding}
            onLikePhoto={handleLikePhoto}
            isLiked={likedPhotos.has(selectedPhoto.id)}
            currentLikes={photoLikes[selectedPhoto.id] || selectedPhoto.likes || 0}
          />
        ) : null;
      case 'upload':
        return (
          <UploadPage 
            onCreateSurfSpot={handleCreateSurfSpot}
            surfSpots={surfSpots}
          />
        );
      case 'about':
        return <AboutPage onBack={() => setCurrentPage('landing')} surfSpots={surfSpots} />;
      default:
        return (
          <LandingPage 
            onExplore={() => setCurrentPage('browse')} 
            onSearch={handleSearch}
            onAboutClick={() => setCurrentPage('about')} 
            user={user}
            onTriggerOnboarding={triggerOnboarding}
            surfSpots={surfSpots}
            onCreateSurfSpot={handleCreateSurfSpot}
            onCreateAlbum={handleCreateAlbum}
            allPhotos={allPhotos}
            onPhotoClick={navigateToPhoto}
            onLikePhoto={handleLikePhoto}
            likedPhotos={likedPhotos}
            photoLikes={photoLikes}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartCount={cartItems.length}
        user={user}
        onTriggerOnboarding={triggerOnboarding}
      />
      {showOnboarding && (
        <UserOnboarding onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}
      {renderPage()}
      <Analytics />
    </div>
  );
}

export default App;
