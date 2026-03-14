import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';
import BottomNavBar from '@/components/BottomNavBar';

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

const signals = [
  { type: 'TASK DUE', detail: 'Front desk coverage schedule not confirmed', accent: '#d97706' },
  { type: 'DOCUMENT PENDING', detail: 'Staff policy update requires acknowledgment', accent: '#3b82f6' },
  { type: 'FOLLOW UP', detail: 'Supply order request awaiting approval', accent: '#0d9488' },
];

const tasks = [
  { task: 'Confirm front desk coverage — this week', priority: 'HIGH', due: 'Today', status: 'OVERDUE' },
  { task: 'Acknowledge updated staff policy', priority: 'HIGH', due: 'Mar 10', status: 'PENDING' },
  { task: 'Restock intake forms — waiting room', priority: 'MEDIUM', due: 'Mar 13', status: 'PENDING' },
  { task: 'Submit March supply request', priority: 'LOW', due: 'Mar 18', status: 'PENDING' },
];

const priorityColors: Record<string, string> = {
  HIGH: '#d97706',
  MEDIUM: '#2dd4bf',
  LOW: '#64748b',
};

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <span>Group Practice</span>
          <span>›</span>
          <span className="text-foreground font-medium">My Dashboard</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8 text-foreground">Group Practice</h1>

        {/* Section 1 — Radar */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
            style={{ borderLeft: '4px solid #2dd4bf' }}
          >
            RADAR
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {signals.map((signal, idx) => (
              <div key={idx} className="min-w-[280px] flex-shrink-0 p-4" style={cardStyle(signal.accent)}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: signal.accent }}>
                  {signal.type}
                </p>
                <p className="text-sm font-semibold mb-4 text-foreground">
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
            {tasks.map((t, idx) => (
              <div key={idx} className="p-5 flex flex-wrap items-center justify-between gap-3" style={cardStyle('#2dd4bf')}>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground">{t.task}</p>
                  <p className="text-sm mt-1 text-muted-foreground">Due: {t.due}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full"
                    style={{ background: 'transparent', color: priorityColors[t.priority], border: `1px solid ${priorityColors[t.priority]}` }}
                  >
                    {t.priority}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: t.status === 'OVERDUE' ? '#ea580c' : undefined }}
                  >
                    <span className={t.status !== 'OVERDUE' ? 'text-muted-foreground' : ''}>{t.status}</span>
                  </span>
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
              View announcements and practice updates.
            </p>
            <button
              onClick={() => navigate('/group-practice/office-board')}
              className="text-xs font-semibold uppercase px-4 py-1.5 rounded"
              style={outlineBtn('#0ea5e9')}
            >
              Go to Message Board
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffDashboard;
