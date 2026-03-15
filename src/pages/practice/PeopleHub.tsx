import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Search, X, UserPlus, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle } from '@/lib/cardStyle';
import StaffAvatar from '@/components/management/StaffAvatar';

const ACCENT = '#818cf8';
const TEAL = '#2dd4bf';

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

interface PeopleEntry {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  status: 'active' | 'pending' | 'draft';
}

const DEMO_STAFF: PeopleEntry[] = [
  { id: 'demo-owner', name: 'Dr. Sarah Mitchell', role: 'OWNER', roleLabel: 'Owner', status: 'active' },
  { id: 'demo-admin', name: 'Marcus Chen', role: 'ADMIN', roleLabel: 'Admin', status: 'active' },
  { id: 'demo-supervisor', name: 'Dr. Angela Torres', role: 'SUPERVISOR', roleLabel: 'Supervisor', status: 'active' },
  { id: 'demo-clinician', name: 'James Rivera, LCSW', role: 'CLINICIAN', roleLabel: 'Clinician — Licensed', status: 'active' },
  { id: 'demo-intern-clinical', name: 'Priya Patel', role: 'INTERN', roleLabel: 'Intern — Clinical', status: 'pending' },
  { id: 'demo-intern-business', name: 'Alex Nguyen', role: 'INTERN', roleLabel: 'Intern — Business', status: 'draft' },
  { id: 'demo-staff', name: 'Taylor Brooks', role: 'STAFF', roleLabel: 'Staff', status: 'active' },
  { id: 'demo-partner', name: 'Jordan Mitchell', role: 'PARTNER', roleLabel: 'Partner', status: 'active' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: TEAL },
  pending: { label: 'Pending', color: '#f59e0b' },
  draft: { label: 'Draft', color: 'hsl(var(--muted-foreground))' },
};

const PeopleHub: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return DEMO_STAFF;
    const q = search.toLowerCase();
    return DEMO_STAFF.filter(s => s.name.toLowerCase().includes(q) || s.roleLabel.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground self-start">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">People</h1>
          <div className="flex gap-2 sm:ml-auto">
            <button
              onClick={() => navigate('/practice/people/wizard')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md min-h-[44px] transition-colors hover:bg-accent/5"
              style={{ color: ACCENT, border: `1px solid rgba(${hexToRgb(ACCENT)},0.5)`, background: 'transparent' }}
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Team Member
            </button>
            <button
              onClick={() => navigate('/practice/people/reviews')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md min-h-[44px] transition-colors hover:bg-accent/5"
              style={{ color: TEAL, border: `1px solid rgba(${hexToRgb(TEAL)},0.5)`, background: 'transparent' }}
            >
              <ClipboardCheck className="w-3.5 h-3.5" /> Review Submissions
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team members..."
            className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              {search ? 'No results found.' : 'No team members yet. Add your first team member to get started.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(member => {
              const sc = statusConfig[member.status];
              return (
                <button
                  key={member.id}
                  onClick={() => navigate(`/practice/people/review/${member.id}`)}
                  className="p-4 flex items-center gap-4 text-left min-h-[56px] cursor-pointer"
                  style={cardStyle(ACCENT)}
                >
                  <StaffAvatar name={member.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{member.roleLabel}</p>
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{ color: sc.color, border: `1px solid ${sc.color}`, background: 'transparent' }}
                  >
                    {sc.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <BottomNavBar />
    </div>
  );
};

export default PeopleHub;
