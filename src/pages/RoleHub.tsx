import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOperatingProfile } from '@/context/OperatingProfileContext';
import AppLayout from '@/components/AppLayout';
import OwnerOnboarding from '@/pages/OwnerOnboarding';
import { Briefcase, GraduationCap, Home } from 'lucide-react';

const tiles = [
  {
    type: 'GROUP_PRACTICE' as const,
    label: 'Group Practice',
    description: 'Manage referrals, staff, and intake workflows',
    icon: Briefcase,
    path: '/practice/radar',
    gradient: 'linear-gradient(135deg, rgba(47,198,180,0.30) 0%, rgba(91,183,255,0.25) 100%)',
    border: 'rgba(47,198,180,0.40)',
  },
  {
    type: 'COACHING' as const,
    label: 'Coaching Business',
    description: 'Client follow-ups, workshops, and invoicing',
    icon: GraduationCap,
    path: '/coaching',
    gradient: 'linear-gradient(135deg, rgba(124,108,246,0.25) 0%, rgba(91,183,255,0.22) 100%)',
    border: 'rgba(124,108,246,0.35)',
  },
  {
    type: 'HOME' as const,
    label: 'Home',
    description: 'Household tasks, maintenance, and reminders',
    icon: Home,
    path: '/home',
    gradient: 'linear-gradient(135deg, rgba(167,243,208,0.35) 0%, rgba(47,198,180,0.25) 100%)',
    border: 'rgba(47,198,180,0.35)',
  },
];

const RoleHub: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, save } = useOperatingProfile();
  const navigate = useNavigate();
  const isOwner = user?.role === 'OWNER';

  // Staff should never see Role Hub
  if (!isOwner) return <Navigate to="/practice/my-radar" replace />;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pf-app-bg flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Onboarding gate
  if (profile && !profile.onboarding_complete) {
    return (
      <OwnerOnboarding
        onComplete={async (data) => {
          await save(data);
          navigate('/hub', { replace: true });
        }}
      />
    );
  }

  // Filter tiles by enabled domains
  const enabledDomains = profile?.domains ?? ['GROUP_PRACTICE'];
  const visibleTiles = tiles.filter(t => enabledDomains.includes(t.type));

  return (
    <AppLayout title={`Welcome back, ${user?.full_name?.split(' ')[0]}`}>
      <p className="text-muted-foreground mb-8 text-lg">Select a role to get started.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {visibleTiles.map(tile => {
          const Icon = tile.icon;
          // Use custom label from profile if available
          const label = profile?.domain_labels?.[tile.type] ?? tile.label;
          return (
            <button
              key={tile.type}
              onClick={() => navigate(tile.path)}
              className="text-left rounded-2xl p-6 transition-all duration-200 group backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              style={{
                background: tile.gradient,
                border: `1px solid ${tile.border}`,
                boxShadow: '0 12px 30px rgba(17,24,39,0.08)',
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/40 flex items-center justify-center mb-4 group-hover:bg-white/60 transition-colors">
                <Icon className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-1">{label}</h2>
              <p className="text-sm text-muted-foreground">{tile.description}</p>
            </button>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default RoleHub;
