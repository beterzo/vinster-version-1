
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ZoekprofielResponse {
  id: string;
  user_id: string;
  functie_als: string;
  kerntaken: string;
  sector: string;
  organisatie_bij: string;
  gewenste_regio: string;
  arbeidsvoorwaarden: string;
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
  
  // Debounce state
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const saveQueue = useRef<{ [key: string]: string }>({});

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
        .maybeSingle();

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

  const calculateProgress = useCallback((data: ZoekprofielResponse) => {
    const fields = [
      data.functie_als,
      data.kerntaken,
      data.sector,
      data.organisatie_bij,
      data.gewenste_regio,
      data.arbeidsvoorwaarden
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const progressPercentage = Math.round((filledFields / fields.length) * 100);
    
    setProgress(progressPercentage);
    setIsCompleted(progressPercentage === 100);
  }, []);

  const debouncedSave = useCallback(async (field: string, value: string) => {
    if (!user?.id) return;

    try {
      console.log(`💾 Saving zoekprofiel ${field}:`, value);

      if (responses) {
        // Update existing record
        const { error } = await supabase
          .from('zoekprofiel_responses')
          .update({ [field]: value })
          .eq('id', responses.id);

        if (error) throw error;

        const updatedResponse = { ...responses, [field]: value };
        setResponses(updatedResponse);
        calculateProgress(updatedResponse);
      } else {
        // Create new record
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
      
      // Remove from save queue
      delete saveQueue.current[field];
    } catch (error) {
      console.error(`❌ Error saving zoekprofiel ${field}:`, error);
      toast({
        title: "Fout bij opslaan",
        description: `Kon ${field} niet opslaan. Probeer het opnieuw.`,
        variant: "destructive"
      });
    }
  }, [user?.id, responses, calculateProgress, toast]);

  const saveResponse = useCallback((field: string, value: string) => {
    // Optimistically update UI
    if (responses) {
      const updatedResponse = { ...responses, [field]: value };
      setResponses(updatedResponse);
      calculateProgress(updatedResponse);
    }

    // Add to save queue
    saveQueue.current[field] = value;

    // Clear existing timeout for this field
    if (debounceTimeouts.current[field]) {
      clearTimeout(debounceTimeouts.current[field]);
    }

    // Set new timeout
    debounceTimeouts.current[field] = setTimeout(() => {
      debouncedSave(field, value);
      delete debounceTimeouts.current[field];
    }, 1000);
  }, [responses, calculateProgress, debouncedSave]);

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
          functie_als: responses.functie_als,
          kerntaken: responses.kerntaken,
          sector: responses.sector,
          organisatie_bij: responses.organisatie_bij,
          gewenste_regio: responses.gewenste_regio,
          arbeidsvoorwaarden: responses.arbeidsvoorwaarden,
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

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
