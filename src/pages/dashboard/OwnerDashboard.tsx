import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { Briefcase, GraduationCap, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Attention Layer demo signals ── */
const SIGNALS = [
  { type: 'LICENSE EXPIRING', name: 'James Rivera, LCSW', detail: '14 days remaining' },
  { type: 'LP VERIFICATION OVERDUE', name: 'Priya Patel', detail: 'Due 3 days ago' },
  { type: 'UNASSIGNED REFERRAL', name: 'New referral from Austin Health', detail: 'Awaiting assignment' },
  { type: 'DISCHARGE DEADLINE', name: 'Maria Gonzalez', detail: 'Due tomorrow' },
  { type: 'ONBOARDING STUCK', name: 'Alex Nguyen (Business Intern)', detail: 'Step 2 of 4' },
  { type: 'MISSING CREDENTIALS', name: 'Dr. Angela Torres', detail: 'NPI # missing' },
];

const WORKSPACES = [
  { id: 'gp', label: 'Group Practice', icon: Briefcase, subtitle: 'Manage your practice', active: true, path: '/dashboard/owner/group-practice' },
  { id: 'coaching', label: 'Coaching', icon: GraduationCap, subtitle: 'Coming Soon', active: false },
  { id: 'home', label: 'Home', icon: Home, subtitle: 'Coming Soon', active: false },
];

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* ── Section 2: Attention Layer ── */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Attention Required</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SIGNALS.map((s, i) => (
              <div key={i} className="sf-alert-card p-4 space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-primary uppercase">{s.type}</span>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.detail}</p>
                <Button size="sm" className="h-7 text-xs mt-1">Resolve</Button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Workspace cards ── */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Choose a workspace</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WORKSPACES.map(w => (
              <button
                key={w.id}
                disabled={!w.active}
                onClick={() => w.active && w.path && navigate(w.path)}
                className={`sf-card p-5 text-left flex items-start gap-4 ${!w.active ? 'opacity-40 cursor-not-allowed hover:border-border' : 'cursor-pointer'}`}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <w.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{w.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{w.subtitle}</p>
                </div>
                {w.active && <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto self-center" />}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;
