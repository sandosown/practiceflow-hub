import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';
import BottomNavBar from '@/components/BottomNavBar';

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
  return `${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid rgba(${hexRgb(accent)},0.45)`,
  };
}

const InternClinicalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = caseload.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        <div className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <span className="font-medium text-foreground">My Dashboard</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-3 mb-8">My Dashboard</h1>

        {/* Radar */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 pl-3 text-foreground border-l-4 border-primary">
            RADAR
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {radarSignals.map((s, i) => (
              <div key={i} className="p-4 space-y-2 flex-shrink-0" style={{ ...cardStyle(s.accent), minWidth: 260 }}>
                <span className="font-bold tracking-wider uppercase text-foreground" style={{ fontSize: 11, color: s.accent }}>{s.type}</span>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
                <button className="h-7 text-xs font-semibold px-3 rounded-full mt-1" style={outlineBtn(s.accent)}>Resolve</button>
              </div>
            ))}
          </div>
        </section>

        {/* My Caseload */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 pl-3 text-foreground border-l-4 border-primary">
            MY CASELOAD
          </h2>
          <input
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mb-4 text-sm bg-card text-foreground rounded-lg"
            style={{ border: '1px solid hsl(var(--border))', padding: '10px 14px', outline: 'none' }}
          />
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.name} className="p-4 flex items-center justify-between" style={cardStyle('#0d9488')}>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-sm text-foreground">{c.name}</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(13,148,136,0.15)', color: '#0d9488' }}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{c.sessions} sessions</span>
                  <span className={c.nextDue ? 'font-medium text-foreground' : ''}>
                    {c.nextDue ?? '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supervision */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 pl-3 text-foreground border-l-4 border-primary">
            SUPERVISION
          </h2>
          <div className="space-y-3">
            <div className="p-5" style={cardStyle('#4f46e5')}>
              <div className="space-y-1 mb-3">
                <p className="font-semibold text-sm text-foreground">Dr. Angela Torres</p>
                <p className="text-xs text-muted-foreground">Supervision type: Individual</p>
                <p className="text-xs text-muted-foreground">Last session: 6 days ago</p>
                <p className="text-xs text-muted-foreground">Next session: Not yet scheduled</p>
              </div>
              <button className="h-7 text-xs font-semibold px-3 rounded-full" style={outlineBtn('#4f46e5')}>
                Log Session Notes
              </button>
            </div>
          </div>
        </section>

        {/* Message Board */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 pl-3 text-foreground border-l-4 border-primary">
            MESSAGE BOARD
          </h2>
          <p className="text-sm text-muted-foreground mb-3">Announcements, safety protocols & updates</p>
          <div className="p-5" style={cardStyle('#0ea5e9')}>
            <p className="text-sm text-muted-foreground mb-3">View announcements, safety protocols, and practice-wide updates.</p>
            <button
              className="h-7 text-xs font-semibold px-3 rounded-full"
              style={outlineBtn('#0ea5e9')}
              onClick={() => navigate('/dashboard/owner/group-practice/office-board')}
            >
              Go to Message Board
            </button>
          </div>
        </section>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default InternClinicalDashboard;
