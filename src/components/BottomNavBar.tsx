import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, MessageSquare, Briefcase, Calendar, MoreHorizontal,
  LayoutDashboard, Users, CreditCard, Package, ShieldCheck, Shield,
  Contact, Award, Mail, Rss, BookOpen, Settings, Sparkles, Lock,
} from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useSessionData } from '@/context/SessionContext';
import type { AppRole, InternSubtype } from '@/types/session';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/dashboard/owner/group-practice' },
  { label: 'Board', icon: MessageSquare, path: '/dashboard/owner/group-practice/office-board' },
  { label: 'My Work', icon: Briefcase, path: null as string | null, action: 'none' },
  { label: 'Calendar', icon: Calendar, path: null as string | null, action: 'none' },
  { label: 'More', icon: MoreHorizontal, path: null as string | null, action: 'drawer' },
];

interface DrawerItem { id: string; label: string; icon: React.FC<any>; path: string; }
interface DrawerSection { id: string; title: string; cols: number; items: DrawerItem[]; }

const ALL_SECTIONS: DrawerSection[] = [
  {
    id: 'PRACTICE', title: 'PRACTICE', cols: 3,
    items: [
      { id: 'management', label: 'Management Center', icon: LayoutDashboard, path: '/dashboard/owner/group-practice/management' },
      { id: 'clients', label: 'Client Database', icon: Users, path: '/dashboard/owner/group-practice/clients' },
      { id: 'insurance', label: 'Insurance Database', icon: CreditCard, path: '/dashboard/owner/group-practice/insurance' },
      { id: 'vendors', label: 'Vendor Database', icon: Package, path: '/dashboard/owner/group-practice/vendors' },
      { id: 'compliance', label: 'Compliance', icon: ShieldCheck, path: '/dashboard/owner/group-practice/compliance' },
    ],
  },
  {
    id: 'CLINICAL', title: 'CLINICAL', cols: 4,
    items: [
      { id: 'supervision', label: 'Supervision Structure', icon: Shield, path: '/dashboard/owner/group-practice/supervision' },
    ],
  },
  {
    id: 'TEAM', title: 'TEAM', cols: 4,
    items: [
      { id: 'directory', label: 'Directory', icon: Contact, path: '/dashboard/owner/group-practice/directory' },
      { id: 'recognition', label: 'Recognition', icon: Award, path: '/dashboard/owner/group-practice/major-moments' },
    ],
  },
  {
    id: 'PERSONAL', title: 'PERSONAL', cols: 4,
    items: [
      { id: 'moments', label: 'Major Moments', icon: Sparkles, path: '/dashboard/owner/group-practice/major-moments' },
    ],
  },
  {
    id: 'COMMUNICATION', title: 'COMMUNICATION', cols: 4,
    items: [
      { id: 'messages', label: 'Messages', icon: Mail, path: '/dashboard/owner/group-practice/office-board' },
      { id: 'feed', label: 'Feed', icon: Rss, path: '/dashboard/owner/group-practice/feed' },
    ],
  },
  {
    id: 'SYSTEM', title: 'SYSTEM', cols: 4,
    items: [
      { id: 'access-permissions', label: 'Access & Permissions', icon: Lock, path: '/dashboard/owner/group-practice/access-permissions' },
      { id: 'guide', label: 'Guide Center', icon: BookOpen, path: '/dashboard/owner/group-practice/guide' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

// Effective role key that distinguishes intern subtypes
type EffectiveRole = 'OWNER' | 'ADMIN' | 'SUPERVISOR' | 'CLINICIAN' | 'INTERN_CLINICAL' | 'INTERN_BUSINESS' | 'STAFF';

function getEffectiveRole(role: AppRole, internSubtype: InternSubtype): EffectiveRole {
  if (role === 'INTERN') {
    return internSubtype === 'BUSINESS' ? 'INTERN_BUSINESS' : 'INTERN_CLINICAL';
  }
  return role as EffectiveRole;
}

// Map of section → item IDs visible per role
const ROLE_VISIBILITY: Record<EffectiveRole, Record<string, string[]>> = {
  OWNER: {
    PRACTICE: ['management', 'clients', 'insurance', 'vendors', 'compliance'],
    CLINICAL: ['supervision'],
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
  ADMIN: {
    PRACTICE: ['management', 'clients', 'insurance', 'vendors', 'compliance'],
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
  SUPERVISOR: {
    PRACTICE: ['clients', 'compliance'],
    CLINICAL: ['supervision'],
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
  CLINICIAN: {
    CLINICAL: ['supervision'],
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
  INTERN_CLINICAL: {
    CLINICAL: ['supervision'],
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
  INTERN_BUSINESS: {
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
  STAFF: {
    TEAM: ['directory', 'recognition'],
    PERSONAL: ['moments'],
    COMMUNICATION: ['messages', 'feed'],
    SYSTEM: ['guide', 'settings'],
  },
};

function getFilteredSections(effectiveRole: EffectiveRole): DrawerSection[] {
  const visibility = ROLE_VISIBILITY[effectiveRole] ?? ROLE_VISIBILITY.STAFF;
  const result: DrawerSection[] = [];

  for (const section of ALL_SECTIONS) {
    const allowedIds = visibility[section.id];
    if (!allowedIds || allowedIds.length === 0) continue;

    const filteredItems = section.items.filter(item => allowedIds.includes(item.id));
    if (filteredItems.length === 0) continue;

    result.push({ ...section, items: filteredItems });
  }

  return result;
}

const ACTIVE_COLOR = '#2dd4bf';
const ACTIVE_BG = 'rgba(45,212,191,0.12)';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  let userName = '';
  let userRole: AppRole = 'STAFF';
  let internSubtype: InternSubtype = null;
  try {
    const session = useSessionData();
    userName = session.full_name ?? '';
    userRole = session.role ?? 'STAFF';
    internSubtype = session.intern_subtype ?? null;
  } catch {
    // not authenticated yet
  }

  const effectiveRole = getEffectiveRole(userRole, internSubtype);
  const sections = getFilteredSections(effectiveRole);

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
          zIndex: 50,
          overflow: 'hidden',
          pointerEvents: 'none',
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
                width: '20%',
                flex: '0 0 20%',
                maxWidth: '20%',
                position: 'relative',
                height: '100%',
                background: isActive ? ACTIVE_BG : 'transparent',
                border: 'none',
                cursor: item.path || (item as any).action === 'drawer' ? 'pointer' : 'default',
                padding: 0,
                pointerEvents: 'auto',
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
          className="border-0 md:!max-w-[480px] md:!mx-auto"
          style={{ background: '#1a2a5e', maxHeight: '75vh', borderRadius: '16px 16px 0 0' }}
        >
          {/* Handle */}
          <div className="flex justify-center" style={{ paddingTop: 8, paddingBottom: 4 }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
          </div>

          {/* Profile block */}
          <div className="px-5 flex items-center gap-3" style={{ paddingBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(45,212,191,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ACTIVE_COLOR,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {userName.charAt(0) || '?'}
            </div>
            <div>
              <p style={{ color: '#e2eaf4', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{userName || 'User'}</p>
              <p style={{ color: '#5a8ab0', fontSize: 11, lineHeight: 1.2 }}>{roleLabelMap[effectiveRole] ?? effectiveRole}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5" style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 8 }} />

          {/* Sections */}
          <div className="px-5 overflow-y-auto" style={{ paddingBottom: 16, maxHeight: 'calc(75vh - 80px)' }}>
            {sections.map((section, sIdx) => (
              <div key={section.id} style={{ marginTop: sIdx === 0 ? 0 : 12 }}>
                <p
                  style={{
                    color: '#5a8ab0',
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 4,
                  }}
                >
                  {section.title}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.cols}, 1fr)`, gap: 8 }}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setMoreOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 56,
                          minWidth: 56,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px 4px',
                          gap: 4,
                        }}
                      >
                        <Icon size={26} color={active ? ACTIVE_COLOR : 'rgba(255,255,255,0.75)'} strokeWidth={1.8} />
                        <span style={{
                          color: active ? ACTIVE_COLOR : '#e2eaf4',
                          fontSize: 10,
                          fontWeight: 400,
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}>
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
