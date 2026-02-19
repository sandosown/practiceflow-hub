import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile } from '@/types/models';
import { MOCK_USERS } from '@/data/mockData';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  completeProfile: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('pf_auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      const user = MOCK_USERS.find(u => u.id === parsed.userId) || null;
      return { user, isAuthenticated: !!user, isProfileComplete: parsed.profileComplete ?? false };
    }
    return { user: null, isAuthenticated: false, isProfileComplete: false };
  });

  const login = useCallback((email: string, password: string) => {
  const normalizedEmail = (email ?? '').trim().toLowerCase();
  const normalizedPassword = (password ?? '').trim();

  // Enforce password: fail closed if missing
  if (!normalizedEmail || !normalizedPassword) return false;

  const user = MOCK_USERS.find(u => (u.email ?? '').trim().toLowerCase() === normalizedEmail);
  if (!user) return false;

  // Enforce password match against mock user record
  // Assumes MOCK_USERS entries include a `password` field (string).
  // If not present, login should fail (security > convenience).
  const userPassword = (user as any).password;
  if (typeof userPassword !== 'string' || userPassword.trim() !== normalizedPassword) {
    return false;
  }

  const profileComplete = localStorage.getItem(`pf_profile_${user.id}`) === 'true';
  setState({ user, isAuthenticated: true, isProfileComplete: profileComplete });
  localStorage.setItem('pf_auth', JSON.stringify({ userId: user.id, profileComplete }));
  return true;
}, []);
  const logout = useCallback(() => {
  setState({ user: null, isAuthenticated: false, isProfileComplete: false });
  localStorage.removeItem('pf_auth');
}, []);



  const completeProfile = useCallback(() => {
    setState(prev => {
      if (prev.user) {
        localStorage.setItem(`pf_profile_${prev.user.id}`, 'true');
        localStorage.setItem('pf_auth', JSON.stringify({ userId: prev.user.id, profileComplete: true }));
      }
      return { ...prev, isProfileComplete: true };
    });
  }, []);

  const switchUser = useCallback((userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      const profileComplete = localStorage.getItem(`pf_profile_${user.id}`) === 'true';
      setState({ user, isAuthenticated: true, isProfileComplete: profileComplete });
      localStorage.setItem('pf_auth', JSON.stringify({ userId: user.id, profileComplete }));
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
