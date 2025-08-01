import React from 'react';
import { MapPin, Heart, Star } from 'lucide-react';
import { Photo } from '../types';

interface LocationPhotoRibbonProps {
  photos: Photo[];
  location: string;
  onPhotoClick: (photo: Photo) => void;
  onLikePhoto: (photoId: string, currentLikes: number) => void;
  likedPhotos: Set<string>;
  photoLikes: Record<string, number>;
}

const LocationPhotoRibbon: React.FC<LocationPhotoRibbonProps> = ({
  photos,
  location,
  onPhotoClick,
  onLikePhoto,
  likedPhotos,
  photoLikes
}) => {
  if (photos.length === 0) return null;

  const handleLikeClick = (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    onLikePhoto(photo.id, photo.likes || 0);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold text-white">
              Most Liked Photos from {location}
            </h2>
          </div>
          <p className="text-blue-100">
            Discover the most popular surf photography from your area
          </p>
        </div>

        {/* Photo Ribbon */}
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {photos.map((photo) => {
              const isLiked = likedPhotos.has(photo.id);
              const currentLikes = photoLikes[photo.id] || photo.likes || 0;
              
              return (
                <div
                  key={photo.id}
                  className="flex-shrink-0 group cursor-pointer"
                  onClick={() => onPhotoClick(photo)}
                >
                  <div className="relative w-80 h-60 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20">
                      {/* Top badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {/* Popular badge */}
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Popular</span>
                        </div>
                        
                        {/* Price */}
                        <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-semibold text-sm">
                          ${photo.price}
                        </div>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white mb-3">
                          <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                          <p className="text-sm opacity-90">by {photo.photographer}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-white text-sm">
                            <Heart className="h-4 w-4" />
                            <span>{currentLikes} likes</span>
                          </div>
                          
                          <button
                            onClick={(e) => handleLikeClick(e, photo)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                              isLiked 
                                ? 'bg-red-500/80 text-white' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {photos.slice(0, 5).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationPhotoRibbon;