import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, User, X, Edit2, CalendarIcon, Trash2, AlertTriangle, List, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSessionData } from '@/context/SessionContext';
import { DEMO_USERS } from '@/data/demoUsers';
import { getDemoAppointments, type DemoAppointment } from '@/data/calendarDemoData';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

/* ─── Appointment type colors ─── */
const TYPE_COLORS: Record<string, string> = {
  'Client Session': '#0d9488',
  'Supervision Session': '#4f46e5',
  'Staff Meeting': '#7c3aed',
  'Intake': '#0ea5e9',
  'Personal': '#94a3b8',
  'Meeting': '#2dd4bf',
  'Session': '#059669',
  'Other': '#64748b',
};

const TEAL = '#2dd4bf';

/* ─── Types available by role category ─── */
const CLINICAL_TYPES = ['Client Session', 'Supervision Session', 'Staff Meeting', 'Intake', 'Personal', 'Meeting', 'Session', 'Other'];
const NON_CLINICAL_TYPES = ['Staff Meeting', 'Personal', 'Meeting', 'Other'];
const OWNER_ADMIN_TYPES = ['Client Session', 'Supervision Session', 'Staff Meeting', 'Intake', 'Personal', 'Meeting', 'Session', 'Other'];

function getTypesForRole(role: string, internSubtype: string | null): string[] {
  if (role === 'OWNER' || role === 'ADMIN' || role === 'PARTNER') return OWNER_ADMIN_TYPES;
  if (role === 'SUPERVISOR') return CLINICAL_TYPES;
  if (role === 'CLINICIAN') return CLINICAL_TYPES;
  if (role === 'INTERN' && internSubtype === 'CLINICAL') return CLINICAL_TYPES;
  return NON_CLINICAL_TYPES;
}

/* ─── Helpers ─── */
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getDurationStr(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getNameById(id: string): string {
  return DEMO_USERS.find(u => u.id === id)?.full_name ?? 'Unknown';
}

type CalendarView = 'month' | 'week' | 'day';

/* ─── Time slots for week/day views ─── */
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm

/* ═══════════════════════════════════════════════ */
const CalendarPage: React.FC = () => {
  const session = useSessionData();
  const userId = session.user_id;
  const role = session.role;
  const internSubtype = session.intern_subtype;

  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<DemoAppointment[]>(() => getDemoAppointments());
  const [selectedAppt, setSelectedAppt] = useState<DemoAppointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedPanelDate, setSelectedPanelDate] = useState<Date | null>(null);
  const [calendarSearch, setCalendarSearch] = useState('');
  const [panelSearch, setPanelSearch] = useState('');
  const isMobile = useIsMobile();
  const panelScrollRef = useRef<HTMLDivElement>(null);

  /* ── Role-scoped filtering ── */
  const roleFilteredAppointments = useMemo(() => {
    if (role === 'OWNER' || role === 'ADMIN' || role === 'PARTNER') {
      return appointments;
    }
    if (role === 'SUPERVISOR') {
      const superviseeIds = ['demo-clinician', 'demo-intern-clinical'];
      return appointments.filter(a => a.assigned_to === userId || superviseeIds.includes(a.assigned_to));
    }
    return appointments.filter(a => a.assigned_to === userId);
  }, [appointments, userId, role]);

  /* ── Search filter helper ── */
  const filterBySearch = useCallback((appts: DemoAppointment[], query: string) => {
    if (!query.trim()) return appts;
    const q = query.toLowerCase();
    return appts.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.appointment_type.toLowerCase().includes(q) ||
      getNameById(a.assigned_to).toLowerCase().includes(q) ||
      (a.assigned_by ? getNameById(a.assigned_by).toLowerCase().includes(q) : false)
    );
  }, []);

  /* ── Calendar-visible appointments (role + calendar search) ── */
  const visibleAppointments = useMemo(
    () => filterBySearch(roleFilteredAppointments, calendarSearch),
    [roleFilteredAppointments, calendarSearch, filterBySearch]
  );

  /* ── Navigation ── */
  const navigatePrev = () => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };
  const navigateNext = () => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };
  const goToToday = () => setCurrentDate(new Date());

  /* ── Scroll panel to date ── */
  const scrollPanelToDate = useCallback((date: Date) => {
    setSelectedPanelDate(date);
    setTimeout(() => {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const el = document.getElementById(`panel-date-${dateKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  /* ── Panel grouped appointments (role + panel search) ── */
  const panelAppointments = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const panelFiltered = filterBySearch(roleFilteredAppointments, panelSearch);
    const filtered = panelFiltered.filter(a => {
      const d = new Date(a.start_time);
      if (view === 'day') return isSameDay(d, currentDate);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    filtered.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    const grouped: Record<string, DemoAppointment[]> = {};
    filtered.forEach(a => {
      const d = new Date(a.start_time);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });
    return grouped;
  }, [roleFilteredAppointments, panelSearch, currentDate, view, filterBySearch]);

  const panelDateContext = view === 'day'
    ? formatDateLong(currentDate)
    : formatMonthYear(currentDate);

  /* ── Open detail ── */
  const openDetail = (appt: DemoAppointment) => {
    setSelectedAppt(appt);
    setDetailOpen(true);
  };

  /* ── Delete ── */
  const handleDelete = (appt: DemoAppointment) => {
    setAppointments(prev => prev.filter(a => a.appointment_id !== appt.appointment_id));
    setDetailOpen(false);
    toast({ title: 'Appointment deleted' });
  };

  /* ── Request Reschedule ── */
  const handleRequestReschedule = (appt: DemoAppointment) => {
    setAppointments(prev => prev.map(a =>
      a.appointment_id === appt.appointment_id
        ? { ...a, needs_reschedule: true, reschedule_requested_by: userId }
        : a
    ));
    setDetailOpen(false);
    toast({ title: 'Reschedule requested', description: 'The supervisor has been notified.' });
  };

  /* ── Add appointment ── */
  const handleAddAppointment = (data: Omit<DemoAppointment, 'appointment_id'>) => {
    const newAppt: DemoAppointment = {
      ...data,
      appointment_id: `appt-new-${Date.now()}`,
    };
    setAppointments(prev => [...prev, newAppt]);
    setAddOpen(false);
    toast({ title: 'Appointment created' });
  };

  /* ── Appointment chip ── */
  const ApptChip: React.FC<{ appt: DemoAppointment; compact?: boolean }> = ({ appt, compact }) => {
    const color = TYPE_COLORS[appt.appointment_type] ?? '#64748b';
    return (
      <button
        onClick={(e) => { e.stopPropagation(); openDetail(appt); }}
        className="text-left w-full truncate rounded px-1.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
        style={{ background: `${color}22`, color, borderLeft: `3px solid ${color}` }}
        title={appt.title}
      >
        {compact ? appt.title : `${formatTime(appt.start_time)} ${appt.title}`}
      </button>
    );
  };

  /* ═══ MONTH VIEW ═══ */
  const MonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getStartDayOfMonth(year, month);
    const today = new Date();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[600px]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold py-2 text-muted-foreground uppercase tracking-wider">{d}</div>
          ))}
          {cells.map((day, idx) => {
            const cellDate = day ? new Date(year, month, day) : null;
            const isToday = cellDate ? isSameDay(cellDate, today) : false;
            const dayAppts = cellDate
              ? visibleAppointments.filter(a => isSameDay(new Date(a.start_time), cellDate))
              : [];

            return (
              <div
                key={idx}
                className="border border-border/40 min-h-[90px] p-1 cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => {
                  if (cellDate) {
                    setCurrentDate(cellDate);
                    setView('day');
                    if (panelOpen) scrollPanelToDate(cellDate);
                  }
                }}
              >
                {day && (
                  <>
                    <span
                      className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isToday ? 'text-primary-foreground' : 'text-foreground/70'
                      }`}
                      style={isToday ? { background: TEAL, color: '#0f172a' } : {}}
                    >
                      {day}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayAppts.slice(0, 3).map(a => (
                        <ApptChip key={a.appointment_id} appt={a} compact />
                      ))}
                      {dayAppts.length > 3 && (
                        <span className="text-[10px] text-muted-foreground pl-1">+{dayAppts.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══ WEEK VIEW ═══ */
  const WeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
    const today = new Date();

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/40">
            <div />
            {days.map((d, i) => {
              const isToday = isSameDay(d, today);
              return (
                <div key={i} className="text-center py-2 border-l border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <div
                    className={`text-sm font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full ${isToday ? '' : 'text-foreground'}`}
                    style={isToday ? { background: TEAL, color: '#0f172a' } : {}}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Time slots */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[52px] border-b border-border/20">
              <div className="text-[10px] text-muted-foreground pr-2 text-right pt-1">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
              {days.map((day, di) => {
                const dayAppts = visibleAppointments.filter(a => {
                  const s = new Date(a.start_time);
                  return isSameDay(s, day) && s.getHours() === hour;
                });
                return (
                  <div key={di} className="border-l border-border/20 p-0.5 relative">
                    {dayAppts.map(a => (
                      <ApptChip key={a.appointment_id} appt={a} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ═══ DAY VIEW ═══ */
  const DayView = () => {
    const today = new Date();
    const isToday = isSameDay(currentDate, today);

    return (
      <div>
        <p className={`text-sm font-medium mb-3 ${isToday ? '' : 'text-foreground/80'}`} style={isToday ? { color: TEAL } : {}}>
          {formatDateLong(currentDate)}{isToday ? ' — Today' : ''}
        </p>
        <div>
          {HOURS.map(hour => {
            const hourAppts = visibleAppointments.filter(a => {
              const s = new Date(a.start_time);
              return isSameDay(s, currentDate) && s.getHours() === hour;
            });
            return (
              <div key={hour} className="flex border-b border-border/20 min-h-[56px]">
                <div className="w-16 text-right pr-3 pt-1 text-xs text-muted-foreground flex-shrink-0">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
                <div className="flex-1 p-1 space-y-1">
                  {hourAppts.map(a => {
                    const color = TYPE_COLORS[a.appointment_type] ?? '#64748b';
                    return (
                      <button
                        key={a.appointment_id}
                        onClick={() => openDetail(a)}
                        className="w-full text-left rounded-lg p-2.5 transition-opacity hover:opacity-80"
                        style={{
                          background: `${color}15`,
                          borderLeft: `4px solid ${color}`,
                          borderTop: `1px solid ${color}40`,
                          borderBottom: `1px solid ${color}40`,
                          borderRight: `1px solid ${color}24`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{a.title}</span>
                          <span className="text-xs text-muted-foreground">{getDurationStr(a.start_time, a.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color }}>{a.appointment_type}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(a.start_time)} – {formatTime(a.end_time)}</span>
                        </div>
                        {a.assigned_by && a.assigned_by !== a.assigned_to && (
                          <p className="text-[11px] text-muted-foreground mt-1">Added by {getNameById(a.assigned_by)}</p>
                        )}
                        {a.needs_reschedule && (
                          <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: '#d97706' }}>
                            <AlertTriangle size={11} /> Reschedule requested
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state for day */}
        {visibleAppointments.filter(a => isSameDay(new Date(a.start_time), currentDate)).length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon size={32} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
            <p className="text-xs text-muted-foreground mt-1">Tap + to add one.</p>
          </div>
        )}
      </div>
    );
  };

  /* ─── View nav label ─── */
  const viewLabel = view === 'month'
    ? formatMonthYear(currentDate)
    : view === 'week'
      ? (() => {
          const s = new Date(currentDate);
          s.setDate(s.getDate() - s.getDay());
          const e = new Date(s);
          e.setDate(e.getDate() + 6);
          return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        })()
      : formatDateLong(currentDate);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="px-4 md:px-6 pt-4 pb-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Calendar</h1>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg overflow-hidden border border-border">
              {(['month', 'week', 'day'] as CalendarView[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                  style={view === v ? { background: TEAL, color: '#0f172a' } : {}}
                >
                  {v}
                </button>
              ))}
            </div>
            {/* Appointments panel toggle */}
            <button
              onClick={() => setPanelOpen(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
            >
              <List size={16} />
              <span className="hidden sm:inline">{panelOpen ? 'Hide' : 'Appointments'}</span>
            </button>
            {/* Add button */}
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Appointment</span>
            </button>
          </div>
        </div>

        {/* Navigation row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={navigatePrev} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors text-foreground">
              <ChevronLeft size={18} />
            </button>
            <button onClick={navigateNext} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors text-foreground">
              <ChevronRight size={18} />
            </button>
            <span className="text-sm font-semibold text-foreground ml-1">{viewLabel}</span>
          </div>
          <button onClick={goToToday} className="text-xs font-medium px-2.5 py-1 rounded-md hover:bg-accent/10 transition-colors" style={{ color: TEAL }}>
            Today
          </button>
        </div>

        {/* Calendar body + Panel layout */}
        <div className="flex gap-4">
          <div className={`bg-card rounded-xl border border-border/60 overflow-hidden transition-all duration-300 ${panelOpen && !isMobile ? 'flex-1 min-w-0' : 'w-full'}`}>
            {view === 'month' && <MonthView />}
            {view === 'week' && <WeekView />}
            {view === 'day' && <DayView />}
          </div>

          {/* Desktop side panel */}
          {panelOpen && !isMobile && (
            <div
              className="w-[280px] flex-shrink-0 rounded-xl overflow-hidden animate-fade-in"
              style={{
                background: 'hsl(var(--card))',
                borderLeft: '4px solid #2dd4bf',
                borderTop: '1px solid rgba(45,212,191,0.50)',
                borderBottom: '1px solid rgba(45,212,191,0.50)',
                borderRight: '1px solid rgba(45,212,191,0.35)',
              }}
            >
              <AppointmentsPanel
                grouped={panelAppointments}
                dateContext={panelDateContext}
                onSelect={openDetail}
              />
            </div>
          )}
        </div>

        {/* Mobile sheet panel */}
        {isMobile && (
          <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
            <SheetContent side="bottom" className="h-[70vh] p-0 rounded-t-xl">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appointments</SheetTitle>
              </SheetHeader>
              <AppointmentsPanel
                grouped={panelAppointments}
                dateContext={panelDateContext}
                onSelect={(a) => { setPanelOpen(false); openDetail(a); }}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* ── Detail dialog ── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedAppt && (
            <AppointmentDetail
              appt={selectedAppt}
              userId={userId}
              role={role}
              onDelete={handleDelete}
              onReschedule={handleRequestReschedule}
              onClose={() => setDetailOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add dialog ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Appointment</DialogTitle>
          </DialogHeader>
          <AddAppointmentForm
            userId={userId}
            role={role}
            internSubtype={internSubtype}
            onSave={handleAddAppointment}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <BottomNavBar />
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/* ─── APPOINTMENTS PANEL ─── */
/* ═══════════════════════════════════════════════ */
interface PanelProps {
  grouped: Record<string, DemoAppointment[]>;
  dateContext: string;
  onSelect: (a: DemoAppointment) => void;
}

const AppointmentsPanel: React.FC<PanelProps> = ({ grouped, dateContext, onSelect }) => {
  const dateKeys = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appointments</p>
        <p className="text-sm text-foreground/70 mt-0.5">{dateContext}</p>
      </div>
      <ScrollArea className="flex-1 px-4 pb-4">
        {dateKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No appointments this month.</p>
        ) : (
          dateKeys.map(dateKey => {
            const appts = grouped[dateKey];
            const d = new Date(dateKey + 'T12:00:00');
            return (
              <div key={dateKey} id={`panel-date-${dateKey}`} className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 border-b border-border/30 pb-1">
                  {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <div className="space-y-1.5">
                  {appts.map(a => {
                    const color = TYPE_COLORS[a.appointment_type] ?? '#64748b';
                    return (
                      <button
                        key={a.appointment_id}
                        onClick={() => onSelect(a)}
                        className="w-full text-left rounded-lg p-2 hover:bg-accent/10 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{formatTime(a.start_time)} – {formatTime(a.end_time)}</p>
                            <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                            <p className="text-[11px] text-muted-foreground">{a.appointment_type}</p>
                            {a.assigned_by && a.assigned_by !== a.assigned_to && (
                              <p className="text-[10px] text-muted-foreground">with {getNameById(a.assigned_to)}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </ScrollArea>
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/* ─── APPOINTMENT DETAIL ─── */
/* ═══════════════════════════════════════════════ */
interface DetailProps {
  appt: DemoAppointment;
  userId: string;
  role: string;
  onDelete: (a: DemoAppointment) => void;
  onReschedule: (a: DemoAppointment) => void;
  onClose: () => void;
}

const AppointmentDetail: React.FC<DetailProps> = ({ appt, userId, role, onDelete, onReschedule }) => {
  const color = TYPE_COLORS[appt.appointment_type] ?? '#64748b';
  const isOwn = appt.created_by === userId || appt.assigned_to === userId;
  const isSupervisorAssigned = !!appt.assigned_by && appt.assigned_by !== appt.assigned_to;
  const canDelete = isOwn && !isSupervisorAssigned;
  const canRequestReschedule = isSupervisorAssigned && appt.assigned_to === userId;

  return (
    <div className="space-y-4">
      {/* Type badge */}
      <div className="flex items-center gap-2">
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: `${color}22`, color }}
        >
          {appt.appointment_type}
        </span>
        {appt.needs_reschedule && (
          <span className="text-xs flex items-center gap-1" style={{ color: '#d97706' }}>
            <AlertTriangle size={12} /> Reschedule requested
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-foreground">{appt.title}</h2>

      {/* Date / Time */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <CalendarIcon size={14} className="text-muted-foreground" />
          {new Date(appt.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Clock size={14} className="text-muted-foreground" />
          {formatTime(appt.start_time)} – {formatTime(appt.end_time)} ({getDurationStr(appt.start_time, appt.end_time)})
        </div>
      </div>

      {/* Assigned info */}
      {appt.assigned_to !== appt.created_by && (
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-muted-foreground" />
          <span className="text-foreground/80">Assigned to: {getNameById(appt.assigned_to)}</span>
        </div>
      )}

      {isSupervisorAssigned && (
        <p className="text-xs text-muted-foreground">Added by {getNameById(appt.assigned_by!)}</p>
      )}

      {/* Notes */}
      {appt.notes && (
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Notes</p>
          <p className="text-sm text-foreground/80">{appt.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {canRequestReschedule && !appt.needs_reschedule && (
          <button
            onClick={() => onReschedule(appt)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
          >
            <AlertTriangle size={14} />
            Request Reschedule
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(appt)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/* ─── ADD APPOINTMENT FORM ─── */
/* ═══════════════════════════════════════════════ */
interface AddFormProps {
  userId: string;
  role: string;
  internSubtype: string | null;
  onSave: (data: Omit<DemoAppointment, 'appointment_id'>) => void;
  onCancel: () => void;
}

const AddAppointmentForm: React.FC<AddFormProps> = ({ userId, role, internSubtype, onSave, onCancel }) => {
  const types = getTypesForRole(role, internSubtype);
  const canAssign = role === 'OWNER' || role === 'ADMIN' || role === 'SUPERVISOR';
  const canLinkClient = ['OWNER', 'ADMIN', 'CLINICIAN'].includes(role) || (role === 'INTERN' && internSubtype === 'CLINICAL');

  const [title, setTitle] = useState('');
  const [type, setType] = useState(types[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [assignTo, setAssignTo] = useState(userId);
  const [notes, setNotes] = useState('');

  const activeStaff = DEMO_USERS.filter(u => u.practice_id === 'demo-practice-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type || !date || !startTime || !endTime) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const startISO = new Date(`${date}T${startTime}:00`).toISOString();
    const endISO = new Date(`${date}T${endTime}:00`).toISOString();

    onSave({
      hat_id: 'w1',
      engine_source: 'operations',
      title: title.trim(),
      appointment_type: type,
      start_time: startISO,
      end_time: endISO,
      created_by: userId,
      assigned_to: assignTo,
      assigned_by: assignTo !== userId ? userId : null,
      client_id: null,
      supervision_session_id: null,
      notes: notes.trim() || null,
      needs_reschedule: false,
      reschedule_requested_by: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label>Title *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Appointment title" />
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <Label>Type *</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map(t => (
              <SelectItem key={t} value={t}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[t] ?? '#64748b' }} />
                  {t}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <Label>Date *</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      {/* Time row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Start Time *</Label>
          <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>End Time *</Label>
          <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>
      </div>

      {/* Assign To */}
      {canAssign && (
        <div className="space-y-1.5">
          <Label>Assign To</Label>
          <Select value={assignTo} onValueChange={setAssignTo}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activeStaff.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.full_name}{u.id === userId ? ' (You)' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." rows={3} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
          style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CalendarPage;
