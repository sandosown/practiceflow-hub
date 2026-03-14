import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SessionContext as SessionData, AppMode, DemoUser } from '@/types/session';
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
  const bootedRef = useRef(false);

  // ── Boot sequence (real auth) ──
  useEffect(() => {
    if (isDemoMode) return; // skip if demo

    let mounted = true;

    const boot = async () => {
      setIsBooting(true);

      // STEP 1 — Auth check
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!authSession) {
        setSession(null);
        setIsBooting(false);
        return;
      }

      // STEP 2-4 — Role resolve from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authSession.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error || !profile) {
        // Profile doesn't exist yet — treat as new user
        setSession(null);
        setIsBooting(false);
        return;
      }

      // STEP 5 — Mode (handled by useDeviceMode hook, injected below)
      // STEP 6 — Workspace load
      let workspaceName: string | null = null;
      if (profile.practice_id) {
        const { data: practice } = await supabase
          .from('practices')
          .select('name')
          .eq('id', profile.practice_id)
          .maybeSingle();
        if (practice) workspaceName = practice.name;
      }

      if (!mounted) return;

      setSession({
        user_id: profile.user_id,
        practice_id: profile.practice_id,
        role: profile.role as SessionData['role'],
        clinician_subtype: (profile.clinician_subtype as SessionData['clinician_subtype']) ?? null,
        intern_subtype: (profile.intern_subtype as SessionData['intern_subtype']) ?? null,
        mode, // injected from hook
        visibility_scope: [],
        workflow_scope: [],
        onboarding_complete: profile.onboarding_complete ?? false,
        workspace_name: workspaceName,
        full_name: profile.full_name,
        email: profile.email,
      });
      setIsBooting(false);
    };

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (!mounted || isDemoMode) return;
      if (!authSession) {
        setSession(null);
        setIsBooting(false);
        return;
      }
      // Re-boot on auth change
      boot();
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
    setSession(null);
    setIsDemoMode(false);
    setIsBooting(false);
  }, [isDemoMode]);

  // Keep mode in sync when device changes
  useEffect(() => {
    if (session && session.mode !== mode) {
      setSession(prev => prev ? { ...prev, mode } : prev);
    }
  }, [mode, session]);

  const isAuthenticated = session !== null;

  return (
    <Ctx.Provider value={{ session, isBooting, isAuthenticated, isDemoMode, login, loginDemo, logout }}>
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
