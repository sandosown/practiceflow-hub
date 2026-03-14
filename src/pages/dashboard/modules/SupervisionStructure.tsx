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

const SupervisionStructure: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();

  const pairs = [
    { supervisor: 'Dr. Angela Torres', supervisee: 'James Rivera LCSW', lastSession: '6 days ago', next: 'Not scheduled' },
    { supervisor: 'Dr. Angela Torres', supervisee: 'Priya Patel (Clinical Intern)', lastSession: '6 days ago', next: 'Not scheduled' },
  ].filter((p) => p.supervisor.toLowerCase().includes(q) || p.supervisee.toLowerCase().includes(q));

  const compliance = [
    { name: 'James Rivera LCSW', type: 'LP THERAPIST', detail: 'Weekly log pending verification', due: 'Due 3 days ago' },
  ].filter((c) => c.name.toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice</button>
          <span>›</span>
          <span className="text-foreground font-medium">Supervision Structure</span>
        </nav>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: '4px solid #4f46e5' }}>Supervision Structure</h1>
        </div>
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by supervisor or supervisee…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: '4px solid #4f46e5' }}>
            ACTIVE SUPERVISION PAIRS
          </h2>
          <div className="flex flex-col gap-3">
            {pairs.length === 0 && <p className="text-sm text-muted-foreground pl-3">No matching pairs.</p>}
            {pairs.map((p, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle('#4f46e5')}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.supervisor} <span className="font-normal text-muted-foreground">supervises</span> {p.supervisee}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last session: {p.lastSession} · Next: {p.next}</p>
                </div>
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn('#4f46e5')}>Log Session</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: '4px solid #ea580c' }}>
            LP COMPLIANCE
          </h2>
          <div className="flex flex-col gap-3">
            {compliance.length === 0 && <p className="text-sm text-muted-foreground pl-3">No matching items.</p>}
            {compliance.map((c, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle('#ea580c')}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full" style={{ background: `rgba(${hexToRgb('#ea580c')},0.15)`, color: '#ea580c' }}>{c.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.detail} · {c.due}</p>
                </div>
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn('#ea580c')}>Verify</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupervisionStructure;
