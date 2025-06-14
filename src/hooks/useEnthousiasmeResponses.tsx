
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface EnthousiasmeResponses {
  kindertijd_liefste_activiteiten?: string;
  kindertijd_favoriete_plekken?: string;
  kindertijd_interesses?: string;
  school_interessantste_vakken?: string;
  school_thuiskomst_activiteiten?: string;
  school_naschoolse_activiteiten?: string;
  eerste_werk_leukste_aspecten?: string;
  werkomgeving_aantrekkelijke_elementen?: string;
  samenwerking_prettige_aspecten?: string;
  plezierige_werkperiode_beschrijving?: string;
  leuk_project_en_rol?: string;
  fluitend_thuiskomen_dag?: string;
}

export const useEnthousiasmeResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<EnthousiasmeResponses>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing responses
  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

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
          kindertijd_liefste_activiteiten: data.kindertijd_liefste_activiteiten || '',
          kindertijd_favoriete_plekken: data.kindertijd_favoriete_plekken || '',
          kindertijd_interesses: data.kindertijd_interesses || '',
          school_interessantste_vakken: data.school_interessantste_vakken || '',
          school_thuiskomst_activiteiten: data.school_thuiskomst_activiteiten || '',
          school_naschoolse_activiteiten: data.school_naschoolse_activiteiten || '',
          eerste_werk_leukste_aspecten: data.eerste_werk_leukste_aspecten || '',
          werkomgeving_aantrekkelijke_elementen: data.werkomgeving_aantrekkelijke_elementen || '',
          samenwerking_prettige_aspecten: data.samenwerking_prettige_aspecten || '',
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
          title: "Fout bij opslaan",
          description: "Er ging iets mis bij het opslaan van je antwoord.",
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
        title: "Fout bij opslaan", 
        description: "Er ging iets mis bij het opslaan van je antwoord.",
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
    updateLocalResponse: (field: keyof EnthousiasmeResponses, value: string) => {
      setResponses(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
};
