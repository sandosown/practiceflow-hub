import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';
import BottomNavBar from '@/components/BottomNavBar';

/* ─────────────────────────────────────────────────────────── */
/* HELPERS                                                     */
/* ─────────────────────────────────────────────────────────── */

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid rgba(${hexToRgb(accent)},0.5)`,
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
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <span className="text-foreground font-medium">My Dashboard</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8 text-foreground">My Dashboard</h1>

        {/* Section 1 — Radar */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
            style={{ borderLeft: '4px solid #2dd4bf' }}
          >
            RADAR
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {RADAR_SIGNALS.map((signal, i) => (
              <div key={i} className="min-w-[280px] flex-shrink-0 p-5" style={cardStyle(signal.accent)}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: signal.accent }}>
                  {signal.type}
                </p>
                <p className="text-sm font-semibold mb-4 text-foreground leading-snug">
                  {signal.detail}
                </p>
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded" style={outlineBtn(signal.accent)}>
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — My Tasks */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
            style={{ borderLeft: '4px solid #2dd4bf' }}
          >
            MY TASKS
          </h2>
          <div className="flex flex-col gap-3">
            {TASKS.map((t, i) => (
              <div key={i} className="p-5 flex items-start justify-between flex-wrap gap-3" style={cardStyle('#2dd4bf')}>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[15px] font-semibold mb-2 text-foreground">{t.task}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Due: <span className="text-foreground">{t.due}</span></span>
                    <span style={{ color: t.status === 'OVERDUE' ? '#ea580c' : undefined }} className={t.status !== 'OVERDUE' ? 'text-muted-foreground' : ''}>
                      {t.status}
                    </span>
                  </div>
                </div>
                <span
                  className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'transparent',
                    color: PRIORITY_COLORS[t.priority],
                    border: `1px solid ${PRIORITY_COLORS[t.priority]}`,
                  }}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Message Board */}
        <section>
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-1 pl-3 text-muted-foreground"
            style={{ borderLeft: '4px solid #0ea5e9' }}
          >
            MESSAGE BOARD
          </h2>
          <p className="text-xs mb-4 pl-3 text-muted-foreground">
            Announcements, safety protocols &amp; updates
          </p>
          <div className="p-5" style={cardStyle('#0ea5e9')}>
            <p className="text-sm mb-3 text-foreground">
              View announcements, safety protocols, and practice-wide updates.
            </p>
            <button
              onClick={() => navigate('/dashboard/owner/group-practice/office-board')}
              className="text-xs font-semibold uppercase px-4 py-1.5 rounded"
              style={outlineBtn('#0ea5e9')}
            >
              Go to Message Board
            </button>
          </div>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default InternBusinessDashboard;
