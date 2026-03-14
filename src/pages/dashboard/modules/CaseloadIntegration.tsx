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

interface Clinician {
  name: string;
  role: string;
  current: number;
  max: number;
  availability: 'AVAILABLE' | 'AT CAPACITY' | 'ON LEAVE';
}

interface UnassignedClient {
  name: string;
  status: string;
  detail: string;
}

const CLINICIANS: Clinician[] = [
  { name: 'James Rivera LCSW', role: 'LICENSED', current: 4, max: 8, availability: 'AVAILABLE' },
  { name: 'Dr. Angela Torres', role: 'SUPERVISOR', current: 2, max: 6, availability: 'AVAILABLE' },
  { name: 'Priya Patel', role: 'CLINICAL INTERN', current: 3, max: 5, availability: 'AVAILABLE' },
];

const UNASSIGNED: UnassignedClient[] = [
  { name: 'New referral from Austin Health', status: 'Awaiting assignment', detail: 'Received 2 days ago' },
  { name: 'Marcus Webb', status: 'Intake scheduled', detail: 'No clinician assigned' },
];

const AVAILABILITY_STYLES: Record<string, { bg: string; color: string }> = {
  AVAILABLE: { bg: `rgba(${hexToRgb('#0d9488')},0.15)`, color: '#0d9488' },
  'AT CAPACITY': { bg: `rgba(${hexToRgb('#d97706')},0.15)`, color: '#d97706' },
  'ON LEAVE': { bg: `rgba(${hexToRgb('#78716c')},0.15)`, color: '#78716c' },
};

const CaseloadIntegration: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();

  const filteredClinicians = CLINICIANS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.availability.toLowerCase().includes(q)
  );

  const filteredUnassigned = UNASSIGNED.filter(
    (c) => c.name.toLowerCase().includes(q) || c.status.toLowerCase().includes(q)
  );

  const renderSection = (label: string, accent: string, children: React.ReactNode) => (
    <section className="mb-10">
      <h2
        className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
        style={{ borderLeft: `4px solid ${accent}` }}
      >
        {label}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice</button>
          <span>›</span>
          <span className="text-foreground font-medium">Caseload Integration</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: '4px solid #3b82f6' }}>
            Caseload Integration
          </h1>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by clinician or status…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {renderSection('CLINICIAN CAPACITY', '#3b82f6',
          <>
            {filteredClinicians.length === 0 && <p className="text-sm text-muted-foreground pl-3">No matching clinicians.</p>}
            {filteredClinicians.map((c, i) => {
              const badge = AVAILABILITY_STYLES[c.availability];
              return (
                <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle('#3b82f6')}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>
                        {c.availability}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.role} · {c.current} of {c.max} clients
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {renderSection('UNASSIGNED CLIENTS', '#0ea5e9',
          <>
            {filteredUnassigned.length === 0 && <p className="text-sm text-muted-foreground pl-3">No matching items.</p>}
            {filteredUnassigned.map((c, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle('#0ea5e9')}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.status} · {c.detail}</p>
                </div>
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn('#0ea5e9')}>
                  Assign
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CaseloadIntegration;
