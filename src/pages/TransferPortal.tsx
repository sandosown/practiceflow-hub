import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { MOCK_REFERRALS, MOCK_USERS } from '@/data/mockData';
import { ChevronRight, UserPlus } from 'lucide-react';

const statusColors: Record<string, string> = {
  NEW: 'bg-pf-focus/[0.16] text-pf-focus',
  ACKNOWLEDGED: 'bg-pf-complete/[0.18] text-pf-complete',
  CONTACT_IN_PROGRESS: 'bg-pf-waiting/[0.18] text-pf-waiting',
  APPT_SCHEDULED: 'bg-pf-upcoming/[0.18] text-pf-upcoming',
  INTAKE_BLOCKED: 'bg-pf-blocked/[0.18] text-pf-blocked',
  INTAKE_READY: 'bg-pf-complete/[0.18] text-pf-complete',
};

const TransferPortal: React.FC = () => {
  const navigate = useNavigate();
  const referrals = MOCK_REFERRALS.filter(r => r.workspace_id === 'w1');

  return (
    <AppLayout
      title="Transfer Portal"
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'Group Practice', path: '/practice/radar' },
        { label: 'Transfer Portal' },
      ]}
    >
      <div className="flex gap-3 mb-6 mt-2">
        <a href="/practice/radar" className="text-sm px-4 py-2 rounded-lg glass-panel text-foreground font-medium card-shadow hover:bg-white/70 transition-colors">Radar</a>
        <button className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Transfer Portal</button>
        <a href="/practice/staff" className="text-sm px-4 py-2 rounded-lg glass-panel text-foreground font-medium card-shadow hover:bg-white/70 transition-colors">Staff Directory</a>
      </div>

      <div className="glass-panel rounded-xl card-shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assigned To</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact By</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => {
                const assignee = MOCK_USERS.find(u => u.id === r.assigned_to_profile_id);
                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/practice/transfers/${r.id}`)}
                    className="border-b border-white/20 hover:bg-white/30 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-foreground">{r.client_name}</div>
                      <div className="text-sm text-muted-foreground">{r.client_email}</div>
                    </td>
                    <td className="p-4">
                      {assignee ? (
                        <span className="text-sm text-foreground">{assignee.full_name}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-pf-blocked"><UserPlus className="w-3.5 h-3.5" /> Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[r.status]}`}>
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{r.contact_by}</td>
                    <td className="p-4"><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default TransferPortal;
