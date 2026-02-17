import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { staffUpdatesStore, GpStaffUpdate, getWorkerName } from '@/data/gpMockData';
import { Plus, X, Check, Eye, EyeOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MOCK_USERS } from '@/data/mockData';

const CommsStaffUpdates: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => staffUpdatesStore.getAll());
  const [creating, setCreating] = useState(false);
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'owner_only'>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('');

  const refresh = () => setItems(staffUpdatesStore.getAll());

  const handleCreate = () => {
    if (!body.trim()) return;
    staffUpdatesStore.create({
      id: crypto.randomUUID(), workspace_id: 'w1', author_profile_id: user!.id,
      body: body.trim(), visibility, created_at: new Date().toISOString(),
    });
    setBody(''); setVisibility('all'); setCreating(false); refresh();
  };

  const visible = items.filter(u => {
    if (u.visibility === 'owner_only' && !isOwner) return false;
    if (filterAuthor && u.author_profile_id !== filterAuthor) return false;
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const staff = MOCK_USERS.filter(u => u.role !== 'OWNER');

  return (
    <AppLayout title="Staff Updates" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Comms', path: '/practice/comms' }, { label: 'Staff Updates' },
    ]}>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {!creating && (
          <Button onClick={() => setCreating(true)} className="pf-btn pf-btn-teal">
            <Plus className="w-4 h-4 mr-2" /> Post Update
          </Button>
        )}
        <select value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)}
          className="text-sm bg-background border border-border rounded-md px-2 py-1">
          <option value="">All authors</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
        </select>
      </div>

      {creating && (
        <div className="pf-glass p-4 mb-6 space-y-3">
          <Textarea placeholder="What's your update?" value={body} onChange={e => setBody(e.target.value)} rows={3} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={visibility === 'owner_only'} onChange={e => setVisibility(e.target.checked ? 'owner_only' : 'all')} />
            {visibility === 'owner_only' ? <><EyeOff className="w-3.5 h-3.5" /> Owner only</> : <><Eye className="w-3.5 h-3.5" /> Visible to all</>}
          </label>
          <div className="flex gap-2">
            <Button onClick={handleCreate} size="sm" className="pf-btn pf-btn-teal"><Check className="w-4 h-4 mr-1" /> Post</Button>
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {visible.map(u => (
          <div key={u.id} className="pf-glass p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-foreground text-sm">{getWorkerName(u.author_profile_id)}</span>
              {u.visibility === 'owner_only' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Owner Only</span>}
              <span className="text-xs text-muted-foreground ml-auto">{new Date(u.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{u.body}</p>
          </div>
        ))}
        {visible.length === 0 && <p className="text-muted-foreground p-4">No updates yet.</p>}
      </div>
    </AppLayout>
  );
};

export default CommsStaffUpdates;
