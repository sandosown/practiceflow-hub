import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { Briefcase, GraduationCap, Home, ChevronRight } from 'lucide-react';
import { useSessionData } from '@/context/SessionContext';

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const WORKSPACES = [
  { id: 'gp', label: 'Group Practice', icon: Briefcase, subtitle: 'Manage your practice', active: true, path: '/dashboard/owner/group-practice', accent: '#2dd4bf' },
  { id: 'coaching', label: 'Coaching', icon: GraduationCap, subtitle: 'Coming Soon', active: false, accent: '#f59e0b' },
  { id: 'home', label: 'Home', icon: Home, subtitle: 'Coming Soon', active: false, accent: '#4ade80' },
];

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const firstName = session.full_name?.split(' ')[0] ?? '';

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {firstName}.
        </h1>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Choose a workspace</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WORKSPACES.map(w => (
              <button
                key={w.id}
                disabled={!w.active}
                onClick={() => w.active && w.path && navigate(w.path)}
                className={`sf-card p-5 text-left flex items-start gap-4 ${!w.active ? 'opacity-40 cursor-not-allowed hover:border-border' : 'cursor-pointer'}`}
                style={{ borderLeft: `4px solid ${w.accent}` }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${w.accent}26` }}
                >
                  <w.icon className="w-5 h-5" style={{ color: w.accent }} />
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
