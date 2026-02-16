import React from 'react';
import AppLayout from '@/components/AppLayout';
import { MOCK_USERS } from '@/data/mockData';
import { Mail, Phone } from 'lucide-react';

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
        <a href="/practice/radar" className="text-sm px-4 py-2 rounded-lg bg-card text-foreground font-medium card-shadow hover:bg-accent transition-colors">Radar</a>
        <a href="/practice/transfers" className="text-sm px-4 py-2 rounded-lg bg-card text-foreground font-medium card-shadow hover:bg-accent transition-colors">Transfer Portal</a>
        <button className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Staff Directory</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div key={member.id} className="bg-card rounded-xl card-shadow-md p-6">
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
        ))}
      </div>
    </AppLayout>
  );
};

export default StaffDirectory;
