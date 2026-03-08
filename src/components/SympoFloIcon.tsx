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
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: glowFilter, flexShrink: 0 }}
    >
      <rect width="40" height="40" rx="9" fill="#1B2D5B"/>
      <path
        d="M28 10 C28 10 22 8 16 10 C10 12 8 17 13 20 C16 21.5 22 22 25 23"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 20 C15 20 18 21 21 23 C25 25.5 29 28 24 31 C20 33 14 32 12 31"
        stroke="#30B8C9"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="10" r="1.5" fill="white" opacity="0.8"/>
    </svg>
  );
};

export default SympoFloIcon;
