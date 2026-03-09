import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/* HELPERS                                                     */
/* ─────────────────────────────────────────────────────────── */

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function cardStyle(accent: string): React.CSSProperties {
  const rgb = hexToRgb(accent);
  return {
    background: `linear-gradient(135deg, #1a2a4a 0%, rgba(${rgb}, 0.04) 100%)`,
    border: `1px solid rgba(${rgb}, 0.25)`,
    borderLeft: `4px solid ${accent}`,
    borderRadius: '16px',
    boxShadow: `0 4px 24px rgba(${rgb}, 0.10), inset 0 1px 0 rgba(255,255,255,0.04)`,
    padding: '20px',
  };
}

function outlineBtn(accent: string): React.CSSProperties {
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid ${accent}`,
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
}

function priorityBadge(accent: string): React.CSSProperties {
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid ${accent}`,
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '11px',
    fontWeight: 600,
  };
}

/* ─────────────────────────────────────────────────────────── */
/* DATA                                                        */
/* ─────────────────────────────────────────────────────────── */

const RADAR_SIGNALS = [
  { type: 'TASK OVERDUE', detail: 'Credentialing packet for Dr. Kim not submitted', accent: '#d97706' },
  { type: 'DOCUMENT PENDING', detail: 'Employee handbook acknowledgment unsigned', accent: '#3b82f6' },
  { type: 'FOLLOW UP', detail: 'Insurance panel application — awaiting response', accent: '#0d9488' },
];

const TASKS = [
  { task: 'Submit credentialing packet — Dr. Kim', priority: 'HIGH', due: 'Today', status: 'OVERDUE' },
  { task: 'Update staff contact directory', priority: 'MEDIUM', due: 'Mar 12', status: 'PENDING' },
  { task: 'Prepare onboarding folder — new hire', priority: 'MEDIUM', due: 'Mar 15', status: 'PENDING' },
  { task: 'File March insurance invoices', priority: 'LOW', due: 'Mar 20', status: 'PENDING' },
];

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: '#d97706',
  MEDIUM: '#2dd4bf',
  LOW: '#64748b',
};

/* ─────────────────────────────────────────────────────────── */
/* COMPONENT                                                   */
/* ─────────────────────────────────────────────────────────── */

const InternBusinessDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <TopNavBar />

      {/* Breadcrumb */}
      <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8' }}>
        <span>Group Practice</span>
        <ChevronRight size={14} style={{ color: '#64748b' }} />
        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>My Dashboard</span>
      </div>

      {/* Page Title */}
      <div style={{ padding: '0 24px 8px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Group Practice</h1>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>

        {/* Section 1 — Radar */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 4, height: 24, background: '#2dd4bf', borderRadius: 2 }} />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.05em', margin: 0 }}>RADAR</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {RADAR_SIGNALS.map((signal, i) => (
              <div key={i} style={{ ...cardStyle(signal.accent), minWidth: 280, flex: '0 0 auto' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: signal.accent, letterSpacing: '0.05em', margin: '0 0 8px' }}>
                  {signal.type}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.4 }}>
                  {signal.detail}
                </p>
                <button style={outlineBtn(signal.accent)}>Resolve</button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — My Tasks */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 4, height: 24, background: '#2dd4bf', borderRadius: 2 }} />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.05em', margin: 0 }}>MY TASKS</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TASKS.map((t, i) => (
              <div key={i} style={cardStyle('#2dd4bf')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: '0 0 8px' }}>{t.task}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
                      <span style={{ color: '#94a3b8' }}>Due: <span style={{ color: '#f1f5f9' }}>{t.due}</span></span>
                      <span style={{ color: t.status === 'OVERDUE' ? '#ea580c' : '#94a3b8' }}>{t.status}</span>
                    </div>
                  </div>
                  <span style={priorityBadge(PRIORITY_COLORS[t.priority])}>{t.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Office Board */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 4, height: 24, background: '#0ea5e9', borderRadius: 2 }} />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.05em', margin: 0 }}>OFFICE BOARD</h2>
          </div>
          <div style={cardStyle('#0ea5e9')}>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>Announcements, safety protocols & updates</p>
            <button
              onClick={() => navigate('/dashboard/owner/group-practice/office-board')}
              style={outlineBtn('#0ea5e9')}
            >
              Go to Office Board
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default InternBusinessDashboard;
