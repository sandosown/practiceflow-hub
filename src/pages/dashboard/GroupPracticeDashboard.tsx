import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft, ClipboardList, MessageSquare, LayoutDashboard, Users, Briefcase, FileText, Shield, CreditCard, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle, cardHoverStyle, iconSquareStyle } from '@/lib/cardStyle';
import BottomNavBar from '@/components/BottomNavBar';

const SIGNALS = [
  { type: 'LICENSE EXPIRING', name: 'James Rivera, LCSW', detail: '14 days remaining', accent: '#d97706' },
  { type: 'LP VERIFICATION OVERDUE', name: 'Priya Patel', detail: 'Due 3 days ago', accent: '#ea580c' },
  { type: 'UNASSIGNED REFERRAL', name: 'New referral from Austin Health', detail: 'Awaiting assignment', accent: '#0ea5e9' },
  { type: 'DISCHARGE DEADLINE', name: 'Maria Gonzalez', detail: 'Due tomorrow', accent: '#7c3aed' },
  { type: 'ONBOARDING STUCK', name: 'Alex Nguyen (Business Intern)', detail: 'Step 2 of 4', accent: '#3b82f6' },
  { type: 'MISSING CREDENTIALS', name: 'Dr. Angela Torres', detail: 'NPI # missing', accent: '#78716c' },
];

const MODULES = [
  { id: 'charts', label: 'Charts Requiring Action', icon: ClipboardList, subtitle: 'Treatment plans needing review', path: '/dashboard/owner/group-practice/charts', accent: '#d97706' },
  { id: 'message-board', label: 'Message Board', icon: MessageSquare, subtitle: 'Announcements, updates & resources', path: '/dashboard/owner/group-practice/office-board', accent: '#0ea5e9' },
  { id: 'management', label: 'Management Center', icon: LayoutDashboard, subtitle: 'Staff, operations & oversight', path: '/dashboard/owner/group-practice/management', accent: '#7c3aed' },
  { id: 'clients', label: 'Client Database', icon: Users, subtitle: 'Client records & status', path: '/dashboard/owner/group-practice/clients', accent: '#0d9488' },
  { id: 'caseload', label: 'Caseload Integration', icon: Briefcase, subtitle: 'Therapist assignments & capacity', path: '/dashboard/owner/group-practice/caseload', accent: '#3b82f6' },
  { id: 'treatment', label: 'Treatment Plan Tracker', icon: FileText, subtitle: 'Plan cycles & reviews', path: '/dashboard/owner/group-practice/treatment', accent: '#059669' },
  { id: 'supervision', label: 'Supervision Structure', icon: Shield, subtitle: 'Supervision assignments', path: '/dashboard/owner/group-practice/supervision', accent: '#4f46e5' },
  { id: 'insurance', label: 'Insurance Database', icon: CreditCard, subtitle: 'Payers & coverage', path: '/dashboard/owner/group-practice/insurance', accent: '#78716c' },
  { id: 'vendors', label: 'Vendor Database', icon: Package, subtitle: 'Vendor contacts & contracts', path: '/dashboard/owner/group-practice/vendors', accent: '#92764a' },
  { id: 'major-moments', label: 'Major Moments', icon: Sparkles, subtitle: 'Your milestones and achievements.', path: '/dashboard/owner/group-practice/major-moments', accent: '#a78bfa' },
];

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)}`;
}

const GroupPracticeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#94a3b8' }}>
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <span className="font-medium text-foreground">Group Practice</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Group Practice</h1>
        </div>

        {/* Radar */}
        <section className="mb-10">
          <h2
            className="text-xl font-bold mb-4 pl-3 text-foreground border-l-4 border-primary"
          >
            RADAR
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SIGNALS.map((s, i) => (
              <div
                key={i}
                className="p-4 space-y-2 flex-shrink-0"
                style={{ ...cardStyle(s.accent), minWidth: 260 }}
              >
                <span className="font-bold tracking-wider uppercase" style={{ fontSize: 11, color: s.accent }}>{s.type}</span>
                <p className="font-bold text-base text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
                <button
                  className="h-7 text-xs font-semibold px-3 rounded-full mt-1"
                  style={{ background: 'transparent', color: s.accent, border: `1px solid rgba(${hexToRgb(s.accent)},0.45)` }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MODULES.map(m => {
            const isHovered = hoveredId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => navigate(m.path)}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="p-5 text-left flex items-start gap-4 cursor-pointer"
                style={isHovered ? cardHoverStyle(m.accent) : cardStyle(m.accent)}
              >
                <div
                  className="flex-shrink-0"
                  style={{ ...iconSquareStyle(m.accent), width: 44, height: 44 }}
                >
                  <m.icon className="w-5 h-5" style={{ color: m.accent }} />
                </div>
                <div>
                  <p className="font-semibold text-base text-foreground">{m.label}</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">{m.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default GroupPracticeDashboard;
