import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

/** Appointment-like shape for live search */
export interface SearchableAppointment {
  appointment_id: string;
  title: string;
  appointment_type: string;
  start_time: string;
}

/* ─── Date Picker Popover ─── */
const DatePickerPopover: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const selected = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  useEffect(() => {
    if (open) {
      const d = value ? new Date(value + 'T00:00:00') : new Date();
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [open, value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const formatDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selected && day === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

  const handleSelect = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${dd}`);
    setOpen(false);
  };

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '10px 12px',
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center gap-2 text-xs text-left"
          style={fieldStyle}
        >
          <span className={`flex-1 ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          {value ? (
            <X
              size={12}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
              onClick={e => { e.stopPropagation(); onChange(''); }}
            />
          ) : (
            <ChevronDown size={12} className="text-muted-foreground flex-shrink-0" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-3 pointer-events-auto"
        style={{
          background: 'rgba(6,14,30,0.97)',
          border: '1px solid rgba(45,212,191,0.15)',
          borderRadius: 10,
        }}
      >
        {/* Header nav */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
              else setViewMonth(m => m - 1);
            }}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-semibold text-foreground">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
              else setViewMonth(m => m + 1);
            }}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-[10px] text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} className="w-8 h-8" />;
            const sel = isSelected(day);
            const tod = isToday(day);
            return (
              <button
                key={day}
                onClick={() => handleSelect(day)}
                className="w-8 h-8 flex items-center justify-center text-[11px] rounded-md transition-colors"
                style={
                  sel
                    ? { background: TEAL, color: '#0f172a', fontWeight: 600 }
                    : tod
                    ? { border: `1px solid rgba(45,212,191,0.4)`, color: TEAL }
                    : { color: 'hsl(var(--foreground))' }
                }
                onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
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
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-foreground truncate flex-1">{a.title}</span>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">{dateStr}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ─── Filter Panel Content (shared desktop + mobile) ─── */
const FilterPanelContent: React.FC<{
  draft: CalendarFilterState;
  setDraft: React.Dispatch<React.SetStateAction<CalendarFilterState>>;
  currentDate: Date;
  onMonthYearChange: (d: Date) => void;
  onSearch: () => void;
  onClear: () => void;
  appointments?: SearchableAppointment[];
  onSelectAppointment?: (appt: SearchableAppointment) => void;
}> = ({ draft, setDraft, currentDate, onMonthYearChange, onSearch, onClear, appointments = [], onSelectAppointment }) => {
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '10px 12px',
  };

  const sectionLabel = "text-[10px] font-semibold uppercase tracking-[0.08em] mb-1 block";
  const sectionLabelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.4)' };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Keyword Search */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Keyword</label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={draft.keyword}
            onChange={e => setDraft(prev => ({ ...prev, keyword: e.target.value }))}
            placeholder="Search appointments..."
            className="w-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50 pl-9"
            style={fieldStyle}
          />
        </div>
        {appointments.length > 0 && onSelectAppointment && (
          <LiveSearchResults
            keyword={draft.keyword}
            appointments={appointments}
            onSelect={onSelectAppointment}
          />
        )}
      </div>

      {/* 2. Month / Year */}
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

      {/* 3. Start Date */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Start Date</label>
        <DatePickerPopover
          value={draft.dateFrom}
          onChange={v => setDraft(prev => ({ ...prev, dateFrom: v }))}
          placeholder="Select start date"
        />
      </div>

      {/* 4. End Date */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>End Date</label>
        <DatePickerPopover
          value={draft.dateTo}
          onChange={v => setDraft(prev => ({ ...prev, dateTo: v }))}
          placeholder="Select end date"
        />
      </div>

      {/* 5. Appointment Type */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Appointment Type</label>
        <select
          value={draft.selectedTypes.length === 1 ? draft.selectedTypes[0] : 'all'}
          onChange={e => setDraft(prev => ({
            ...prev,
            selectedTypes: e.target.value === 'all' ? [] : [e.target.value],
          }))}
          className="w-full text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
          style={fieldStyle}
        >
          <option value="all">All Types</option>
          {ALL_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* 6. Status */}
      <div>
        <label className={sectionLabel} style={sectionLabelStyle}>Status</label>
        <select
          value={draft.selectedStatuses.length === 1 ? draft.selectedStatuses[0] : 'all'}
          onChange={e => setDraft(prev => ({
            ...prev,
            selectedStatuses: e.target.value === 'all' ? [] : [e.target.value],
          }))}
          className="w-full text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50"
          style={fieldStyle}
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 7+8. Search + Clear */}
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

/* ═══ Main Export — Permanently Visible Filter Panel (LOG-107) ═══ */

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

const CalendarFilters: React.FC<Props> = ({
  filters, onChange, onClear, currentDate, onMonthYearChange, role,
  placeholder, compact = false,
  appointments = [], onSelectAppointment,
}) => {
  const [draft, setDraft] = useState<CalendarFilterState>({ ...filters });

  useEffect(() => {
    setDraft({ ...filters });
  }, [filters]);

  const handleSearch = () => {
    onChange(draft);
  };

  const handleClear = () => {
    const cleared = { ...DEFAULT_FILTERS };
    setDraft(cleared);
    onClear();
  };

  const handleSelectAppointment = (appt: SearchableAppointment) => {
    onSelectAppointment?.(appt);
  };

  return (
    <div className={compact ? '' : 'mb-4'}>
      <FilterPanelContent
        draft={draft}
        setDraft={setDraft}
        currentDate={currentDate}
        onMonthYearChange={onMonthYearChange}
        onSearch={handleSearch}
        onClear={handleClear}
        appointments={appointments}
        onSelectAppointment={handleSelectAppointment}
      />
    </div>
  );
};

export default CalendarFilters;
