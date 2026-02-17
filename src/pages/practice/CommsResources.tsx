import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { resourcesStore, GpResource } from '@/data/gpMockData';
import { Plus, Trash2, Edit2, X, Check, ExternalLink, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CATEGORIES = ['emergency', 'handbook', 'policies', 'procedures', 'other'] as const;
const CAT_LABELS: Record<string, string> = { emergency: 'Emergency', handbook: 'Handbook', policies: 'Policies', procedures: 'Procedures', other: 'Other' };

const CommsResources: React.FC = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const [items, setItems] = useState(() => resourcesStore.getAll());
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', category: 'other' as string, resource_type: 'text' as 'link' | 'text', url: '', content: '' });

  const refresh = () => setItems(resourcesStore.getAll());

  const handleSave = () => {
    if (!form.title.trim()) return;
    const data: GpResource = {
      id: editId || crypto.randomUUID(), workspace_id: 'w1',
      category: form.category as GpResource['category'], title: form.title.trim(),
      resource_type: form.resource_type, url: form.resource_type === 'link' ? form.url : null,
      content: form.resource_type === 'text' ? form.content : null, updated_at: new Date().toISOString(),
    };
    if (editId) resourcesStore.update(editId, data);
    else resourcesStore.create(data);
    setCreating(false); setEditId(null); setForm({ title: '', category: 'other', resource_type: 'text', url: '', content: '' }); refresh();
  };

  const startEdit = (r: GpResource) => {
    setEditId(r.id); setForm({ title: r.title, category: r.category, resource_type: r.resource_type, url: r.url || '', content: r.content || '' }); setCreating(false);
  };

  const filtered = selectedCat ? items.filter(i => i.category === selectedCat) : items;

  return (
    <AppLayout title="Resources" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'Comms', path: '/practice/comms' }, { label: 'Resources' },
    ]}>
      <div className="flex gap-6 flex-col md:flex-row">
        {/* Left: categories */}
        <div className="md:w-48 flex-shrink-0">
          <div className="pf-glass p-3 space-y-1">
            <button onClick={() => setSelectedCat('')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${!selectedCat ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent'}`}>
              All
            </button>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setSelectedCat(c)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition capitalize ${selectedCat === c ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent'}`}>
                {CAT_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: list */}
        <div className="flex-1 min-w-0">
          {isOwner && !creating && !editId && (
            <Button onClick={() => { setCreating(true); setForm({ title: '', category: selectedCat || 'other', resource_type: 'text', url: '', content: '' }); }} className="mb-4 pf-btn pf-btn-teal">
              <Plus className="w-4 h-4 mr-2" /> Add Resource
            </Button>
          )}

          {(creating || editId) && isOwner && (
            <div className="pf-glass p-4 mb-4 space-y-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <div className="flex gap-3">
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="text-sm bg-background border border-border rounded-md px-2 py-1">
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
                <select value={form.resource_type} onChange={e => setForm(f => ({ ...f, resource_type: e.target.value as 'link' | 'text' }))}
                  className="text-sm bg-background border border-border rounded-md px-2 py-1">
                  <option value="text">Text</option>
                  <option value="link">Link</option>
                </select>
              </div>
              {form.resource_type === 'link' ? (
                <Input placeholder="URL" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
              ) : (
                <Textarea placeholder="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} />
              )}
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="pf-btn pf-btn-teal"><Check className="w-4 h-4 mr-1" /> Save</Button>
                <Button variant="ghost" size="sm" onClick={() => { setCreating(false); setEditId(null); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="pf-glass p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {r.resource_type === 'link' ? <ExternalLink className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
                    <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{r.category}</span>
                  </div>
                  {isOwner && (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(r)} className="p-1 hover:bg-accent rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => { resourcesStore.remove(r.id); refresh(); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  )}
                </div>
                {r.resource_type === 'link' && r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-primary underline mt-1 block">{r.url}</a>
                )}
                {r.resource_type === 'text' && r.content && (
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{r.content}</p>
                )}
              </div>
            ))}
            {filtered.length === 0 && <p className="text-muted-foreground p-4">No resources yet.</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CommsResources;
