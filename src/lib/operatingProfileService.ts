import { supabase } from '@/integrations/supabase/client';
import { OperatingProfile } from '@/types/operatingProfile';

const DEFAULT_VALUES = {
  domains: ['GROUP_PRACTICE'] as string[],
  domain_labels: { GROUP_PRACTICE: 'Group Practice', COACHING: 'Coaching Business', HOME: 'Home' },
  domain_priority: ['GROUP_PRACTICE'] as string[],
  practice_mode: 'group' as const,
  uses_referrals: true,
  has_staff: true,
  has_interns: true,
  notification_style: 'realtime' as const,
  notifications_pref: 'MEDIUM' as const,
  onboarding_complete: false,
};

// --- Session check ---

async function hasSupabaseSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data?.session?.user?.id;
}

// --- localStorage helpers ---

const LS_KEY = (ownerId: string) => `pf_operating_profile_${ownerId}`;

function migrateProfile(ownerId: string, raw: any): OperatingProfile {
  const now = new Date().toISOString();
  const base = buildDefaultProfile(ownerId);
  const merged = {
    ...base,
    ...raw,
    owner_profile_id: ownerId,
    id: raw?.id ?? base.id,
    created_at: raw?.created_at ?? base.created_at,
    updated_at: now,
  };
  if (!Array.isArray(merged.domains) || merged.domains.length === 0) merged.domains = ['GROUP_PRACTICE'];
  if (!Array.isArray(merged.domain_priority) || merged.domain_priority.length === 0) merged.domain_priority = [...merged.domains];
  return merged as OperatingProfile;
}

function readLocalProfile(ownerId: string): OperatingProfile | null {
  try {
    const raw = localStorage.getItem(LS_KEY(ownerId));
    if (!raw) return null;
    const migrated = migrateProfile(ownerId, JSON.parse(raw));
    writeLocalProfile(ownerId, migrated);
    return migrated;
  } catch {
    return null;
  }
}

function writeLocalProfile(ownerId: string, profile: OperatingProfile): void {
  localStorage.setItem(LS_KEY(ownerId), JSON.stringify(profile));
}

function buildDefaultProfile(ownerId: string): OperatingProfile {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    owner_profile_id: ownerId,
    ...DEFAULT_VALUES,
    created_at: now,
    updated_at: now,
  };
}

// --- Supabase DB helpers ---

async function createDefaultProfileInDb(ownerId: string): Promise<OperatingProfile | null> {
  const { data, error } = await supabase
    .from('operating_profiles')
    .insert({ owner_profile_id: ownerId, ...DEFAULT_VALUES })
    .select()
    .single();
  if (error) {
    console.error('Failed to create default operating profile:', error);
    return null;
  }
  return data as unknown as OperatingProfile;
}

// --- Public API ---

export async function getOperatingProfile(ownerId: string): Promise<OperatingProfile | null> {
  if (!(await hasSupabaseSession())) {
    const local = readLocalProfile(ownerId);
    if (local) return local;
    const def = buildDefaultProfile(ownerId);
    writeLocalProfile(ownerId, def);
    return def;
  }

  const { data, error } = await supabase
    .from('operating_profiles')
    .select('*')
    .eq('owner_profile_id', ownerId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch operating profile:', error);
    return null;
  }
  if (data) return data as unknown as OperatingProfile;
  return createDefaultProfileInDb(ownerId);
}

export async function saveOperatingProfile(
  ownerId: string,
  updates: Partial<OperatingProfile>,
): Promise<OperatingProfile | null> {
  if (!(await hasSupabaseSession())) {
    let profile = readLocalProfile(ownerId);
    if (!profile) profile = buildDefaultProfile(ownerId);
    const merged = { ...profile, ...updates, updated_at: new Date().toISOString() };
    writeLocalProfile(ownerId, merged);
    return merged;
  }

  let { data, error } = await supabase
    .from('operating_profiles')
    .select('*')
    .eq('owner_profile_id', ownerId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch operating profile for save:', error);
    return null;
  }

  if (!data) {
    data = (await createDefaultProfileInDb(ownerId)) as any;
    if (!data) return null;
  }

  const { owner_profile_id: _o, id: _i, created_at: _c, updated_at: _u, ...safeUpdates } = updates as any;

  const { data: updated, error: updateErr } = await supabase
    .from('operating_profiles')
    .update(safeUpdates)
    .eq('owner_profile_id', ownerId)
    .select()
    .single();

  if (updateErr) {
    console.error('Failed to update operating profile:', updateErr);
    return null;
  }
  return updated as unknown as OperatingProfile;
}
