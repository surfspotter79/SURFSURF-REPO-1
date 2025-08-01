import React, { useState, useRef } from 'react';
import { Upload, ArrowUp, MapPin, Plus } from 'lucide-react';
import InteractiveLocationPicker from '../components/InteractiveLocationPicker';

interface UploadPageProps {
  onCreateSurfSpot?: (spotData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => void;
  surfSpots?: Array<{ id: string; name: string; coordinates: { lat: number; lng: number } }>;
}

const UploadPage: React.FC<UploadPageProps> = ({ onCreateSurfSpot, surfSpots = [] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    photographer: '',
    date: '',
    timeRange: '',
    event: '',
    description: '',
    price: ''
  });
  const [draftSaved, setDraftSaved] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<string[]>([
    'Pipeline, Hawaii',
    'Gold Coast, Australia', 
    'Jeffreys Bay, South Africa',
    'Ericeira, Portugal',
    'Uluwatu, Bali',
    'Tavarua, Fiji',
    'Mavericks, California',
    'Hossegor, France',
    'Puerto Escondido, Mexico',
    'Raglan, New Zealand',
    'Mundaka, Spain',
    'Nazaré, Portugal',
    ...surfSpots.map(spot => spot.name)
  ]);
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
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { formData, uploadedFiles });
  };

  const handleSaveDraft = () => {
    // Save form data to localStorage or state management
    localStorage.setItem('surfPhotoUploadDraft', JSON.stringify(formData));
    setDraftSaved(true);
    // Clear the saved indicator after 3 seconds
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleLocationCreate = (locationData: { name: string; coordinates: { lat: number; lng: number }; description: string }) => {
    // Add to available locations
    setAvailableLocations(prev => [...prev, locationData.name]);
    
    // Set as selected location
    setFormData(prev => ({ ...prev, location: locationData.name }));
    
    // Call parent callback if provided
    if (onCreateSurfSpot) {
      onCreateSurfSpot(locationData);
    }
    
    setShowLocationPicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Surf Photos</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4">Drag and drop photos or click to upload</p>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
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
                <ArrowUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-lg text-gray-600">
                  Drag and drop photos or click to upload
                </p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <p className="font-medium text-gray-900 mb-4">
                  Uploaded Files ({uploadedFiles.length})
                </p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Photo Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <select
                    value={formData.location}
                    onChange={(e) => {
                      if (e.target.value === 'add-new-location') {
                        setShowLocationPicker(true);
                      } else {
                        setFormData(prev => ({ ...prev, location: e.target.value }));
                      }
                    }}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                  >
                    <option value="">Select a location</option>
                    {availableLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                    <option value="add-new-location" className="font-medium text-blue-600">
                      + Add New Location
                    </option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(true)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Add new location"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photographer Name
                </label>
                <input
                  type="text"
                  value={formData.photographer}
                  onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
                <select
                  value={formData.timeRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select time range</option>
                  <option value="dawn">Dawn (5:00 AM - 7:00 AM)</option>
                  <option value="morning">Morning (7:00 AM - 11:00 AM)</option>
                  <option value="midday">Midday (11:00 AM - 2:00 PM)</option>
                  <option value="afternoon">Afternoon (2:00 PM - 6:00 PM)</option>
                  <option value="sunset">Sunset (6:00 PM - 8:00 PM)</option>
                  <option value="night">Night (8:00 PM - 5:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event (if applicable)
                </label>
                <input
                  type="text"
                  value={formData.event}
                  onChange={(e) => setFormData(prev => ({ ...prev, event: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., World Surf League Championship"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (if applicable)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                placeholder="Describe the surf conditions, wave size, location details, or any other relevant information about this photo..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>Save Draft</span>
            </button>
            
            {draftSaved && (
              <span className="text-green-600 font-medium">
                Draft saved! You can now upload more photos with these details.
              </span>
            )}
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Photos</span>
            </button>
          </div>
        </form>

        {/* Interactive Location Picker Modal */}
        {showLocationPicker && (
          <InteractiveLocationPicker
            onLocationCreate={handleLocationCreate}
            onClose={() => setShowLocationPicker(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UploadPage;