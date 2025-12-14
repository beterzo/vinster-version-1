import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export interface ZoekprofielAntwoord {
  id: string;
  user_id: string;
  round_id?: string;
  functie_als: string;
  kerntaken: string;
  organisatie_bij: string;
  sector: string;
  gewenste_regio: string;
  arbeidsvoorwaarden: string;
  created_at: string;
  updated_at: string;
}

export const useZoekprofielAntwoorden = (roundId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTranslation();
  const [responses, setResponses] = useState<ZoekprofielAntwoord | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Keep track of local state for optimistic updates
  const [localState, setLocalState] = useState<Partial<ZoekprofielAntwoord>>({});
  
  // Debounce state - track active saves to prevent race conditions
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const activeSaves = useRef<Set<string>>(new Set());

  const loadResponses = async () => {
    if (!user?.id || !roundId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading zoekprofiel antwoorden for user:', user.id, 'round:', roundId);
      
      const { data, error } = await supabase
        .from('zoekprofiel_antwoorden')
        .select('*')
        .eq('user_id', user.id)
        .eq('round_id', roundId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading zoekprofiel antwoorden:', error);
        throw error;
      }

      console.log('✅ Loaded zoekprofiel antwoorden:', data);
      setResponses(data);
      
      // Initialize local state with loaded data or empty object
      const initialState = data || {
        functie_als: '',
        kerntaken: '',
        organisatie_bij: '',
        sector: '',
        gewenste_regio: '',
        arbeidsvoorwaarden: ''
      };
      
      setLocalState(initialState);
    } catch (error) {
      console.error('❌ Failed to load zoekprofiel antwoorden:', error);
      toast({
        title: "Fout bij laden",
        description: "Kon je zoekprofiel gegevens niet laden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedSave = useCallback(async (field: string, value: string) => {
    if (!user?.id || !roundId) return;

    // Prevent multiple saves for the same field
    if (activeSaves.current.has(field)) {
      return;
    }

    activeSaves.current.add(field);

    try {
      console.log(`💾 Saving zoekprofiel ${field}:`, value);

      // Use upsert logic to handle both insert and update cases
      const { data, error } = await supabase
        .from('zoekprofiel_antwoorden')
        .upsert({
          user_id: user.id,
          round_id: roundId,
          [field]: value
        }, {
          onConflict: 'user_id,round_id'
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Successfully saved zoekprofiel ${field}`);
      
      // Update the responses state with the saved data
      setResponses(data);
      
      // Merge the saved field back into local state to ensure consistency
      setLocalState(prev => ({
        ...prev,
        [field]: value
      }));

    } catch (error) {
      console.error(`❌ Error saving zoekprofiel ${field}:`, error);
      
      // Rollback optimistic update on error
      setLocalState(prev => ({
        ...prev,
        [field]: responses?.[field as keyof ZoekprofielAntwoord] || ''
      }));
      
      toast({
        title: "Fout bij opslaan",
        description: `Kon ${field} niet opslaan. Probeer het opnieuw.`,
        variant: "destructive"
      });
    } finally {
      activeSaves.current.delete(field);
    }
  }, [user?.id, roundId, responses, toast]);

  const saveResponse = useCallback((field: string, value: string) => {
    // Immediately update local state for optimistic UI updates
    setLocalState(prev => {
      const newState = { ...prev, [field]: value };
      return newState;
    });

    // Clear existing timeout for this field
    if (debounceTimeouts.current[field]) {
      clearTimeout(debounceTimeouts.current[field]);
    }

    // Set new timeout for debounced save
    debounceTimeouts.current[field] = setTimeout(() => {
      debouncedSave(field, value);
      delete debounceTimeouts.current[field];
    }, 1000);
  }, [debouncedSave]);

  const submitToWebhook = async (submissionLanguage?: string) => {
    const languageToUse = submissionLanguage || language || 'nl';
    
    // Use local state for submission to ensure we have the latest values
    const dataToSubmit = { ...responses, ...localState };
    
    if (!dataToSubmit.functie_als || !dataToSubmit.kerntaken || !dataToSubmit.organisatie_bij || 
        !dataToSubmit.sector || !dataToSubmit.gewenste_regio || !dataToSubmit.arbeidsvoorwaarden) {
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
          email: user?.email || "",
          first_name: user?.user_metadata?.first_name || "",
          last_name: user?.user_metadata?.last_name || "",
          language: languageToUse,
          functie_als: dataToSubmit.functie_als,
          kerntaken: dataToSubmit.kerntaken,
          organisatie_bij: dataToSubmit.organisatie_bij,
          sector: dataToSubmit.sector,
          gewenste_regio: dataToSubmit.gewenste_regio,
          arbeidsvoorwaarden: dataToSubmit.arbeidsvoorwaarden,
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
    if (roundId) {
      loadResponses();
    } else {
      setLoading(false);
    }
  }, [user?.id, roundId]);

  // Use useMemo to prevent unnecessary re-renders of currentData
  const currentData = useMemo(() => {
    return { ...responses, ...localState };
  }, [responses, localState]);

  return {
    responses: currentData,
    loading,
    saveResponse,
    submitToWebhook,
    loadResponses
  };
};
