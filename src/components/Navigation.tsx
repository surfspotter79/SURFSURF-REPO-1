import React from 'react';
import { Upload, ShoppingCart } from 'lucide-react';
import WaveBubbleLogo from './WaveBubbleLogo';
import { User } from '../types';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: 'landing' | 'browse' | 'photo' | 'upload') => void;
  cartCount: number;
  user: User | null;
  onTriggerOnboarding: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, cartCount, user, onTriggerOnboarding }) => {
  const handleCartClick = () => {
    if (!user) {
      onTriggerOnboarding();
    } else {
      // Handle cart functionality for logged in users
      console.log('Show cart');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <WaveBubbleLogo size="lg" className="text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SurfSpotter</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('upload')}
              className={`font-medium transition-colors ${
                currentPage === 'upload' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Upload
            </button>
            
            <button 
              onClick={handleCartClick}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {user && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">Hi, {user.username}!</span>
              </div>
            )}
            
            {!user && (
              <button
                onClick={onTriggerOnboarding}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;