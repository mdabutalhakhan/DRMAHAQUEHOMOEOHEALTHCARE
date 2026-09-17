import React from 'react';

interface ClinicLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({ 
  className = "w-8 h-8", 
  size,
  color = "#256B38"
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Inner Boundary Circle */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="3" fill="none" opacity="0.9" />
      
      {/* Asclepius Staff / Rod */}
      <circle cx="50" cy="18" r="3.8" fill={color} />
      <line x1="50" y1="21" x2="50" y2="82" stroke={color} strokeWidth="3" strokeLinecap="round" />
      
      {/* Coiled Serpent */}
      <path 
        d="M 50 27 C 62 27, 63 38, 50 44 C 37 49, 38 60, 50 65 C 62 70, 60 78, 50 81" 
        stroke={color} 
        strokeWidth="3.6" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Homeopathic Leaves (Left) */}
      <path d="M 47 75 C 37 72, 28 60, 25 48" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 25 48 C 22 36, 38 35, 42 45 C 42 54, 28 54, 25 48 Z" fill={color} />
      <path d="M 33 44 C 30 34, 43 32, 46 39 C 46 46, 36 47, 33 44 Z" fill={color} />
      
      {/* Homeopathic Globules / Sugar Pills (Right) */}
      <circle cx="67" cy="33" r="3.2" fill={color} />
      <circle cx="76" cy="40" r="3.2" fill={color} />
      <circle cx="68" cy="44" r="3" fill={color} />
      <circle cx="77" cy="52" r="3.2" fill={color} />
      <circle cx="68" cy="55" r="3.2" fill={color} />
      <circle cx="76" cy="64" r="3.2" fill={color} />
      <circle cx="67" cy="66" r="2.8" fill={color} />
      <circle cx="72" cy="75" r="3" fill={color} />
      <circle cx="64" cy="78" r="2.8" fill={color} />
    </svg>
  );
};

export default ClinicLogo;
