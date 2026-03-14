import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Briefcase, Calendar, MoreHorizontal, X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/dashboard/owner/group-practice' },
  { label: 'Board', icon: MessageSquare, path: '/dashboard/owner/group-practice/office-board' },
  { label: 'My Work', icon: Briefcase, path: null as string | null, action: 'none' },
  { label: 'Calendar', icon: Calendar, path: null as string | null, action: 'none' },
  { label: 'More', icon: MoreHorizontal, path: null as string | null, action: 'drawer' },
];

const ACTIVE_COLOR = '#2dd4bf';
const ACTIVE_BG = 'rgba(45,212,191,0.12)';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const isItemActive = (item: typeof NAV_ITEMS[number]) => {
    if (!item.path) return false;
    if (item.label === 'Home') {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
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
          const isActive = isItemActive(item);
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <button
              key={item.label}
              onClick={() => {
                if ((item as any).action === 'drawer') {
                  setMoreOpen(true);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
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
                cursor: item.path || (item as any).action === 'drawer' ? 'pointer' : 'default',
                padding: 0,
              }}
            >
              <item.icon size={22} color={color} strokeWidth={2} />
              <span style={{ fontSize: 9, color, lineHeight: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Drawer open={moreOpen} onOpenChange={setMoreOpen}>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle style={{ color: '#1a2a5e' }}>More</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-1 rounded-md hover:bg-muted">
                <X size={20} style={{ color: '#94a3b8' }} />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-6 pb-8 pt-2 text-center">
            <p style={{ color: '#94a3b8', fontSize: 14 }}>More coming soon</p>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BottomNavBar;
