import React from 'react';
import AppLayout from '@/components/AppLayout';
import { MOCK_USERS } from '@/data/mockData';
import { Mail, Phone } from 'lucide-react';

const roleAccent: Record<string, string> = {
  OWNER: 'rgba(47,198,180,0.45)',
  THERAPIST: 'rgba(91,183,255,0.35)',
  INTERN: 'rgba(124,108,246,0.30)',
};

const StaffDirectory: React.FC = () => {
  const staff = MOCK_USERS.filter(u => u.status === 'active');

  return (
    <AppLayout
      title="Staff Directory"
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'Group Practice', path: '/practice/radar' },
        { label: 'Staff Directory' },
      ]}
    >
      <div className="flex gap-3 mb-6 mt-2">
        <a href="/practice/radar" className="pf-tab pf-tab-radar">Radar</a>
        <a href="/practice/transfers" className="pf-tab pf-tab-transfer">Transfer Portal</a>
        <button className="pf-tab pf-tab-staff pf-tab-active">Staff Directory</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div key={member.id} className="pf-glass overflow-hidden">
            <div className="h-1.5" style={{ background: roleAccent[member.role] || roleAccent.INTERN }} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">{member.full_name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{member.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" /> {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" /> {member.phone}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default StaffDirectory;
