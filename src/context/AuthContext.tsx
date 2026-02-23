import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserProfile } from '@/types/models';
import { MOCK_USERS } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginDemo: (userId: string) => void;
  logout: () => Promise<void>;
  completeProfile: () => void;
  switchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
  user: null,
  isAuthenticated: false,
  isProfileComplete: false,
  isLoading: true
});

useEffect(() => {

  let mounted = true;

  const load = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!mounted) return;

    if (!session) {
  setState({
    user: null,
    isAuthenticated: false,
    isProfileComplete: false,
    isLoading: false
  });
  return;
}

    const isProfileComplete = localStorage.getItem(`pf_profile_${session.user.id}`) === 'true';

    const user = {
      id: session.user.id,
      email: session.user.email ?? ''
    } as unknown as UserProfile;

    setState({
      user,
      isAuthenticated: true,
      isProfileComplete,
      isLoading: false
    });
  };

  load();

  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!mounted) return;

    if (!session) {
      setState({
        user: null,
        isAuthenticated: false,
        isProfileComplete: false,
        isLoading: false
      });
      return;
    }

    const isProfileComplete = localStorage.getItem(`pf_profile_${session.user.id}`) === 'true';

    const user = {
      id: session.user.id,
      email: session.user.email ?? ''
    } as unknown as UserProfile;

    setState({
      user,
      isAuthenticated: true,
      isProfileComplete,
      isLoading: false
    });
  });

  return () => {
    mounted = false;
    sub.subscription.unsubscribe();
  };
}, []);


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
  isProfileComplete: false,
  isLoading: false
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

  const loginDemo = useCallback((userId: string) => {
    const demoUser = MOCK_USERS.find(u => u.id === userId);
    if (!demoUser) return;
    setState({
      user: demoUser,
      isAuthenticated: true,
      isProfileComplete: true,
      isLoading: false,
    });
  }, []);

  const switchUser = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      setState({
        user: null,
        isAuthenticated: false,
        isProfileComplete: false,
        isLoading: false
      });
      return;
    }

    const isProfileComplete =
      localStorage.getItem(`pf_profile_${data.user.id}`) === 'true';

    setState(prev => ({
      ...prev,
      user: {
        id: data.user.id,
        email: data.user.email ?? ''
      } as any,
      isAuthenticated: true,
      isProfileComplete,
      isLoading: false
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, loginDemo, logout, completeProfile, switchUser }}>
      {state.isLoading ? <div style={{ padding: 16 }}>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
