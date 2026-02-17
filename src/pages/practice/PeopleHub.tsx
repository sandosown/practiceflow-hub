import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { MOCK_USERS } from '@/data/mockData';
import { workerProfilesStore } from '@/data/gpMockData';
import { Mail, Phone, ClipboardList } from 'lucide-react';

const statusColors: Record<string, string> = {
  'not_started': 'bg-muted text-muted-foreground',
  'draft': 'bg-yellow-100 text-yellow-800',
  'submitted': 'bg-blue-100 text-blue-800',
  'changes_requested': 'bg-orange-100 text-orange-800',
  'approved': 'bg-green-100 text-green-800',
};

const PeopleHub: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === 'OWNER';
  const staff = MOCK_USERS.filter(u => u.role !== 'OWNER' && u.status === 'active');
  const workerProfiles = workerProfilesStore.getAll();

  const getProfileStatus = (workerId: string) => {
    const wp = workerProfiles.find(p => p.worker_profile_id === workerId);
    return wp?.status ?? 'not_started';
  };

  return (
    <AppLayout title="People" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' }, { label: 'People' },
    ]}>
      {isOwner && (
        <div className="mb-4">
          <button onClick={() => navigate('/practice/people/reviews')} className="pf-btn pf-btn-blue flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Profile Reviews
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => {
          const profileStatus = getProfileStatus(member.id);
          const statusLabel = profileStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <div key={member.id} className="pf-glass overflow-hidden cursor-pointer hover:-translate-y-1 transition-all"
              onClick={() => {
                if (!isOwner && member.id === user?.id) navigate('/practice/people/my-profile');
                else if (isOwner) navigate(`/practice/people/review/${member.id}`);
              }}>
              <div className="h-1.5" style={{ background: member.role === 'THERAPIST' ? 'rgba(91,183,255,0.35)' : 'rgba(124,108,246,0.30)' }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{member.full_name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{member.full_name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{member.role}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[profileStatus]}`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {member.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {member.phone}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default PeopleHub;
