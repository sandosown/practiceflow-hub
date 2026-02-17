import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { workerProfilesStore, GpWorkerProfile, getWorkerName } from '@/data/gpMockData';
import { Check, MessageSquare, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type TabKey = 'submitted' | 'changes_requested' | 'approved';

const ProfileReviews: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>('submitted');
  const [items, setItems] = useState(() => workerProfilesStore.getAll());
  const [reviewNote, setReviewNote] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const refresh = () => setItems(workerProfilesStore.getAll());

  const approve = (id: string) => {
    workerProfilesStore.update(id, {
      status: 'approved', reviewed_by_profile_id: user!.id,
      reviewed_at: new Date().toISOString(), review_note: null,
    });
    refresh();
  };

  const requestChanges = (id: string) => {
    if (!reviewNote.trim()) return;
    workerProfilesStore.update(id, {
      status: 'changes_requested', reviewed_by_profile_id: user!.id,
      reviewed_at: new Date().toISOString(), review_note: reviewNote.trim(),
    });
    setReviewingId(null); setReviewNote(''); refresh();
  };

  const filtered = items.filter(p => p.status === tab);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'submitted', label: `Pending (${items.filter(p => p.status === 'submitted').length})` },
    { key: 'changes_requested', label: `Changes Req. (${items.filter(p => p.status === 'changes_requested').length})` },
    { key: 'approved', label: `Approved (${items.filter(p => p.status === 'approved').length})` },
  ];

  const renderProfile = (p: GpWorkerProfile) => (
    <div key={p.id} className="pf-glass p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{p.first_name || getWorkerName(p.worker_profile_id)} {p.last_name}</h3>
          <p className="text-xs text-muted-foreground">Submitted: {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : '—'}</p>
        </div>
        {tab === 'submitted' && (
          <div className="flex gap-2">
            <Button size="sm" className="pf-btn pf-btn-teal" onClick={() => approve(p.id)}>
              <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setReviewingId(p.id); setReviewNote(''); }}>
              <MessageSquare className="w-4 h-4 mr-1" /> Request Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        {p.email && <div><span className="font-medium text-foreground">Email:</span> {p.email}</div>}
        {p.license_type && <div><span className="font-medium text-foreground">License:</span> {p.license_type}</div>}
        {p.npi_number && <div><span className="font-medium text-foreground">NPI:</span> {p.npi_number}</div>}
        {p.city && <div><span className="font-medium text-foreground">Location:</span> {p.city}, {p.state}</div>}
      </div>

      {p.populations_served.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {p.populations_served.map(pop => (
            <span key={pop} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{pop}</span>
          ))}
        </div>
      )}

      {p.review_note && tab === 'changes_requested' && (
        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">{p.review_note}</div>
      )}

      {reviewingId === p.id && (
        <div className="mt-3 space-y-2">
          <Textarea placeholder="Describe what needs to change..." value={reviewNote} onChange={e => setReviewNote(e.target.value)} rows={2} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => requestChanges(p.id)} className="pf-btn pf-btn-lavender">Send</Button>
            <Button size="sm" variant="ghost" onClick={() => setReviewingId(null)}><X className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout title="Profile Reviews" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'People', path: '/practice/people' }, { label: 'Profile Reviews' },
    ]}>
      <div className="pf-tabbar mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`pf-tab ${tab === t.key ? 'pf-tab-active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-muted-foreground p-4">No profiles in this category.</p>}
      {filtered.map(renderProfile)}
    </AppLayout>
  );
};

export default ProfileReviews;
