import React from 'react';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';
import BottomNavBar from '@/components/BottomNavBar';

const radarSignals = [
  { type: 'ONBOARDING STUCK', detail: 'Alex Nguyen — Step 2 of 4', accent: '#3b82f6' },
  { type: 'UNASSIGNED REFERRAL', detail: 'New referral from Austin Health', accent: '#0ea5e9' },
  { type: 'DISCHARGE DEADLINE', detail: 'Maria Gonzalez — due tomorrow', accent: '#7c3aed' },
  { type: 'MISSING CREDENTIALS', detail: 'Dr. Angela Torres — NPI # missing', accent: '#78716c' },
];

const workflowQueue = [
  { type: 'TRANSFER REQUEST', line1: 'Client: Robert Chen', line2: 'From: James Rivera', status: 'SUBMITTED' },
  { type: 'TERMINATION REQUEST', line1: 'Client: David Kim', line2: 'Requested by: James Rivera', status: 'PENDING APPROVAL' },
  { type: 'CAPACITY OVERRIDE', line1: 'Clinician: James Rivera', line2: 'Reason: Coverage needed', status: 'PENDING' },
];

function hexRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string) {
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid rgba(${hexRgb(accent)},0.5)`,
  } as React.CSSProperties;
}

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-20">

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
            {radarSignals.map((s) => (
              <div key={s.type} className="min-w-[220px] flex-shrink-0 p-4" style={cardStyle(s.accent)}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.accent }}>
                  {s.type}
                </p>
                <p className="text-sm font-semibold mb-3 text-foreground">{s.detail}</p>
                <button className="text-xs font-medium px-3 py-1 rounded" style={outlineBtn(s.accent)}>
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Workflow Queue */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
            style={{ borderLeft: '4px solid #2dd4bf' }}
          >
            WORKFLOW QUEUE
          </h2>
          <div className="flex flex-col gap-3">
            {workflowQueue.map((w) => (
              <div key={w.type} className="flex items-center justify-between p-4" style={cardStyle('#f59e0b')}>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>
                    {w.type}
                  </p>
                  <p className="text-sm text-foreground">{w.line1}</p>
                  <p className="text-xs text-muted-foreground">{w.line2}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
                  >
                    {w.status}
                  </span>
                  <button className="text-xs font-medium px-3 py-1 rounded" style={outlineBtn('#f59e0b')}>
                    Review
                  </button>
                </div>
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
            <button className="text-xs font-medium px-4 py-1.5 rounded" style={outlineBtn('#0ea5e9')}>
              Go to Message Board
            </button>
          </div>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default AdminDashboard;
