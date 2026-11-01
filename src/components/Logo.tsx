import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  light = false,
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 42 : 32;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand house + wrench mark */}
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: iconSize, height: iconSize }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House roof & frame in navy (or white if light) */}
          <path
            d="M50 14L16 42V84C16 87.3 18.7 90 22 90H78C81.3 90 84 87.3 84 84V42L50 14Z"
            stroke={light ? '#FCFCFF' : '#171635'}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Integrated wrench silhouette */}
          <path
            d="M44 40C39.5 41.5 36.5 46 37 51C37.5 56 41.5 59.5 46.5 59C49 58.8 51.5 57.5 53 55.5L64 66.5C65.5 68 68 68 69.5 66.5C71 65 71 62.5 69.5 61L58.5 50C60 48.5 61 46 60.5 43.5C59.5 38.5 55 35 50 35.5C48 35.8 45.8 37.5 44 40Z"
            fill={light ? '#FFD331' : '#171635'}
          />
          {/* Wrench jaw cutout */}
          <path
            d="M42 44L47 48"
            stroke={light ? '#171635' : '#FCFCFF'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Three dynamic spark rays (brand motif) */}
          <line x1="88" y1="28" x2="96" y2="24" stroke="#FFD331" strokeWidth="5" strokeLinecap="round" />
          <line x1="88" y1="36" x2="98" y2="38" stroke="#FFD331" strokeWidth="5" strokeLinecap="round" />
          <line x1="82" y1="44" x2="91" y2="49" stroke="#FFD331" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand wordmark */}
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight brand-font flex items-center ${
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl'
        } ${light ? 'text-[#FCFCFF]' : 'text-[#171635]'}`}>
          <span>Repair</span>
          <span className="text-[#70C8F4] font-medium">Right</span>
        </div>
        {showTagline && (
          <span className={`text-[10px] tracking-normal font-medium mt-0.5 ${
            light ? 'text-[#FCFCFF]/80' : 'text-[#171635]/70'
          }`}>
            Know your next safe step.
          </span>
        )}
      </div>
    </div>
  );
};
