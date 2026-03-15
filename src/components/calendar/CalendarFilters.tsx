import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  assignedTo: string; // 'all' or user id
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

interface Props {
  filters: CalendarFilterState;
  onChange: (f: CalendarFilterState) => void;
  onClear: () => void;
  /** Current month/year shown on calendar — for the month/year picker */
  currentDate: Date;
  onMonthYearChange: (date: Date) => void;
  role: string;
  /** vertical = panel layout, horizontal = calendar bar */
  layout?: 'horizontal' | 'vertical';
}

/* ─── Multiselect Dropdown ─── */
const MultiSelectDropdown: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
  const display = selected.length === 0 ? label : `${label} (${selected.length})`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors hover:bg-accent/10"
          style={{
            borderColor: selected.length > 0 ? TEAL : 'hsl(var(--border))',
            color: selected.length > 0 ? TEAL : 'hsl(var(--foreground))',
          }}
        >
          {display}
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-accent/10 cursor-pointer text-xs text-foreground">
              <Checkbox
                checked={selected.includes(opt)}
                onCheckedChange={(checked) => {
                  if (checked) onChange([...selected, opt]);
                  else onChange(selected.filter(s => s !== opt));
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Month/Year Picker ─── */
const MonthYearPicker: React.FC<{
  currentDate: Date;
  onSelect: (d: Date) => void;
}> = ({ currentDate, onSelect }) => {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const [pickerYear, setPickerYear] = useState(year);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border text-xs font-medium transition-colors hover:bg-accent/10 text-foreground"
        >
          {MONTHS[month]} {year}
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setPickerYear(y => y - 1)} className="text-xs text-muted-foreground hover:text-foreground">←</button>
          <span className="text-sm font-semibold text-foreground">{pickerYear}</span>
          <button onClick={() => setPickerYear(y => y + 1)} className="text-xs text-muted-foreground hover:text-foreground">→</button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map((m, i) => {
            const isActive = i === month && pickerYear === year;
            return (
              <button
                key={m}
                onClick={() => onSelect(new Date(pickerYear, i, 1))}
                className="text-xs py-1.5 rounded-md transition-colors hover:bg-accent/10"
                style={isActive ? { background: TEAL, color: '#0f172a', fontWeight: 600 } : { color: 'hsl(var(--foreground))' }}
              >
                {m.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Assigned To dropdown ─── */
const AssignedToDropdown: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const staff = DEMO_USERS.filter(u => u.practice_id === 'demo-practice-1');
  const display = value === 'all' ? 'All Staff' : (staff.find(s => s.id === value)?.full_name ?? 'All Staff');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors hover:bg-accent/10"
          style={{
            borderColor: value !== 'all' ? TEAL : 'hsl(var(--border))',
            color: value !== 'all' ? TEAL : 'hsl(var(--foreground))',
          }}
        >
          {display}
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <div className="space-y-1">
          <label className="flex items-center gap-2 py-1 px-1 rounded hover:bg-accent/10 cursor-pointer text-xs text-foreground">
            <input
              type="radio"
              name="assigned-to"
              checked={value === 'all'}
              onChange={() => onChange('all')}
              className="accent-[#2dd4bf]"
            />
            All Staff
          </label>
          {staff.map(s => (
            <label key={s.id} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-accent/10 cursor-pointer text-xs text-foreground">
              <input
                type="radio"
                name="assigned-to"
                checked={value === s.id}
                onChange={() => onChange(s.id)}
                className="accent-[#2dd4bf]"
              />
              {s.full_name}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ─── Filter Controls (shared between layouts) ─── */
const FilterControls: React.FC<Props & { stacked?: boolean }> = ({
  filters, onChange, onClear, currentDate, onMonthYearChange, role, stacked,
}) => {
  const isOwnerAdmin = role === 'OWNER' || role === 'ADMIN' || role === 'PARTNER';
  const active = isFiltersActive(filters);
  const gapClass = stacked ? 'flex flex-col gap-2' : 'flex flex-wrap items-center gap-2';

  return (
    <div className={gapClass}>
      {/* Keyword */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={filters.keyword}
          onChange={e => onChange({ ...filters, keyword: e.target.value })}
          placeholder="Search by keyword..."
          className={`pl-8 pr-3 py-1.5 rounded-md border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50 ${stacked ? 'w-full' : 'w-44'}`}
        />
      </div>

      {/* Date Range */}
      <div className={`flex items-center gap-1.5 ${stacked ? 'w-full' : ''}`}>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
          className={`px-2 py-1.5 rounded-md border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50 ${stacked ? 'flex-1' : 'w-[120px]'}`}
          title="From date"
        />
        <span className="text-xs text-muted-foreground">–</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => onChange({ ...filters, dateTo: e.target.value })}
          className={`px-2 py-1.5 rounded-md border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]/50 ${stacked ? 'flex-1' : 'w-[120px]'}`}
          title="To date"
        />
      </div>

      {/* Month/Year */}
      <MonthYearPicker currentDate={currentDate} onSelect={onMonthYearChange} />

      {/* Type multiselect */}
      <MultiSelectDropdown
        label="Type"
        options={ALL_TYPES}
        selected={filters.selectedTypes}
        onChange={v => onChange({ ...filters, selectedTypes: v })}
      />

      {/* Status multiselect */}
      <MultiSelectDropdown
        label="Status"
        options={ALL_STATUSES}
        selected={filters.selectedStatuses}
        onChange={v => onChange({ ...filters, selectedStatuses: v })}
      />

      {/* Assigned To — Owner/Admin only */}
      {isOwnerAdmin && (
        <AssignedToDropdown
          value={filters.assignedTo}
          onChange={v => onChange({ ...filters, assignedTo: v })}
        />
      )}

      {/* Clear all */}
      {active && (
        <button
          onClick={onClear}
          className="text-xs font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: TEAL }}
        >
          <X size={12} />
          Clear all
        </button>
      )}
    </div>
  );
};

/* ═══ Main Export ═══ */
const CalendarFilters: React.FC<Props> = (props) => {
  const { layout = 'horizontal' } = props;
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = isFiltersActive(props.filters);

  // Desktop horizontal or panel vertical
  if (!isMobile || layout === 'vertical') {
    return (
      <div className={layout === 'vertical' ? 'px-0' : 'mb-4'}>
        <FilterControls {...props} stacked={layout === 'vertical'} />
      </div>
    );
  }

  // Mobile: collapse behind button
  return (
    <div className="mb-4">
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/10 border border-border relative"
      >
        <Filter size={16} className="text-foreground" />
        <span className="text-foreground">Filters</span>
        {active && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{ background: TEAL }}
          />
        )}
      </button>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-xl p-4">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-sm font-semibold text-foreground">Filters</SheetTitle>
          </SheetHeader>
          <FilterControls {...props} stacked />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarFilters;
