import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { payersStore, GpPayer } from '@/data/gpMockData';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const OpsPayers: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => payersStore.getAll());
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ payer_name: '', payer_id: '', claims_address: '', submission_deadlines: '', contact_name: '', contact_phone: '', contact_email: '', notes: '' });

  const refresh = () => setItems(payersStore.getAll());

  const handleSave = () => {
    if (!form.payer_name.trim()) return;
    const data: GpPayer = { id: editId || crypto.randomUUID(), workspace_id: 'w1', ...form };
    if (editId) payersStore.update(editId, data);
    else payersStore.create(data);
    setCreating(false); setEditId(null); setForm({ payer_name: '', payer_id: '', claims_address: '', submission_deadlines: '', contact_name: '', contact_phone: '', contact_email: '', notes: '' }); refresh();
  };

  const startEdit = (p: GpPayer) => {
    setEditId(p.id); setForm({ payer_name: p.payer_name, payer_id: p.payer_id, claims_address: p.claims_address, submission_deadlines: p.submission_deadlines, contact_name: p.contact_name, contact_phone: p.contact_phone, contact_email: p.contact_email, notes: p.notes });
  };

  return (
    <AppLayout title="Insurance (Payers)" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Operations', path: '/practice/ops' }, { label: 'Insurance' },
    ]}>
      {isOwner && !creating && !editId && (
        <Button onClick={() => setCreating(true)} className="mb-4 pf-btn pf-btn-teal"><Plus className="w-4 h-4 mr-2" /> Add Payer</Button>
      )}

      {(creating || editId) && (
        <div className="pf-glass p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Payer Name" value={form.payer_name} onChange={e => setForm(f => ({ ...f, payer_name: e.target.value }))} />
            <Input placeholder="Payer ID" value={form.payer_id} onChange={e => setForm(f => ({ ...f, payer_id: e.target.value }))} />
            <Input placeholder="Claims Address" value={form.claims_address} onChange={e => setForm(f => ({ ...f, claims_address: e.target.value }))} />
            <Input placeholder="Submission Deadlines" value={form.submission_deadlines} onChange={e => setForm(f => ({ ...f, submission_deadlines: e.target.value }))} />
            <Input placeholder="Contact Name" value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
            <Input placeholder="Contact Phone" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} />
            <Input placeholder="Contact Email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
          </div>
          <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
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
              <TableHead>Payer Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Deadlines</TableHead>
              {isOwner && <TableHead></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(p => (
              <TableRow key={p.id} className="pf-row">
                <TableCell className="font-medium">{p.payer_name}</TableCell>
                <TableCell>{p.payer_id || '—'}</TableCell>
                <TableCell>{p.contact_name || '—'}</TableCell>
                <TableCell>{p.submission_deadlines || '—'}</TableCell>
                {isOwner && (
                  <TableCell>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(p)} className="p-1 hover:bg-accent rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => { payersStore.remove(p.id); refresh(); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={isOwner ? 5 : 4} className="text-center text-muted-foreground">No payers added yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default OpsPayers;
