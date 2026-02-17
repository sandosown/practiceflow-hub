import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { announcementsStore, GpAnnouncement } from '@/data/gpMockData';
import { Pin, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CommsAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => announcementsStore.getAll());
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);

  const refresh = () => setItems(announcementsStore.getAll());

  const handleCreate = () => {
    if (!title.trim()) return;
    announcementsStore.create({
      id: crypto.randomUUID(), workspace_id: 'w1', title: title.trim(), body: body.trim(),
      pinned, created_by_profile_id: user!.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    setTitle(''); setBody(''); setPinned(false); setCreating(false); refresh();
  };

  const handleUpdate = () => {
    if (!editId || !title.trim()) return;
    announcementsStore.update(editId, { title: title.trim(), body: body.trim(), pinned, updated_at: new Date().toISOString() });
    setEditId(null); setTitle(''); setBody(''); setPinned(false); refresh();
  };

  const handleDelete = (id: string) => { announcementsStore.remove(id); refresh(); };

  const startEdit = (a: GpAnnouncement) => {
    setEditId(a.id); setTitle(a.title); setBody(a.body); setPinned(a.pinned); setCreating(false);
  };

  const sorted = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <AppLayout title="Announcements" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Comms', path: '/practice/comms' }, { label: 'Announcements' },
    ]}>
      {isOwner && !creating && !editId && (
        <Button onClick={() => { setCreating(true); setTitle(''); setBody(''); setPinned(false); }} className="mb-4 pf-btn pf-btn-teal">
          <Plus className="w-4 h-4 mr-2" /> New Announcement
        </Button>
      )}

      {(creating || editId) && isOwner && (
        <div className="pf-glass p-4 mb-6 space-y-3">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} rows={3} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} /> Pin to top
          </label>
          <div className="flex gap-2">
            <Button onClick={editId ? handleUpdate : handleCreate} size="sm" className="pf-btn pf-btn-teal">
              <Check className="w-4 h-4 mr-1" /> {editId ? 'Save' : 'Post'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setCreating(false); setEditId(null); }}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(a => (
          <div key={a.id} className="pf-glass p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {a.pinned && <Pin className="w-4 h-4 text-primary" />}
                <h3 className="font-semibold text-foreground">{a.title}</h3>
              </div>
              {isOwner && (
                <div className="flex gap-1">
                  <button onClick={() => startEdit(a)} className="p-1 hover:bg-accent rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{a.body}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {sorted.length === 0 && <p className="text-muted-foreground p-4">No announcements yet.</p>}
      </div>
    </AppLayout>
  );
};

export default CommsAnnouncements;
