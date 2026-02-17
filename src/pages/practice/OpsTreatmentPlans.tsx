import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { treatmentCyclesStore, clientsStore, GpTreatmentPlanCycle, getWorkerName } from '@/data/gpMockData';
import { MOCK_USERS } from '@/data/mockData';
import { Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const STATE_LABELS: Record<string, string> = {
  not_started: 'Not Started', started: 'Started', editing: 'Editing',
  done: 'Done', sent_for_approval: 'Sent for Approval', approved: 'Approved',
};
const STATE_COLORS: Record<string, string> = {
  not_started: 'bg-muted text-muted-foreground', started: 'bg-yellow-100 text-yellow-800',
  editing: 'bg-blue-100 text-blue-800', done: 'bg-green-100 text-green-800',
  sent_for_approval: 'bg-purple-100 text-purple-800', approved: 'bg-green-200 text-green-900',
};

const OpsTreatmentPlans: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => treatmentCyclesStore.getAll());
  const [filterClinician, setFilterClinician] = useState('');
  const [filterState, setFilterState] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ client_id: '', cycle_key: '', due_date: '', assigned_to_profile_id: '' });

  const clients = clientsStore.getAll();
  const clinicians = MOCK_USERS.filter(u => u.role !== 'OWNER');
  const refresh = () => setItems(treatmentCyclesStore.getAll());

  const handleCreate = () => {
    if (!form.client_id || !form.cycle_key || !form.due_date) return;
    treatmentCyclesStore.create({
      id: crypto.randomUUID(), workspace_id: 'w1', client_id: form.client_id,
      cycle_key: form.cycle_key, due_date: form.due_date,
      assigned_to_profile_id: form.assigned_to_profile_id || null,
      state: 'not_started', updated_at: new Date().toISOString(),
      submitted_at: null, approved_at: null, approved_by_profile_id: null,
    });
    setCreating(false); refresh();
  };

  const updateState = (id: string, state: string) => {
    const patch: Partial<GpTreatmentPlanCycle> = { state: state as GpTreatmentPlanCycle['state'], updated_at: new Date().toISOString() };
    if (state === 'sent_for_approval') patch.submitted_at = new Date().toISOString();
    if (state === 'approved') { patch.approved_at = new Date().toISOString(); patch.approved_by_profile_id = user!.id; }
    treatmentCyclesStore.update(id, patch);
    refresh();
  };

  const visible = useMemo(() => {
    let list = isOwner ? items : items.filter(i => i.assigned_to_profile_id === user?.id);
    if (filterClinician) list = list.filter(i => i.assigned_to_profile_id === filterClinician);
    if (filterState) list = list.filter(i => i.state === filterState);
    return list;
  }, [items, isOwner, user?.id, filterClinician, filterState]);

  const getClientName = (cid: string) => {
    const c = clients.find(cl => cl.id === cid);
    return c ? `${c.first_name} ${c.last_name}` : '—';
  };

  const workerStates = ['started', 'editing', 'done', 'sent_for_approval'];
  const ownerStates = ['approved'];

  return (
    <AppLayout title={isOwner ? 'Treatment Plan Tracker' : 'My Treatment Plans'} breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Operations', path: '/practice/ops' }, { label: 'Treatment Plans' },
    ]}>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {isOwner && !creating && (
          <Button onClick={() => setCreating(true)} className="pf-btn pf-btn-teal"><Plus className="w-4 h-4 mr-2" /> Create Cycle</Button>
        )}
        {isOwner && (
          <select value={filterClinician} onChange={e => setFilterClinician(e.target.value)}
            className="text-sm bg-background border border-border rounded-md px-2 py-1">
            <option value="">All Clinicians</option>
            {clinicians.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
        )}
        <select value={filterState} onChange={e => setFilterState(e.target.value)}
          className="text-sm bg-background border border-border rounded-md px-2 py-1">
          <option value="">All States</option>
          {Object.entries(STATE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {creating && (
        <div className="pf-glass p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}
              className="text-sm bg-background border border-border rounded-md px-2 py-2">
              <option value="">Select Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
            <input placeholder="Cycle Key (e.g., 2026-01)" value={form.cycle_key}
              onChange={e => setForm(f => ({ ...f, cycle_key: e.target.value }))}
              className="text-sm bg-background border border-border rounded-md px-2 py-2" />
            <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="text-sm bg-background border border-border rounded-md px-2 py-2" />
            <select value={form.assigned_to_profile_id} onChange={e => setForm(f => ({ ...f, assigned_to_profile_id: e.target.value }))}
              className="text-sm bg-background border border-border rounded-md px-2 py-2">
              <option value="">Assign Clinician</option>
              {clinicians.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} size="sm" className="pf-btn pf-btn-teal"><Check className="w-4 h-4 mr-1" /> Create</Button>
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="pf-glass pf-table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Due</TableHead>
              {isOwner && <TableHead>Clinician</TableHead>}
              <TableHead>State</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(c => (
              <TableRow key={c.id} className="pf-row">
                <TableCell className="font-medium">{getClientName(c.client_id)}</TableCell>
                <TableCell>{c.cycle_key}</TableCell>
                <TableCell>{c.due_date}</TableCell>
                {isOwner && <TableCell>{c.assigned_to_profile_id ? getWorkerName(c.assigned_to_profile_id) : '—'}</TableCell>}
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATE_COLORS[c.state]}`}>{STATE_LABELS[c.state]}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {!isOwner && workerStates.filter(s => s !== c.state).map(s => (
                      <button key={s} onClick={() => updateState(c.id, s)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition">
                        {STATE_LABELS[s]}
                      </button>
                    ))}
                    {isOwner && c.state === 'sent_for_approval' && (
                      <button onClick={() => updateState(c.id, 'approved')}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition">
                        Approve
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow><TableCell colSpan={isOwner ? 6 : 5} className="text-center text-muted-foreground">No treatment plan cycles found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default OpsTreatmentPlans;
