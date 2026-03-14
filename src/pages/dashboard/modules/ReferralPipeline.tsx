import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Search, Plus, Pencil, CheckSquare, ArrowRight, ArrowLeft as ArrowLeftIcon, X, GripVertical, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cardStyle } from '@/lib/cardStyle';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSession } from '@/context/SessionContext';
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

const DEFAULT_STAGES = [
  'New Referral',
  'Contact Made',
  'Pre-Screening Complete',
  'Insurance Verified',
  'Assigned',
];

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
  stage: string;
  outcome?: Outcome;
}

interface MovementLog {
  referralId: string;
  from: string;
  to: string;
  user: string;
  timestamp: string;
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

/* ── Outcome Bucket Popover ── */
const OutcomePopover: React.FC<{
  children: React.ReactNode;
  onSelect: (outcome: Outcome) => void;
}> = ({ children, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="end" sideOffset={4}>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 font-semibold">Move to outcome</p>
        {(['Declined', 'No Response', 'Intake Complete'] as Outcome[]).map(o => (
          <button
            key={o}
            onClick={() => { onSelect(o); setOpen(false); }}
            className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors"
            style={{ color: o === 'Intake Complete' ? '#059669' : 'hsl(var(--muted-foreground))' }}
          >
            {o}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

/* ── Draggable Card ── */
const DraggableCard: React.FC<{
  referral: Referral;
  isMobile: boolean;
  stages: string[];
  onMoveStage: (id: string, dir: 1 | -1) => void;
  onMoveToOutcome: (id: string, outcome: Outcome) => void;
}> = ({ referral: r, isMobile, stages, onMoveStage, onMoveToOutcome }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: r.id });
  const stageIdx = stages.indexOf(r.stage);
  const isFirst = stageIdx === 0;
  const isLast = stageIdx === stages.length - 1;

  const style: React.CSSProperties = {
    ...cardStyle(ACCENT),
    borderRadius: 10,
    opacity: isDragging ? 0 : 1,
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
        <div className="flex items-center gap-0.5 ml-auto">
          {/* Back arrow */}
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            title="Move to previous stage"
            disabled={isFirst}
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onMoveStage(r.id, -1)}
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" style={{ color: isFirst ? 'hsl(var(--muted-foreground) / 0.35)' : ACCENT }} />
          </button>
          {/* Forward arrow — last stage triggers outcome popover */}
          {isLast ? (
            <OutcomePopover onSelect={(o) => onMoveToOutcome(r.id, o)}>
              <button
                className="p-1 rounded hover:bg-muted transition-colors"
                title="Move to outcome"
                onPointerDown={e => e.stopPropagation()}
              >
                <ArrowRight className="w-3.5 h-3.5" style={{ color: ACCENT }} />
              </button>
            </OutcomePopover>
          ) : (
            <button
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Move to next stage"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => onMoveStage(r.id, 1)}
            >
              <ArrowRight className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Droppable Column with collapse ── */
const MAX_VISIBLE = 2;

const DroppableColumn: React.FC<{
  stage: string;
  cards: Referral[];
  isMobile: boolean;
  stages: string[];
  isOwner: boolean;
  isCustom: boolean;
  onMoveStage: (id: string, dir: 1 | -1) => void;
  onMoveToOutcome: (id: string, outcome: Outcome) => void;
  onDeleteStage?: () => void;
  onRenameStage?: (newName: string) => void;
}> = ({ stage, cards, isMobile, stages, isOwner, isCustom, onMoveStage, onMoveToOutcome, onDeleteStage, onRenameStage }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(stage);

  const visibleCards = expanded ? cards : cards.slice(0, MAX_VISIBLE);
  const hiddenCount = cards.length - MAX_VISIBLE;

  const confirmRename = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== stage && onRenameStage) {
      onRenameStage(trimmed);
    }
    setEditing(false);
  };

  const cancelRename = () => {
    setEditName(stage);
    setEditing(false);
  };

  return (
    <div ref={setNodeRef} className="flex-shrink-0 flex flex-col" style={{ minWidth: 240, width: 240 }}>
      <div className="flex items-center justify-between mb-3 px-1">
        {editing ? (
          <div className="flex items-center gap-1 flex-1 mr-1">
            <Input
              value={editName}
              maxLength={30}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') cancelRename(); }}
              autoFocus
              className="h-6 text-xs font-semibold uppercase tracking-wider px-1 py-0"
            />
            <button onClick={confirmRename} className="p-0.5 rounded hover:bg-muted transition-colors" title="Confirm">
              <Check className="w-3 h-3" style={{ color: ACCENT }} />
            </button>
            <button onClick={cancelRename} className="p-0.5 rounded hover:bg-muted transition-colors" title="Cancel">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <h3
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate"
              onDoubleClick={() => { if (isOwner) { setEditName(stage); setEditing(true); } }}
            >
              {stage}
            </h3>
            {isOwner && (
              <button
                onClick={() => { setEditName(stage); setEditing(true); }}
                className="p-0.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                style={{ opacity: 0.5 }}
                title="Rename stage"
              >
                <Pencil className="w-2.5 h-2.5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `rgba(${hexToRgb(ACCENT)},0.12)`, color: ACCENT }}>
            {cards.length}
          </span>
          {isOwner && isCustom && (
            <button
              onClick={onDeleteStage}
              className="p-0.5 rounded hover:bg-muted transition-colors"
              title="Delete custom stage"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      <div
        className="flex flex-col gap-3 overflow-y-auto pr-1"
        style={{
          minHeight: 120,
          maxHeight: '70vh',
          transition: 'background 150ms',
          background: isOver ? `rgba(${hexToRgb(ACCENT)},0.06)` : undefined,
          borderRadius: 8,
          padding: 4,
        }}
      >
        {cards.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-6 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
            No referrals
          </div>
        )}
        {visibleCards.map(r => (
          <DraggableCard key={r.id} referral={r} isMobile={isMobile} stages={stages} onMoveStage={onMoveStage} onMoveToOutcome={onMoveToOutcome} />
        ))}
        {hiddenCount > 0 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs font-semibold py-2 rounded-lg transition-colors hover:bg-muted"
            style={{ color: ACCENT }}
          >
            +{hiddenCount} more
          </button>
        )}
        {expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(false)}
            className="text-xs font-semibold py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Droppable Outcome Bucket ── */
const DroppableOutcomeBucket: React.FC<{ outcome: Outcome; items: Referral[] }> = ({ outcome, items }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `outcome:${outcome}` });
  const isComplete = outcome === 'Intake Complete';

  return (
    <div
      ref={setNodeRef}
      className="p-4 rounded-xl transition-all"
      style={{
        background: isComplete ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.1)',
        outline: isOver ? `2px solid ${isComplete ? '#059669' : 'hsl(var(--muted-foreground))'}` : 'none',
        outlineOffset: -2,
      }}
    >
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
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No referrals</p>
      ) : (
        <div className="space-y-2">
          {items.map(r => (
            <div key={r.id} className="text-sm text-foreground">
              {r.firstName} {r.lastName}
              <span className="text-xs text-muted-foreground ml-2">{r.dateSubmitted}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Add Stage Button ── */
const AddStageButton: React.FC<{ onAdd: (name: string) => void }> = ({ onAdd }) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const confirm = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      setName('');
      setAdding(false);
    }
  };

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-muted transition-colors self-start"
        style={{ width: 32, height: 32, border: `1px dashed rgba(${hexToRgb(ACCENT)},0.4)` }}
        title="Add custom stage"
      >
        <Plus className="w-4 h-4" style={{ color: ACCENT }} />
      </button>
    );
  }

  return (
    <div className="flex-shrink-0 flex flex-col gap-2 self-start p-3 rounded-xl" style={{ width: 200, background: 'hsl(var(--card))', border: `1px solid rgba(${hexToRgb(ACCENT)},0.3)` }}>
      <Input
        placeholder="Stage name"
        maxLength={30}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') { setAdding(false); setName(''); } }}
        autoFocus
        className="text-sm h-8"
      />
      <div className="flex gap-2">
        <button
          onClick={confirm}
          disabled={!name.trim()}
          className="text-xs font-semibold px-3 py-1 rounded-md"
          style={{ color: ACCENT, border: `1px solid rgba(${hexToRgb(ACCENT)},0.5)`, opacity: name.trim() ? 1 : 0.5 }}
        >
          Add
        </button>
        <button
          onClick={() => { setAdding(false); setName(''); }}
          className="text-xs text-muted-foreground px-3 py-1 rounded-md hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ── Overlay Card (shown while dragging) ── */
const OverlayCard: React.FC<{ referral: Referral }> = ({ referral: r }) => (
  <div className="p-3 space-y-2" style={{ ...cardStyle(ACCENT), borderRadius: 10, width: 232, background: 'hsl(var(--card))', opacity: 0.8 }}>
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
  const { session } = useSession();
  const isOwner = session?.role === 'OWNER';

  const [search, setSearch] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [customStages, setCustomStages] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', source: '', notes: '' });
  const [movementLog, setMovementLog] = useState<MovementLog[]>([]);

  // All stages = defaults + custom appended
  const stages = [...DEFAULT_STAGES.slice(0, -1), ...customStages, DEFAULT_STAGES[DEFAULT_STAGES.length - 1]];
  // Custom stages inserted before "Assigned" (the last default)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const q = search.toLowerCase();
  const filtered = referrals.filter(
    r => !r.outcome && (`${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || r.source.toLowerCase().includes(q))
  );

  const stageReferrals = (stage: string) => filtered.filter(r => r.stage === stage);

  const logMovement = useCallback((referralId: string, from: string, to: string) => {
    setMovementLog(prev => [...prev, {
      referralId,
      from,
      to,
      user: session?.full_name ?? 'Unknown',
      timestamp: new Date().toISOString(),
    }]);
  }, [session?.full_name]);

  const moveStage = useCallback((id: string, direction: 1 | -1) => {
    setReferrals(prev => prev.map(r => {
      if (r.id !== id || r.outcome) return r;
      const idx = stages.indexOf(r.stage);
      const next = idx + direction;
      if (next < 0 || next >= stages.length) return r;
      logMovement(r.id, r.stage, stages[next]);
      return { ...r, stage: stages[next], daysInStage: 0 };
    }));
  }, [stages, logMovement]);

  const moveToOutcome = useCallback((id: string, outcome: Outcome) => {
    setReferrals(prev => prev.map(r => {
      if (r.id !== id) return r;
      logMovement(r.id, r.stage, outcome);
      return { ...r, outcome };
    }));
  }, [logMovement]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const targetId = over.id as string;

    // Check if dropped on outcome bucket
    if (targetId.startsWith('outcome:')) {
      const outcome = targetId.replace('outcome:', '') as Outcome;
      moveToOutcome(active.id as string, outcome);
      return;
    }

    // Dropped on a stage column
    if (stages.includes(targetId)) {
      const ref = referrals.find(r => r.id === active.id);
      if (ref && ref.stage !== targetId) {
        logMovement(ref.id, ref.stage, targetId);
        setReferrals(prev => prev.map(r =>
          r.id === active.id ? { ...r, stage: targetId, daysInStage: 0 } : r
        ));
      }
    }
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
    setForm({ firstName: '', lastName: '', phone: '', email: '', source: '', notes: '' });
    setModalOpen(false);
  };

  const addCustomStage = useCallback((name: string) => {
    if (customStages.includes(name)) return;
    setCustomStages(prev => [...prev, name]);
  }, [customStages]);

  const deleteCustomStage = useCallback((name: string) => {
    // Move any cards in this stage to the previous stage
    const idx = stages.indexOf(name);
    const fallback = idx > 0 ? stages[idx - 1] : stages[0];
    setReferrals(prev => prev.map(r =>
      r.stage === name ? { ...r, stage: fallback, daysInStage: 0 } : r
    ));
    setCustomStages(prev => prev.filter(s => s !== name));
  }, [stages]);

  const outcomeReferrals = referrals.filter(r => r.outcome);
  const activeReferral = activeId ? referrals.find(r => r.id === activeId) : null;

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">

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
          <div className="flex gap-4 overflow-x-auto pb-4 items-start">
            {stages.map((stage, idx) => (
              <React.Fragment key={stage}>
                {/* Add stage button before each column (Owner only) */}
                {isOwner && idx > 0 && (
                  <div className="flex-shrink-0 self-start mt-8">
                    <AddStageButton onAdd={(name) => {
                      // Insert at this position
                      const defaultIdx = DEFAULT_STAGES.indexOf(stage);
                      if (defaultIdx >= 0) {
                        // Insert before this default stage — add to custom stages
                        setCustomStages(prev => [...prev, name]);
                      } else {
                        setCustomStages(prev => {
                          const ci = prev.indexOf(stage);
                          const next = [...prev];
                          next.splice(ci, 0, name);
                          return next;
                        });
                      }
                    }} />
                  </div>
                )}
                <DroppableColumn
                  stage={stage}
                  cards={stageReferrals(stage)}
                  isMobile={isMobile}
                  stages={stages}
                  isOwner={isOwner}
                  isCustom={!DEFAULT_STAGES.includes(stage)}
                  onMoveStage={moveStage}
                  onMoveToOutcome={moveToOutcome}
                  onDeleteStage={() => deleteCustomStage(stage)}
                />
              </React.Fragment>
            ))}
            {/* Add stage button at end (Owner only) */}
            {isOwner && (
              <div className="flex-shrink-0 self-start mt-8">
                <AddStageButton onAdd={addCustomStage} />
              </div>
            )}
          </div>
          <DragOverlay>
            {activeReferral ? <OverlayCard referral={activeReferral} /> : null}
          </DragOverlay>

          {/* Outcome Buckets — now droppable */}
          <section className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
              OUTCOMES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['Declined', 'No Response', 'Intake Complete'] as Outcome[]).map(outcome => (
                <DroppableOutcomeBucket
                  key={outcome}
                  outcome={outcome}
                  items={outcomeReferrals.filter(r => r.outcome === outcome)}
                />
              ))}
            </div>
          </section>
        </DndContext>
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Source</label>
              <select
                value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>Select source…</option>
                <option value="Web Form">Web Form</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral from provider">Referral from provider</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
