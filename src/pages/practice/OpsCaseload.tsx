import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { clientsStore } from '@/data/gpMockData';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const OpsCaseload: React.FC = () => {
  const { user } = useAuth();
  const clients = clientsStore.getAll().filter(c => c.primary_clinician_profile_id === user?.id);

  return (
    <AppLayout title="My Caseload" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Operations', path: '/practice/ops' }, { label: 'My Caseload' },
    ]}>
      <div className="pf-glass pf-table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map(c => (
              <TableRow key={c.id} className="pf-row">
                <TableCell className="font-medium">{c.first_name} {c.last_name}</TableCell>
                <TableCell>{c.date_of_birth || '—'}</TableCell>
                <TableCell>{c.location || '—'}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                    {c.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No clients assigned to you.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default OpsCaseload;
