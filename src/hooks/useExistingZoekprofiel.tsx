
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useExistingZoekprofiel = () => {
  const { user } = useAuth();
  const [hasExistingZoekprofiel, setHasExistingZoekprofiel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingZoekprofiel, setExistingZoekprofiel] = useState<any>(null);

  useEffect(() => {
    const checkExistingZoekprofiel = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Checking for existing zoekprofiel...');
        
        const { data, error } = await supabase
          .from('user_zoekprofielen')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Error checking existing zoekprofiel:', error);
          return;
        }

        if (data) {
          console.log('✅ Found existing zoekprofiel:', data);
          setHasExistingZoekprofiel(true);
          setExistingZoekprofiel(data);
        } else {
          console.log('📝 No existing zoekprofiel found');
          setHasExistingZoekprofiel(false);
          setExistingZoekprofiel(null);
        }
      } catch (error) {
        console.error('❌ Failed to check existing zoekprofiel:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingZoekprofiel();
  }, [user?.id]);

  return {
    hasExistingZoekprofiel,
    existingZoekprofiel,
    loading
  };
};
