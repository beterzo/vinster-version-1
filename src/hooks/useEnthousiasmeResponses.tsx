
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useJourneyReset } from '@/contexts/JourneyResetContext';

export interface EnthousiasmeResponses {
  kindertijd_activiteiten?: string;
  kindertijd_plekken?: string;
  kindertijd_interesses_nieuw?: string;
  eerste_werk_leukste_taken?: string;
  eerste_werk_werkomstandigheden?: string;
  eerste_werk_onderwerpen?: string;
  plezierige_werkperiode_beschrijving?: string;
  leuk_project_en_rol?: string;
  fluitend_thuiskomen_dag?: string;
}

export const useEnthousiasmeResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { registerRefreshCallback, unregisterRefreshCallback } = useJourneyReset();
  const [responses, setResponses] = useState<EnthousiasmeResponses>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing responses
  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  // Register for journey reset refresh
  useEffect(() => {
    const refreshCallback = () => {
      console.log('🔄 Refreshing enthousiasme responses after journey reset');
      setResponses({});
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
      const { data, error } = await supabase
        .from('enthousiasme_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading responses:', error);
        return;
      }

      if (data) {
        setResponses({
          kindertijd_activiteiten: data.kindertijd_activiteiten || '',
          kindertijd_plekken: data.kindertijd_plekken || '',
          kindertijd_interesses_nieuw: data.kindertijd_interesses_nieuw || '',
          eerste_werk_leukste_taken: data.eerste_werk_leukste_taken || '',
          eerste_werk_werkomstandigheden: data.eerste_werk_werkomstandigheden || '',
          eerste_werk_onderwerpen: data.eerste_werk_onderwerpen || '',
          plezierige_werkperiode_beschrijving: data.plezierige_werkperiode_beschrijving || '',
          leuk_project_en_rol: data.leuk_project_en_rol || '',
          fluitend_thuiskomen_dag: data.fluitend_thuiskomen_dag || '',
        });
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResponse = async (field: keyof EnthousiasmeResponses, value: string) => {
    if (!user) return;

    setSaving(true);
    
    try {
      const updateData = {
        user_id: user.id,
        [field]: value,
      };

      const { error } = await supabase
        .from('enthousiasme_responses')
        .upsert(updateData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving response:', error);
        toast({
          title: t('common.toast.save_error'),
          description: t('common.toast.save_error_description'),
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setResponses(prev => ({
        ...prev,
        [field]: value
      }));

      console.log('Response saved successfully');
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: t('common.toast.save_error'), 
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    responses,
    loading,
    saving,
    saveResponse,
    loadResponses, // Export loadResponses for manual refresh
    updateLocalResponse: (field: keyof EnthousiasmeResponses, value: string) => {
      setResponses(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
};
