import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';
import { ChevronRight } from 'lucide-react';

// Helper to convert hex to rgb tuple
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// Outline button style
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

// Priority badge style (border only)
function priorityBadge(accent: string): React.CSSProperties {
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid ${accent}`,
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
  };
}

// Signal card style with 5-layer system
function signalCardStyle(accent: string): React.CSSProperties {
  const [r, g, b] = hexToRgb(accent);
  return {
    background: `linear-gradient(135deg, rgba(${r},${g},${b},0.08) 0%, #1a2a4a 60%)`,
    border: `1px solid rgba(${r},${g},${b},0.45)`,
    borderLeft: `4px solid ${accent}`,
    borderRadius: '12px',
    boxShadow: `0 0 16px rgba(${r},${g},${b},0.18), inset 0 1px 0 rgba(255,255,255,0.04)`,
    padding: '16px',
    minWidth: '280px',
    flexShrink: 0,
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
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-4" style={{ color: '#94a3b8' }}>
          <span>Group Practice</span>
          <ChevronRight className="w-4 h-4" />
          <span style={{ color: '#f1f5f9' }}>My Dashboard</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-8" style={{ color: '#f1f5f9' }}>Group Practice</h1>

        {/* Section 1 — Radar */}
        <section className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{
              color: '#f1f5f9',
              borderLeft: '4px solid #2dd4bf',
              paddingLeft: '12px',
            }}
          >
            RADAR
          </h2>
          <div
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#2dd4bf #1a2a4a' }}
          >
            {signals.map((signal, idx) => (
              <div key={idx} style={signalCardStyle(signal.accent)}>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: signal.accent }}
                >
                  {signal.type}
                </p>
                <p className="font-semibold mb-4" style={{ color: '#f1f5f9' }}>
                  {signal.detail}
                </p>
                <button style={outlineBtn(signal.accent)}>Resolve</button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — My Tasks */}
        <section className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{
              color: '#f1f5f9',
              borderLeft: '4px solid #2dd4bf',
              paddingLeft: '12px',
            }}
          >
            MY TASKS
          </h2>
          <div className="space-y-3">
            {tasks.map((t, idx) => (
              <div key={idx} style={cardStyle('#2dd4bf')} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ color: '#f1f5f9' }}>
                      {t.task}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                      Due: {t.due}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={priorityBadge(priorityColors[t.priority])}>{t.priority}</span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: t.status === 'OVERDUE' ? '#ea580c' : '#94a3b8' }}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Office Board */}
        <section className="mb-8">
          <h2
            className="text-lg font-semibold mb-2"
            style={{
              color: '#f1f5f9',
              borderLeft: '4px solid #0ea5e9',
              paddingLeft: '12px',
            }}
          >
            OFFICE BOARD
          </h2>
          <p className="text-sm mb-4 pl-4" style={{ color: '#94a3b8' }}>
            Announcements, safety protocols & updates
          </p>
          <div style={cardStyle('#0ea5e9')} className="p-5">
            <p className="font-semibold mb-4" style={{ color: '#f1f5f9' }}>
              View announcements and practice updates.
            </p>
            <button
              onClick={() => navigate('/group-practice/office-board')}
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

export default StaffDashboard;
