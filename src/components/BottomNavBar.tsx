import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, MessageSquare, Briefcase, Calendar, MoreHorizontal,
  LayoutDashboard, Users, CreditCard, Package, ShieldCheck,
  Contact, Award, Mail, Rss, BookOpen, Settings,
} from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useSessionData } from '@/context/SessionContext';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/dashboard/owner/group-practice' },
  { label: 'Board', icon: MessageSquare, path: '/dashboard/owner/group-practice/office-board' },
  { label: 'My Work', icon: Briefcase, path: null as string | null, action: 'none' },
  { label: 'Calendar', icon: Calendar, path: null as string | null, action: 'none' },
  { label: 'More', icon: MoreHorizontal, path: null as string | null, action: 'drawer' },
];

interface DrawerItem { label: string; icon: React.FC<any>; path: string; }
interface DrawerSection { title: string; items: DrawerItem[]; }

const OWNER_SECTIONS: DrawerSection[] = [
  {
    title: 'PRACTICE',
    items: [
      { label: 'Management Center', icon: LayoutDashboard, path: '/dashboard/owner/group-practice/management' },
      { label: 'Client Database', icon: Users, path: '/dashboard/owner/group-practice/clients' },
      { label: 'Insurance Database', icon: CreditCard, path: '/dashboard/owner/group-practice/insurance' },
      { label: 'Vendor Database', icon: Package, path: '/dashboard/owner/group-practice/vendors' },
      { label: 'Compliance', icon: ShieldCheck, path: '/dashboard/owner/group-practice/compliance' },
    ],
  },
  {
    title: 'TEAM',
    items: [
      { label: 'Directory', icon: Contact, path: '/dashboard/owner/group-practice/directory' },
      { label: 'Recognition', icon: Award, path: '/dashboard/owner/group-practice/major-moments' },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { label: 'Messages', icon: Mail, path: '/dashboard/owner/group-practice/office-board' },
      { label: 'Feed', icon: Rss, path: '/dashboard/owner/group-practice/feed' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Guide Center', icon: BookOpen, path: '/dashboard/owner/group-practice/guide' },
      { label: 'Settings', icon: Settings, path: '/dashboard/owner/group-practice/settings' },
    ],
  },
];

const ACTIVE_COLOR = '#2dd4bf';
const ACTIVE_BG = 'rgba(45,212,191,0.12)';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  let userName = '';
  let userRole = '';
  try {
    const session = useSessionData();
    userName = session.full_name ?? '';
    userRole = session.role ?? '';
  } catch {
    // not authenticated yet
  }

  const roleLabelMap: Record<string, string> = {
    OWNER: 'Owner',
    CLINICIAN: 'Clinician',
    INTERN_CLINICAL: 'Clinical Intern',
    INTERN_BUSINESS: 'Business Intern',
    SUPERVISOR: 'Supervisor',
    ADMIN: 'Admin',
    STAFF: 'Staff',
  };

  const isItemActive = (item: typeof NAV_ITEMS[number]) => {
    if (!item.path) return false;
    if (item.label === 'Home') return location.pathname === item.path;
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
        <DrawerContent
          className="border-0"
          style={{ background: '#1a2a5e', maxHeight: '75vh' }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-4">
            <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
          </div>

          {/* Profile block */}
          <div className="px-5 pb-4 flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(45,212,191,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ACTIVE_COLOR,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {userName.charAt(0) || '?'}
            </div>
            <div>
              <p style={{ color: '#e2eaf4', fontSize: 14, fontWeight: 600 }}>{userName || 'User'}</p>
              <p style={{ color: '#5a8ab0', fontSize: 11 }}>{roleLabelMap[userRole] ?? userRole}</p>
            </div>
          </div>

          {/* Sections */}
          <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 100px)' }}>
            {OWNER_SECTIONS.map((section) => (
              <div key={section.title} className="mb-5">
                <p
                  style={{
                    color: '#5a8ab0',
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  {section.title}
                </p>
                <div className="flex flex-col gap-1.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.path);
                          setMoreOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                        style={{
                          background: active ? ACTIVE_BG : 'rgba(255,255,255,0.07)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon size={18} color={active ? ACTIVE_COLOR : '#e2eaf4'} strokeWidth={2} />
                        <span style={{ color: active ? ACTIVE_COLOR : '#e2eaf4', fontSize: 13, fontWeight: 500 }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BottomNavBar;
