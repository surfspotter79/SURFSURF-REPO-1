import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface FloatingMenuProps {
  onAboutClick: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onAboutClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Info className="h-6 w-6" />}
      </button>

      {/* Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-2 min-w-[160px] animate-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => {
              onAboutClick();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Info className="h-4 w-4" />
            <span>About SurfSpotter</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;