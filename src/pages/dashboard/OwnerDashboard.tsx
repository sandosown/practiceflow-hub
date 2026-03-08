import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { Briefcase, GraduationCap, Home } from 'lucide-react';
import { useSessionData } from '@/context/SessionContext';

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const WORKSPACES = [
  { id: 'gp', label: 'Group Practice', icon: Briefcase, subtitle: 'Your practice', active: true, path: '/dashboard/owner/group-practice', accent: '#2dd4bf', second: '#0ea5e9' },
  { id: 'coaching', label: 'Coaching', icon: GraduationCap, subtitle: 'Coming Soon', active: false, accent: '#f59e0b', second: '#f97316' },
  { id: 'home', label: 'Home', icon: Home, subtitle: 'Coming Soon', active: false, accent: '#4ade80', second: '#22d3ee' },
];

const NEBULA_POOLS = [
  { w: 550, h: 320, top: '10%', left: '5%', color: '45,212,191', opacity: 0.09, blur: 50 },
  { w: 420, h: 260, bottom: '15%', right: '8%', color: '96,165,250', opacity: 0.07, blur: 45 },
  { w: 800, h: 500, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '45,212,191', opacity: 0.05, blur: 70 },
  { w: 250, h: 200, top: '30%', right: '20%', color: '249,115,22', opacity: 0.05, blur: 40 },
  { w: 200, h: 180, bottom: '30%', left: '15%', color: '74,222,128', opacity: 0.05, blur: 40 },
];

interface FlowConnectorProps { accent1: string; accent2: string }
const FlowConnector: React.FC<FlowConnectorProps> = ({ accent1, accent2 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, width: 40, height: 80 }}>
    <div style={{ width: 1, flex: 1, background: `linear-gradient(180deg, ${accent1}88 0%, ${accent1}44 100%)`, animation: 'flowLine 3s ease-in-out infinite' }} />
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: `radial-gradient(circle, ${accent1}, ${accent2})`, boxShadow: `0 0 12px ${accent1}88`, animation: 'pulseGlow 2.5s ease-in-out infinite', flexShrink: 0 }} />
    <div style={{ width: 1, flex: 1, background: `linear-gradient(180deg, ${accent2}44 0%, ${accent2}88 100%)`, animation: 'flowLine 3s ease-in-out infinite 0.5s' }} />
  </div>
);

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const rawFirst = session.full_name?.split(' ')[0] ?? '';
  const firstName = rawFirst.endsWith('.') ? rawFirst.slice(0, -1) : rawFirst;
  const displayName = session.full_name?.startsWith('Dr.') ? `Dr. ${session.full_name.split(' ').slice(1).join(' ').split(' ')[0]}` : firstName;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stars = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.4 + Math.random() * 1.8,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    })), []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#060e1e', position: 'relative', overflow: 'hidden' }}>
      <TopNavBar />

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle { from { opacity: 0.04; } to { opacity: 0.75; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes flowLine { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes floatUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes greetShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      `}</style>

      {/* Stars */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: '#fff', pointerEvents: 'none', zIndex: 0,
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
        }} />
      ))}

      {/* Nebula pools */}
      {NEBULA_POOLS.map((n, i) => (
        <div key={i} style={{
          position: 'absolute', width: n.w, height: n.h,
          top: n.top, left: n.left, bottom: (n as any).bottom, right: (n as any).right,
          transform: n.transform,
          background: `radial-gradient(ellipse, rgba(${n.color},${n.opacity}) 0%, transparent 70%)`,
          filter: `blur(${n.blur}px)`, pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>

        {/* Greeting */}
        <div style={{
          textAlign: 'center', marginBottom: 52, position: 'relative',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          {/* Glow above greeting */}
          <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 360, height: 80, background: 'radial-gradient(ellipse, rgba(45,212,191,0.18) 0%, transparent 70%)', filter: 'blur(24px)', pointerEvents: 'none' }} />
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(26px, 3.8vw, 44px)',
            fontWeight: 'normal',
            letterSpacing: '-0.01em',
            background: 'linear-gradient(90deg, #e2f8f5, #ffffff, #b2f0ea)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'greetShimmer 6s ease-in-out infinite',
            margin: 0,
          }}>
            {getGreeting()}, {displayName}.
          </h1>
          <p style={{ fontSize: 13, color: '#4a6080', marginTop: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Which role are you stepping into?
          </p>
        </div>

        {/* Cards row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0, position: 'relative',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
        }}>
          {WORKSPACES.map((w, i) => {
            const isHovered = hoveredId === w.id && w.active;
            return (
              <React.Fragment key={w.id}>
                {i > 0 && <FlowConnector accent1={WORKSPACES[i - 1].accent} accent2={w.accent} />}
                <div
                  onClick={() => w.active && w.path && navigate(w.path)}
                  onMouseEnter={() => w.active && setHoveredId(w.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    width: 240, height: 210, borderRadius: 24, position: 'relative',
                    cursor: w.active ? 'pointer' : 'default',
                    opacity: w.active ? 1 : 0.6,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isHovered ? 'translateY(-10px) scale(1.03)' : 'translateY(0) scale(1)',
                    animation: w.active && !isHovered ? 'floatUp 4s ease-in-out infinite' : 'none',
                  }}
                >
                  {/* Outer glow */}
                  <div style={{
                    position: 'absolute', inset: -3, borderRadius: 28,
                    background: `linear-gradient(135deg, ${w.accent}${isHovered ? '70' : '35'}, ${w.second}${isHovered ? '50' : '20'})`,
                    filter: `blur(${isHovered ? 20 : 12}px)`,
                    transition: 'all 0.4s ease', zIndex: 0,
                  }} />

                  {/* Card body */}
                  <div style={{
                    position: 'relative', zIndex: 1, width: '100%', height: '100%', borderRadius: 24,
                    background: 'linear-gradient(145deg, #1a2f52 0%, #0f1e38 55%, #080f20 100%)',
                    border: `1.5px solid ${w.accent}${isHovered ? 'bb' : '55'}`,
                    boxShadow: isHovered
                      ? `0 0 35px ${w.accent}55, 0 0 70px ${w.accent}22, inset 0 1px 0 rgba(255,255,255,0.1)`
                      : `0 0 18px ${w.accent}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 14, overflow: 'hidden', transition: 'all 0.4s ease',
                  }}>
                    {/* Inner nebula */}
                    <div style={{
                      position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
                      width: 140, height: 140, borderRadius: '50%',
                      background: `radial-gradient(circle, ${w.accent}${isHovered ? '28' : '14'} 0%, transparent 70%)`,
                      filter: 'blur(24px)', transition: 'all 0.4s ease', pointerEvents: 'none',
                    }} />
                    {/* Top shimmer */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${w.accent}88, transparent)` }} />

                    {/* Icon */}
                    <div style={{
                      width: 62, height: 62, borderRadius: 18,
                      background: `linear-gradient(135deg, ${w.accent}30, ${w.second}18)`,
                      border: `1px solid ${w.accent}66`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 24px ${w.accent}44`,
                      position: 'relative', zIndex: 1,
                    }}>
                      <w.icon size={28} color={w.accent} />
                    </div>

                    {/* Label */}
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                      <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15, letterSpacing: '0.02em', margin: 0 }}>{w.label}</p>
                      <p style={{ color: w.active ? w.accent : '#475569', fontSize: 12, marginTop: 4, letterSpacing: '0.04em' }}>{w.subtitle}</p>
                    </div>

                    {/* Coming Soon badge */}
                    {!w.active && (
                      <div style={{
                        position: 'absolute', bottom: 16, padding: '3px 14px', borderRadius: 20,
                        background: `${w.accent}18`, border: `1px solid ${w.accent}33`,
                        color: w.accent, fontSize: 11, letterSpacing: '0.06em',
                      }}>Coming Soon</div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </main>

      {/* Bottom ambient line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.25), transparent)', zIndex: 1 }} />
    </div>
  );
};

export default OwnerDashboard;
