import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft, Pin, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cardStyle } from '@/lib/cardStyle';

const OB_ACCENT = '#0ea5e9';

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
  const [activeTab, setActiveTab] = useState<'announcements' | 'updates' | 'resources'>('announcements');

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [showNewAnn, setShowNewAnn] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  const [updates, setUpdates] = useState<StaffUpdate[]>([]);
  const [updateText, setUpdateText] = useState('');

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

  const tabs = [
    { key: 'announcements' as const, label: 'Announcements' },
    { key: 'updates' as const, label: 'Staff Updates' },
    { key: 'resources' as const, label: 'Resources' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#94a3b8' }}>
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice Dashboard</button>
          <span>›</span>
          <span className="font-medium" style={{ color: '#f1f5f9' }}>Office Board</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1
            className="text-2xl font-bold pl-3"
            style={{ color: '#f1f5f9', borderLeft: `4px solid ${OB_ACCENT}` }}
          >
            Office Board
          </h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: '#0f1e38' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="px-4 py-2 text-sm font-medium rounded-md transition-all"
              style={activeTab === t.key ? {
                color: '#f1f5f9',
                background: 'rgba(14, 165, 233, 0.15)',
                borderBottom: `2px solid ${OB_ACCENT}`,
                boxShadow: `0 2px 8px rgba(14, 165, 233, 0.2)`,
              } : {
                color: '#64748b',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {!showNewAnn && (
              <button
                className="h-8 text-xs font-semibold px-4 rounded-full"
                style={{ background: OB_ACCENT, color: '#0a1628' }}
                onClick={() => setShowNewAnn(true)}
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" /> New Announcement
              </button>
            )}
            {showNewAnn && (
              <div className="p-4 space-y-3" style={cardStyle(OB_ACCENT)}>
                <Input placeholder="Title" value={annTitle} onChange={e => setAnnTitle(e.target.value)} style={{ background: '#0f1e38', borderColor: 'rgba(14,165,233,0.2)', color: '#f1f5f9' }} />
                <Textarea placeholder="Body" value={annBody} onChange={e => setAnnBody(e.target.value)} rows={3} style={{ background: '#0f1e38', borderColor: 'rgba(14,165,233,0.2)', color: '#f1f5f9' }} />
                <label className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                  <input type="checkbox" checked={annPinned} onChange={e => setAnnPinned(e.target.checked)} /> Pin to top
                </label>
                <div className="flex gap-2">
                  <button className="h-7 text-xs font-semibold px-3 rounded-full" style={{ background: OB_ACCENT, color: '#0a1628' }} onClick={createAnnouncement}><Check className="w-3.5 h-3.5 inline mr-1" /> Post</button>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewAnn(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}
            {sortedAnn.map(a => (
              <div key={a.id} className="p-4" style={cardStyle(OB_ACCENT)}>
                <div className="flex items-center gap-2 mb-1">
                  {a.pinned && <Pin className="w-3.5 h-3.5" style={{ color: OB_ACCENT }} />}
                  <h3 className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{a.title}</h3>
                  <span className="text-xs ml-auto" style={{ color: '#64748b' }}>{a.date}</span>
                </div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>{a.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Staff Updates */}
        {activeTab === 'updates' && (
          <div className="space-y-4">
            <div className="p-4 space-y-3" style={cardStyle(OB_ACCENT)}>
              <Textarea placeholder="What's your update?" value={updateText} onChange={e => setUpdateText(e.target.value)} rows={3} style={{ background: '#0f1e38', borderColor: 'rgba(14,165,233,0.2)', color: '#f1f5f9' }} />
              <div className="flex gap-2">
                <button className="h-7 text-xs font-semibold px-3 rounded-full" style={{ background: OB_ACCENT, color: '#0a1628' }} onClick={postUpdate} disabled={!updateText.trim()}><Check className="w-3.5 h-3.5 inline mr-1" /> Post</button>
                {updateText && <Button variant="ghost" size="sm" onClick={() => setUpdateText('')}><X className="w-4 h-4 mr-1" /> Cancel</Button>}
              </div>
            </div>
            {updates.length === 0 && <p className="text-sm p-4" style={{ color: '#64748b' }}>No updates yet.</p>}
            {updates.map(u => (
              <div key={u.id} className="p-4" style={cardStyle(OB_ACCENT)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{u.author}</span>
                  <span className="text-xs ml-auto" style={{ color: '#64748b' }}>{u.date}</span>
                </div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>{u.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Resources */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={resCat}
                onChange={e => setResCat(e.target.value)}
                className="text-sm rounded-md px-2 py-1.5"
                style={{ background: '#0f1e38', border: '1px solid rgba(14,165,233,0.2)', color: '#f1f5f9' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {!showNewRes && (
                <button
                  className="h-8 text-xs font-semibold px-4 rounded-full"
                  style={{ background: OB_ACCENT, color: '#0a1628' }}
                  onClick={() => setShowNewRes(true)}
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Resource
                </button>
              )}
            </div>
            {showNewRes && (
              <div className="p-4 space-y-3" style={cardStyle(OB_ACCENT)}>
                <Input placeholder="Resource title" value={resTitle} onChange={e => setResTitle(e.target.value)} style={{ background: '#0f1e38', borderColor: 'rgba(14,165,233,0.2)', color: '#f1f5f9' }} />
                <Input placeholder="URL (optional)" value={resUrl} onChange={e => setResUrl(e.target.value)} style={{ background: '#0f1e38', borderColor: 'rgba(14,165,233,0.2)', color: '#f1f5f9' }} />
                <select value={resCategory} onChange={e => setResCategory(e.target.value)} className="text-sm rounded-md px-2 py-1.5 w-full" style={{ background: '#0f1e38', border: '1px solid rgba(14,165,233,0.2)', color: '#f1f5f9' }}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button className="h-7 text-xs font-semibold px-3 rounded-full" style={{ background: OB_ACCENT, color: '#0a1628' }} onClick={createResource}><Check className="w-3.5 h-3.5 inline mr-1" /> Add</button>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewRes(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}
            {filteredRes.length === 0 && <p className="text-sm p-4" style={{ color: '#64748b' }}>No resources yet.</p>}
            {filteredRes.map(r => (
              <div key={r.id} className="p-4 flex items-center justify-between" style={cardStyle(OB_ACCENT)}>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{r.title}</p>
                  <span className="text-xs" style={{ color: OB_ACCENT }}>{r.category}</span>
                </div>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: OB_ACCENT }}>Open</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficeBoard;
