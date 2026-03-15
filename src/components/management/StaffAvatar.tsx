import React from 'react';

const TEAL = '#2dd4bf';

interface StaffAvatarProps {
  name: string;
  size?: 'sm' | 'lg';
}

function getInitials(name: string): string {
  const parts = name.replace(/,.*$/, '').replace(/\b(Dr\.|LCSW|LPC|PhD|PsyD|LMFT)\b/gi, '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] ?? '?').toUpperCase();
}

const StaffAvatar: React.FC<StaffAvatarProps> = ({ name, size = 'sm' }) => {
  const dim = size === 'lg' ? 64 : 40;
  const fontSize = size === 'lg' ? 22 : 14;

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full font-bold"
      style={{
        width: dim,
        height: dim,
        fontSize,
        background: TEAL,
        color: '#fff',
        letterSpacing: '0.04em',
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default StaffAvatar;
