import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DEMO_USERS } from '@/data/demoUsers';

const TEAL = '#2dd4bf';

const TYPE_COLORS: Record<string, string> = {
  'Client Session': '#2dd4bf',
  'Supervision Session': '#818cf8',
  'Staff Meeting': '#fb923c',
  'Intake': '#34d399',
  'Personal': '#e879f9',
  'Meeting': '#38bdf8',
  'Session': '#a3e635',
  'Other': '#94a3b8',
};

const STATUS_COLORS: Record<string, string> = {
  'Confirmed': '#4ade80',
  'Completed': '#94a3b8',
  'Cancelled': '#cbd5e1',
  'Rescheduled': '#fb923c',
  'No Show': '#e879f9',
};

const ALL_TYPES = Object.keys(TYPE_COLORS);
const ALL_STATUSES = Object.keys(STATUS_COLORS);

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

/** Appointment-like shape for live search */
export interface SearchableAppointment {
  appointment_id: string;
  title: string;
  appointment_type: string;
  start_time: string;
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
  appointments?: SearchableAppointment[];
  onSelectAppointment?: (appt: SearchableAppointment) => void;
}

/** Convert hex to r,g,b string */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

/* ─── Accent Chip (LOG-105) ─── */
const AccentChip: React.FC<{
  label: string;
  color: string;
  checked: boolean;
  onClick: () => void;
}> = ({ label, color, checked, onClick }) => {
  const rgb = hexToRgb(color);
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] text-[11px] font-medium border transition-colors"
      style={{
        padding: '5px 12px',
        ...(checked
          ? {
              borderColor: color,
              color: color,
              background: `rgba(${rgb},0.1)`,
            }
          : {
              borderColor: `rgba(${rgb},0.45)`,
              color: `rgba(${rgb},0.45)`,
              background: 'transparent',
            }),
      }}
    >
      {label}
    </button>
  );
};

/* ─── Live Search Results ─── */
const LiveSearchResults: React.FC<{
  keyword: string;
  appointments: SearchableAppointment[];
  onSelect: (appt: SearchableAppointment) => void;
}> = ({ keyword, appointments, onSelect }) => {
  const q = keyword.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return appointments
      .filter(a => a.title.toLowerCase().includes(q))
      .slice(0, 8);
  }, [q, appointments]);

  if (!q) return null;
  if (q.length >= 2 && results.length === 0) {
    return (
      <div className="mt-1.5 py-2 px-2 text-[11px] text-muted-foreground">
        No results found
      </div>
    );
  }
  if (results.length === 0) return null;

  return (
    <div className="mt-1.5 border border-border rounded-md bg-background overflow-hidden">
      {results.map(a => {
        const color = TYPE_COLORS[a.appointment_type] ?? '#64748b';
        const d = new Date(a.start_time);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return (
          <button
            key={a.appointment_id}
            onClick={() => onSelect(a)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-accent/10 transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            <span className="text-xs text-foreground truncate flex-1">{a.title}</span>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">{dateStr}</span>
          </button>
        );
      })}
    </div>
  );
};

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
  appointments?: SearchableAppointment[];
  onSelectAppointment?: (appt: SearchableAppointment) => void;
}> = ({ draft, setDraft, currentDate, onMonthYearChange, role, onSearch, onClear, compact, appointments = [], onSelectAppointment }) => {
  const isOwnerAdmin = role === 'OWNER' || role === 'ADMIN' || role === 'PARTNER';
  const staff = DEMO_USERS.filter(u => u.practice_id === 'demo-practice-1');
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '10px 12px',
  };

  const sectionLabel = "text-[10px] font-semibold uppercase tracking-[0.08em] mb-1 block" as const;
  const sectionLabelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.4)' };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Keyword */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Keyword</label>
        <input
          type="text"
          value={draft.keyword}
          onChange={e => setDraft(prev => ({ ...prev, keyword: e.target.value }))}
          placeholder="Search..."
          className="w-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
          style={fieldStyle}
        />
        {appointments.length > 0 && onSelectAppointment && (
          <LiveSearchResults
            keyword={draft.keyword}
            appointments={appointments}
            onSelect={onSelectAppointment}
          />
        )}
      </div>

      {/* Date Range */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Date Range</label>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={draft.dateFrom}
            onChange={e => setDraft(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="flex-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
            style={fieldStyle}
            title="From"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <input
            type="date"
            value={draft.dateTo}
            onChange={e => setDraft(prev => ({ ...prev, dateTo: e.target.value }))}
            className="flex-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
            style={fieldStyle}
            title="To"
          />
        </div>
      </div>

      {/* Month / Year */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Month / Year</label>
        <button
          onClick={() => setMonthPickerOpen(o => !o)}
          className="flex items-center gap-1 w-full text-xs font-medium hover:bg-accent/10 text-foreground"
          style={fieldStyle}
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
        <label className={sectionLabel} style={sectionLabelStyle}>Appointment Type</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map(t => {
            const checked = draft.selectedTypes.includes(t);
            return (
              <AccentChip
                key={t}
                label={t}
                color={TYPE_COLORS[t]}
                checked={checked}
                onClick={() => setDraft(prev => ({
                  ...prev,
                  selectedTypes: checked ? prev.selectedTypes.filter(s => s !== t) : [...prev.selectedTypes, t],
                }))}
              />
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Status</label>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(s => {
            const checked = draft.selectedStatuses.includes(s);
            return (
              <AccentChip
                key={s}
                label={s}
                color={STATUS_COLORS[s]}
                checked={checked}
                onClick={() => setDraft(prev => ({
                  ...prev,
                  selectedStatuses: checked ? prev.selectedStatuses.filter(x => x !== s) : [...prev.selectedStatuses, s],
                }))}
              />
            );
          })}
        </div>
      </div>

      {/* Assigned To */}
      {isOwnerAdmin && (
        <div>
          <label className={sectionLabel} style={sectionLabelStyle}>Assigned To</label>
          <select
            value={draft.assignedTo}
            onChange={e => setDraft(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="w-full text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
            style={fieldStyle}
          >
            <option value="all">All Staff</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.full_name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={onSearch}
          className="flex-1 text-xs font-medium transition-colors"
          style={{
            border: '1.5px solid #2dd4bf',
            color: '#2dd4bf',
            background: 'transparent',
            borderRadius: 8,
            padding: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Search
        </button>
        <button
          onClick={onClear}
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none' }}
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
  appointments = [], onSelectAppointment,
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarFilterState>({ ...filters });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const active = isFiltersActive(filters);
  const summary = active ? filterSummary(filters) : '';

  useEffect(() => {
    if (!open) setDraft({ ...filters });
  }, [filters, open]);

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

  const handleBarClick = () => {
    setOpen(o => !o);
  };

  const handleSelectAppointment = (appt: SearchableAppointment) => {
    setOpen(false);
    onSelectAppointment?.(appt);
  };

  const ChevronIcon = open ? ChevronUp : ChevronDown;

  // Desktop
  if (!isMobile) {
    return (
      <div ref={containerRef} className={`relative ${compact ? '' : 'mb-4'}`}>
        <div
          onClick={handleBarClick}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card transition-colors hover:border-[#2dd4bf]/40 cursor-pointer"
        >
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="flex-1 text-xs min-w-0 truncate" style={{ color: active && summary ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
            {active && summary ? summary : placeholder}
          </span>
          {active && (
            <button onClick={handleBarClear} className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground flex-shrink-0">
              <X size={12} />
              Clear
            </button>
          )}
          <ChevronIcon size={14} className="text-muted-foreground flex-shrink-0" />
        </div>

        {open && (
          <div className={`absolute z-50 top-full mt-1 ${compact ? 'w-full' : 'w-[380px]'} left-0 bg-card border border-border rounded-xl shadow-lg animate-fade-in`}>
            <FilterDropdownContent
              draft={draft}
              setDraft={setDraft}
              currentDate={currentDate}
              onMonthYearChange={onMonthYearChange}
              role={role}
              onSearch={handleSearch}
              onClear={handleClear}
              compact={compact}
              appointments={appointments}
              onSelectAppointment={handleSelectAppointment}
            />
          </div>
        )}
      </div>
    );
  }

  // Mobile
  return (
    <div className={compact ? '' : 'mb-4'}>
      <div
        onClick={handleBarClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card cursor-pointer"
      >
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        <span className="flex-1 text-xs min-w-0 truncate" style={{ color: active && summary ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
          {active && summary ? summary : placeholder}
        </span>
        {active && (
          <button onClick={handleBarClear} className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground flex-shrink-0">
            <X size={12} />
            Clear
          </button>
        )}
        <ChevronIcon size={14} className="text-muted-foreground flex-shrink-0" />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-xl p-0 overflow-y-auto">
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
            appointments={appointments}
            onSelectAppointment={handleSelectAppointment}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarFilters;
