import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCustomCategories(userId: string, modalType: string, isDemoMode: boolean) {
  const [custom, setCustom] = useState<string[]>([]);

  const fetch = useCallback(async () => {
    if (isDemoMode || !userId) return;
    const { data } = await supabase
      .from('finance_custom_categories')
      .select('category_name')
      .eq('user_id', userId)
      .eq('modal_type', modalType);
    if (data) setCustom(data.map(d => d.category_name));
  }, [userId, modalType, isDemoMode]);

  useEffect(() => { fetch(); }, [fetch]);

  const addCategory = useCallback(async (name: string) => {
    if (isDemoMode) {
      // In demo mode, just add locally
      setCustom(prev => [...prev, name]);
      return;
    }
    const { error } = await supabase.from('finance_custom_categories').insert({
      user_id: userId,
      modal_type: modalType,
      category_name: name,
    } as any);
    if (!error) setCustom(prev => [...prev, name]);
  }, [userId, modalType, isDemoMode]);

  return { customCategories: custom, addCategory };
}
