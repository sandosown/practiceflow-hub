import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle } from '@/lib/cardStyle';

const ACCENT = '#7c3aed';

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return { background: 'transparent', color: accent, border: `1px solid rgba(${hexToRgb(accent)},0.5)` };
}

const SUMMARY = [
  { label: 'Total Staff', value: '6' },
  { label: 'Active Clients', value: '5' },
  { label: 'Open Referrals', value: '2' },
  { label: 'Pending Actions', value: '4' },
];

const STAFF = [
  { name: 'Dr. Sarah Mitchell', role: 'OWNER' },
  { name: 'Marcus Chen', role: 'ADMIN' },
  { name: 'Dr. Angela Torres', role: 'SUPERVISOR' },
  { name: 'James Rivera LCSW', role: 'CLINICIAN' },
  { name: 'Priya Patel', role: 'INTERN CLINICAL' },
  { name: 'Alex Nguyen', role: 'INTERN BUSINESS' },
  { name: 'Taylor Brooks', role: 'STAFF' },
];

const ACTIVITY = [
  { title: 'New hire added', detail: 'Alex Nguyen — Business Intern', time: '2 days ago' },
  { title: 'Referral received', detail: 'Austin Health — Awaiting assignment', time: '2 days ago' },
  { title: 'Transfer request submitted', detail: 'Robert Chen — Pending approval', time: '3 days ago' },
  { title: 'Credential alert', detail: 'James Rivera LCSW — License expiring in 14 days', time: '1 day ago' },
];

const ManagementCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: `4px solid ${ACCENT}` }}>Management Center</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {SUMMARY.map((s, i) => (
            <div key={i} className="p-4 rounded-xl" style={cardStyle(ACCENT)}>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Staff Overview */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            STAFF OVERVIEW
          </h2>
          <div className="flex flex-col gap-3">
            {STAFF.map((s, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle(ACCENT)}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn(ACCENT)}>View Profile</button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            RECENT ACTIVITY
          </h2>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="p-4" style={cardStyle(ACCENT)}>
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.detail} · {a.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default ManagementCenter;
