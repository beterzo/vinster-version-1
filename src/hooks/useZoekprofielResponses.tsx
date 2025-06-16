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
  
  // Keep track of local state for optimistic updates
  const [localState, setLocalState] = useState<Partial<ZoekprofielResponse>>({});
  
  // Debounce state - track active saves to prevent race conditions
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const activeSaves = useRef<Set<string>>(new Set());

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
      
      // Initialize local state with loaded data or empty object
      const initialState = data || {
        functie_als: '',
        kerntaken: '',
        sector: '',
        organisatie_bij: '',
        gewenste_regio: '',
        arbeidsvoorwaarden: ''
      };
      
      setLocalState(initialState);
      calculateProgress(initialState);
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

  const calculateProgress = useCallback((data: Partial<ZoekprofielResponse>) => {
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

    // Prevent multiple saves for the same field
    if (activeSaves.current.has(field)) {
      return;
    }

    activeSaves.current.add(field);

    try {
      console.log(`💾 Saving zoekprofiel ${field}:`, value);

      // Use upsert logic to handle both insert and update cases
      const { data, error } = await supabase
        .from('zoekprofiel_responses')
        .upsert({
          user_id: user.id,
          [field]: value
        }, {
          onConflict: 'user_id'
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
        [field]: responses?.[field as keyof ZoekprofielResponse] || ''
      }));
      
      toast({
        title: "Fout bij opslaan",
        description: `Kon ${field} niet opslaan. Probeer het opnieuw.`,
        variant: "destructive"
      });
    } finally {
      activeSaves.current.delete(field);
    }
  }, [user?.id, responses, toast]);

  const saveResponse = useCallback((field: string, value: string) => {
    // Immediately update local state for optimistic UI updates
    setLocalState(prev => {
      const newState = { ...prev, [field]: value };
      calculateProgress(newState);
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
  }, [calculateProgress, debouncedSave]);

  const submitToWebhook = async () => {
    // Use local state for submission to ensure we have the latest values
    const dataToSubmit = { ...responses, ...localState };
    
    if (!dataToSubmit.functie_als || !dataToSubmit.kerntaken || !dataToSubmit.sector || 
        !dataToSubmit.organisatie_bij || !dataToSubmit.gewenste_regio || !dataToSubmit.arbeidsvoorwaarden) {
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
          functie_als: dataToSubmit.functie_als,
          kerntaken: dataToSubmit.kerntaken,
          sector: dataToSubmit.sector,
          organisatie_bij: dataToSubmit.organisatie_bij,
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
    loadResponses();
  }, [user?.id]);

  // Return local state merged with responses for current values
  const currentData = { ...responses, ...localState };

  return {
    responses: currentData,
    loading,
    progress,
    isCompleted,
    saveResponse,
    submitToWebhook,
    loadResponses
  };
};
