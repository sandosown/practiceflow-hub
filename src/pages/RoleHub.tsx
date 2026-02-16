import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Briefcase, GraduationCap, Home } from 'lucide-react';

const tiles = [
  {
    type: 'PRACTICE' as const,
    label: 'Group Practice',
    description: 'Manage referrals, staff, and intake workflows',
    icon: Briefcase,
    path: '/practice/radar',
    ownerOnly: false,
  },
  {
    type: 'COACHING' as const,
    label: 'Coaching Business',
    description: 'Client follow-ups, workshops, and invoicing',
    icon: GraduationCap,
    path: '/coaching',
    ownerOnly: true,
  },
  {
    type: 'HOME' as const,
    label: 'Home',
    description: 'Household tasks, maintenance, and reminders',
    icon: Home,
    path: '/home',
    ownerOnly: true,
  },
];

const RoleHub: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === 'OWNER';

  return (
    <AppLayout title={`Welcome back, ${user?.full_name?.split(' ')[0]}`}>
      <p className="text-muted-foreground mb-8 text-lg">Select a role to get started.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {tiles.map(tile => {
          const available = isOwner || !tile.ownerOnly;
          const Icon = tile.icon;
          return (
            <button
              key={tile.type}
              disabled={!available}
              onClick={() => {
                if (tile.type === 'PRACTICE' && !isOwner) {
                  navigate('/practice/my-radar');
                } else {
                  navigate(tile.path);
                }
              }}
              className={`text-left bg-card rounded-xl card-shadow-md p-6 transition-all duration-200 group ${
                available ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-1">{tile.label}</h2>
              <p className="text-sm text-muted-foreground">{tile.description}</p>
              {!available && <p className="text-xs text-muted-foreground mt-2 italic">Owner access only</p>}
            </button>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default RoleHub;
