import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft, Pin, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/* ── Demo data ── */
interface Announcement { id: string; title: string; body: string; date: string; pinned: boolean; }
interface StaffUpdate { id: string; author: string; body: string; date: string; }
interface Resource { id: string; title: string; category: string; url: string; }

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Holiday Schedule', body: 'Office closed Dec 24-25', date: '2/19/2026', pinned: true },
  { id: '2', title: 'EHR Training', body: 'Mandatory training next Thursday 2pm', date: '2/19/2026', pinned: false },
];

const CATEGORIES = ['All', 'Emergency', 'Handbook', 'Policies', 'Procedures', 'Other'];

const OfficeBoard: React.FC = () => {
  const navigate = useNavigate();

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [showNewAnn, setShowNewAnn] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  // Staff updates state
  const [updates, setUpdates] = useState<StaffUpdate[]>([]);
  const [updateText, setUpdateText] = useState('');

  // Resources state
  const [resources, setResources] = useState<Resource[]>([]);
  const [resCat, setResCat] = useState('All');
  const [showNewRes, setShowNewRes] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resCategory, setResCategory] = useState('Other');

  const createAnnouncement = () => {
    if (!annTitle.trim()) return;
    setAnnouncements(prev => [{ id: crypto.randomUUID(), title: annTitle.trim(), body: annBody.trim(), date: new Date().toLocaleDateString(), pinned: annPinned }, ...prev]);
    setAnnTitle(''); setAnnBody(''); setAnnPinned(false); setShowNewAnn(false);
  };

  const postUpdate = () => {
    if (!updateText.trim()) return;
    setUpdates(prev => [{ id: crypto.randomUUID(), author: 'You', body: updateText.trim(), date: new Date().toLocaleDateString() }, ...prev]);
    setUpdateText('');
  };

  const createResource = () => {
    if (!resTitle.trim()) return;
    setResources(prev => [{ id: crypto.randomUUID(), title: resTitle.trim(), category: resCategory, url: resUrl.trim() }, ...prev]);
    setResTitle(''); setResUrl(''); setResCategory('Other'); setShowNewRes(false);
  };

  const sortedAnn = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const filteredRes = resCat === 'All' ? resources : resources.filter(r => r.category === resCat);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice Dashboard</button>
          <span>›</span>
          <span className="text-foreground font-medium">Office Board</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Office Board</h1>
        </div>

        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="updates">Staff Updates</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* ── Announcements ── */}
          <TabsContent value="announcements" className="space-y-4">
            {!showNewAnn && (
              <Button size="sm" onClick={() => setShowNewAnn(true)}>
                <Plus className="w-4 h-4 mr-1" /> New Announcement
              </Button>
            )}
            {showNewAnn && (
              <div className="sf-card p-4 space-y-3">
                <Input placeholder="Title" value={annTitle} onChange={e => setAnnTitle(e.target.value)} className="bg-background border-border" />
                <Textarea placeholder="Body" value={annBody} onChange={e => setAnnBody(e.target.value)} rows={3} className="bg-background border-border" />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" checked={annPinned} onChange={e => setAnnPinned(e.target.checked)} /> Pin to top
                </label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={createAnnouncement}><Check className="w-4 h-4 mr-1" /> Post</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewAnn(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}
            {sortedAnn.map(a => (
              <div key={a.id} className="sf-card p-4">
                <div className="flex items-center gap-2 mb-1">
                  {a.pinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                  <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">{a.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </TabsContent>

          {/* ── Staff Updates ── */}
          <TabsContent value="updates" className="space-y-4">
            <div className="sf-card p-4 space-y-3">
              <Textarea placeholder="What's your update?" value={updateText} onChange={e => setUpdateText(e.target.value)} rows={3} className="bg-background border-border" />
              <div className="flex gap-2">
                <Button size="sm" onClick={postUpdate} disabled={!updateText.trim()}><Check className="w-4 h-4 mr-1" /> Post</Button>
                {updateText && <Button variant="ghost" size="sm" onClick={() => setUpdateText('')}><X className="w-4 h-4 mr-1" /> Cancel</Button>}
              </div>
            </div>
            {updates.length === 0 && (
              <p className="text-sm text-muted-foreground p-4">No updates yet.</p>
            )}
            {updates.map(u => (
              <div key={u.id} className="sf-card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground text-sm">{u.author}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{u.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{u.body}</p>
              </div>
            ))}
          </TabsContent>

          {/* ── Resources ── */}
          <TabsContent value="resources" className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={resCat}
                onChange={e => setResCat(e.target.value)}
                className="text-sm bg-card border border-border rounded-md px-2 py-1.5 text-foreground"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {!showNewRes && (
                <Button size="sm" onClick={() => setShowNewRes(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Resource
                </Button>
              )}
            </div>
            {showNewRes && (
              <div className="sf-card p-4 space-y-3">
                <Input placeholder="Resource title" value={resTitle} onChange={e => setResTitle(e.target.value)} className="bg-background border-border" />
                <Input placeholder="URL (optional)" value={resUrl} onChange={e => setResUrl(e.target.value)} className="bg-background border-border" />
                <select value={resCategory} onChange={e => setResCategory(e.target.value)} className="text-sm bg-card border border-border rounded-md px-2 py-1.5 text-foreground w-full">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={createResource}><Check className="w-4 h-4 mr-1" /> Add</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewRes(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}
            {filteredRes.length === 0 && (
              <p className="text-sm text-muted-foreground p-4">No resources yet.</p>
            )}
            {filteredRes.map(r => (
              <div key={r.id} className="sf-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{r.title}</p>
                  <span className="text-xs text-primary">{r.category}</span>
                </div>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Open</a>}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OfficeBoard;
