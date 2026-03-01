import React from 'react';

const Logo = ({ className = "", size = "md", showText = true }) => {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-lg" },
    md: { icon: "h-10 w-10", text: "text-xl" },
    lg: { icon: "h-14 w-14", text: "text-2xl" },
    xl: { icon: "h-20 w-20", text: "text-4xl" }
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-red-600/30 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <svg 
          className={`${s.icon} relative transition-transform duration-300 group-hover:scale-110`}
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="60" cy="60" r="56" stroke="url(#ringGrad)" strokeWidth="2" opacity="0.4" />
          <circle cx="60" cy="60" r="50" stroke="url(#ringGrad)" strokeWidth="1" opacity="0.2" />
          
          {/* Main dark circle background */}
          <circle cx="60" cy="60" r="46" fill="url(#bgGrad)" />
          
          {/* Inner glow ring */}
          <circle cx="60" cy="60" r="46" stroke="url(#innerRingGrad)" strokeWidth="1.5" />
          
          {/* Eye shape - outer */}
          <path 
            d="M20 60 Q40 35 60 35 Q80 35 100 60 Q80 85 60 85 Q40 85 20 60Z" 
            fill="url(#eyeBg)" 
            stroke="url(#eyeStroke)" 
            strokeWidth="1"
          />
          
          {/* Iris outer */}
          <circle cx="60" cy="60" r="18" fill="url(#irisOuter)" />
          
          {/* Iris inner ring */}
          <circle cx="60" cy="60" r="14" fill="url(#irisInner)" />
          
          {/* Pupil */}
          <ellipse cx="61" cy="60" rx="7" ry="9" fill="#050505" />
          
          {/* Pupil inner dot */}
          <circle cx="61" cy="60" r="3" fill="#1a0000" />
          
          {/* Primary highlight */}
          <circle cx="54" cy="53" r="4" fill="white" opacity="0.7" />
          <circle cx="54" cy="53" r="2.5" fill="white" opacity="0.9" />
          
          {/* Secondary highlight */}
          <circle cx="67" cy="55" r="2" fill="white" opacity="0.3" />
          
          {/* Bottom reflection */}
          <ellipse cx="60" cy="68" rx="6" ry="1.5" fill="url(#reflectionGrad)" opacity="0.3" />
          
          {/* Crosshair lines - subtle */}
          <line x1="60" y1="30" x2="60" y2="38" stroke="#DC143C" strokeWidth="1" opacity="0.5" />
          <line x1="60" y1="82" x2="60" y2="90" stroke="#DC143C" strokeWidth="1" opacity="0.5" />
          <line x1="30" y1="60" x2="38" y2="60" stroke="#DC143C" strokeWidth="1" opacity="0.5" />
          <line x1="82" y1="60" x2="90" y2="60" stroke="#DC143C" strokeWidth="1" opacity="0.5" />
          
          {/* Corner accents */}
          <path d="M25 25 L35 25 L35 27" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M25 25 L25 35 L27 35" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M95 25 L85 25 L85 27" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M95 25 L95 35 L93 35" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M25 95 L35 95 L35 93" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M25 95 L25 85 L27 85" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M95 95 L85 95 L85 93" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M95 95 L95 85 L93 85" stroke="#DC143C" strokeWidth="1.5" opacity="0.4" fill="none" />
          
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC143C" />
              <stop offset="100%" stopColor="#8B0000" />
            </linearGradient>
            <radialGradient id="bgGrad" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#080808" />
            </radialGradient>
            <linearGradient id="innerRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC143C" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8B0000" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DC143C" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="eyeBg" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1a0a0a" />
              <stop offset="100%" stopColor="#0a0505" />
            </radialGradient>
            <linearGradient id="eyeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC143C" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#DC143C" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#DC143C" stopOpacity="0.5" />
            </linearGradient>
            <radialGradient id="irisOuter" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FF1744" />
              <stop offset="60%" stopColor="#DC143C" />
              <stop offset="100%" stopColor="#6B0000" />
            </radialGradient>
            <radialGradient id="irisInner" cx="45%" cy="45%">
              <stop offset="0%" stopColor="#FF4444" />
              <stop offset="50%" stopColor="#CC1133" />
              <stop offset="100%" stopColor="#440000" />
            </radialGradient>
            <linearGradient id="reflectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC143C" stopOpacity="0" />
              <stop offset="50%" stopColor="#DC143C" />
              <stop offset="100%" stopColor="#DC143C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <span className={`${s.text} font-black tracking-tight`}>
          <span className="text-white">Just</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Peek</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
