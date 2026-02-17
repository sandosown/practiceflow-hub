// Group Practice module mock data store (localStorage-backed)
import { MOCK_USERS } from './mockData';

const STORAGE_PREFIX = 'pf_gp_';

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

// ---- Types ----
export interface GpAnnouncement {
  id: string; workspace_id: string; title: string; body: string;
  pinned: boolean; created_by_profile_id: string; created_at: string; updated_at: string;
}
export interface GpStaffUpdate {
  id: string; workspace_id: string; author_profile_id: string; body: string;
  visibility: 'all' | 'owner_only'; created_at: string;
}
export interface GpResource {
  id: string; workspace_id: string; category: 'emergency' | 'handbook' | 'policies' | 'procedures' | 'other';
  title: string; resource_type: 'link' | 'text'; url: string | null; content: string | null; updated_at: string;
}
export interface GpSupervisionSession {
  id: string; workspace_id: string; facilitator_profile_id: string;
  day_of_week: number; time: string; location_mode: 'virtual' | 'in_person' | 'hybrid';
  location_detail: string | null; notes: string | null;
}
export interface GpWorkerProfile {
  id: string; workspace_id: string; worker_profile_id: string;
  status: 'draft' | 'submitted' | 'changes_requested' | 'approved';
  review_note: string | null; reviewed_by_profile_id: string | null; reviewed_at: string | null;
  submitted_at: string | null; created_at: string; updated_at: string;
  email: string; first_name: string; last_name: string; date_of_birth: string;
  license_type: string; caqh_number: string; npi_number: string;
  address: string; city: string; county: string; state: string; zip_code: string;
  populations_served: string[]; provider_ethnicity: string[];
}
export interface GpClient {
  id: string; workspace_id: string; first_name: string; last_name: string;
  date_of_birth: string | null; location: string | null;
  status: 'active' | 'inactive'; primary_clinician_profile_id: string | null;
  created_at: string; updated_at: string;
}
export interface GpTreatmentPlanCycle {
  id: string; workspace_id: string; client_id: string; cycle_key: string;
  due_date: string; assigned_to_profile_id: string | null;
  state: 'not_started' | 'started' | 'editing' | 'done' | 'sent_for_approval' | 'approved';
  updated_at: string; submitted_at: string | null; approved_at: string | null; approved_by_profile_id: string | null;
}
export interface GpPayer {
  id: string; workspace_id: string; payer_name: string; payer_id: string;
  claims_address: string; submission_deadlines: string;
  contact_name: string; contact_phone: string; contact_email: string; notes: string;
}
export interface GpVendor {
  id: string; workspace_id: string; vendor_name: string;
  main_contact_name: string; main_contact_phone: string; main_contact_email: string;
  documents_due_date: string | null; invoice_submission_window: string | null;
  notes_submission_timeframe: string | null; notes: string;
}

// ---- Seed data ----
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const SEED_ANNOUNCEMENTS: GpAnnouncement[] = [
  { id: uid(), workspace_id: 'w1', title: 'Holiday Schedule Update', body: 'Office will be closed Dec 24-25. Please reschedule clients accordingly.', pinned: true, created_by_profile_id: 'u1', created_at: now(), updated_at: now() },
  { id: uid(), workspace_id: 'w1', title: 'New EHR Training', body: 'Mandatory training on the new EHR system next Thursday at 2pm.', pinned: false, created_by_profile_id: 'u1', created_at: now(), updated_at: now() },
];

const SEED_CLIENTS: GpClient[] = [
  { id: 'c1', workspace_id: 'w1', first_name: 'Maria', last_name: 'Gonzalez', date_of_birth: '1990-03-15', location: 'Austin, TX', status: 'active', primary_clinician_profile_id: 'u2', created_at: now(), updated_at: now() },
  { id: 'c2', workspace_id: 'w1', first_name: 'David', last_name: 'Chen', date_of_birth: '1985-07-22', location: 'Austin, TX', status: 'active', primary_clinician_profile_id: 'u2', created_at: now(), updated_at: now() },
  { id: 'c3', workspace_id: 'w1', first_name: 'Aisha', last_name: 'Johnson', date_of_birth: '1992-11-01', location: 'Round Rock, TX', status: 'active', primary_clinician_profile_id: 'u3', created_at: now(), updated_at: now() },
  { id: 'c4', workspace_id: 'w1', first_name: 'Tom', last_name: 'Bradley', date_of_birth: '1978-06-10', location: 'Austin, TX', status: 'inactive', primary_clinician_profile_id: 'u2', created_at: now(), updated_at: now() },
];

// ---- CRUD helpers ----
export function gpStore<T extends { id: string }>(key: string, seed: T[] = []) {
  return {
    getAll: (): T[] => load<T>(key, seed),
    get: (id: string): T | undefined => load<T>(key, seed).find(i => i.id === id),
    create: (item: T) => { const all = load<T>(key, seed); all.unshift(item); save(key, all); return item; },
    update: (id: string, patch: Partial<T>) => {
      const all = load<T>(key, seed);
      const idx = all.findIndex(i => i.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; save(key, all); }
      return all[idx];
    },
    remove: (id: string) => { const all = load<T>(key, seed).filter(i => i.id !== id); save(key, all); },
    replace: (items: T[]) => save(key, items),
  };
}

export const announcementsStore = gpStore<GpAnnouncement>('announcements', SEED_ANNOUNCEMENTS);
export const staffUpdatesStore = gpStore<GpStaffUpdate>('staff_updates', []);
export const resourcesStore = gpStore<GpResource>('resources', []);
export const supervisionStore = gpStore<GpSupervisionSession>('supervision', []);
export const workerProfilesStore = gpStore<GpWorkerProfile>('worker_profiles', []);
export const clientsStore = gpStore<GpClient>('clients', SEED_CLIENTS);
export const treatmentCyclesStore = gpStore<GpTreatmentPlanCycle>('treatment_cycles', []);
export const payersStore = gpStore<GpPayer>('payers', []);
export const vendorsStore = gpStore<GpVendor>('vendors', []);

export const POPULATIONS_OPTIONS = [
  'Adolescents', 'Adults', 'Blind/Visually Impaired', 'Children 0-5', 'Children 6-12',
  'Christian Religious', 'Couples', 'Deaf/Hearing Impaired', 'First Responders', 'Geriatric',
  'Law Enforcement', 'LGBTQ', "Men's Issues", 'Military', 'Minority Multicultural',
  'Trauma Victims', 'Veterans', "Women's Issues",
];

export const ETHNICITY_OPTIONS = [
  'American Indian/Alaskan Native', 'Asian', 'Black/African American',
  'Hispanic/Latino', 'Native Hawaiian/Other Pacific Islander', 'White/Caucasian',
];

export function getWorkerName(id: string) {
  return MOCK_USERS.find(u => u.id === id)?.full_name ?? 'Unknown';
}
