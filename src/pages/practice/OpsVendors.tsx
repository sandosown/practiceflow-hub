import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { vendorsStore, GpVendor } from '@/data/gpMockData';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const OpsVendors: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => vendorsStore.getAll());
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ vendor_name: '', main_contact_name: '', main_contact_phone: '', main_contact_email: '', documents_due_date: '', invoice_submission_window: '', notes_submission_timeframe: '', notes: '' });

  const refresh = () => setItems(vendorsStore.getAll());

  const handleSave = () => {
    if (!form.vendor_name.trim()) return;
    const data: GpVendor = {
      id: editId || crypto.randomUUID(), workspace_id: 'w1',
      vendor_name: form.vendor_name, main_contact_name: form.main_contact_name,
      main_contact_phone: form.main_contact_phone, main_contact_email: form.main_contact_email,
      documents_due_date: form.documents_due_date || null,
      invoice_submission_window: form.invoice_submission_window || null,
      notes_submission_timeframe: form.notes_submission_timeframe || null,
      notes: form.notes,
    };
    if (editId) vendorsStore.update(editId, data);
    else vendorsStore.create(data);
    setCreating(false); setEditId(null); setForm({ vendor_name: '', main_contact_name: '', main_contact_phone: '', main_contact_email: '', documents_due_date: '', invoice_submission_window: '', notes_submission_timeframe: '', notes: '' }); refresh();
  };

  const startEdit = (v: GpVendor) => {
    setEditId(v.id); setForm({
      vendor_name: v.vendor_name, main_contact_name: v.main_contact_name,
      main_contact_phone: v.main_contact_phone, main_contact_email: v.main_contact_email,
      documents_due_date: v.documents_due_date || '', invoice_submission_window: v.invoice_submission_window || '',
      notes_submission_timeframe: v.notes_submission_timeframe || '', notes: v.notes,
    });
  };

  if (!isOwner) {
    return (
      <AppLayout title="Vendors" breadcrumbs={[
        { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
        { label: 'Operations', path: '/practice/ops' }, { label: 'Vendors' },
      ]}>
        <p className="text-muted-foreground p-4">Vendor database is only accessible to administrators.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Vendors" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Operations', path: '/practice/ops' }, { label: 'Vendors' },
    ]}>
      {!creating && !editId && (
        <Button onClick={() => setCreating(true)} className="mb-4 pf-btn pf-btn-teal"><Plus className="w-4 h-4 mr-2" /> Add Vendor</Button>
      )}

      {(creating || editId) && (
        <div className="pf-glass p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Vendor Name" value={form.vendor_name} onChange={e => setForm(f => ({ ...f, vendor_name: e.target.value }))} />
            <Input placeholder="Contact Name" value={form.main_contact_name} onChange={e => setForm(f => ({ ...f, main_contact_name: e.target.value }))} />
            <Input placeholder="Contact Phone" value={form.main_contact_phone} onChange={e => setForm(f => ({ ...f, main_contact_phone: e.target.value }))} />
            <Input placeholder="Contact Email" value={form.main_contact_email} onChange={e => setForm(f => ({ ...f, main_contact_email: e.target.value }))} />
            <Input placeholder="Documents Due Date" value={form.documents_due_date} onChange={e => setForm(f => ({ ...f, documents_due_date: e.target.value }))} />
            <Input placeholder="Invoice Submission Window" value={form.invoice_submission_window} onChange={e => setForm(f => ({ ...f, invoice_submission_window: e.target.value }))} />
            <Input placeholder="Notes Submission Timeframe" value={form.notes_submission_timeframe} onChange={e => setForm(f => ({ ...f, notes_submission_timeframe: e.target.value }))} />
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
              <TableHead>Vendor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Docs Due</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(v => (
              <TableRow key={v.id} className="pf-row">
                <TableCell className="font-medium">{v.vendor_name}</TableCell>
                <TableCell>{v.main_contact_name || '—'}</TableCell>
                <TableCell>{v.main_contact_phone || '—'}</TableCell>
                <TableCell>{v.documents_due_date || '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(v)} className="p-1 hover:bg-accent rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { vendorsStore.remove(v.id); refresh(); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No vendors added yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default OpsVendors;
