import { supabase } from '@/integrations/supabase/client';
import { OperatingProfile } from '@/types/operatingProfile';

const DEFAULT_PROFILE = {
  domains: { practice: true, coaching: true, home: true },
  practice_mode: 'group',
  uses_referrals: true,
  has_staff: true,
  has_interns: true,
  notification_style: 'realtime',
} as const;

async function createDefaultProfile(ownerId: string): Promise<OperatingProfile | null> {
  const { data, error } = await supabase
    .from('operating_profiles')
    .insert({
      owner_profile_id: ownerId,
      ...DEFAULT_PROFILE,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create default operating profile:', error);
    return null;
  }

  return data as unknown as OperatingProfile;
}

export async function getOperatingProfile(ownerId: string): Promise<OperatingProfile | null> {
  const { data, error } = await supabase
    .from('operating_profiles')
    .select('*')
    .eq('owner_profile_id', ownerId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch operating profile:', error);
    return null;
  }

  if (data) {
    return data as unknown as OperatingProfile;
  }

  return createDefaultProfile(ownerId);
}
