import React from 'react';

// New Stealth-themed logo with eye and shadow motifs
const Logo = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        className={`${sizes[size]} transition-transform duration-300 hover:scale-110`}
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Shadow Circle */}
        <circle cx="50" cy="50" r="45" fill="url(#shadowGradient)" opacity="0.3" />
        
        {/* Main Eye Shape */}
        <ellipse cx="50" cy="50" rx="40" ry="25" fill="url(#eyeGradient)" />
        
        {/* Upper Eyelid Shadow */}
        <path 
          d="M 10 50 Q 50 30, 90 50" 
          fill="#000000" 
          opacity="0.4"
        />
        
        {/* Iris */}
        <circle cx="50" cy="50" r="15" fill="url(#irisGradient)" />
        
        {/* Pupil with Peek Effect */}
        <ellipse cx="52" cy="50" rx="8" ry="10" fill="#0a0a0a" />
        
        {/* Highlight Glint */}
        <circle cx="48" cy="46" r="3" fill="#FF6B6B" opacity="0.8" />
        <circle cx="54" cy="48" r="2" fill="#FFFFFF" opacity="0.6" />
        
        {/* Stealth Lines - Left */}
        <line x1="5" y1="45" x2="10" y2="50" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" />
        <line x1="5" y1="50" x2="10" y2="50" stroke="#DC143C" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
        <line x1="5" y1="55" x2="10" y2="50" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
        
        {/* Stealth Lines - Right */}
        <line x1="95" y1="45" x2="90" y2="50" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
        <line x1="95" y1="50" x2="90" y2="50" stroke="#DC143C" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <line x1="95" y1="55" x2="90" y2="50" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Bottom Shadow Effect */}
        <ellipse cx="50" cy="75" rx="35" ry="8" fill="#DC143C" opacity="0.15" className="animate-pulse" />
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          
          <radialGradient id="irisGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FF1744" />
            <stop offset="40%" stopColor="#DC143C" />
            <stop offset="100%" stopColor="#8B0000" />
          </radialGradient>
        </defs>
      </svg>
      
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-white">Just</span>
        <span className="text-red-600">Peek</span>
      </span>
    </div>
  );
};

export default Logo;
