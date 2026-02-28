import React from 'react';

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
        {/* Outer Ghost Shape */}
        <path 
          d="M50 10 C30 10 20 20 20 40 L20 70 C20 75 22 78 25 78 C28 78 30 75 30 72 L30 68 C30 65 32 63 35 63 C38 63 40 65 40 68 L40 72 C40 75 42 78 45 78 C48 78 50 75 50 72 L50 68 C50 65 52 63 55 63 C58 63 60 65 60 68 L60 72 C60 75 62 78 65 78 C68 78 70 75 70 72 L70 68 C70 65 72 63 75 63 C78 63 80 65 80 68 L80 72 C80 75 82 78 85 78 C88 78 90 75 90 70 L90 40 C90 20 80 10 60 10 L50 10 Z" 
          fill="url(#ghostGradient)"
          className="drop-shadow-2xl"
        />
        
        {/* Eye 1 - Peeking */}
        <circle cx="38" cy="40" r="6" fill="#0a0a0a" />
        <circle cx="40" cy="39" r="3" fill="#DC143C" className="animate-pulse" />
        
        {/* Eye 2 - Peeking */}
        <circle cx="62" cy="40" r="6" fill="#0a0a0a" />
        <circle cx="64" cy="39" r="3" fill="#DC143C" className="animate-pulse" />
        
        {/* Stealth Lines */}
        <line x1="20" y1="35" x2="15" y2="35" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" />
        <line x1="20" y1="45" x2="12" y2="45" stroke="#DC143C" strokeWidth="2" opacity="0.4" className="animate-pulse" />
        <line x1="20" y1="55" x2="15" y2="55" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" />
        
        <line x1="80" y1="35" x2="85" y2="35" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" />
        <line x1="80" y1="45" x2="88" y2="45" stroke="#DC143C" strokeWidth="2" opacity="0.4" className="animate-pulse" />
        <line x1="80" y1="55" x2="85" y2="55" stroke="#DC143C" strokeWidth="2" opacity="0.6" className="animate-pulse" />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC143C" />
            <stop offset="50%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
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
