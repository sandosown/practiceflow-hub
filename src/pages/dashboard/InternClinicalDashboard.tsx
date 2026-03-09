import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';

const radarSignals = [
  { type: 'SUPERVISION SESSION DUE', detail: 'Weekly session not yet logged', accent: '#3b82f6' },
  { type: 'CHART DUE', detail: 'Session notes for Maria Gonzalez overdue', accent: '#d97706' },
  { type: 'HOURS ALERT', detail: 'Behind schedule — 14 of 40 hours this month', accent: '#ea580c' },
];

const caseload = [
  { name: 'Maria Gonzalez', status: 'ACTIVE', sessions: 6, nextDue: 'Chart due today' },
  { name: 'Kevin Park', status: 'ACTIVE', sessions: 3, nextDue: null },
  { name: 'Lisa Tran', status: 'ACTIVE', sessions: 2, nextDue: 'Treatment plan in 10 days' },
];

function hexRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return { background: 'transparent', color: accent, border: `1px solid rgba(${hexRgb(accent)},0.5)` };
}

const InternClinicalDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = caseload.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

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
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3" style={{ color: '#94a3b8', borderLeft: '4px solid #2dd4bf' }}>
            RADAR
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {radarSignals.map((s) => (
              <div key={s.type} className="min-w-[220px] flex-shrink-0 p-4" style={cardStyle(s.accent)}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.accent }}>{s.type}</p>
                <p className="text-sm font-medium mb-3" style={{ color: '#f1f5f9' }}>{s.detail}</p>
                <button className="text-xs font-medium px-3 py-1 rounded" style={outlineBtn(s.accent)}>Resolve</button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — My Caseload */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3" style={{ color: '#94a3b8', borderLeft: '4px solid #2dd4bf' }}>
            My Caseload
          </h2>
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 text-sm"
            style={{ background: '#1a2a4a', border: '1px solid #1e3a5f', color: '#f1f5f9', borderRadius: '8px', padding: '10px 14px', outline: 'none' }}
          />
          <div className="flex flex-col gap-3">
            {filtered.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-4" style={cardStyle('#2dd4bf')}>
                <div className="flex items-center gap-4 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9' }}>{c.name}</p>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs shrink-0" style={{ color: '#94a3b8' }}>
                  <span>{c.sessions} sessions</span>
                  <span style={{ color: c.nextDue ? '#f1f5f9' : '#64748b' }}>{c.nextDue ?? '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Supervision */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3" style={{ color: '#94a3b8', borderLeft: '4px solid #4f46e5' }}>
            Supervision
          </h2>
          <div className="p-5" style={cardStyle('#4f46e5')}>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>Dr. Angela Torres</p>
                <p className="text-xs" style={{ color: '#64748b' }}>Supervision type: Individual</p>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Last session: 6 days ago</p>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Next session: Not yet scheduled</p>
              </div>
              <button className="text-xs font-medium px-3 py-1 rounded shrink-0 mt-1" style={outlineBtn('#4f46e5')}>Log Session Notes</button>
            </div>
          </div>
        </section>

        {/* Section 4 — Office Board */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-1 pl-3" style={{ color: '#94a3b8', borderLeft: '4px solid #0ea5e9' }}>
            Office Board
          </h2>
          <p className="text-xs mb-4 pl-3" style={{ color: '#64748b' }}>Announcements, safety protocols &amp; updates</p>
          <div className="p-5" style={cardStyle('#0ea5e9')}>
            <p className="text-sm mb-3" style={{ color: '#f1f5f9' }}>View announcements, safety protocols, and practice-wide updates.</p>
            <button className="text-xs font-medium px-4 py-1.5 rounded" style={outlineBtn('#0ea5e9')}>Go to Office Board</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InternClinicalDashboard;
