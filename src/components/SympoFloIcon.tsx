import React from 'react';

interface SympoFloIconProps {
  size?: number;
  glow?: boolean;
}

const SympoFloIcon: React.FC<SympoFloIconProps> = ({ size = 32, glow = false }) => {
  const glowFilter = glow
    ? `drop-shadow(0 0 ${size > 48 ? 16 : 7}px rgba(48,184,201,${size > 48 ? 0.6 : 0.5})) drop-shadow(0 0 ${size > 48 ? 32 : 14}px rgba(48,184,201,${size > 48 ? 0.25 : 0.2}))`
    : undefined;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      style={{ filter: glowFilter, flexShrink: 0 }}
    >
      <rect width="32" height="32" rx="7" fill="#1B2D5B" />
      <path
        d="M22 8 C22 8 14 8 10 12 C7 15 9 18 13 18"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />
      <path
        d="M10 18 C10 18 14 18 18 21 C22 24 20 26 16 26"
        stroke="#30B8C9"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="22" cy="8.5" r="1.2" fill="white" opacity="0.7" />
    </svg>
  );
};

export default SympoFloIcon;
