import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cardStyle } from '@/lib/cardStyle';

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return { background: 'transparent', color: accent, border: `1px solid rgba(${hexToRgb(accent)},0.5)` };
}

interface PlanItem { client: string; detail: string; clinician: string; }

const EXPIRING: PlanItem[] = [
  { client: 'Maria Gonzalez', detail: 'Plan expires in 5 days', clinician: 'James Rivera LCSW' },
  { client: 'Sandra Lee', detail: 'Plan expires in 12 days', clinician: 'James Rivera LCSW' },
  { client: 'Kevin Park', detail: 'Plan expires in 18 days', clinician: 'Priya Patel' },
];

const PENDING: PlanItem[] = [
  { client: 'David Kim', detail: 'Submitted for review', clinician: 'James Rivera LCSW' },
  { client: 'Lisa Tran', detail: 'Awaiting supervisor sign-off', clinician: 'Priya Patel' },
];

const UP_TO_DATE: PlanItem[] = [
  { client: 'Robert Chen', detail: 'Plan current — Next review in 45 days', clinician: 'James Rivera LCSW' },
];

const TreatmentPlanTracker: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();

  const filter = (items: PlanItem[]) =>
    items.filter((i) => i.client.toLowerCase().includes(q) || i.clinician.toLowerCase().includes(q));

  const renderSection = (label: string, accent: string, items: PlanItem[], actionLabel?: string) => {
    const filtered = filter(items);
    return (
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${accent}` }}>
          {label}
        </h2>
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground pl-3">No matching items.</p>}
          {filtered.map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle(accent)}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.client}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.detail} · {item.clinician}</p>
              </div>
              {actionLabel && (
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn(accent)}>
                  {actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice</button>
          <span>›</span>
          <span className="text-foreground font-medium">Treatment Plan Tracker</span>
        </nav>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: '4px solid #059669' }}>Treatment Plan Tracker</h1>
        </div>
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by client or clinician…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {renderSection('EXPIRING SOON', '#059669', EXPIRING, 'Review')}
        {renderSection('PENDING REVIEW', '#d97706', PENDING, 'Approve')}
        {renderSection('UP TO DATE', '#78716c', UP_TO_DATE)}
      </div>
    </div>
  );
};

export default TreatmentPlanTracker;
