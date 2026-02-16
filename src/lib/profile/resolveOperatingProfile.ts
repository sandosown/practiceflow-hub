/**
 * Operating Profile Resolver — safe defaults for any user.
 * Reads from localStorage (key: "operating_profile") or returns DEFAULT.
 * Never gates app behavior on onboarding completion.
 */

export interface ResolvedOperatingProfile {
  domains: string[];
  priority_order: string[];
  notification_intensity: 'command_center' | 'low' | 'medium' | 'high';
  profile_source: 'default' | 'saved';
}

const DEFAULT_PROFILE: ResolvedOperatingProfile = {
  domains: ['group_practice'],
  priority_order: ['group_practice'],
  notification_intensity: 'command_center',
  profile_source: 'default',
};

export function resolveOperatingProfile(): ResolvedOperatingProfile {
  try {
    const raw = localStorage.getItem('operating_profile');
    if (!raw) return { ...DEFAULT_PROFILE };

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.domains) || parsed.domains.length === 0) {
      return { ...DEFAULT_PROFILE };
    }

    return {
      domains: parsed.domains,
      priority_order: Array.isArray(parsed.priority_order) ? parsed.priority_order : [...parsed.domains],
      notification_intensity: parsed.notification_intensity ?? 'command_center',
      profile_source: 'saved',
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}
