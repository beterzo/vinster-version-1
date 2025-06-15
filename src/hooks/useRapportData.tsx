
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface RapportData {
  enthousiasme: any;
  wensberoepen: any;
  extraInformatie: any;
  prioriteiten: any;
}

export const useRapportData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<RapportData>({
    enthousiasme: null,
    wensberoepen: null,
    extraInformatie: null,
    prioriteiten: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;

    try {
      console.log('Loading all rapport data for user:', user.id);

      // Load all data in parallel
      const [enthousiasmeResult, wensberoepenResult, extraInfoResult, prioriteitenResult] = await Promise.all([
        supabase
          .from('enthousiasme_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('wensberoepen_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('extra_informatie_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('prioriteiten_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      setData({
        enthousiasme: enthousiasmeResult.data,
        wensberoepen: wensberoepenResult.data,
        extraInformatie: extraInfoResult.data,
        prioriteiten: prioriteitenResult.data
      });

      console.log('Loaded rapport data:', {
        enthousiasme: !!enthousiasmeResult.data,
        wensberoepen: !!wensberoepenResult.data,
        extraInformatie: !!extraInfoResult.data,
        prioriteiten: !!prioriteitenResult.data
      });

    } catch (error) {
      console.error('Error loading rapport data:', error);
      toast({
        title: "Fout bij laden",
        description: "Er is een fout opgetreden bij het laden van je gegevens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    loadAllData();
  };

  return {
    data,
    loading,
    refreshData
  };
};
