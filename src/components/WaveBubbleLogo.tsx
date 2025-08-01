import React from 'react';

interface WaveBubbleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const WaveBubbleLogo: React.FC<WaveBubbleLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Main speech bubble body */}
        <path
          d="M18 15 
             L57 15 
             Q65 15 65 23 
             L65 52 
             Q65 60 57 60 
             L35 60 
             L15 75 
             L20 60 
             L18 60 
             Q10 60 10 52 
             L10 23 
             Q10 15 18 15 Z"
          fill="white"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Camera viewfinder on the right */}
        <path
          d="M65 25 L85 15 L85 55 L65 45 Z"
          fill="white"
          stroke="#EA580C"
          strokeWidth="3"
        />
        
      </svg>
    </div>
  );
};

export default WaveBubbleLogo;