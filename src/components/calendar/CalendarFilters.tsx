import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


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
/* ─── Custom Date Picker Field ─── */
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayYMD(): string {
  return toYMD(new Date());
}

const DatePickerField: React.FC<{
  value: string;
  onChange: (val: string) => void;
  label: string;
  fieldStyle: React.CSSProperties;
  sectionLabel: string;
  sectionLabelStyle: React.CSSProperties;
}> = ({ value, onChange, label, fieldStyle, sectionLabel, sectionLabelStyle }) => {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(value + 'T00:00:00') : null;
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : new Date().getMonth());
  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : new Date().getFullYear());

  useEffect(() => {
    if (open && parsed) {
      setViewMonth(parsed.getMonth());
      setViewYear(parsed.getFullYear());
    }
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const today = todayYMD();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = (day: number) => {
    onChange(toYMD(new Date(viewYear, viewMonth, day)));
    setOpen(false);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const calendarPopoverStyle: React.CSSProperties = {
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    padding: 12,
    width: 260,
  };

  return (
    <div>
      <label className={sectionLabel} style={sectionLabelStyle}>{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 w-full text-xs text-foreground min-h-[44px]"
            style={fieldStyle}
          >
            <span className={`flex-1 text-left ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
              {value ? formatDisplayDate(value) : 'Select date'}
            </span>
            {value && (
              <span onClick={clearDate} className="flex-shrink-0 text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={12} />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-border bg-popover rounded-xl" align="start" sideOffset={4}>
          <div style={calendarPopoverStyle}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <button onClick={prevMonth} className="p-1 rounded transition-colors text-muted-foreground hover:text-primary">
                <ChevronLeft size={14} />
              </button>
              <span className="text-foreground text-[13px]">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} className="p-1 rounded transition-colors text-muted-foreground hover:text-primary">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map(d => (
                <span key={d} className="text-center text-[10px] uppercase text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDow }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const ymd = toYMD(new Date(viewYear, viewMonth, day));
                const isSelected = ymd === value;
                const isToday = ymd === today && !isSelected;
                return (
                  <button
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`flex items-center justify-center transition-colors w-8 h-8 text-[13px] rounded-md ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : isToday
                          ? 'border border-primary/40 text-foreground/70'
                          : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
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

/* ─── Filter Dropdown Content (no keyword — it lives in the top bar) ─── */
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
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  const fieldStyle: React.CSSProperties = {
    background: 'hsl(var(--muted) / 0.5)',
    border: '1px solid hsl(var(--border))',
    borderRadius: 8,
    padding: '10px 12px',
  };

  const sectionLabel = "text-[10px] font-semibold uppercase tracking-[0.08em] mb-1 block" as const;
  const sectionLabelStyle: React.CSSProperties = { color: 'hsl(var(--muted-foreground))' };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
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

      {/* Start Date */}
      <DatePickerField
        value={draft.dateFrom}
        onChange={val => setDraft(prev => ({ ...prev, dateFrom: val }))}
        label="Start Date"
        fieldStyle={fieldStyle}
        sectionLabel={sectionLabel}
        sectionLabelStyle={sectionLabelStyle}
      />

      {/* End Date */}
      <DatePickerField
        value={draft.dateTo}
        onChange={val => setDraft(prev => ({ ...prev, dateTo: val }))}
        label="End Date"
        fieldStyle={fieldStyle}
        sectionLabel={sectionLabel}
        sectionLabelStyle={sectionLabelStyle}
      />

      {/* Appointment Type */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Appointment Type</label>
        <select
          value={draft.selectedTypes.length === 1 ? draft.selectedTypes[0] : 'all'}
          onChange={e => setDraft(prev => ({
            ...prev,
            selectedTypes: e.target.value === 'all' ? [] : [e.target.value],
          }))}
          className="w-full text-xs text-foreground bg-card focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
          style={fieldStyle}
        >
          <option value="all" className="bg-card text-foreground">All Types</option>
          {ALL_TYPES.map(t => (
            <option key={t} value={t} className="bg-card text-foreground">{t}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Status</label>
        <select
          value={draft.selectedStatuses.length === 1 ? draft.selectedStatuses[0] : 'all'}
          onChange={e => setDraft(prev => ({
            ...prev,
            selectedStatuses: e.target.value === 'all' ? [] : [e.target.value],
          }))}
          className="w-full text-xs text-foreground bg-card focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
          style={fieldStyle}
        >
          <option value="all" className="bg-card text-foreground">All Statuses</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s} className="bg-card text-foreground">{s}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={onSearch}
          className="flex-1 text-xs font-medium transition-colors min-h-[44px]"
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
          className="text-xs font-medium hover:opacity-80 transition-opacity text-muted-foreground min-h-[44px]"
          style={{ background: 'transparent', border: 'none' }}
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
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        // Don't close if clicking inside a popover portal (date pickers, etc.)
        const popoverEl = (target as Element)?.closest?.('[data-radix-popper-content-wrapper]');
        if (popoverEl) return;
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

  const handleSelectAppointment = (appt: SearchableAppointment) => {
    onSelectAppointment?.(appt);
  };

  // Live keyword change — update draft and propagate immediately
  const handleKeywordChange = (value: string) => {
    const next = { ...filters, keyword: value };
    setDraft(prev => ({ ...prev, keyword: value }));
    onChange(next);
  };

  const handleKeywordClear = () => {
    handleKeywordChange('');
  };

  const filtersActive = isFiltersActive({ ...filters, keyword: '' }); // active ignoring keyword

  // Desktop
  if (!isMobile) {
    return (
      <div ref={containerRef} className={`relative ${compact ? '' : 'mb-4'}`}>
        {/* CHANGE 1 — Live keyword input */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card transition-colors focus-within:border-[#2dd4bf]/40">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={filters.keyword}
            onChange={e => handleKeywordChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-xs min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {filters.keyword && (
            <button onClick={handleKeywordClear} className="text-muted-foreground hover:text-foreground flex-shrink-0">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Live search results */}
        {appointments.length > 0 && onSelectAppointment && (
          <LiveSearchResults
            keyword={filters.keyword}
            appointments={appointments}
            onSelect={handleSelectAppointment}
          />
        )}

        {/* CHANGE 2 — Filters toggle button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 mt-2 transition-colors border border-border text-muted-foreground"
          style={{
            background: 'transparent',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Filters
          {filtersActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] flex-shrink-0" />}
          <ChevronDown
            size={10}
            className="transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* CHANGE 3 — Filter panel */}
        {open && (
          <div
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            className={`absolute z-50 top-full mt-1 ${compact ? 'w-full' : 'w-[380px]'} left-0 bg-card border border-border rounded-xl shadow-lg animate-fade-in`}
            style={{ top: 'auto', position: 'relative' }}
          >
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

  // Mobile — use inline expand when compact (inside panel), Sheet otherwise
  if (compact) {
    return (
      <div>
        {/* Live keyword input */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card focus-within:border-[#2dd4bf]/40 min-h-[44px]">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={filters.keyword}
            onChange={e => handleKeywordChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-xs min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {filters.keyword && (
            <button onClick={handleKeywordClear} className="text-muted-foreground hover:text-foreground flex-shrink-0 min-h-[44px] flex items-center">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Live search results */}
        {appointments.length > 0 && onSelectAppointment && (
          <LiveSearchResults
            keyword={filters.keyword}
            appointments={appointments}
            onSelect={handleSelectAppointment}
          />
        )}

        {/* Filters toggle — inline expand */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 mt-2 transition-colors border border-border text-muted-foreground min-h-[44px]"
          style={{
            background: 'transparent',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Filters
          {filtersActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] flex-shrink-0" />}
          <ChevronDown
            size={10}
            className="transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {open && (
          <div
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            className="mt-1 bg-card border border-border rounded-xl animate-fade-in"
          >
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
          </div>
        )}
      </div>
    );
  }

  // Mobile full page (not inside panel)
  return (
    <div className="mb-4">
      {/* Live keyword input */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card focus-within:border-[#2dd4bf]/40 min-h-[44px]">
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={filters.keyword}
          onChange={e => handleKeywordChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-xs min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {filters.keyword && (
          <button onClick={handleKeywordClear} className="text-muted-foreground hover:text-foreground flex-shrink-0 min-h-[44px] flex items-center">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Live search results */}
      {appointments.length > 0 && onSelectAppointment && (
        <LiveSearchResults
          keyword={filters.keyword}
          appointments={appointments}
          onSelect={handleSelectAppointment}
        />
      )}

      {/* Filters toggle */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 mt-2 transition-colors border border-border text-muted-foreground min-h-[44px]"
        style={{
          background: 'transparent',
          borderRadius: 6,
          padding: '4px 12px',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Filters
        {filtersActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] flex-shrink-0" />}
        <ChevronDown size={10} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-xl p-0 overflow-y-auto bg-card">
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
