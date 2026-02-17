import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { clientsStore, GpClient, getWorkerName } from '@/data/gpMockData';
import { MOCK_USERS } from '@/data/mockData';
import { Plus, Edit2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const OpsClients: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => clientsStore.getAll());
  const [filterClinician, setFilterClinician] = useState('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', date_of_birth: '', location: '', status: 'active' as string, primary_clinician_profile_id: '' });

  const refresh = () => setItems(clientsStore.getAll());
  const clinicians = MOCK_USERS.filter(u => u.role !== 'OWNER');

  const handleSave = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) return;
    const data: GpClient = {
      id: editId || crypto.randomUUID(), workspace_id: 'w1',
      first_name: form.first_name.trim(), last_name: form.last_name.trim(),
      date_of_birth: form.date_of_birth || null, location: form.location || null,
      status: form.status as 'active' | 'inactive',
      primary_clinician_profile_id: form.primary_clinician_profile_id || null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    if (editId) clientsStore.update(editId, data);
    else clientsStore.create(data);
    setCreating(false); setEditId(null); setForm({ first_name: '', last_name: '', date_of_birth: '', location: '', status: 'active', primary_clinician_profile_id: '' }); refresh();
  };

  const startEdit = (c: GpClient) => {
    setEditId(c.id); setForm({
      first_name: c.first_name, last_name: c.last_name, date_of_birth: c.date_of_birth || '',
      location: c.location || '', status: c.status, primary_clinician_profile_id: c.primary_clinician_profile_id || '',
    });
  };

  const filtered = filterClinician ? items.filter(c => c.primary_clinician_profile_id === filterClinician) : items;

  return (
    <AppLayout title="Clients" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Operations', path: '/practice/ops' }, { label: 'Clients' },
    ]}>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {isOwner && !creating && !editId && (
          <Button onClick={() => setCreating(true)} className="pf-btn pf-btn-teal"><Plus className="w-4 h-4 mr-2" /> Add Client</Button>
        )}
        <select value={filterClinician} onChange={e => setFilterClinician(e.target.value)}
          className="text-sm bg-background border border-border rounded-md px-2 py-1">
          <option value="">All Clinicians</option>
          {clinicians.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
        </select>
      </div>

      {(creating || editId) && (
        <div className="pf-glass p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="First Name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            <Input placeholder="Last Name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            <Input placeholder="Date of Birth" type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
            <Input placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <select value={form.primary_clinician_profile_id} onChange={e => setForm(f => ({ ...f, primary_clinician_profile_id: e.target.value }))}
              className="text-sm bg-background border border-border rounded-md px-2 py-2">
              <option value="">No Clinician</option>
              {clinicians.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="text-sm bg-background border border-border rounded-md px-2 py-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="pf-btn pf-btn-teal"><Check className="w-4 h-4 mr-1" /> Save</Button>
            <Button variant="ghost" size="sm" onClick={() => { setCreating(false); setEditId(null); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="pf-glass pf-table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Clinician</TableHead>
              <TableHead>Status</TableHead>
              {isOwner && <TableHead></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="pf-row">
                <TableCell className="font-medium">{c.first_name} {c.last_name}</TableCell>
                <TableCell>{c.date_of_birth || '—'}</TableCell>
                <TableCell>{c.location || '—'}</TableCell>
                <TableCell>{c.primary_clinician_profile_id ? getWorkerName(c.primary_clinician_profile_id) : '—'}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                    {c.status}
                  </span>
                </TableCell>
                {isOwner && (
                  <TableCell>
                    <button onClick={() => startEdit(c)} className="p-1 hover:bg-accent rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No clients found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default OpsClients;
