/**
 * Demo appointments for the Calendar — seeded for current month.
 * Uses demo user IDs from demoUsers.ts.
 */

export interface DemoAppointment {
  appointment_id: string;
  hat_id: string;
  engine_source: string;
  title: string;
  appointment_type: string;
  start_time: string;
  end_time: string;
  created_by: string;
  assigned_to: string;
  assigned_by: string | null;
  client_id: string | null;
  supervision_session_id: string | null;
  notes: string | null;
  needs_reschedule: boolean;
  reschedule_requested_by: string | null;
}

function isoDate(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(1);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function getDemoAppointments(): DemoAppointment[] {
  return [
    // Dr. Sarah Mitchell (OWNER) — 2 Staff Meetings, 1 Personal
    {
      appointment_id: 'appt-owner-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Weekly Leadership Sync',
      appointment_type: 'Staff Meeting',
      start_time: isoDate(2, 10), end_time: isoDate(2, 11),
      created_by: 'demo-owner', assigned_to: 'demo-owner',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: 'Review weekly KPIs and staff updates', needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-owner-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Monthly All-Hands',
      appointment_type: 'Staff Meeting',
      start_time: isoDate(14, 14), end_time: isoDate(14, 15, 30),
      created_by: 'demo-owner', assigned_to: 'demo-owner',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: 'Monthly practice-wide meeting', needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-owner-3',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Dentist Appointment',
      appointment_type: 'Personal',
      start_time: isoDate(8, 9), end_time: isoDate(8, 10),
      created_by: 'demo-owner', assigned_to: 'demo-owner',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },

    // Marcus Chen (ADMIN) — 2 Staff Meetings, 1 Meeting
    {
      appointment_id: 'appt-admin-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Weekly Leadership Sync',
      appointment_type: 'Staff Meeting',
      start_time: isoDate(2, 10), end_time: isoDate(2, 11),
      created_by: 'demo-owner', assigned_to: 'demo-admin',
      assigned_by: 'demo-owner', client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-admin-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Monthly All-Hands',
      appointment_type: 'Staff Meeting',
      start_time: isoDate(14, 14), end_time: isoDate(14, 15, 30),
      created_by: 'demo-owner', assigned_to: 'demo-admin',
      assigned_by: 'demo-owner', client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-admin-3',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Vendor Review — EHR Platform',
      appointment_type: 'Meeting',
      start_time: isoDate(6, 13), end_time: isoDate(6, 14),
      created_by: 'demo-admin', assigned_to: 'demo-admin',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: 'Annual vendor contract review', needs_reschedule: false, reschedule_requested_by: null,
    },

    // Dr. Angela Torres (SUPERVISOR) — 3 Supervision Sessions, 1 Staff Meeting
    {
      appointment_id: 'appt-sup-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Supervision — James Rivera',
      appointment_type: 'Supervision Session',
      start_time: isoDate(3, 11), end_time: isoDate(3, 12),
      created_by: 'demo-supervisor', assigned_to: 'demo-supervisor',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: 'Weekly individual supervision', needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-sup-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Supervision — Priya Patel',
      appointment_type: 'Supervision Session',
      start_time: isoDate(3, 14), end_time: isoDate(3, 15),
      created_by: 'demo-supervisor', assigned_to: 'demo-supervisor',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: 'Weekly individual supervision', needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-sup-3',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Group Supervision',
      appointment_type: 'Supervision Session',
      start_time: isoDate(10, 10), end_time: isoDate(10, 11, 30),
      created_by: 'demo-supervisor', assigned_to: 'demo-supervisor',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: 'Monthly group supervision session', needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-sup-4',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Monthly All-Hands',
      appointment_type: 'Staff Meeting',
      start_time: isoDate(14, 14), end_time: isoDate(14, 15, 30),
      created_by: 'demo-owner', assigned_to: 'demo-supervisor',
      assigned_by: 'demo-owner', client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },

    // James Rivera (CLINICIAN) — 4 Client Sessions, 2 Supervision Sessions (from Dr. Torres)
    {
      appointment_id: 'appt-clin-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — M. Johnson',
      appointment_type: 'Client Session',
      start_time: isoDate(1, 9), end_time: isoDate(1, 10),
      created_by: 'demo-clinician', assigned_to: 'demo-clinician',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-clin-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — R. Williams',
      appointment_type: 'Client Session',
      start_time: isoDate(1, 11), end_time: isoDate(1, 12),
      created_by: 'demo-clinician', assigned_to: 'demo-clinician',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-clin-3',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — A. Davis',
      appointment_type: 'Client Session',
      start_time: isoDate(5, 10), end_time: isoDate(5, 11),
      created_by: 'demo-clinician', assigned_to: 'demo-clinician',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-clin-4',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — T. Brown',
      appointment_type: 'Client Session',
      start_time: isoDate(12, 14), end_time: isoDate(12, 15),
      created_by: 'demo-clinician', assigned_to: 'demo-clinician',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    // Supervision assigned by Dr. Torres
    {
      appointment_id: 'appt-clin-sup-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Supervision — Dr. Torres',
      appointment_type: 'Supervision Session',
      start_time: isoDate(3, 11), end_time: isoDate(3, 12),
      created_by: 'demo-supervisor', assigned_to: 'demo-clinician',
      assigned_by: 'demo-supervisor', client_id: null, supervision_session_id: null,
      notes: 'Weekly individual supervision', needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-clin-sup-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Group Supervision',
      appointment_type: 'Supervision Session',
      start_time: isoDate(10, 10), end_time: isoDate(10, 11, 30),
      created_by: 'demo-supervisor', assigned_to: 'demo-clinician',
      assigned_by: 'demo-supervisor', client_id: null, supervision_session_id: null,
      notes: 'Monthly group supervision session', needs_reschedule: false, reschedule_requested_by: null,
    },

    // Priya Patel (INTERN CLINICAL) — 3 Client Sessions, 1 Supervision Session (from Dr. Torres)
    {
      appointment_id: 'appt-intern-c-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — K. Martinez',
      appointment_type: 'Client Session',
      start_time: isoDate(2, 9), end_time: isoDate(2, 10),
      created_by: 'demo-intern-clinical', assigned_to: 'demo-intern-clinical',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-intern-c-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — L. Garcia',
      appointment_type: 'Client Session',
      start_time: isoDate(4, 13), end_time: isoDate(4, 14),
      created_by: 'demo-intern-clinical', assigned_to: 'demo-intern-clinical',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-intern-c-3',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Client Session — S. Lee',
      appointment_type: 'Client Session',
      start_time: isoDate(9, 11), end_time: isoDate(9, 12),
      created_by: 'demo-intern-clinical', assigned_to: 'demo-intern-clinical',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-intern-c-sup-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Supervision — Dr. Torres',
      appointment_type: 'Supervision Session',
      start_time: isoDate(3, 14), end_time: isoDate(3, 15),
      created_by: 'demo-supervisor', assigned_to: 'demo-intern-clinical',
      assigned_by: 'demo-supervisor', client_id: null, supervision_session_id: null,
      notes: 'Weekly individual supervision', needs_reschedule: false, reschedule_requested_by: null,
    },

    // Alex Nguyen (INTERN BUSINESS) — 2 Meetings
    {
      appointment_id: 'appt-intern-b-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Insurance Follow-up Call',
      appointment_type: 'Meeting',
      start_time: isoDate(4, 10), end_time: isoDate(4, 10, 30),
      created_by: 'demo-intern-business', assigned_to: 'demo-intern-business',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-intern-b-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Admin Training Session',
      appointment_type: 'Meeting',
      start_time: isoDate(11, 15), end_time: isoDate(11, 16),
      created_by: 'demo-intern-business', assigned_to: 'demo-intern-business',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },

    // Taylor Brooks (STAFF) — 1 Meeting, 1 Personal
    {
      appointment_id: 'appt-staff-1',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Front Desk Coverage Review',
      appointment_type: 'Meeting',
      start_time: isoDate(5, 8), end_time: isoDate(5, 8, 30),
      created_by: 'demo-staff', assigned_to: 'demo-staff',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
    {
      appointment_id: 'appt-staff-2',
      hat_id: 'w1', engine_source: 'operations',
      title: 'Doctor Visit',
      appointment_type: 'Personal',
      start_time: isoDate(13, 16), end_time: isoDate(13, 17),
      created_by: 'demo-staff', assigned_to: 'demo-staff',
      assigned_by: null, client_id: null, supervision_session_id: null,
      notes: null, needs_reschedule: false, reschedule_requested_by: null,
    },
  ];
}
