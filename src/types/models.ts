export type UserRole = 'OWNER' | 'THERAPIST' | 'INTERN';

export type ReferralStatus =
  | 'NEW'
  | 'ACKNOWLEDGED'
  | 'CONTACT_IN_PROGRESS'
  | 'APPT_SCHEDULED'
  | 'INTAKE_BLOCKED'
  | 'INTAKE_READY';

export type ContactOutcome = 'SCHEDULED' | 'PENDING' | 'NO_CONTACT';

export type WorkspaceType = 'PRACTICE' | 'COACHING' | 'HOME';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  notification_prefs_json: Record<string, boolean>;
}

export interface RoleWorkspace {
  id: string;
  owner_profile_id: string;
  name: string;
  type: WorkspaceType;
}

export interface Referral {
  id: string;
  workspace_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  assigned_to_profile_id: string | null;
  created_by_profile_id: string;
  status: ReferralStatus;
  acknowledge_by: string;
  contact_by: string;
  first_session_date: string | null;
  created_at: string;
}

export interface ReferralChecklist {
  referral_id: string;
  ack_done: boolean;
  contact_outcome: ContactOutcome | null;
  intake_ack_signed_in_ehr: boolean;
  intake_missing_payment_auth: boolean;
  intake_missing_consent: boolean;
  intake_missing_privacy: boolean;
}

export type RadarBucket = 'do_now' | 'waiting' | 'coming_up';
