import { UserProfile, RoleWorkspace, Referral, ReferralChecklist } from '@/types/models';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    full_name: 'Dr. Sarah Mitchell',
    email: 'sarah@practiceflow.io',
    phone: '(555) 100-0001',
    role: 'OWNER',
    status: 'active',
    notification_prefs_json: { email: true, in_app: true },
  },
  {
    id: 'u2',
    full_name: 'James Rivera, LCSW',
    email: 'james@practiceflow.io',
    phone: '(555) 100-0002',
    role: 'THERAPIST',
    status: 'active',
    notification_prefs_json: { email: true, in_app: true },
  },
  {
    id: 'u3',
    full_name: 'Priya Patel, Intern',
    email: 'priya@practiceflow.io',
    phone: '(555) 100-0003',
    role: 'INTERN',
    status: 'active',
    notification_prefs_json: { email: true, in_app: false },
  },
];

export const MOCK_WORKSPACES: RoleWorkspace[] = [
  { id: 'w1', owner_profile_id: 'u1', name: 'Clarity Counseling Group', type: 'PRACTICE' },
  { id: 'w2', owner_profile_id: 'u1', name: 'Mitchell Coaching', type: 'COACHING' },
  { id: 'w3', owner_profile_id: 'u1', name: 'Home', type: 'HOME' },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'r1', workspace_id: 'w1', client_name: 'Maria Gonzalez', client_phone: '(555) 200-0001',
    client_email: 'maria.g@email.com', assigned_to_profile_id: 'u2', created_by_profile_id: 'u1',
    status: 'NEW', acknowledge_by: fmt(today), contact_by: fmt(addDays(today, 1)),
    first_session_date: null, created_at: fmt(addDays(today, -1)),
  },
  {
    id: 'r2', workspace_id: 'w1', client_name: 'David Chen', client_phone: '(555) 200-0002',
    client_email: 'david.c@email.com', assigned_to_profile_id: 'u2', created_by_profile_id: 'u1',
    status: 'ACKNOWLEDGED', acknowledge_by: fmt(addDays(today, -2)), contact_by: fmt(today),
    first_session_date: null, created_at: fmt(addDays(today, -3)),
  },
  {
    id: 'r3', workspace_id: 'w1', client_name: 'Aisha Johnson', client_phone: '(555) 200-0003',
    client_email: 'aisha.j@email.com', assigned_to_profile_id: 'u3', created_by_profile_id: 'u1',
    status: 'CONTACT_IN_PROGRESS', acknowledge_by: fmt(addDays(today, -3)), contact_by: fmt(addDays(today, -1)),
    first_session_date: null, created_at: fmt(addDays(today, -4)),
  },
  {
    id: 'r4', workspace_id: 'w1', client_name: 'Tom Bradley', client_phone: '(555) 200-0004',
    client_email: 'tom.b@email.com', assigned_to_profile_id: 'u2', created_by_profile_id: 'u1',
    status: 'APPT_SCHEDULED', acknowledge_by: fmt(addDays(today, -5)), contact_by: fmt(addDays(today, -3)),
    first_session_date: fmt(addDays(today, 3)), created_at: fmt(addDays(today, -6)),
  },
  {
    id: 'r5', workspace_id: 'w1', client_name: 'Lena Kowalski', client_phone: '(555) 200-0005',
    client_email: 'lena.k@email.com', assigned_to_profile_id: 'u3', created_by_profile_id: 'u1',
    status: 'INTAKE_BLOCKED', acknowledge_by: fmt(addDays(today, -4)), contact_by: fmt(addDays(today, -2)),
    first_session_date: fmt(addDays(today, 2)), created_at: fmt(addDays(today, -5)),
  },
  {
    id: 'r6', workspace_id: 'w1', client_name: 'Ray Thompson', client_phone: '(555) 200-0006',
    client_email: 'ray.t@email.com', assigned_to_profile_id: null, created_by_profile_id: 'u1',
    status: 'NEW', acknowledge_by: fmt(addDays(today, 2)), contact_by: fmt(addDays(today, 4)),
    first_session_date: null, created_at: fmt(today),
  },
];

export const MOCK_CHECKLISTS: Record<string, ReferralChecklist> = {
  r4: { referral_id: 'r4', ack_done: true, contact_outcome: 'SCHEDULED', intake_ack_signed_in_ehr: true, intake_missing_payment_auth: false, intake_missing_consent: false, intake_missing_privacy: false },
  r5: { referral_id: 'r5', ack_done: true, contact_outcome: 'SCHEDULED', intake_ack_signed_in_ehr: false, intake_missing_payment_auth: true, intake_missing_consent: true, intake_missing_privacy: false },
};

export const COACHING_STUB_CARDS = [
  { id: 'cs1', title: 'Follow up with Alex B.', bucket: 'do_now' as const, detail: 'Session feedback overdue' },
  { id: 'cs2', title: 'Prep group workshop materials', bucket: 'coming_up' as const, detail: 'Due in 2 days' },
  { id: 'cs3', title: 'Invoice pending — Marcus T.', bucket: 'waiting' as const, detail: 'Awaiting payment confirmation' },
];

export const HOME_STUB_CARDS = [
  { id: 'hs1', title: 'Schedule HVAC maintenance', bucket: 'do_now' as const, detail: 'Filter replacement overdue' },
  { id: 'hs2', title: 'Renew home insurance', bucket: 'coming_up' as const, detail: 'Expires in 10 days' },
];
