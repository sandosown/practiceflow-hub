import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DEMO_USERS } from '@/data/demoUsers';

const TEAL = '#2dd4bf';

const ALL_TYPES = [
  'Client Session', 'Supervision Session', 'Staff Meeting', 'Intake',
  'Personal', 'Meeting', 'Session', 'Other',
];

const ALL_STATUSES = ['Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface CalendarFilterState {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  selectedTypes: string[];
  selectedStatuses: string[];
  assignedTo: string;
}

export const DEFAULT_FILTERS: CalendarFilterState = {
  keyword: '',
  dateFrom: '',
  dateTo: '',
  selectedTypes: [],
  selectedStatuses: [],
  assignedTo: 'all',
};

export function isFiltersActive(f: CalendarFilterState): boolean {
  return (
    f.keyword.trim() !== '' ||
    f.dateFrom !== '' ||
    f.dateTo !== '' ||
    f.selectedTypes.length > 0 ||
    f.selectedStatuses.length > 0 ||
    f.assignedTo !== 'all'
  );
}

/** Build a short summary string of active filters */
function filterSummary(f: CalendarFilterState): string {
  const parts: string[] = [];
  if (f.keyword.trim()) parts.push(`"${f.keyword.trim()}"`);
  if (f.dateFrom && f.dateTo) parts.push(`${f.dateFrom} – ${f.dateTo}`);
  else if (f.dateFrom) parts.push(`From ${f.dateFrom}`);
  else if (f.dateTo) parts.push(`To ${f.dateTo}`);
  if (f.selectedTypes.length === 1) parts.push(f.selectedTypes[0]);
  else if (f.selectedTypes.length > 1) parts.push(`${f.selectedTypes.length} types`);
  if (f.selectedStatuses.length === 1) parts.push(f.selectedStatuses[0]);
  else if (f.selectedStatuses.length > 1) parts.push(`${f.selectedStatuses.length} statuses`);
  if (f.assignedTo !== 'all') {
    const name = DEMO_USERS.find(u => u.id === f.assignedTo)?.full_name;
    if (name) parts.push(name);
  }
  return parts.join(' · ');
}

interface Props {
  filters: CalendarFilterState;
  onChange: (f: CalendarFilterState) => void;
  onClear: () => void;
  currentDate: Date;
  onMonthYearChange: (date: Date) => void;
  role: string;
  placeholder?: string;
  compact?: boolean;
}

/* ─── Filter Dropdown Content ─── */
const FilterDropdownContent: React.FC<{
  draft: CalendarFilterState;
  setDraft: React.Dispatch<React.SetStateAction<CalendarFilterState>>;
  currentDate: Date;
  onMonthYearChange: (d: Date) => void;
  role: string;
  onSearch: () => void;
  onClear: () => void;
  compact?: boolean;
}> = ({ draft, setDraft, currentDate, onMonthYearChange, role, onSearch, onClear, compact }) => {
  const isOwnerAdmin = role === 'OWNER' || role === 'ADMIN' || role === 'PARTNER';
  const staff = DEMO_USERS.filter(u => u.practice_id === 'demo-practice-1');
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  return (
    <div className={`space-y-3 ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Date Range */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Date Range</label>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={draft.dateFrom}
            onChange={e => setDraft(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="flex-1 px-2 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
            title="From"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <input
            type="date"
            value={draft.dateTo}
            onChange={e => setDraft(prev => ({ ...prev, dateTo: e.target.value }))}
            className="flex-1 px-2 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
            title="To"
          />
        </div>
      </div>

      {/* Month / Year */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Month / Year</label>
        <button
          onClick={() => setMonthPickerOpen(o => !o)}
          className="flex items-center gap-1 w-full px-2.5 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent/10 text-foreground"
        >
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          <ChevronDown size={12} className="ml-auto" />
        </button>
        {monthPickerOpen && (
          <div className="mt-1.5 p-2 rounded-md border border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPickerYear(y => y - 1)} className="text-xs text-muted-foreground hover:text-foreground px-1">←</button>
              <span className="text-xs font-semibold text-foreground">{pickerYear}</span>
              <button onClick={() => setPickerYear(y => y + 1)} className="text-xs text-muted-foreground hover:text-foreground px-1">→</button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((m, i) => {
                const isActive = i === currentDate.getMonth() && pickerYear === currentDate.getFullYear();
                return (
                  <button
                    key={m}
                    onClick={() => {
                      onMonthYearChange(new Date(pickerYear, i, 1));
                      setMonthPickerOpen(false);
                    }}
                    className="text-[11px] py-1 rounded-md transition-colors hover:bg-accent/10"
                    style={isActive ? { background: TEAL, color: '#0f172a', fontWeight: 600 } : { color: 'hsl(var(--foreground))' }}
                  >
                    {m.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Appointment Type */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Appointment Type</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map(t => {
            const checked = draft.selectedTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => setDraft(prev => ({
                  ...prev,
                  selectedTypes: checked ? prev.selectedTypes.filter(s => s !== t) : [...prev.selectedTypes, t],
                }))}
                className="px-2 py-1 rounded-full text-[11px] font-medium border transition-colors"
                style={checked
                  ? { borderColor: TEAL, color: TEAL, background: 'rgba(45,212,191,0.08)' }
                  : { borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_STATUSES.map(s => {
            const checked = draft.selectedStatuses.includes(s);
            return (
              <button
                key={s}
                onClick={() => setDraft(prev => ({
                  ...prev,
                  selectedStatuses: checked ? prev.selectedStatuses.filter(x => x !== s) : [...prev.selectedStatuses, s],
                }))}
                className="px-2 py-1 rounded-full text-[11px] font-medium border transition-colors"
                style={checked
                  ? { borderColor: TEAL, color: TEAL, background: 'rgba(45,212,191,0.08)' }
                  : { borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Assigned To */}
      {isOwnerAdmin && (
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Assigned To</label>
          <select
            value={draft.assignedTo}
            onChange={e => setDraft(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="w-full px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
          >
            <option value="all">All Staff</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.full_name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSearch}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
          style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
        >
          Search
        </button>
        <button
          onClick={onClear}
          className="text-xs font-medium hover:opacity-80 transition-opacity text-muted-foreground"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

/* ═══ Main Export — Search Box with Filter Dropdown ═══ */
const CalendarFilters: React.FC<Props> = ({
  filters, onChange, onClear, currentDate, onMonthYearChange, role,
  placeholder = 'Search calendar...', compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarFilterState>({ ...filters });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const active = isFiltersActive(filters);
  const summary = active ? filterSummary(filters) : '';

  // Sync draft when filters change externally
  useEffect(() => {
    if (!open) setDraft({ ...filters });
  }, [filters, open]);

  // Close dropdown on outside click (desktop only)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, isMobile]);

  const handleSearch = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { ...DEFAULT_FILTERS };
    setDraft(cleared);
    onClear();
    setOpen(false);
  };

  const handleBarClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClear();
  };

  // Desktop: inline dropdown
  if (!isMobile) {
    return (
      <div ref={containerRef} className={`relative ${compact ? '' : 'mb-4'}`}>
        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card cursor-text transition-colors hover:border-[#2dd4bf]/40"
          onClick={() => setOpen(true)}
        >
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          {active ? (
            <span className="text-xs text-foreground truncate flex-1">{summary}</span>
          ) : (
            <span className="text-xs text-muted-foreground flex-1">{placeholder}</span>
          )}
          {active && (
            <button onClick={handleBarClear} className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground flex-shrink-0">
              <X size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Dropdown panel */}
        {open && (
          <div className={`absolute z-50 top-full mt-1 ${compact ? 'w-full' : 'w-[380px]'} left-0 bg-card border border-border rounded-xl shadow-lg p-4 animate-fade-in`}>
            <FilterDropdownContent
              draft={draft}
              setDraft={setDraft}
              currentDate={currentDate}
              onMonthYearChange={onMonthYearChange}
              role={role}
              onSearch={handleSearch}
              onClear={handleClear}
              compact={compact}
            />
          </div>
        )}
      </div>
    );
  }

  // Mobile: search bar → bottom sheet
  return (
    <div className={compact ? '' : 'mb-4'}>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        {active ? (
          <span className="text-xs text-foreground truncate flex-1">{summary}</span>
        ) : (
          <span className="text-xs text-muted-foreground flex-1">{placeholder}</span>
        )}
        {active && (
          <button onClick={handleBarClear} className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground flex-shrink-0">
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-xl p-4 overflow-y-auto">
          <SheetHeader className="mb-3">
            <SheetTitle className="text-sm font-semibold text-foreground">Filters</SheetTitle>
          </SheetHeader>
          <FilterDropdownContent
            draft={draft}
            setDraft={setDraft}
            currentDate={currentDate}
            onMonthYearChange={onMonthYearChange}
            role={role}
            onSearch={handleSearch}
            onClear={handleClear}
            compact
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarFilters;
