import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Photo } from '../types';

interface PhotoDetailPageProps {
  photo: Photo;
  onAddToCart: (photo: Photo) => void;
  onBack: () => void;
  onTriggerOnboarding: () => void;
  onLikePhoto: (photoId: string, currentLikes: number) => void;
  isLiked: boolean;
  currentLikes: number;
}

const PhotoDetailPage: React.FC<PhotoDetailPageProps> = ({ 
  photo, 
  onAddToCart, 
  onBack, 
  onTriggerOnboarding, 
  onLikePhoto, 
  isLiked, 
  currentLikes 
}) => {
  const handleLikeClick = () => {
    onLikePhoto(photo.id, photo.likes || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Photo */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{photo.title}</h1>
              <p className="text-gray-600">Photographer Name</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => onAddToCart(photo)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Buy ${photo.price}
              </button>
              
              <button
                onClick={handleLikeClick}
                className={`font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 ${
                  isLiked 
                    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
                <span className="bg-white px-2 py-1 rounded text-sm">
                  {currentLikes}
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">{photo.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Date</h3>
                <p className="text-gray-600">{photo.date}</p>
              </div>
            </div>

            {photo.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{photo.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;