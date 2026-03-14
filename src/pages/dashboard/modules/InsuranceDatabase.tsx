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

interface Payer { name: string; detail: string; }

const ACTIVE: Payer[] = [
  { name: 'Aetna', detail: 'Panel open · 3 clinicians credentialed' },
  { name: 'Blue Cross Blue Shield', detail: 'Panel open · 2 clinicians credentialed' },
  { name: 'Cigna', detail: 'Panel open · 1 clinician credentialed' },
];

const IN_PROGRESS: Payer[] = [
  { name: 'United Healthcare', detail: 'Application submitted · James Rivera LCSW · Est. completion: 30 days' },
  { name: 'Humana', detail: 'Documents pending · Priya Patel · Missing NPI' },
];

const InsuranceDatabase: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();
  const filter = (items: Payer[]) => items.filter((i) => i.name.toLowerCase().includes(q) || i.detail.toLowerCase().includes(q));

  const renderSection = (label: string, accent: string, items: Payer[]) => {
    const filtered = filter(items);
    return (
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${accent}` }}>{label}</h2>
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground pl-3">No matching items.</p>}
          {filtered.map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle(accent)}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
              </div>
              <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn(accent)}>View</button>
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
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: '4px solid #78716c' }}>Insurance Database</h1>
        </div>
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by payer name or status…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {renderSection('ACTIVE PAYERS', '#78716c', ACTIVE)}
        {renderSection('CREDENTIALING IN PROGRESS', '#d97706', IN_PROGRESS)}
      </div>
      <BottomNavBar />
    </div>
  );
};

export default InsuranceDatabase;
