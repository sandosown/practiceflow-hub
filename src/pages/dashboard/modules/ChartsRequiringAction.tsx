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
  return {
    background: 'transparent',
    color: accent,
    border: `1px solid rgba(${hexToRgb(accent)},0.5)`,
  };
}

interface ChartItem {
  clinician: string;
  client: string;
  action: string;
  due: string;
}

const UNSIGNED_NOTES: ChartItem[] = [
  { clinician: 'James Rivera, LCSW', client: 'Maria Gonzalez', action: 'Session note', due: 'Due today' },
  { clinician: 'James Rivera, LCSW', client: 'David Kim', action: 'Session note', due: 'Due today' },
  { clinician: 'Dr. Angela Torres', client: 'Priya Patel', action: 'Supervision note', due: 'Due tomorrow' },
];

const TREATMENT_PLANS: ChartItem[] = [
  { clinician: 'James Rivera', client: 'Maria Gonzalez', action: 'Plan expires in 5 days', due: '5 days' },
  { clinician: 'James Rivera', client: 'Sandra Lee', action: 'Plan expires in 12 days', due: '12 days' },
];

const PENDING_SIGNATURES: ChartItem[] = [
  { clinician: 'Dr. Torres', client: 'Kevin Park', action: 'Intake assessment — awaiting signature', due: 'Pending' },
  { clinician: 'Supervisor', client: 'Robert Chen', action: 'Discharge summary — awaiting review', due: 'Pending' },
];

const ChartsRequiringAction: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filter = (items: ChartItem[]) =>
    items.filter(
      (i) =>
        i.clinician.toLowerCase().includes(search.toLowerCase()) ||
        i.client.toLowerCase().includes(search.toLowerCase()) ||
        i.action.toLowerCase().includes(search.toLowerCase())
    );

  const renderSection = (label: string, accent: string, items: ChartItem[]) => {
    const filtered = filter(items);
    return (
      <section className="mb-10">
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
          style={{ borderLeft: `4px solid ${accent}` }}
        >
          {label}
        </h2>
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground pl-3">No matching items.</p>
          )}
          {filtered.map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle(accent)}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {item.clinician} — <span className="font-normal">{item.action}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Client: {item.client} · {item.due}
                </p>
              </div>
              <button
                className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0"
                style={outlineBtn(accent)}
              >
                Resolve
              </button>
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice</button>
          <span>›</span>
          <span className="text-foreground font-medium">Charts Requiring Action</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1
            className="text-2xl font-bold text-foreground pl-3"
            style={{ borderLeft: '4px solid #d97706' }}
          >
            Charts Requiring Action
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by clinician, client, or action…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {renderSection('UNSIGNED NOTES', '#d97706', UNSIGNED_NOTES)}
        {renderSection('TREATMENT PLANS EXPIRING', '#059669', TREATMENT_PLANS)}
        {renderSection('PENDING SIGNATURES', '#4f46e5', PENDING_SIGNATURES)}
      </div>
    </div>
  );
};

export default ChartsRequiringAction;
