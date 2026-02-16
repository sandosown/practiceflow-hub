export interface OperatingProfile {
  id: string;
  owner_profile_id: string;
  domains: {
    practice: boolean;
    coaching: boolean;
    home: boolean;
  };
  practice_mode: 'solo' | 'group';
  uses_referrals: boolean;
  has_staff: boolean;
  has_interns: boolean;
  notification_style: 'realtime' | 'daily_digest';
  created_at: string;
  updated_at: string;
}
