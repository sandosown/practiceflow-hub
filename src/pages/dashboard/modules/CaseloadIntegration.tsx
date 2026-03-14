import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Search, Plus, Pencil, CheckSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cardStyle } from '@/lib/cardStyle';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const ACCENT = '#0ea5e9';

const STAGES = [
  'New Referral',
  'Contact Made',
  'Pre-Screening Complete',
  'Insurance Verified',
  'Assigned',
] as const;

type Stage = typeof STAGES[number];
type Outcome = 'Declined' | 'No Response' | 'Intake Complete';

interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  notes: string;
  dateSubmitted: string;
  daysInStage: number;
  stage: Stage;
  outcome?: Outcome;
}

const INITIAL_REFERRALS: Referral[] = [
  { id: '1', firstName: 'Marcus', lastName: 'Webb', phone: '512-555-0142', email: 'marcus.webb@email.com', source: 'Web Form', notes: '', dateSubmitted: '03/08/2026', daysInStage: 6, stage: 'New Referral' },
  { id: '2', firstName: 'Daniela', lastName: 'Reyes', phone: '512-555-0198', email: 'daniela.r@email.com', source: 'Web Form', notes: 'Prefers evening sessions', dateSubmitted: '03/06/2026', daysInStage: 8, stage: 'New Referral' },
  { id: '3', firstName: 'Jordan', lastName: 'Okafor', phone: '512-555-0277', email: 'jordan.o@email.com', source: 'Web Form', notes: '', dateSubmitted: '03/04/2026', daysInStage: 4, stage: 'Contact Made' },
  { id: '4', firstName: 'Lily', lastName: 'Chen', phone: '512-555-0311', email: 'lily.chen@email.com', source: 'Web Form', notes: 'Spanish-speaking preferred', dateSubmitted: '03/01/2026', daysInStage: 3, stage: 'Pre-Screening Complete' },
  { id: '5', firstName: 'Terrance', lastName: 'Brooks', phone: '512-555-0455', email: 'tbrooks@email.com', source: 'Web Form', notes: '', dateSubmitted: '02/25/2026', daysInStage: 2, stage: 'Insurance Verified' },
  { id: '6', firstName: 'Aisha', lastName: 'Patel', phone: '512-555-0523', email: 'aisha.p@email.com', source: 'Web Form', notes: 'Assigned to Dr. Torres', dateSubmitted: '02/20/2026', daysInStage: 1, stage: 'Assigned' },
];

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

/* ── Draggable Card ── */
const DraggableCard: React.FC<{ referral: Referral; isMobile: boolean; onMoveStage: (id: string, dir: 1 | -1) => void }> = ({ referral: r, isMobile, onMoveStage }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: r.id });
  const style: React.CSSProperties = {
    ...cardStyle(ACCENT),
    borderRadius: 10,
    opacity: isDragging ? 0.4 : 1,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    cursor: 'grab',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="p-3 space-y-2" style={style}>
      <p className="font-semibold text-sm text-foreground">{r.firstName} {r.lastName}</p>
      <p className="text-[11px] text-muted-foreground">Submitted {r.dateSubmitted}</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `rgba(${hexToRgb(ACCENT)},0.12)`, color: ACCENT }}>
          {r.source}
        </span>
        <span className="text-[10px] text-muted-foreground">{r.daysInStage}d in stage</span>
      </div>
      <div className="flex items-center gap-1 pt-1">
        <button className="p-1 rounded hover:bg-muted transition-colors" title="Add Note" onPointerDown={e => e.stopPropagation()}>
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button className="p-1 rounded hover:bg-muted transition-colors" title="Add Task" onPointerDown={e => e.stopPropagation()}>
          <CheckSquare className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {isMobile && (
          <button
            className="p-1 rounded hover:bg-muted transition-colors ml-auto"
            title="Move to next stage"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onMoveStage(r.id, 1)}
          >
            <ArrowRight className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Droppable Column ── */
const DroppableColumn: React.FC<{ stage: Stage; children: React.ReactNode; count: number }> = ({ stage, children, count }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div ref={setNodeRef} className="flex-shrink-0 flex flex-col" style={{ minWidth: 240, width: 240 }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stage}</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `rgba(${hexToRgb(ACCENT)},0.12)`, color: ACCENT }}>
          {count}
        </span>
      </div>
      <div
        className="flex flex-col gap-3 overflow-y-auto pr-1"
        style={{
          height: '70vh',
          transition: 'background 150ms',
          background: isOver ? `rgba(${hexToRgb(ACCENT)},0.06)` : undefined,
          borderRadius: 8,
          padding: 4,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ── Overlay Card (shown while dragging) ── */
const OverlayCard: React.FC<{ referral: Referral }> = ({ referral: r }) => (
  <div className="p-3 space-y-2 shadow-lg" style={{ ...cardStyle(ACCENT), borderRadius: 10, width: 232, background: 'hsl(var(--card))' }}>
    <p className="font-semibold text-sm text-foreground">{r.firstName} {r.lastName}</p>
    <p className="text-[11px] text-muted-foreground">Submitted {r.dateSubmitted}</p>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `rgba(${hexToRgb(ACCENT)},0.12)`, color: ACCENT }}>
        {r.source}
      </span>
      <span className="text-[10px] text-muted-foreground">{r.daysInStage}d in stage</span>
    </div>
  </div>
);

const ReferralPipeline: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', source: 'Web Form', notes: '' });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const q = search.toLowerCase();
  const filtered = referrals.filter(
    r => !r.outcome && (`${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || r.source.toLowerCase().includes(q))
  );

  const stageReferrals = (stage: Stage) => filtered.filter(r => r.stage === stage);

  const moveStage = (id: string, direction: 1 | -1) => {
    setReferrals(prev => prev.map(r => {
      if (r.id !== id || r.outcome) return r;
      const idx = STAGES.indexOf(r.stage);
      const next = idx + direction;
      if (next < 0 || next >= STAGES.length) return r;
      return { ...r, stage: STAGES[next], daysInStage: 0 };
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const targetStage = over.id as Stage;
    if (!STAGES.includes(targetStage)) return;
    setReferrals(prev => prev.map(r =>
      r.id === active.id && r.stage !== targetStage ? { ...r, stage: targetStage, daysInStage: 0 } : r
    ));
  };

  const handleAddReferral = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    const newRef: Referral = {
      id: Date.now().toString(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      source: form.source || 'Web Form',
      notes: form.notes.trim(),
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      daysInStage: 0,
      stage: 'New Referral',
    };
    setReferrals(prev => [newRef, ...prev]);
    setForm({ firstName: '', lastName: '', phone: '', email: '', source: 'Web Form', notes: '' });
    setModalOpen(false);
  };

  const outcomeReferrals = referrals.filter(r => r.outcome);
  const activeReferral = activeId ? referrals.find(r => r.id === activeId) : null;

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
          <span className="text-foreground font-medium">Referral Pipeline</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: `4px solid ${ACCENT}` }}>
              Referral Pipeline
            </h1>
            <p className="text-sm text-muted-foreground pl-3 mt-0.5" style={{ marginLeft: 4 }}>Referral intake to assignment.</p>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search referrals…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg shrink-0"
            style={{ background: 'transparent', color: ACCENT, border: `1px solid rgba(${hexToRgb(ACCENT)},0.5)` }}
          >
            <Plus className="w-4 h-4" /> Add Referral
          </button>
        </div>

        {/* Kanban Board */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const cards = stageReferrals(stage);
              return (
                <DroppableColumn key={stage} stage={stage} count={cards.length}>
                  {cards.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-6 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                      No referrals
                    </div>
                  )}
                  {cards.map(r => (
                    <DraggableCard key={r.id} referral={r} isMobile={isMobile} onMoveStage={moveStage} />
                  ))}
                </DroppableColumn>
              );
            })}
          </div>
          <DragOverlay>
            {activeReferral ? <OverlayCard referral={activeReferral} /> : null}
          </DragOverlay>
        </DndContext>

        {/* Outcome Buckets */}
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            OUTCOMES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['Declined', 'No Response', 'Intake Complete'] as Outcome[]).map(outcome => {
              const isComplete = outcome === 'Intake Complete';
              const items = outcomeReferrals.filter(r => r.outcome === outcome);
              return (
                <div key={outcome} className="p-4 rounded-xl" style={{ background: isComplete ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.1)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: isComplete ? '#059669' : 'hsl(var(--muted-foreground))' }}>
                      {outcome}
                    </h3>
                    {isComplete && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ border: '1px solid #059669', color: '#059669' }}>
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {items.length === 0 ? 'No referrals' : `${items.length} referral${items.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Add Referral Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Referral</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
              <Input placeholder="Last Name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <Input placeholder="Source" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} />
            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              onClick={handleAddReferral}
              className="text-sm font-semibold px-4 py-2.5 rounded-lg w-full mt-1"
              style={{ background: 'transparent', color: ACCENT, border: `1px solid rgba(${hexToRgb(ACCENT)},0.5)` }}
            >
              Save Referral
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavBar />
    </div>
  );
};

export default ReferralPipeline;
