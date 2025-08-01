import React, { useState, useRef } from 'react';
import { Upload, X, Plus, MapPin, Camera } from 'lucide-react';
import { SurfSpot, Album, User } from '../types';

interface AlbumCreatorProps {
  surfSpot: SurfSpot;
  user: User;
  onAlbumCreate: (album: Omit<Album, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const AlbumCreator: React.FC<AlbumCreatorProps> = ({
  surfSpot,
  user,
  onAlbumCreate,
  onClose
}) => {
  const [albumData, setAlbumData] = useState({
    title: '',
    description: '',
    photos: [] as File[]
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      setAlbumData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAlbumData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    }
  };

  const removePhoto = (index: number) => {
    setAlbumData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (albumData.title && albumData.photos.length > 0) {
      // Convert files to Photo objects (in real app, you'd upload to server first)
      const photos = albumData.photos.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        title: `${albumData.title} - Photo ${index + 1}`,
        photographer: user.username,
        location: surfSpot.name,
        date: new Date().toISOString().split('T')[0],
        price: 25, // Default price
        imageUrl: URL.createObjectURL(file), // Temporary URL for demo
        description: albumData.description,
        tags: [surfSpot.name.toLowerCase().replace(/[^a-z0-9]/g, '-')],
        coordinates: surfSpot.coordinates,
        likes: 0
      }));

      const album: Omit<Album, 'id' | 'createdAt'> = {
        title: albumData.title,
        description: albumData.description,
        photos,
        createdBy: user.id,
        surfSpotId: surfSpot.id
      };

      onAlbumCreate(album);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Album</h2>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{surfSpot.name}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Album Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumData.title}
                  onChange={(e) => setAlbumData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Epic Session at Pipeline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={albumData.description}
                  onChange={(e) => setAlbumData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                  placeholder="Describe the session, conditions, or story behind these photos..."
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Photos * (Drag & drop or click to upload)
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg text-gray-600">
                      Drop your surf photos here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse files
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Photos Preview */}
              {albumData.photos.length > 0 && (
                <div className="mt-6">
                  <p className="font-medium text-gray-900 mb-4">
                    Uploaded Photos ({albumData.photos.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {albumData.photos.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!albumData.title || albumData.photos.length === 0}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Album</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlbumCreator;