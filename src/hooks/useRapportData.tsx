
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

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
  const [data, setData] = useState<RapportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRapportData();
    }
  }, [user]);

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
        title: "Fout bij laden",
        description: "Er is een fout opgetreden bij het laden van je rapport gegevens.",
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
