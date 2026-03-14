import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Briefcase, Calendar, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/dashboard/owner' },
  { label: 'Board', icon: MessageSquare, path: '/dashboard/owner/group-practice/office-board' },
  { label: 'My Work', icon: Briefcase, path: '/dashboard/owner/group-practice' },
  { label: 'Calendar', icon: Calendar, path: null },
  { label: 'More', icon: MoreHorizontal, path: null },
];

const ACTIVE_COLOR = '#2dd4bf';
const ACTIVE_BG = 'rgba(45,212,191,0.12)';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';

const BottomNavBar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isMobile) return null;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#1a2a5e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.path !== null && location.pathname === item.path;
        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              flex: 1,
              height: '100%',
              background: isActive ? ACTIVE_BG : 'transparent',
              border: 'none',
              cursor: item.path ? 'pointer' : 'default',
              padding: 0,
            }}
          >
            <item.icon size={22} color={color} strokeWidth={2} />
            <span style={{ fontSize: 9, color, lineHeight: 1 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
