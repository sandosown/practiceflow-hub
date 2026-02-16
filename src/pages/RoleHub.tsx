import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOperatingProfile } from '@/context/OperatingProfileContext';
import AppLayout from '@/components/AppLayout';
import OwnerOnboarding from '@/pages/OwnerOnboarding';
import { Briefcase, GraduationCap, Home, Sparkles } from 'lucide-react';

const BUILTIN_TILES = [
  {
    type: 'GROUP_PRACTICE',
    label: 'Group Practice',
    description: 'Manage referrals, staff, and intake workflows',
    icon: Briefcase,
    path: '/practice/radar',
    gradient: 'linear-gradient(135deg, rgba(47,198,180,0.30) 0%, rgba(91,183,255,0.25) 100%)',
    border: 'rgba(47,198,180,0.40)',
  },
  {
    type: 'COACHING',
    label: 'Coaching Business',
    description: 'Client follow-ups, workshops, and invoicing',
    icon: GraduationCap,
    path: '/coaching',
    gradient: 'linear-gradient(135deg, rgba(124,108,246,0.25) 0%, rgba(91,183,255,0.22) 100%)',
    border: 'rgba(124,108,246,0.35)',
  },
  {
    type: 'HOME',
    label: 'Home',
    description: 'Household tasks, maintenance, and reminders',
    icon: Home,
    path: '/home',
    gradient: 'linear-gradient(135deg, rgba(167,243,208,0.35) 0%, rgba(47,198,180,0.25) 100%)',
    border: 'rgba(47,198,180,0.35)',
  },
];

const CUSTOM_GRADIENT = 'linear-gradient(135deg, rgba(91,183,255,0.18) 0%, rgba(124,108,246,0.12) 100%)';
const CUSTOM_BORDER = 'rgba(91,183,255,0.30)';

const RoleHub: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, save } = useOperatingProfile();
  const navigate = useNavigate();
  const isOwner = user?.role === 'OWNER';

  if (!isOwner) return <Navigate to="/practice/my-radar" replace />;

  if (loading) {
    return (
      <div className="min-h-screen pf-app-bg flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

  const enabledDomains = profile?.domains ?? ['GROUP_PRACTICE'];
  const builtinVisible = BUILTIN_TILES.filter(t => enabledDomains.includes(t.type));

  // Custom domain tiles
  const customKeys = enabledDomains.filter(k => k.startsWith('CUSTOM_'));

  return (
    <AppLayout title={`Welcome back, ${user?.full_name?.split(' ')[0]}`}>
      <p className="text-muted-foreground mb-8 text-lg">Select a role to get started.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {builtinVisible.map(tile => {
          const Icon = tile.icon;
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

        {/* Custom domain tiles — Coming Soon */}
        {customKeys.map(key => {
          const label = profile?.domain_labels?.[key] ?? key;
          return (
            <div
              key={key}
              className="text-left rounded-2xl p-6 backdrop-blur-sm opacity-75 cursor-default"
              style={{
                background: CUSTOM_GRADIENT,
                border: `1px solid ${CUSTOM_BORDER}`,
                boxShadow: '0 12px 30px rgba(17,24,39,0.05)',
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/40 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-foreground">{label}</h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Custom workspace — available soon</p>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default RoleHub;
