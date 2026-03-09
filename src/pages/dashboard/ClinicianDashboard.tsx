import React from 'react';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';

const signals = [
  { type: 'MY CHARTS DUE', detail: '3 charts require your signature', accent: '#d97706' },
  { type: 'TREATMENT PLAN REVIEW', detail: 'Maria Gonzalez — plan expires in 5 days', accent: '#059669' },
  { type: 'DISCHARGE TASK', detail: 'Client session notes overdue', accent: '#7c3aed' },
];

const caseload = [
  { name: 'Maria Gonzalez', status: 'ACTIVE', sessions: 12, nextDue: 'Treatment plan in 5 days' },
  { name: 'David Kim', status: 'ACTIVE', sessions: 4, nextDue: 'Chart due today' },
  { name: 'Sandra Lee', status: 'ACTIVE', sessions: 8, nextDue: null },
  { name: 'Robert Chen', status: 'PENDING_TRANSFER', sessions: 6, nextDue: 'Transfer in progress' },
];

const statusColor: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: 'rgba(45,212,191,0.15)', text: '#2dd4bf' },
  PENDING_TRANSFER: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
};

const ClinicianDashboard: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#64748b' }}>
          <span>Group Practice</span>
          <span>›</span>
          <span style={{ color: '#f1f5f9' }} className="font-medium">My Dashboard</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8" style={{ color: '#f1f5f9' }}>Group Practice</h1>

        {/* Section 1 — Attention Layer */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3" style={{ color: '#94a3b8', borderLeft: '4px solid #2dd4bf' }}>
            RADAR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {signals.map((s) => (
              <div key={s.type} className="p-4" style={cardStyle(s.accent)}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.accent }}>
                  {s.type}
                </p>
                <p className="text-sm mb-3" style={{ color: '#f1f5f9' }}>{s.detail}</p>
                <button
                  className="text-xs font-medium px-3 py-1 rounded"
                   style={{
                    background: 'transparent',
                    color: s.accent,
                    border: `1px solid rgba(${hexRgb(s.accent)},0.4)`,
                  }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — My Caseload */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>
            MY CASELOAD
          </h2>
          <div className="flex flex-col gap-3">
            {caseload.map((c) => {
              const accent = c.status === 'ACTIVE' ? '#2dd4bf' : '#f59e0b';
              const sc = statusColor[c.status];
              return (
                <div key={c.name} className="flex items-center justify-between p-4" style={cardStyle(accent)}>
                  <div className="flex items-center gap-4 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9' }}>{c.name}</p>
                    <span
                      className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-xs shrink-0" style={{ color: '#94a3b8' }}>
                    <span>{c.sessions} sessions</span>
                    <span style={{ color: c.nextDue ? '#f1f5f9' : '#64748b' }}>
                      {c.nextDue ?? '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

/** Tiny helper — extract r,g,b from a hex string for inline rgba() */
function hexRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

export default ClinicianDashboard;
