
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useJourneyReset } from '@/contexts/JourneyResetContext';

interface ExtraInformatieData {
  opleidingsniveau: string;
  beroepsopleiding: string;
  fysieke_beperkingen: string;
  sector_voorkeur: string;
}

export const useExtraInformatieResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { registerRefreshCallback, unregisterRefreshCallback } = useJourneyReset();
  const [responses, setResponses] = useState<ExtraInformatieData>({
    opleidingsniveau: '',
    beroepsopleiding: '',
    fysieke_beperkingen: '',
    sector_voorkeur: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  // Register for journey reset refresh
  useEffect(() => {
    const refreshCallback = () => {
      console.log('🔄 Refreshing extra informatie responses after journey reset');
      setResponses({
        opleidingsniveau: '',
        beroepsopleiding: '',
        fysieke_beperkingen: '',
        sector_voorkeur: ''
      });
      setLoading(true);
      if (user) {
        loadResponses();
      }
    };

    registerRefreshCallback(refreshCallback);
    return () => unregisterRefreshCallback(refreshCallback);
  }, [user, registerRefreshCallback, unregisterRefreshCallback]);

  const loadResponses = async () => {
    if (!user) return;

    try {
      console.log('Loading extra informatie responses for user:', user.id);
      
      const { data, error } = await supabase
        .from('extra_informatie_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading extra informatie responses:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded extra informatie responses:', data);
        setResponses({
          opleidingsniveau: data.opleidingsniveau || '',
          beroepsopleiding: data.beroepsopleiding || '',
          fysieke_beperkingen: data.fysieke_beperkingen || '',
          sector_voorkeur: data.sector_voorkeur || ''
        });
      } else {
        console.log('No extra informatie responses found, using empty defaults');
      }
    } catch (error) {
      console.error('Error loading extra informatie responses:', error);
      toast({
        title: t('common.toast.load_error'),
        description: t('common.toast.load_error_description'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResponses = async (data: ExtraInformatieData) => {
    if (!user) return false;

    setSaving(true);
    try {
      console.log('Saving extra informatie responses:', data);

      const { error } = await supabase
        .from('extra_informatie_responses')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving extra informatie responses:', error);
        throw error;
      }

      setResponses(data);
      
      // Removed automatic success toast notification
      
      return true;
    } catch (error) {
      console.error('Error saving extra informatie responses:', error);
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Page-based completion: only check required fields (opleidingsniveau is required)
  const isCompleted = () => {
    return responses.opleidingsniveau !== '';
  };

  // Page-based progress: either 0% (not started) or 100% (completed with required fields)
  const getProgress = () => {
    return isCompleted() ? 100 : 0;
  };

  return {
    responses,
    loading,
    saving,
    saveResponses,
    isCompleted: isCompleted(),
    progress: getProgress(),
    loadResponses // Export for manual refresh
  };
};
