import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Megaphone, MessageSquare, BookOpen, GraduationCap } from 'lucide-react';

const sections = [
  { label: 'Announcements', description: 'Company-wide announcements', icon: Megaphone, path: '/practice/comms/announcements', gradient: 'linear-gradient(135deg, rgba(47,198,180,0.25), rgba(91,183,255,0.20))' },
  { label: 'Staff Updates', description: 'Messages from staff', icon: MessageSquare, path: '/practice/comms/staff-updates', gradient: 'linear-gradient(135deg, rgba(91,183,255,0.25), rgba(124,108,246,0.18))' },
  { label: 'Resources', description: 'Handbook, policies, emergency info', icon: BookOpen, path: '/practice/comms/resources', gradient: 'linear-gradient(135deg, rgba(167,243,208,0.30), rgba(47,198,180,0.20))' },
  { label: 'Supervision', description: 'Supervision schedule & details', icon: GraduationCap, path: '/practice/comms/supervision', gradient: 'linear-gradient(135deg, rgba(124,108,246,0.22), rgba(91,183,255,0.18))' },
];

const CommsHub: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AppLayout title="Comms" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' }, { label: 'Comms' },
    ]}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mt-4">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.path} onClick={() => navigate(s.path)}
              className="text-left rounded-2xl p-5 transition-all duration-200 group hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              style={{ background: s.gradient, border: '1px solid rgba(255,255,255,0.45)' }}>
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

export default CommsHub;
