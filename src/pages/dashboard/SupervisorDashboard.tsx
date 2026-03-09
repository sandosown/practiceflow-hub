import React from 'react';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';

const radarSignals = [
  { type: 'LP VERIFICATION OVERDUE', detail: 'Priya Patel — due 3 days ago', accent: '#ea580c' },
  { type: 'TERMINATION REQUEST', detail: 'James Rivera — awaiting your approval', accent: '#7c3aed' },
  { type: 'SUPERVISION SESSION DUE', detail: 'Priya Patel — weekly session not logged', accent: '#3b82f6' },
  { type: 'INTERN PROGRESS ALERT', detail: 'Priya Patel — hours behind schedule', accent: '#d97706' },
];

const supervisees = [
  {
    name: 'Priya Patel',
    role: 'CLINICAL INTERN',
    status: 'ACTIVE',
    statusAccent: '#2dd4bf',
    details: ['14 of 40 hours logged this month', 'Last supervision: 6 days ago'],
    action: 'Review Hours',
    actionAccent: '#2dd4bf',
  },
  {
    name: 'James Rivera LCSW',
    role: 'LP THERAPIST',
    status: 'LP COMPLIANCE',
    statusAccent: '#ea580c',
    details: ['Weekly log pending verification', 'Verification due: 3 days overdue'],
    action: 'Verify Week',
    actionAccent: '#ea580c',
  },
];

function hexRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return { background: 'transparent', color: accent, border: `1px solid rgba(${hexRgb(accent)},0.5)` };
}

const SupervisorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#64748b' }}>
          <span>Group Practice</span>
          <span>›</span>
          <span style={{ color: '#f1f5f9' }} className="font-medium">My Dashboard</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8" style={{ color: '#f1f5f9' }}>Group Practice</h1>

        {/* Section 1 — Radar */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3"
            style={{ color: '#94a3b8', borderLeft: '4px solid #2dd4bf' }}
          >
            RADAR
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {radarSignals.map((s) => (
              <div key={s.type} className="min-w-[220px] flex-shrink-0 p-4" style={cardStyle(s.accent)}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.accent }}>
                  {s.type}
                </p>
                <p className="text-sm font-medium mb-3" style={{ color: '#f1f5f9' }}>{s.detail}</p>
                <button className="text-xs font-medium px-3 py-1 rounded" style={outlineBtn(s.accent)}>
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Supervision Queue */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3"
            style={{ color: '#94a3b8', borderLeft: '4px solid #2dd4bf' }}
          >
            SUPERVISION QUEUE
          </h2>
          <div className="flex flex-col gap-3">
            {supervisees.map((s) => (
              <div key={s.name} className="flex items-start justify-between p-5" style={cardStyle(s.actionAccent)}>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{s.name}</p>
                    <span
                      className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: `rgba(${hexRgb(s.statusAccent)},0.15)`, color: s.statusAccent }}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: '#64748b' }}>{s.role}</p>
                  {s.details.map((d) => (
                    <p key={d} className="text-sm" style={{ color: '#94a3b8' }}>{d}</p>
                  ))}
                </div>
                <button className="text-xs font-medium px-3 py-1 rounded shrink-0 mt-1" style={outlineBtn(s.actionAccent)}>
                  {s.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Office Board */}
        <section>
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-1 pl-3"
            style={{ color: '#94a3b8', borderLeft: '4px solid #0ea5e9' }}
          >
            OFFICE BOARD
          </h2>
          <p className="text-xs mb-4 pl-3" style={{ color: '#64748b' }}>
            Announcements, safety protocols &amp; updates
          </p>
          <div className="p-5" style={cardStyle('#0ea5e9')}>
            <p className="text-sm mb-3" style={{ color: '#f1f5f9' }}>
              View announcements, safety protocols, and practice-wide updates.
            </p>
            <button className="text-xs font-medium px-4 py-1.5 rounded" style={outlineBtn('#0ea5e9')}>
              Go to Office Board
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
