import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OperatingProfile } from '@/types/operatingProfile';
import { getOperatingProfile, saveOperatingProfile } from '@/lib/operatingProfileService';
import { useAuth } from '@/context/AuthContext';

interface OperatingProfileContextType {
  profile: OperatingProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  save: (updates: Partial<OperatingProfile>) => Promise<void>;
}

const OperatingProfileContext = createContext<OperatingProfileContextType>({
  profile: null,
  loading: true,
  refresh: async () => {},
  save: async () => {},
});

export const OperatingProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isProfileComplete } = useAuth();
  const [profile, setProfile] = useState<OperatingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwner = isAuthenticated && isProfileComplete && user?.role === 'OWNER';
  const ownerId = isOwner ? user!.id : null;

  const refresh = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    const result = await getOperatingProfile(ownerId);
    setProfile(result);
    setLoading(false);
  }, [ownerId]);

  const save = useCallback(async (updates: Partial<OperatingProfile>) => {
    if (!ownerId) return;
    const result = await saveOperatingProfile(ownerId, updates);
    if (result) setProfile(result);
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getOperatingProfile(ownerId).then((result) => {
      if (!cancelled) {
        setProfile(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [ownerId]);

  return (
    <OperatingProfileContext.Provider value={{ profile, loading, refresh, save }}>
      {children}
    </OperatingProfileContext.Provider>
  );
};

export const useOperatingProfile = () => useContext(OperatingProfileContext);
