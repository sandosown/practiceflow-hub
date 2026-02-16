import React, { createContext, useContext, useState, useEffect } from 'react';
import { OperatingProfile } from '@/types/operatingProfile';
import { getOperatingProfile } from '@/lib/operatingProfileService';
import { useAuth } from '@/context/AuthContext';

interface OperatingProfileContextType {
  profile: OperatingProfile | null;
  loading: boolean;
}

const OperatingProfileContext = createContext<OperatingProfileContextType>({
  profile: null,
  loading: true,
});

export const OperatingProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isProfileComplete } = useAuth();
  const [profile, setProfile] = useState<OperatingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isProfileComplete || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Only owners have operating profiles
    if (user.role !== 'OWNER') {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getOperatingProfile(user.id).then((result) => {
      if (!cancelled) {
        setProfile(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [user, isAuthenticated, isProfileComplete]);

  return (
    <OperatingProfileContext.Provider value={{ profile, loading }}>
      {children}
    </OperatingProfileContext.Provider>
  );
};

export const useOperatingProfile = () => useContext(OperatingProfileContext);
