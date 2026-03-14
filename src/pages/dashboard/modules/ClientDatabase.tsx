import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cardStyle } from '@/lib/cardStyle';

const ACCENT = '#0d9488';

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

interface ClientRecord {
  name: string;
  status: 'ACTIVE' | 'PENDING TRANSFER';
  clinician: string;
  sessions: number;
}

const CLIENTS: ClientRecord[] = [
  { name: 'Maria Gonzalez', status: 'ACTIVE', clinician: 'James Rivera LCSW', sessions: 12 },
  { name: 'David Kim', status: 'ACTIVE', clinician: 'James Rivera LCSW', sessions: 4 },
  { name: 'Sandra Lee', status: 'ACTIVE', clinician: 'James Rivera LCSW', sessions: 8 },
  { name: 'Robert Chen', status: 'PENDING TRANSFER', clinician: 'James Rivera LCSW', sessions: 6 },
  { name: 'Kevin Park', status: 'ACTIVE', clinician: 'Priya Patel (Intern)', sessions: 3 },
  { name: 'Lisa Tran', status: 'ACTIVE', clinician: 'Priya Patel (Intern)', sessions: 2 },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: `rgba(${hexToRgb('#0d9488')},0.15)`, color: '#0d9488' },
  'PENDING TRANSFER': { bg: `rgba(${hexToRgb('#f59e0b')},0.15)`, color: '#f59e0b' },
};

const ClientDatabase: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = CLIENTS.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.clinician.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <span className="text-foreground font-medium">Client Database</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1
            className="text-2xl font-bold text-foreground pl-3"
            style={{ borderLeft: `4px solid ${ACCENT}` }}
          >
            Client Database
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, status, or clinician…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Client list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground pl-3">No matching clients.</p>
          )}
          {filtered.map((client, i) => {
            const badge = STATUS_STYLES[client.status];
            return (
              <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle(ACCENT)}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{client.name}</p>
                    <span
                      className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {client.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigned to {client.clinician} · {client.sessions} sessions
                  </p>
                </div>
                <button
                  className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0"
                  style={outlineBtn(ACCENT)}
                >
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default ClientDatabase;
