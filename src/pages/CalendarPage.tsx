import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, ChevronLeft, ChevronRight, Clock, User, X, Edit2, CalendarIcon, Trash2, AlertTriangle, List, Search, Check, RotateCcw, MapPin, Video, Link2, Users, Copy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSessionData } from '@/context/SessionContext';
import { DEMO_USERS } from '@/data/demoUsers';
import { getDemoAppointments, type DemoAppointment, type AppointmentStatus, type MeetingFormat, type ParticipantEntry } from '@/data/calendarDemoData';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CalendarFilters, { type CalendarFilterState, DEFAULT_FILTERS, isFiltersActive } from '@/components/calendar/CalendarFilters';

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

/* ─── Status colors & labels ─── */
const STATUS_COLORS: Record<string, string> = {
  'confirmed': '#2dd4bf',
  'completed': '#059669',
  'cancelled': '#78716c',
  'rescheduled': '#d97706',
  'no_show': '#c026d3',
};

const STATUS_LABELS: Record<string, string> = {
  'confirmed': 'Confirmed',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'rescheduled': 'Rescheduled',
  'no_show': 'No Show',
};

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

/* ─── Filter helper — applies all filters with AND logic ─── */
function applyFilters(appts: DemoAppointment[], filters: CalendarFilterState): DemoAppointment[] {
  return appts.filter(a => {
    // Keyword — matches title
    if (filters.keyword.trim()) {
      const q = filters.keyword.toLowerCase();
      if (!a.title.toLowerCase().includes(q)) return false;
    }

    // Date range
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom + 'T00:00:00');
      if (new Date(a.start_time) < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo + 'T23:59:59');
      if (new Date(a.start_time) > to) return false;
    }

    // Type
    if (filters.selectedTypes.length > 0) {
      if (!filters.selectedTypes.includes(a.appointment_type)) return false;
    }

    // Status
    if (filters.selectedStatuses.length > 0) {
      const statusLabel = STATUS_LABELS[a.status] ?? 'Confirmed';
      if (!filters.selectedStatuses.includes(statusLabel)) return false;
    }

    // Assigned To
    if (filters.assignedTo !== 'all') {
      if (a.assigned_to !== filters.assignedTo) return false;
    }

    return true;
  });
}

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
  const isMobile = useIsMobile();
  const panelScrollRef = useRef<HTMLDivElement>(null);

  /* ── Shared filter state (both calendar and panel use the same filters) ── */
  const [calendarFilters, setCalendarFilters] = useState<CalendarFilterState>({ ...DEFAULT_FILTERS });
  const [panelFilters, setPanelFilters] = useState<CalendarFilterState>({ ...DEFAULT_FILTERS });

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

  /* ── Calendar-visible appointments (role + calendar filters) ── */
  const visibleAppointments = useMemo(
    () => applyFilters(roleFilteredAppointments, calendarFilters),
    [roleFilteredAppointments, calendarFilters]
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

  /* ── Month/Year change from filter ── */
  const handleMonthYearChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  /* ── Scroll panel to date ── */
  const scrollPanelToDate = useCallback((date: Date) => {
    setSelectedPanelDate(date);
    setTimeout(() => {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const el = document.getElementById(`panel-date-${dateKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  /* ── Panel grouped appointments (role + panel filters) ── */
  const panelAppointments = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const panelFiltered = applyFilters(roleFilteredAppointments, panelFilters);
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
  }, [roleFilteredAppointments, panelFilters, currentDate, view]);

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

  /* ── Update Status ── */
  const handleStatusUpdate = useCallback((apptId: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(a =>
      a.appointment_id === apptId
        ? { ...a, status: newStatus, status_updated_at: new Date().toISOString(), status_updated_by: userId }
        : a
    ));
    // Also update selectedAppt if it's the one being changed
    setSelectedAppt(prev => prev && prev.appointment_id === apptId
      ? { ...prev, status: newStatus, status_updated_at: new Date().toISOString(), status_updated_by: userId }
      : prev
    );
    toast({ title: `Status updated to ${STATUS_LABELS[newStatus]}` });
  }, [userId]);

  /* ── Duplicate detection state ── */
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateAppt, setDuplicateAppt] = useState<DemoAppointment | null>(null);
  const [duplicateCreatorName, setDuplicateCreatorName] = useState('');

  /* ── Add appointment ── */
  const handleAddAppointment = (data: Omit<DemoAppointment, 'appointment_id'>) => {
    // Duplicate detection: check if a linked appointment with the exact same participant set already exists
    if (data.participants.length > 0) {
      // Build the set of all people in the new appointment (creator + participants)
      const newParticipantIds = new Set<string>();
      newParticipantIds.add(data.created_by);
      data.participants.forEach(p => {
        if (p.id) newParticipantIds.add(p.id);
      });

      // Only check if we have at least 2 people (creator + at least one participant with id)
      if (newParticipantIds.size >= 2) {
        // Find existing linked appointments with exact same participant set
        const duplicates = appointments.filter(existing => {
          if (!existing.is_linked) return false;
          if (existing.status === 'cancelled') return false;

          // Build existing participant set (creator + participants)
          const existingIds = new Set<string>();
          existingIds.add(existing.created_by);
          existing.participants.forEach(p => {
            if (p.id) existingIds.add(p.id);
          });

          // Check exact match
          if (existingIds.size !== newParticipantIds.size) return false;
          for (const id of newParticipantIds) {
            if (!existingIds.has(id)) return false;
          }
          return true;
        });

        if (duplicates.length > 0) {
          // Show the most recent duplicate
          const mostRecent = duplicates.sort((a, b) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
          )[0];
          setDuplicateAppt(mostRecent);
          setDuplicateCreatorName(getNameById(mostRecent.created_by));
          setDuplicateModalOpen(true);
          return; // Block save
        }
      }
    }

    const newAppt: DemoAppointment = {
      ...data,
      appointment_id: `appt-new-${Date.now()}`,
    };
    setAppointments(prev => [...prev, newAppt]);
    setAddOpen(false);
    toast({ title: 'Appointment created' });
  };

  /* ── Duplicate modal handlers ── */
  const handleDuplicateGoToCalendar = () => {
    setDuplicateModalOpen(false);
    setAddOpen(false);
    if (duplicateAppt) {
      const d = new Date(duplicateAppt.start_time);
      setCurrentDate(d);
      setView('day');
    }
  };

  const handleDuplicateGoToAppointments = () => {
    setDuplicateModalOpen(false);
    setAddOpen(false);
    setPanelOpen(true);
    if (duplicateAppt) {
      const d = new Date(duplicateAppt.start_time);
      setCurrentDate(d);
      scrollPanelToDate(d);
    }
  };

  const handleDuplicateEditExisting = () => {
    setDuplicateModalOpen(false);
    setAddOpen(false);
    if (duplicateAppt) {
      openDetail(duplicateAppt);
    }
  };

  /* ── Appointment chip ── */
  const ApptChip: React.FC<{ appt: DemoAppointment; compact?: boolean }> = ({ appt, compact }) => {
    const color = TYPE_COLORS[appt.appointment_type] ?? '#64748b';
    const isCancelled = appt.status === 'cancelled';
    const isNoShow = appt.status === 'no_show';
    const isCompleted = appt.status === 'completed';
    const isRescheduled = appt.status === 'rescheduled';
    const muted = isCancelled || isNoShow;

    return (
      <button
        onClick={(e) => { e.stopPropagation(); openDetail(appt); }}
        className="text-left w-full truncate rounded px-1.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 flex items-center gap-1"
        style={{
          background: `${color}22`,
          color,
          borderLeft: `3px solid ${color}`,
          opacity: muted ? 0.5 : 1,
        }}
        title={appt.title}
      >
        {isCompleted && <Check size={10} className="flex-shrink-0" />}
        {isRescheduled && <RotateCcw size={10} className="flex-shrink-0" />}
        <span className={isCancelled ? 'line-through' : ''}>
          {compact ? appt.title : `${formatTime(appt.start_time)} ${appt.title}`}
        </span>
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
                          opacity: (a.status === 'cancelled' || a.status === 'no_show') ? 0.5 : 1,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold text-foreground flex items-center gap-1 ${a.status === 'cancelled' ? 'line-through' : ''}`}>
                            {a.status === 'completed' && <Check size={12} />}
                            {a.status === 'rescheduled' && <RotateCcw size={12} />}
                            {a.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{getDurationStr(a.start_time, a.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color }}>{a.appointment_type}</span>
                          <span
                            className="px-1.5 py-0 rounded-full text-[10px] font-medium"
                            style={{ color: STATUS_COLORS[a.status], border: `1px solid ${STATUS_COLORS[a.status]}` }}
                          >
                            {STATUS_LABELS[a.status]}
                          </span>
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

        {/* Search bar with filter dropdown */}
        <CalendarFilters
          filters={calendarFilters}
          onChange={setCalendarFilters}
          onClear={() => setCalendarFilters({ ...DEFAULT_FILTERS })}
          currentDate={currentDate}
          onMonthYearChange={handleMonthYearChange}
          role={role}
          appointments={roleFilteredAppointments}
          onSelectAppointment={(appt) => {
            const d = new Date(appt.start_time);
            setCurrentDate(d);
            setView('day');
            const found = appointments.find(a => a.appointment_id === appt.appointment_id);
            if (found) openDetail(found);
          }}
        />

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
              className="w-[320px] flex-shrink-0 rounded-xl overflow-hidden animate-fade-in"
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
                filters={panelFilters}
                onFiltersChange={setPanelFilters}
                onFiltersClear={() => setPanelFilters({ ...DEFAULT_FILTERS })}
                currentDate={currentDate}
                onMonthYearChange={handleMonthYearChange}
                role={role}
                userId={userId}
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
                filters={panelFilters}
                onFiltersChange={setPanelFilters}
                onFiltersClear={() => setPanelFilters({ ...DEFAULT_FILTERS })}
                currentDate={currentDate}
                onMonthYearChange={handleMonthYearChange}
                role={role}
                userId={userId}
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
              onStatusUpdate={handleStatusUpdate}
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

      {/* ── Duplicate detection modal ── */}
      <Dialog open={duplicateModalOpen} onOpenChange={setDuplicateModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy size={18} style={{ color: TEAL }} />
              Duplicate Appointment Found
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground/80">
            {duplicateCreatorName} already created this appointment and added it to your calendar.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleDuplicateGoToCalendar}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
            >
              Go to Calendar
            </button>
            <button
              type="button"
              onClick={handleDuplicateGoToAppointments}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
            >
              Go to Appointments
            </button>
            <button
              type="button"
              onClick={handleDuplicateEditExisting}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ border: `1.5px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
            >
              Edit Existing
            </button>
          </div>
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
  filters: CalendarFilterState;
  onFiltersChange: (f: CalendarFilterState) => void;
  onFiltersClear: () => void;
  currentDate: Date;
  onMonthYearChange: (d: Date) => void;
  role: string;
  userId: string;
}

const AppointmentsPanel: React.FC<PanelProps> = ({ grouped, dateContext, onSelect, filters, onFiltersChange, onFiltersClear, currentDate, onMonthYearChange, role, userId }) => {
  const dateKeys = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appointments</p>
        <p className="text-sm text-foreground/70 mt-0.5">{dateContext}</p>
      </div>
      {/* Panel search bar with filter dropdown */}
      <div className="px-4 pb-3">
        <CalendarFilters
          filters={filters}
          onChange={onFiltersChange}
          onClear={onFiltersClear}
          currentDate={currentDate}
          onMonthYearChange={onMonthYearChange}
          role={role}
          placeholder="Search..."
          compact
          appointments={Object.values(grouped).flat()}
          onSelectAppointment={(appt) => onSelect(appt as any)}
        />
      </div>
      <ScrollArea className="flex-1 px-4 pb-4">
        {dateKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No appointments found.</p>
        ) : (
          dateKeys.map(dateKey => {
            const appts = grouped[dateKey];
            const d = new Date(dateKey + 'T12:00:00');
            return (
              <div key={dateKey} id={`panel-date-${dateKey}`} className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 border-b border-border/30 pb-1">
                  {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <div className="space-y-2">
                  {appts.map(a => {
                    const color = TYPE_COLORS[a.appointment_type] ?? '#64748b';
                    return (
                      <button
                        key={a.appointment_id}
                        onClick={() => onSelect(a)}
                        className="w-full text-left rounded-lg p-2.5 hover:opacity-80 transition-opacity"
                        style={{
                          background: 'hsl(var(--card))',
                          borderLeft: `4px solid ${color}`,
                          borderTop: `1px solid ${color}40`,
                          borderBottom: `1px solid ${color}40`,
                          borderRight: `1px solid ${color}26`,
                        }}
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{formatTime(a.start_time)} – {formatTime(a.end_time)}</p>
                          <p className={`text-sm font-medium text-foreground truncate ${a.status === 'cancelled' ? 'line-through' : ''}`}
                            style={{ opacity: (a.status === 'cancelled' || a.status === 'no_show') ? 0.5 : 1 }}
                          >{a.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[11px] text-muted-foreground">{a.appointment_type}</p>
                            <span
                              className="px-1.5 py-0 rounded-full text-[10px] font-medium"
                              style={{ color: STATUS_COLORS[a.status], border: `1px solid ${STATUS_COLORS[a.status]}` }}
                            >
                              {STATUS_LABELS[a.status]}
                            </span>
                          </div>
                          {a.assigned_by && a.assigned_by !== a.assigned_to && (
                            <p className="text-[10px] text-muted-foreground">
                              {a.assigned_to === userId ? `Added by ${getNameById(a.assigned_by)}` : `with ${getNameById(a.assigned_to)}`}
                            </p>
                          )}
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
  onStatusUpdate: (apptId: string, status: AppointmentStatus) => void;
  onClose: () => void;
}

const ALL_STATUSES: AppointmentStatus[] = ['confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'];

const AppointmentDetail: React.FC<DetailProps> = ({ appt, userId, role, onDelete, onReschedule, onStatusUpdate }) => {
  const color = TYPE_COLORS[appt.appointment_type] ?? '#64748b';
  const statusColor = STATUS_COLORS[appt.status] ?? '#64748b';
  const isOwn = appt.created_by === userId || appt.assigned_to === userId;
  const isSupervisorAssigned = !!appt.assigned_by && appt.assigned_by !== appt.assigned_to;
  const canDelete = isOwn && !isSupervisorAssigned;
  const canRequestReschedule = isSupervisorAssigned && appt.assigned_to === userId;
  const canUpdateStatus = isOwn || role === 'OWNER' || role === 'ADMIN' ||
    (role === 'SUPERVISOR' && ['demo-clinician', 'demo-intern-clinical'].includes(appt.assigned_to));

  const [statusPickerOpen, setStatusPickerOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Status + Type badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}` }}
        >
          {STATUS_LABELS[appt.status]}
        </span>
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

      {/* Participants */}
      {appt.participants && appt.participants.length > 0 && (
        <div className="flex items-start gap-2 text-sm">
          <Users size={14} className="text-muted-foreground mt-0.5" />
          <div className="flex flex-wrap gap-1.5">
            {appt.participants.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-foreground/80">
                <span>{p.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {p.external ? 'External' : (p.role ?? '')}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meeting Format */}
      {appt.meeting_format && (
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          {appt.meeting_format === 'in_person' ? (
            <MapPin size={14} className="text-muted-foreground" />
          ) : (
            <Video size={14} className="text-muted-foreground" />
          )}
          <span>{appt.meeting_format === 'in_person' ? 'In-Person' : 'Virtual'}</span>
          {appt.meeting_format === 'in_person' && appt.location && (
            <span className="text-muted-foreground">— {appt.location}</span>
          )}
          {appt.meeting_format === 'virtual' && appt.virtual_platform && (
            <span className="text-muted-foreground">— {appt.virtual_platform}</span>
          )}
        </div>
      )}

      {/* Meeting Link */}
      {appt.meeting_format === 'virtual' && appt.meeting_link && (
        <div className="flex items-center gap-2 text-sm">
          <Link2 size={14} className="text-muted-foreground" />
          <a
            href={appt.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:underline"
            style={{ color: TEAL }}
          >
            {appt.meeting_link}
          </a>
        </div>
      )}

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

      {/* Status Update */}
      {canUpdateStatus && (
        <div className="relative">
          <button
            onClick={() => setStatusPickerOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ border: `1.5px solid ${statusColor}`, color: statusColor, background: 'transparent' }}
          >
            Update Status
          </button>
          {statusPickerOpen && (
            <div className="absolute z-50 mt-1 left-0 bg-card border border-border rounded-lg shadow-lg p-1.5 min-w-[180px] animate-fade-in">
              {ALL_STATUSES.map(s => {
                const sc = STATUS_COLORS[s];
                const isActive = appt.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onStatusUpdate(appt.appointment_id, s);
                      setStatusPickerOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors hover:bg-accent/10"
                    style={{ color: sc, fontWeight: isActive ? 700 : 500 }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: sc }} />
                    {STATUS_LABELS[s]}
                    {isActive && <Check size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
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

interface SavedLocation {
  location_id: string;
  hat_id: string;
  name: string;
  address: string | null;
  type: string;
  is_active: boolean;
}

const LOCATION_TYPES = ['Office', 'Studio', 'Clinic', 'Venue', 'Home', 'Other'];
const DEFAULT_PLATFORMS = ['Zoom', 'SimplePractice', 'Google Meet', 'Microsoft Teams', 'FaceTime', 'Phone Call', 'Other'];

interface AddFormProps {
  userId: string;
  role: string;
  internSubtype: string | null;
  onSave: (data: Omit<DemoAppointment, 'appointment_id'>) => void;
  onCancel: () => void;
}

const AddAppointmentForm: React.FC<AddFormProps> = ({ userId, role, internSubtype, onSave, onCancel }) => {
  const types = getTypesForRole(role, internSubtype);


  const [title, setTitle] = useState('');
  const [type, setType] = useState(types[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  
  const [notes, setNotes] = useState('');

  // LOG-102 context fields
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantDropdownOpen, setParticipantDropdownOpen] = useState(false);
  const [addingExternalPerson, setAddingExternalPerson] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [externalEmail, setExternalEmail] = useState('');
  const [meetingFormat, setMeetingFormat] = useState<MeetingFormat | null>(null);
  const [location, setLocation] = useState('');
  const [virtualPlatform, setVirtualPlatform] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [customPlatforms, setCustomPlatforms] = useState<string[]>([]);
  const [addingPlatform, setAddingPlatform] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');

  // LOG-103: Saved locations
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [addingLocation, setAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [newLocationType, setNewLocationType] = useState('Office');
  const [saveForFuture, setSaveForFuture] = useState(true);

  // Fetch saved locations
  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from('hat_locations')
        .select('*')
        .eq('hat_id', 'w1')
        .eq('is_active', true)
        .order('name');
      if (data) setSavedLocations(data as unknown as SavedLocation[]);
    };
    fetchLocations();
  }, []);

  const allPlatforms = [...DEFAULT_PLATFORMS, ...customPlatforms];

  const activeStaff = DEMO_USERS.filter(u => u.practice_id === 'demo-practice-1');

  // Role display labels
  const getRoleLabel = (u: typeof DEMO_USERS[0]): string => {
    if (u.role === 'INTERN' && u.intern_subtype === 'CLINICAL') return 'Clinical Intern';
    if (u.role === 'INTERN' && u.intern_subtype === 'BUSINESS') return 'Business Intern';
    if (u.role === 'CLINICIAN') return 'Clinician';
    return u.role.charAt(0) + u.role.slice(1).toLowerCase();
  };


  // Participants options based on role — includes role label
  const participantOptions = useMemo((): { id: string; name: string; role: string }[] => {
    const staff = activeStaff.filter(u => u.id !== userId);
    if (role === 'OWNER' || role === 'ADMIN' || role === 'PARTNER') {
      return staff.map(u => ({ id: u.id, name: u.full_name, role: getRoleLabel(u) }));
    }
    if (role === 'SUPERVISOR') {
      const superviseeIds = ['demo-clinician', 'demo-intern-clinical'];
      return staff.filter(u => superviseeIds.includes(u.id) || !['INTERN', 'STAFF'].includes(u.role))
        .map(u => ({ id: u.id, name: u.full_name, role: getRoleLabel(u) }));
    }
    if (role === 'CLINICIAN' || (role === 'INTERN' && internSubtype === 'CLINICAL')) {
      return staff.map(u => ({ id: u.id, name: u.full_name, role: getRoleLabel(u) }));
    }
    return staff.map(u => ({ id: u.id, name: u.full_name, role: getRoleLabel(u) }));
  }, [role, internSubtype, userId, activeStaff]);

  const filteredParticipantOptions = useMemo(() => {
    const selectedIds = new Set(participants.map(p => p.id ?? p.name));
    const available = participantOptions.filter(o => !selectedIds.has(o.id));
    if (!participantSearch.trim()) return available;
    const q = participantSearch.toLowerCase();
    return available.filter(o => o.name.toLowerCase().includes(q) || o.role.toLowerCase().includes(q));
  }, [participantOptions, participants, participantSearch]);

  const addParticipant = (entry: ParticipantEntry) => {
    setParticipants(prev => [...prev, entry]);
    setParticipantSearch('');
  };

  const removeParticipant = (index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddExternalPerson = () => {
    const name = externalName.trim();
    if (!name) return;
    if (participants.some(p => p.name === name && p.external)) return;
    addParticipant({ name, external: true, email: externalEmail.trim() || undefined });
    setExternalName('');
    setExternalEmail('');
    setAddingExternalPerson(false);
  };

  const participantRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (participantRef.current && !participantRef.current.contains(e.target as Node)) {
        setParticipantDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type || !date || !startTime || !endTime) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (!meetingFormat) {
      toast({ title: 'Please select a meeting format', variant: 'destructive' });
      return;
    }
    if (meetingFormat === 'virtual' && !virtualPlatform) {
      toast({ title: 'Please select a platform', variant: 'destructive' });
      return;
    }

    const startISO = new Date(`${date}T${startTime}:00`).toISOString();
    const endISO = new Date(`${date}T${endTime}:00`).toISOString();

    // Derive assigned_to from first internal participant in "With" field, fallback to creator
    const firstInternalParticipant = participants.find(p => !p.external && p.id);
    const assignedTo = firstInternalParticipant?.id ?? userId;

    onSave({
      hat_id: 'w1',
      engine_source: 'operations',
      title: title.trim(),
      appointment_type: type,
      start_time: startISO,
      end_time: endISO,
      created_by: userId,
      assigned_to: assignedTo,
      assigned_by: assignedTo !== userId ? userId : null,
      client_id: null,
      supervision_session_id: null,
      notes: notes.trim() || null,
      needs_reschedule: false,
      reschedule_requested_by: null,
      status: 'confirmed',
      status_updated_at: null,
      status_updated_by: null,
      participants,
      meeting_format: meetingFormat,
      location: meetingFormat === 'in_person' ? (location || null) : null,
      virtual_platform: meetingFormat === 'virtual' ? (virtualPlatform || null) : null,
      meeting_link: meetingFormat === 'virtual' ? (meetingLink.trim() || null) : null,
      appointment_group_id: null,
      is_linked: participants.length > 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Title */}
      <div className="space-y-1.5">
        <Label>Title *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Appointment title" />
      </div>

      {/* 2. Type */}
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

      {/* 3. With (Participants) */}
      <div className="space-y-1.5" ref={participantRef}>
        <Label>With</Label>
        {/* Selected participant chips */}
        {participants.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {participants.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-foreground"
              >
                <span>{p.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {p.external ? 'External' : (p.role ?? '')}
                </span>
                <button type="button" onClick={() => removeParticipant(i)} className="text-muted-foreground hover:text-foreground ml-0.5">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        {/* Search input */}
        <div className="relative">
          <Input
            value={participantSearch}
            onChange={e => { setParticipantSearch(e.target.value); setParticipantDropdownOpen(true); setAddingExternalPerson(false); }}
            onFocus={() => { setParticipantDropdownOpen(true); setAddingExternalPerson(false); }}
            placeholder="Search staff or add someone..."
            className="text-sm"
          />
          {participantDropdownOpen && (
            <div className="absolute z-50 mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg max-h-52 overflow-y-auto">
              {/* Add someone new — at top */}
              {!addingExternalPerson ? (
                <button
                  type="button"
                  onClick={() => setAddingExternalPerson(true)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent/10 transition-colors flex items-center gap-1.5"
                  style={{ color: TEAL }}
                >
                  <Plus size={13} /> Add someone new
                </button>
              ) : (
                <div className="px-3 py-2.5 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add External Contact</p>
                  <Input
                    value={externalName}
                    onChange={e => setExternalName(e.target.value)}
                    placeholder="Name *"
                    className="text-sm h-8"
                    autoFocus
                  />
                  <Input
                    value={externalEmail}
                    onChange={e => setExternalEmail(e.target.value)}
                    placeholder="Email (optional)"
                    type="email"
                    className="text-sm h-8"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddExternalPerson}
                      disabled={!externalName.trim()}
                      className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-40"
                      style={{ border: `1px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAddingExternalPerson(false); setExternalName(''); setExternalEmail(''); }}
                      className="px-3 py-1.5 rounded-md text-xs text-muted-foreground border border-border"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border my-1" />

              {/* Internal staff options */}
              {filteredParticipantOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { addParticipant({ id: o.id, name: o.name, role: o.role }); setParticipantDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent/10 transition-colors flex items-center justify-between"
                >
                  <span className="text-foreground font-medium">{o.name}</span>
                  <span className="text-[11px] text-muted-foreground">{o.role}</span>
                </button>
              ))}
              {filteredParticipantOptions.length === 0 && !addingExternalPerson && (
                <p className="text-xs text-muted-foreground px-3 py-2">No matching staff found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Meeting Format */}
      <div className="space-y-1.5">
        <Label>How are you meeting? *</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMeetingFormat('in_person')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all"
            style={meetingFormat === 'in_person' ? {
              border: `2px solid ${TEAL}`, color: TEAL, background: `${TEAL}11`,
            } : {
              border: '1.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', background: 'transparent',
            }}
          >
            <MapPin size={16} /> In-Person
          </button>
          <button
            type="button"
            onClick={() => setMeetingFormat('virtual')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all"
            style={meetingFormat === 'virtual' ? {
              border: `2px solid ${TEAL}`, color: TEAL, background: `${TEAL}11`,
            } : {
              border: '1.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', background: 'transparent',
            }}
          >
            <Video size={16} /> Virtual
          </button>
        </div>
      </div>

      {/* 5A. Location (if In-Person) — LOG-103 */}
      {meetingFormat === 'in_person' && (
        <div className="space-y-1.5">
          <Label>Where?</Label>
          {!addingLocation ? (
            <>
              <Select value={location} onValueChange={(val) => {
                if (val === '__add_new__') {
                  setAddingLocation(true);
                } else {
                  setLocation(val);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__add_new__">
                    <span className="flex items-center gap-1.5" style={{ color: TEAL }}>
                      <Plus size={12} /> Add New Location
                    </span>
                  </SelectItem>
                  {savedLocations.map(loc => (
                    <SelectItem key={loc.location_id} value={loc.name}>
                      <div className="flex flex-col">
                        <span>{loc.name}</span>
                        {loc.address && <span className="text-[11px] text-muted-foreground">{loc.address}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
            </>
          ) : (
            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Location</p>
              <Input
                value={newLocationName}
                onChange={e => setNewLocationName(e.target.value)}
                placeholder="Location name *"
                className="text-sm"
                autoFocus
              />
              <Input
                value={newLocationAddress}
                onChange={e => setNewLocationAddress(e.target.value)}
                placeholder="Address (optional)"
                className="text-sm"
              />
              <Select value={newLocationType} onValueChange={setNewLocationType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveForFuture}
                    onChange={e => setSaveForFuture(e.target.checked)}
                    className="rounded border-border"
                  />
                  Save for future use?
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const name = newLocationName.trim();
                    if (!name) return;
                    if (saveForFuture) {
                      const { data, error } = await supabase
                        .from('hat_locations')
                        .insert({
                          hat_id: 'w1',
                          name,
                          address: newLocationAddress.trim() || null,
                          type: newLocationType.toLowerCase(),
                          created_by: userId,
                        })
                        .select()
                        .single();
                      if (!error && data) {
                        setSavedLocations(prev => [...prev, data as unknown as SavedLocation]);
                        toast({ title: 'Location saved' });
                      }
                    }
                    setLocation(name);
                    setNewLocationName('');
                    setNewLocationAddress('');
                    setNewLocationType('Office');
                    setSaveForFuture(true);
                    setAddingLocation(false);
                  }}
                  disabled={!newLocationName.trim()}
                  className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-40"
                  style={{ border: `1px solid ${TEAL}`, color: TEAL, background: 'transparent' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingLocation(false); setNewLocationName(''); setNewLocationAddress(''); }}
                  className="px-3 py-1.5 text-muted-foreground text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5B. Platform + Meeting Link (if Virtual) */}
      {meetingFormat === 'virtual' && (
        <>
          <div className="space-y-1.5">
            <Label>Platform *</Label>
            {!addingPlatform ? (
              <Select value={virtualPlatform} onValueChange={setVirtualPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform..." />
                </SelectTrigger>
                <SelectContent>
                  {allPlatforms.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAddingPlatform(true); }}
                    className="w-full text-left px-2 py-1.5 text-sm flex items-center gap-1.5 hover:bg-accent/10"
                    style={{ color: TEAL }}
                  >
                    <Plus size={12} /> Add platform
                  </button>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newPlatformName}
                  onChange={e => setNewPlatformName(e.target.value)}
                  placeholder="Platform name"
                  className="text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPlatformName.trim()) {
                      setCustomPlatforms(prev => [...prev, newPlatformName.trim()]);
                      setVirtualPlatform(newPlatformName.trim());
                      setNewPlatformName('');
                    }
                    setAddingPlatform(false);
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-medium"
                  style={{ border: `1px solid ${TEAL}`, color: TEAL }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingPlatform(false); setNewPlatformName(''); }}
                  className="px-2 py-1.5 text-muted-foreground text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Meeting Link</Label>
            <Input
              value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              placeholder="https://..."
              type="url"
              className="text-sm"
            />
          </div>
        </>
      )}

      {/* 6. Date */}
      <div className="space-y-1.5">
        <Label>Date *</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      {/* 7. Time row */}
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


      {/* 9. Notes */}
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." rows={3} />
      </div>

      {/* 10. Actions */}
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
