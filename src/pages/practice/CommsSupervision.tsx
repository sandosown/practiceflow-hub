import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { supervisionStore, GpSupervisionSession, getWorkerName } from '@/data/gpMockData';
import { Plus, Trash2, Edit2, X, Check, Video, MapPin, Blend } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MOCK_USERS } from '@/data/mockData';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MODE_ICONS = { virtual: Video, in_person: MapPin, hybrid: Blend };

const CommsSupervision: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => supervisionStore.getAll());
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ facilitator_profile_id: 'u1', day_of_week: 1, time: '10:00 AM', location_mode: 'virtual' as string, location_detail: '', notes: '' });

  const refresh = () => setItems(supervisionStore.getAll());
  const allStaff = MOCK_USERS;

  const handleSave = () => {
    const data: GpSupervisionSession = {
      id: editId || crypto.randomUUID(), workspace_id: 'w1',
      facilitator_profile_id: form.facilitator_profile_id,
      day_of_week: Number(form.day_of_week), time: form.time,
      location_mode: form.location_mode as GpSupervisionSession['location_mode'],
      location_detail: form.location_detail || null, notes: form.notes || null,
    };
    if (editId) supervisionStore.update(editId, data);
    else supervisionStore.create(data);
    setCreating(false); setEditId(null); refresh();
  };

  const startEdit = (s: GpSupervisionSession) => {
    setEditId(s.id); setForm({
      facilitator_profile_id: s.facilitator_profile_id, day_of_week: s.day_of_week,
      time: s.time, location_mode: s.location_mode, location_detail: s.location_detail || '', notes: s.notes || '',
    });
  };

  return (
    <AppLayout title="Supervision" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Comms', path: '/practice/comms' }, { label: 'Supervision' },
    ]}>
      {isOwner && !creating && !editId && (
        <Button onClick={() => setCreating(true)} className="mb-4 pf-btn pf-btn-teal">
          <Plus className="w-4 h-4 mr-2" /> Add Session
        </Button>
      )}

      {(creating || editId) && isOwner && (
        <div className="pf-glass p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Facilitator</label>
              <select value={form.facilitator_profile_id} onChange={e => setForm(f => ({ ...f, facilitator_profile_id: e.target.value }))}
                className="w-full text-sm bg-background border border-border rounded-md px-2 py-2">
                {allStaff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Day</label>
              <select value={form.day_of_week} onChange={e => setForm(f => ({ ...f, day_of_week: Number(e.target.value) }))}
                className="w-full text-sm bg-background border border-border rounded-md px-2 py-2">
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Time</label>
              <Input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Mode</label>
              <select value={form.location_mode} onChange={e => setForm(f => ({ ...f, location_mode: e.target.value }))}
                className="w-full text-sm bg-background border border-border rounded-md px-2 py-2">
                <option value="virtual">Virtual</option>
                <option value="in_person">In Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          <Input placeholder="Location detail (optional)" value={form.location_detail} onChange={e => setForm(f => ({ ...f, location_detail: e.target.value }))} />
          <Textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="pf-btn pf-btn-teal"><Check className="w-4 h-4 mr-1" /> Save</Button>
            <Button variant="ghost" size="sm" onClick={() => { setCreating(false); setEditId(null); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(s => {
          const ModeIcon = MODE_ICONS[s.location_mode] || Video;
          return (
            <div key={s.id} className="pf-glass p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{DAYS[s.day_of_week]} at {s.time}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Facilitator: {getWorkerName(s.facilitator_profile_id)}</p>
                </div>
                {isOwner && (
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(s)} className="p-1 hover:bg-accent rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { supervisionStore.remove(s.id); refresh(); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <ModeIcon className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground capitalize">{s.location_mode.replace('_', ' ')}</span>
                {s.location_detail && <span className="text-sm text-muted-foreground">— {s.location_detail}</span>}
              </div>
              {s.notes && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{s.notes}</p>}
            </div>
          );
        })}
        {items.length === 0 && <p className="text-muted-foreground p-4 col-span-2">No supervision sessions scheduled.</p>}
      </div>
    </AppLayout>
  );
};

export default CommsSupervision;
