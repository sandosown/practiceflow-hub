export interface StaffEntry {
  name: string;
  firstName: string;
  role: string;
  id: string;
  status: 'active' | 'inactive';
  email?: string;
  clinicianSubtype?: string | null;
  internSubtype?: string | null;
  joinedAt?: string;
  // Contextual data
  activeClients?: number;
  licenseDaysLeft?: number | null;
  licenseType?: string | null;
  licenseNumber?: string | null;
  licenseState?: string | null;
  licenseExpiry?: string | null;
  caqhNumber?: string | null;
  npiNumber?: string | null;
  superviseeCount?: number;
  supervisorName?: string | null;
  lastActive?: string | null;
  grantedPermissions?: string[];
}

export interface ContextLine {
  text: string;
  warn?: boolean;
}

export interface StaffContextInfo {
  lines: ContextLine[];
}
