export type AppRole = 'OWNER' | 'ADMIN' | 'SUPERVISOR' | 'CLINICIAN' | 'INTERN' | 'STAFF';
export type ClinicianSubtype = 'LICENSED' | 'LP' | null;
export type InternSubtype = 'CLINICAL' | 'BUSINESS' | null;
export type AppMode = 'CONTROL' | 'ACTION';

export interface SessionContext {
  user_id: string;
  practice_id: string | null;
  role: AppRole;
  clinician_subtype: ClinicianSubtype;
  intern_subtype: InternSubtype;
  mode: AppMode;
  visibility_scope: string[];
  workflow_scope: string[];
  onboarding_complete: boolean;
  workspace_name: string | null;
  full_name: string | null;
  email: string | null;
  theme_preference: 'light' | 'dark';
}

export interface DemoUser {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  clinician_subtype: ClinicianSubtype;
  intern_subtype: InternSubtype;
  practice_id: string;
  workspace_name: string;
  onboarding_complete: boolean;
}
