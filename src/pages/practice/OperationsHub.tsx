import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Users, FileText, Shield, Building2, ClipboardList } from 'lucide-react';

const OperationsHub: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';

  const sections = [
    { label: 'Clients', description: 'Client database & demographics', icon: Users, path: '/practice/ops/clients', show: isOwner },
    { label: 'My Caseload', description: 'Your assigned clients', icon: Users, path: '/practice/ops/caseload', show: !isOwner },
    { label: 'Treatment Plans', description: 'Treatment plan cycle tracker', icon: ClipboardList, path: '/practice/ops/treatment-plans', show: true },
    { label: 'Insurance (Payers)', description: 'Payer contacts & deadlines', icon: Shield, path: '/practice/ops/payers', show: true },
    { label: 'Vendors', description: 'Vendor database (admin only)', icon: Building2, path: '/practice/ops/vendors', show: isOwner },
  ].filter(s => s.show);

  const gradients = [
    'linear-gradient(135deg, rgba(47,198,180,0.25), rgba(91,183,255,0.20))',
    'linear-gradient(135deg, rgba(91,183,255,0.25), rgba(124,108,246,0.18))',
    'linear-gradient(135deg, rgba(167,243,208,0.30), rgba(47,198,180,0.20))',
    'linear-gradient(135deg, rgba(124,108,246,0.22), rgba(91,183,255,0.18))',
    'linear-gradient(135deg, rgba(100,116,139,0.22), rgba(91,108,255,0.16))',
  ];

  return (
    <AppLayout title="Operations" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' }, { label: 'Operations' },
    ]}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-4">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={s.path} onClick={() => navigate(s.path)}
              className="text-left rounded-2xl p-5 transition-all duration-200 group hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              style={{ background: gradients[i % gradients.length], border: '1px solid rgba(255,255,255,0.45)' }}>
              <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center mb-3 group-hover:bg-white/60 transition-colors">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{s.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
            </button>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default OperationsHub;
