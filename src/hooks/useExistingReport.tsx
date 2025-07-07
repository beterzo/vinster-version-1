
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useExistingReport = () => {
  const { user } = useAuth();
  const [hasExistingReport, setHasExistingReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingReport, setExistingReport] = useState<any>(null);

  useEffect(() => {
    const checkExistingReport = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Checking for existing user report...');
        
        const { data, error } = await supabase
          .from('user_reports')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Error checking existing report:', error);
          return;
        }

        if (data) {
          console.log('✅ Found existing report:', data);
          setHasExistingReport(true);
          setExistingReport(data);
        } else {
          console.log('📝 No existing report found');
          setHasExistingReport(false);
          setExistingReport(null);
        }
      } catch (error) {
        console.error('❌ Failed to check existing report:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingReport();
  }, [user?.id]);

  return {
    hasExistingReport,
    existingReport,
    loading
  };
};
