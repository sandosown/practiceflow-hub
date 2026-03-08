import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { Briefcase, GraduationCap, Home } from 'lucide-react';
import { useSessionData } from '@/context/SessionContext';
import { cardStyle, cardHoverStyle, iconSquareStyle } from '@/lib/cardStyle';

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const WORKSPACES = [
  { id: 'gp', label: 'Group Practice', icon: Briefcase, subtitle: 'Your practice', active: true, path: '/dashboard/owner/group-practice', accent: '#2dd4bf' },
  { id: 'coaching', label: 'Coaching', icon: GraduationCap, subtitle: 'Coming Soon', active: false, accent: '#f59e0b' },
  { id: 'home', label: 'Home', icon: Home, subtitle: 'Coming Soon', active: false, accent: '#4ade80' },
];

const FlowConnector: React.FC = () => (
  <div
    style={{
      width: '1px',
      height: '80px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(45,212,191,0.6) 50%, transparent 100%)',
      boxShadow: '0 0 8px rgba(45,212,191,0.4)',
      alignSelf: 'center',
      flexShrink: 0,
    }}
  />
);

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const rawFirst = session.full_name?.split(' ')[0] ?? '';
  const firstName = rawFirst.endsWith('.') ? rawFirst.slice(0, -1) : rawFirst;
  const displayName = session.full_name?.startsWith('Dr.') ? `Dr. ${session.full_name.split(' ').slice(1).join(' ').split(' ')[0]}` : firstName;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <main className="flex-1 flex flex-col items-center justify-center px-6" style={{ marginTop: '-40px' }}>
        {/* Greeting */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2.4rem',
          color: '#FFFFFF',
          fontWeight: 'normal',
          marginBottom: '6px',
          textAlign: 'center',
        }}>
          {getGreeting()}, {displayName}.
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: '#94a3b8',
          marginBottom: '48px',
          textAlign: 'center',
        }}>
          Where would you like to flow today?
        </p>

        {/* Cards container with ambient glow */}
        <div style={{ position: 'relative' }}>
          {/* Ambient background glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Cards row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            {WORKSPACES.map((w, i) => {
              const isHovered = hoveredId === w.id;
              const baseStyle = w.active
                ? (isHovered ? cardHoverStyle(w.accent) : cardStyle(w.accent))
                : cardStyle(w.accent, { muted: true });

              return (
                <React.Fragment key={w.id}>
                  {i > 0 && <FlowConnector />}
                  <button
                    disabled={!w.active}
                    onClick={() => w.active && w.path && navigate(w.path)}
                    onMouseEnter={() => w.active && setHoveredId(w.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={!w.active ? 'cursor-default' : 'cursor-pointer'}
                    style={{
                      ...baseStyle,
                      width: '280px',
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      borderRadius: '20px',
                      transition: 'all 0.25s ease',
                      transform: isHovered && w.active ? 'translateY(-3px)' : 'translateY(0)',
                    }}
                  >
                    <div style={{ ...iconSquareStyle(w.accent), width: 52, height: 52 }}>
                      <w.icon className="w-7 h-7" style={{ color: w.accent }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9', marginBottom: '4px' }}>{w.label}</p>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>{w.subtitle}</p>
                    </div>
                    {!w.active && (
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#64748b',
                      }}>
                        Coming Soon
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
