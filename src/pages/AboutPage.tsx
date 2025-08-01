import React from 'react';
import { Camera, MapPin, Users, ArrowLeft } from 'lucide-react';
import SatelliteWorldMap from '../components/SatelliteWorldMap';
import { SurfSpot } from '../types';

interface AboutPageProps {
  onBack?: () => void;
  surfSpots: SurfSpot[];
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, surfSpots }) => {
  return (
    <div className="min-h-screen bg-white" style={{
      backgroundImage: 'url(https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1920)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Our Global Network
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover surf photography from iconic breaks around the world
            </p>
          </div>

          {/* World Map with Orange Frame */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 rounded-lg p-1.5 shadow-lg max-w-4xl w-full">
              <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <SatelliteWorldMap 
                  onLocationClick={(location) => console.log('Location clicked:', location)} 
                  surfSpots={surfSpots}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SurfSpotter?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The world's premier destination for surf photography, connecting 
              passionate photographers with surf enthusiasts globally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <Camera className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Every photo is carefully curated from professional surf photographers 
                worldwide, ensuring the highest quality and most stunning captures.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore surf photography from iconic breaks around the world, 
                from Pipeline to Jeffreys Bay, and discover hidden gems.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a thriving community of surf photographers and enthusiasts. 
                Upload your own shots and connect with fellow ocean lovers.
              </p>
            </div>
          </div>

          {/* Additional Content */}
          <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                SurfSpotter was born from a passion for capturing the raw beauty and power of the ocean. 
                We believe that surf photography is more than just taking pictures – it's about preserving 
                moments of pure stoke, incredible athleticism, and the timeless connection between humans and the sea.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform connects talented photographers with surf enthusiasts worldwide, creating a 
                vibrant marketplace where stunning imagery meets passionate collectors.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Platform Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Photographers</span>
                  <span className="font-bold text-orange-600">2,500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Photos Available</span>
                  <span className="font-bold text-orange-600">50,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Surf Spots Covered</span>
                  <span className="font-bold text-orange-600">{surfSpots.length}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Countries</span>
                  <span className="font-bold text-orange-600">45+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;