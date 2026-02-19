import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserProfile } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeProfile: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
  user: null,
  isAuthenticated: false,
  isProfileComplete: false
});

useEffect(() => {

  let mounted = true;

  const load = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!mounted) return;

    if (!session) {
      setState({ user: null, isAuthenticated: false, isProfileComplete: false });
      return;
    }

    const user = {
      id: session.user.id,
      email: session.user.email ?? ''
    } as unknown as UserProfile;

    setState({
      user,
      isAuthenticated: true,
      isProfileComplete: true
    });
  };

  load();

  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!mounted) return;

    if (!session) {
      setState({ user: null, isAuthenticated: false, isProfileComplete: false });
      return;
    }

    const user = {
      id: session.user.id,
      email: session.user.email ?? ''
    } as unknown as UserProfile;

    setState({ user, isAuthenticated: true, isProfileComplete: true });
  });

  return () => {
    mounted = false;
    sub.subscription.unsubscribe();
  };
}, []);

  user: null,
  isAuthenticated: false,
  isProfileComplete: false
});


  const login = useCallback(async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password.trim()
  });

  return !error;
}, []);

  const logout = useCallback(async () => {
  await supabase.auth.signOut();

  setState({
    user: null,
    isAuthenticated: false,
    isProfileComplete: false
  });
}, []);




  const completeProfile = useCallback(() => {
    setState(prev => {
      if (prev.user) {
        localStorage.setItem(`pf_profile_${prev.user.id}`, 'true');
        
      }
      return { ...prev, isProfileComplete: true };
    });
  }, []);

  const switchUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();

if (!data?.user) return;

setState(prev => ({
  ...prev,
  user: {
    id: data.user.id,
    email: data.user.email ?? '',
  } as any,
  isAuthenticated: true
}));

     
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, completeProfile, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
