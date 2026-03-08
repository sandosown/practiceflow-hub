import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft, ClipboardList, MessageSquare, LayoutDashboard, Users, Briefcase, FileText, Shield, CreditCard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SIGNALS = [
  { type: 'LICENSE EXPIRING', name: 'James Rivera, LCSW', detail: '14 days remaining' },
  { type: 'LP VERIFICATION OVERDUE', name: 'Priya Patel', detail: 'Due 3 days ago' },
  { type: 'UNASSIGNED REFERRAL', name: 'New referral from Austin Health', detail: 'Awaiting assignment' },
  { type: 'DISCHARGE DEADLINE', name: 'Maria Gonzalez', detail: 'Due tomorrow' },
  { type: 'ONBOARDING STUCK', name: 'Alex Nguyen (Business Intern)', detail: 'Step 2 of 4' },
  { type: 'MISSING CREDENTIALS', name: 'Dr. Angela Torres', detail: 'NPI # missing' },
];

const MODULES = [
  { id: 'charts', label: 'Charts Requiring Action', icon: ClipboardList, subtitle: 'Treatment plans needing review', path: '/dashboard/owner/group-practice/charts', accent: '#d97706' },
  { id: 'office-board', label: 'Office Board', icon: MessageSquare, subtitle: 'Announcements, updates & resources', path: '/dashboard/owner/group-practice/office-board', accent: '#0ea5e9' },
  { id: 'management', label: 'Management Center', icon: LayoutDashboard, subtitle: 'Staff, operations & oversight', path: '/dashboard/owner/group-practice/management', accent: '#7c3aed' },
  { id: 'clients', label: 'Client Database', icon: Users, subtitle: 'Client records & status', path: '/dashboard/owner/group-practice/clients', accent: '#0d9488' },
  { id: 'caseload', label: 'Caseload Integration', icon: Briefcase, subtitle: 'Therapist assignments & capacity', path: '/dashboard/owner/group-practice/caseload', accent: '#3b82f6' },
  { id: 'treatment', label: 'Treatment Plan Tracker', icon: FileText, subtitle: 'Plan cycles & reviews', path: '/dashboard/owner/group-practice/treatment', accent: '#059669' },
  { id: 'supervision', label: 'Supervision Structure', icon: Shield, subtitle: 'Supervision assignments', path: '/dashboard/owner/group-practice/supervision', accent: '#4f46e5' },
  { id: 'insurance', label: 'Insurance Database', icon: CreditCard, subtitle: 'Payers & coverage', path: '/dashboard/owner/group-practice/insurance', accent: '#78716c' },
  { id: 'vendors', label: 'Vendor Database', icon: Package, subtitle: 'Vendor contacts & contracts', path: '/dashboard/owner/group-practice/vendors', accent: '#92764a' },
];

const GroupPracticeDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <span className="text-foreground font-medium">Group Practice Dashboard</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Group Practice Dashboard</h1>
        </div>

        {/* Radar */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Radar</h2>
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

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => navigate(m.path)}
              className="sf-card p-5 text-left flex items-start gap-4 cursor-pointer"
              style={{ borderLeft: `4px solid ${m.accent}` }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${m.accent}26` }}
              >
                <m.icon className="w-5 h-5" style={{ color: m.accent }} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupPracticeDashboard;
