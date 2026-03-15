import type { SessionContext } from '@/types/session';

/** Returns the dashboard route for a resolved session */
export function getDashboardRoute(session: SessionContext): string {
  if (!session.onboarding_complete && session.role === 'OWNER') {
    return '/onboarding';
  }

  switch (session.role) {
    case 'OWNER':
      return '/dashboard/owner';
    case 'PARTNER':
      return '/dashboard/partner/group-practice';
    case 'ADMIN':
      return '/dashboard/admin';
    case 'SUPERVISOR':
      return '/dashboard/supervisor';
    case 'CLINICIAN':
      return '/dashboard/clinician';
    case 'INTERN':
      return session.intern_subtype === 'BUSINESS'
        ? '/dashboard/intern/business'
        : '/dashboard/intern/clinical';
    case 'STAFF':
      return '/dashboard/staff';
    default:
      return '/login';
  }
}

/** Public routes that don't require authentication */
export const PUBLIC_ROUTES = ['/login', '/register', '/password-reset', '/reset-password'];
