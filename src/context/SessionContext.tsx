import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SessionContext as SessionData, AppMode } from '@/types/session';
import type { Session } from '@supabase/supabase-js';
import { DEMO_USERS } from '@/data/demoUsers';

interface SessionAPI {
  session: SessionData | null;
  isBooting: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  loginDemo: (demoUserId: string) => void;
  logout: () => Promise<void>;
  setThemePreference: (pref: 'light' | 'dark') => Promise<void>;
}

const Ctx = createContext<SessionAPI | null>(null);

const THEME_CACHE_KEY = 'pf_theme_preference';
const DEMO_THEME_CACHE_PREFIX = 'pf_demo_theme_preference_';

type ThemePreference = 'light' | 'dark';

function normalizeThemePreference(value: unknown): ThemePreference {
  return value === 'dark' ? 'dark' : 'light';
}

function applyThemePreference(pref: ThemePreference): void {
  if (pref === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function cacheThemePreference(pref: ThemePreference, demoUserId?: string): void {
  localStorage.setItem(THEME_CACHE_KEY, pref);
  if (demoUserId) {
    localStorage.setItem(`${DEMO_THEME_CACHE_PREFIX}${demoUserId}`, pref);
  }
}

function getCachedThemePreference(demoUserId?: string): ThemePreference {
  if (demoUserId) {
    const demoStored = localStorage.getItem(`${DEMO_THEME_CACHE_PREFIX}${demoUserId}`);
    if (demoStored === 'dark' || demoStored === 'light') return demoStored;
  }
  const stored = localStorage.getItem(THEME_CACHE_KEY);
  return normalizeThemePreference(stored);
}

/** Resolves device mode — must be called inside component tree */
function useDeviceMode(): AppMode {
  const isMobile = useIsMobile();
  return isMobile ? 'ACTION' : 'CONTROL';
}

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const mode = useDeviceMode();
  const isDemoModeRef = useRef(false);

  useEffect(() => {
    isDemoModeRef.current = isDemoMode;
  }, [isDemoMode]);

  // ── Boot sequence (real auth) ──
  useEffect(() => {
    if (isDemoMode) return;

    let mounted = true;
    let requestId = 0;

    const hydrateFromAuth = async (authSession: Session | null) => {
      if (isDemoModeRef.current) return;

      const currentRequest = ++requestId;
      setIsBooting(true);

      if (!authSession) {
        if (!mounted || currentRequest !== requestId || isDemoModeRef.current) return;
        setSession(null);
        setIsBooting(false);
        return;
      }

      // STEP 2-4 — Role resolve from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authSession.user.id)
        .maybeSingle();

      if (!mounted || currentRequest !== requestId || isDemoModeRef.current) return;

      if (profileError) {
        setSession(null);
        setIsBooting(false);
        return;
      }

      let resolvedProfile = profile;

      // Backfill profile when legacy users don't have one yet
      if (!resolvedProfile) {
        const fallbackTheme = getCachedThemePreference();
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .upsert(
            {
              user_id: authSession.user.id,
              email: authSession.user.email ?? null,
              full_name: (authSession.user.user_metadata?.full_name as string | undefined) ?? null,
              theme_preference: fallbackTheme,
            } as any,
            { onConflict: 'user_id' }
          )
          .select('*')
          .maybeSingle();

        if (!mounted || currentRequest !== requestId || isDemoModeRef.current) return;

        if (createError || !createdProfile) {
          setSession(null);
          setIsBooting(false);
          return;
        }

        resolvedProfile = createdProfile;
      }

      // STEP 6 — Workspace load
      let workspaceName: string | null = null;
      if (resolvedProfile.practice_id) {
        const { data: practice } = await supabase
          .from('practices')
          .select('name')
          .eq('id', resolvedProfile.practice_id)
          .maybeSingle();
        if (practice) workspaceName = practice.name;
      }

      if (!mounted || currentRequest !== requestId || isDemoModeRef.current) return;

      const themePref = normalizeThemePreference(resolvedProfile.theme_preference);

      // Apply theme before rendering dashboard content
      applyThemePreference(themePref);
      cacheThemePreference(themePref);

      setSession({
        user_id: resolvedProfile.user_id,
        practice_id: resolvedProfile.practice_id,
        role: resolvedProfile.role as SessionData['role'],
        clinician_subtype: (resolvedProfile.clinician_subtype as SessionData['clinician_subtype']) ?? null,
        intern_subtype: (resolvedProfile.intern_subtype as SessionData['intern_subtype']) ?? null,
        mode,
        visibility_scope: [],
        workflow_scope: [],
        onboarding_complete: resolvedProfile.onboarding_complete ?? false,
        workspace_name: workspaceName,
        full_name: resolvedProfile.full_name,
        email: resolvedProfile.email,
        theme_preference: themePref,
      });
      setIsBooting(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (!mounted || isDemoModeRef.current) return;
      void hydrateFromAuth(authSession);
    });

    void supabase.auth.getSession().then(({ data: { session: authSession } }) => {
      if (!mounted || isDemoModeRef.current) return;
      void hydrateFromAuth(authSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [isDemoMode, mode]);

  // ── Demo login ──
  const loginDemo = useCallback((demoUserId: string) => {
    const demo = DEMO_USERS.find(u => u.id === demoUserId);
    if (!demo) return;

    const demoTheme = getCachedThemePreference(demo.id);
    applyThemePreference(demoTheme);
    cacheThemePreference(demoTheme, demo.id);

    isDemoModeRef.current = true;
    setIsDemoMode(true);
    setSession({
      user_id: demo.id,
      practice_id: demo.practice_id,
      role: demo.role,
      clinician_subtype: demo.clinician_subtype,
      intern_subtype: demo.intern_subtype,
      mode,
      visibility_scope: [],
      workflow_scope: [],
      onboarding_complete: demo.onboarding_complete,
      workspace_name: demo.workspace_name,
      full_name: demo.full_name,
      email: demo.email,
      theme_preference: demoTheme,
    });
    setIsBooting(false);
  }, [mode]);

  // ── Real login ──
  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });
    return { error: error?.message ?? null };
  }, []);

  // ── Logout ──
  const logout = useCallback(async () => {
    if (!isDemoMode) {
      await supabase.auth.signOut();
    }
    isDemoModeRef.current = false;
    document.documentElement.classList.remove('dark');
    setSession(null);
    setIsDemoMode(false);
    setIsBooting(false);
  }, [isDemoMode]);

  // ── Theme preference ──
  const setThemePreference = useCallback(async (pref: 'light' | 'dark') => {
    const normalized = normalizeThemePreference(pref);

    applyThemePreference(normalized);
    cacheThemePreference(normalized, isDemoMode ? session?.user_id : undefined);
    setSession(prev => (prev ? { ...prev, theme_preference: normalized } : prev));

    if (isDemoMode) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          email: session?.email ?? user.email ?? null,
          full_name: session?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? null,
          theme_preference: normalized,
        } as any,
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Failed to persist theme preference:', error.message);
    }
  }, [isDemoMode, session?.email, session?.full_name, session?.user_id]);

  // Keep mode in sync when device changes
  useEffect(() => {
    if (session && session.mode !== mode) {
      setSession(prev => (prev ? { ...prev, mode } : prev));
    }
  }, [mode, session]);

  const isAuthenticated = session !== null;

  return (
    <Ctx.Provider value={{ session, isBooting, isAuthenticated, isDemoMode, login, loginDemo, logout, setThemePreference }}>
      {isBooting ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-lg">SF</span>
            </div>
            <p className="text-muted-foreground text-lg font-medium animate-pulse">
              Preparing your workspace…
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </Ctx.Provider>
  );
};

export function useSession(): SessionAPI {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

/** Convenience: get the resolved session data (throws if not authenticated) */
export function useSessionData(): SessionData {
  const { session } = useSession();
  if (!session) throw new Error('useSessionData called before session resolved');
  return session;
}
