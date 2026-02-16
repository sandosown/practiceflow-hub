export interface OperatingProfile {
  id: string;
  owner_profile_id: string;
  domains: string[];
  domain_labels: Record<string, string>;
  domain_priority: string[];
  practice_mode: 'solo' | 'group';
  uses_referrals: boolean;
  has_staff: boolean;
  has_interns: boolean;
  notification_style: 'realtime' | 'daily_digest';
  notifications_pref: 'LOW' | 'MEDIUM' | 'HIGH';
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}
