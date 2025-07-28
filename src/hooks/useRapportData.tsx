
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useJourneyReset } from '@/contexts/JourneyResetContext';

interface RapportData {
  id: string;
  user_id: string;
  report_data: any;
  report_status: string;
  pdf_file_path: string | null;
  pdf_generated_at: string | null;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useRapportData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { registerRefreshCallback, unregisterRefreshCallback } = useJourneyReset();
  const [data, setData] = useState<RapportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRapportData();
    }
  }, [user]);

  // Register for journey reset refresh
  useEffect(() => {
    const refreshCallback = () => {
      console.log('🔄 Refreshing rapport data after journey reset');
      setData(null);
      setLoading(true);
      if (user) {
        loadRapportData();
      }
    };

    registerRefreshCallback(refreshCallback);
    return () => unregisterRefreshCallback(refreshCallback);
  }, [user, registerRefreshCallback, unregisterRefreshCallback]);

  const loadRapportData = async () => {
    if (!user) return;

    try {
      console.log('Loading rapport data for user:', user.id);

      const { data: reportData, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading rapport data:', error);
        throw error;
      }

      setData(reportData);
      console.log('Loaded rapport data:', reportData);

    } catch (error) {
      console.error('Error loading rapport data:', error);
      toast({
        title: t('common.toast.load_error'),
        description: t('common.toast.load_error_description'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    loadRapportData();
  };

  return {
    data,
    loading,
    refreshData
  };
};
