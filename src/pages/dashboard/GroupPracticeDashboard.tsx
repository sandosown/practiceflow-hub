import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft, ClipboardList, MessageSquare, LayoutDashboard, Users, Briefcase, FileText, Shield, CreditCard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MODULES = [
  { id: 'charts', label: 'Charts Requiring Action', icon: ClipboardList, subtitle: 'Treatment plans needing review', path: '/dashboard/owner/group-practice/charts' },
  { id: 'office-board', label: 'Office Board', icon: MessageSquare, subtitle: 'Announcements, updates & resources', path: '/dashboard/owner/group-practice/office-board' },
  { id: 'management', label: 'Management Center', icon: LayoutDashboard, subtitle: 'Staff, operations & oversight', path: '/dashboard/owner/group-practice/management' },
  { id: 'clients', label: 'Client Database', icon: Users, subtitle: 'Client records & status', path: '/dashboard/owner/group-practice/clients' },
  { id: 'caseload', label: 'Caseload Integration', icon: Briefcase, subtitle: 'Therapist assignments & capacity', path: '/dashboard/owner/group-practice/caseload' },
  { id: 'treatment', label: 'Treatment Plan Tracker', icon: FileText, subtitle: 'Plan cycles & reviews', path: '/dashboard/owner/group-practice/treatment' },
  { id: 'supervision', label: 'Supervision Structure', icon: Shield, subtitle: 'Supervision assignments', path: '/dashboard/owner/group-practice/supervision' },
  { id: 'insurance', label: 'Insurance Database', icon: CreditCard, subtitle: 'Payers & coverage', path: '/dashboard/owner/group-practice/insurance' },
  { id: 'vendors', label: 'Vendor Database', icon: Package, subtitle: 'Vendor contacts & contracts', path: '/dashboard/owner/group-practice/vendors' },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => navigate(m.path)}
              className="sf-card p-5 text-left flex items-start gap-4 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <m.icon className="w-5 h-5 text-primary" />
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
