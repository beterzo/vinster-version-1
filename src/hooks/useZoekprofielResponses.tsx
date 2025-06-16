
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ZoekprofielResponse {
  id: string;
  user_id: string;
  gewenst_werk: string;
  branche_richting: string;
  energie_gevende_aspecten: string;
  organisatie_type: string;
  gewenste_regio: string;
  belangrijke_voorwaarden: string;
  created_at: string;
  updated_at: string;
}

export const useZoekprofielResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<ZoekprofielResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const loadResponses = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading zoekprofiel responses for user:', user.id);
      
      const { data, error } = await supabase
        .from('zoekprofiel_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading zoekprofiel responses:', error);
        throw error;
      }

      console.log('✅ Loaded zoekprofiel responses:', data);
      setResponses(data);
      
      if (data) {
        calculateProgress(data);
      }
    } catch (error) {
      console.error('❌ Failed to load zoekprofiel responses:', error);
      toast({
        title: "Fout bij laden",
        description: "Kon je zoekprofiel gegevens niet laden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (data: ZoekprofielResponse) => {
    const fields = [
      data.gewenst_werk,
      data.branche_richting,
      data.energie_gevende_aspecten,
      data.organisatie_type,
      data.gewenste_regio,
      data.belangrijke_voorwaarden
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const progressPercentage = Math.round((filledFields / fields.length) * 100);
    
    setProgress(progressPercentage);
    setIsCompleted(progressPercentage === 100);
  };

  const saveResponse = async (field: string, value: string) => {
    if (!user?.id) return;

    try {
      console.log(`💾 Saving zoekprofiel ${field}:`, value);

      if (responses) {
        const { error } = await supabase
          .from('zoekprofiel_responses')
          .update({ [field]: value })
          .eq('id', responses.id);

        if (error) throw error;

        const updatedResponse = { ...responses, [field]: value };
        setResponses(updatedResponse);
        calculateProgress(updatedResponse);
      } else {
        const { data, error } = await supabase
          .from('zoekprofiel_responses')
          .insert({
            user_id: user.id,
            [field]: value
          })
          .select()
          .single();

        if (error) throw error;

        setResponses(data);
        calculateProgress(data);
      }

      console.log(`✅ Successfully saved zoekprofiel ${field}`);
    } catch (error) {
      console.error(`❌ Error saving zoekprofiel ${field}:`, error);
      toast({
        title: "Fout bij opslaan",
        description: `Kon ${field} niet opslaan.`,
        variant: "destructive"
      });
    }
  };

  const submitToWebhook = async () => {
    if (!responses) {
      toast({
        title: "Geen gegevens",
        description: "Er zijn geen gegevens om te versturen.",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('🚀 Submitting zoekprofiel to webhook...');
      
      const response = await fetch('https://hook.eu2.make.com/y47oalww255yswggp44jy2ty8518j2ok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          gewenst_werk: responses.gewenst_werk,
          branche_richting: responses.branche_richting,
          energie_gevende_aspecten: responses.energie_gevende_aspecten,
          organisatie_type: responses.organisatie_type,
          gewenste_regio: responses.gewenste_regio,
          belangrijke_voorwaarden: responses.belangrijke_voorwaarden,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Successfully submitted to webhook');
      toast({
        title: "Zoekprofiel verzonden",
        description: "Je zoekprofiel is succesvol verwerkt!",
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error submitting to webhook:', error);
      toast({
        title: "Fout bij verzenden",
        description: "Er ging iets mis bij het verwerken van je zoekprofiel.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadResponses();
  }, [user?.id]);

  return {
    responses,
    loading,
    progress,
    isCompleted,
    saveResponse,
    submitToWebhook,
    loadResponses
  };
};
