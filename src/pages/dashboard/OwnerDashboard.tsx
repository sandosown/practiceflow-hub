import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { Briefcase, GraduationCap, Home, ChevronRight } from 'lucide-react';
import { useSessionData } from '@/context/SessionContext';
import { cardStyle, cardHoverStyle, iconSquareStyle } from '@/lib/cardStyle';

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const WORKSPACES = [
  { id: 'gp', label: 'Group Practice', icon: Briefcase, subtitle: 'Manage your practice', active: true, path: '/dashboard/owner/group-practice', accent: '#2dd4bf' },
  { id: 'coaching', label: 'Coaching', icon: GraduationCap, subtitle: 'Coming Soon', active: false, accent: '#f59e0b' },
  { id: 'home', label: 'Home', icon: Home, subtitle: 'Coming Soon', active: false, accent: '#4ade80' },
];

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const rawFirst = session.full_name?.split(' ')[0] ?? '';
  // Fix double period: if name already ends with ".", don't add another
  const firstName = rawFirst.endsWith('.') ? rawFirst.slice(0, -1) : rawFirst;
  const displayName = session.full_name?.startsWith('Dr.') ? `Dr. ${session.full_name.split(' ').slice(1).join(' ').split(' ')[0]}` : firstName;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#f1f5f9' }}>
            {getGreeting()}, {displayName}.
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Your workspaces are ready.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#f1f5f9' }}>Choose a workspace</h2>
          <div className="flex flex-col gap-4">
            {WORKSPACES.map(w => {
              const isHovered = hoveredId === w.id;
              const style = w.active
                ? (isHovered ? cardHoverStyle(w.accent) : cardStyle(w.accent))
                : cardStyle(w.accent, { muted: true });

              return (
                <button
                  key={w.id}
                  disabled={!w.active}
                  onClick={() => w.active && w.path && navigate(w.path)}
                  onMouseEnter={() => setHoveredId(w.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`p-5 text-left flex items-center gap-4 ${!w.active ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{ ...style, minHeight: '80px', padding: '20px 24px' }}
                >
                  <div
                    className="flex-shrink-0"
                    style={{ ...iconSquareStyle(w.accent), width: 48, height: 48 }}
                  >
                    <w.icon className="w-6 h-6" style={{ color: w.accent }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg" style={{ color: '#f1f5f9' }}>{w.label}</p>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{w.subtitle}</p>
                  </div>
                  {w.active && <ChevronRight className="w-5 h-5" style={{ color: '#64748b' }} />}
                  {!w.active && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;
