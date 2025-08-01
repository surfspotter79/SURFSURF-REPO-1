import React from 'react';
import { MapPin, User, ShoppingCart, Heart } from 'lucide-react';
import { Photo } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onLikePhoto: (photoId: string, currentLikes: number) => void;
  likedPhotos: Set<string>;
  photoLikes: Record<string, number>;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, onLikePhoto, likedPhotos, photoLikes }) => {
  const handleLikeClick = (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation(); // Prevent photo click when clicking like button
    onLikePhoto(photo.id, photo.likes || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => {
        const isLiked = likedPhotos.has(photo.id);
        const currentLikes = photoLikes[photo.id] || photo.likes || 0;
        
        return (
          <div
            key={photo.id}
            onClick={() => onPhotoClick(photo)}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            {/* Photo */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{photo.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => handleLikeClick(e, photo)}
                        className={`bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors ${
                          isLiked ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <span>{new Date(photo.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full font-semibold text-sm shadow-lg">
                ${photo.price}
              </div>

              {/* Like Count Badge */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{currentLikes}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {photo.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{photo.photographer}</span>
                </div>
                <span>{photo.date}</span>
              </div>

              {/* Tags */}
              {photo.tags && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {photo.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {photo.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{photo.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGrid;