
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export interface ZoekprofielResponse {
  id: string;
  user_id: string;
  functie_als: string;
  kerntaken: string;
  organisatie_bij: string;
  sector: string;
  gewenste_regio: string;
  arbeidsvoorwaarden: string;
  created_at: string;
  updated_at: string;
}

export const useZoekprofielResponses = (roundId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTranslation();
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
      await calculateProgress(initialState);
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

  const calculateProgress = useCallback(async (data: Partial<ZoekprofielResponse>) => {
    const fields = [
      data.functie_als,
      data.kerntaken,
      data.organisatie_bij,
      data.sector,
      data.gewenste_regio,
      data.arbeidsvoorwaarden
    ];

    // Check if field has meaningful content (not just empty or whitespace)
    const filledFields = fields.filter(field => field && typeof field === 'string' && field.trim().length > 0).length;
    const baseProgressPercentage = Math.round((filledFields / fields.length) * 100);
    
    // Check if user has a completed zoekprofiel for this specific round
    let hasCompletedZoekprofiel = false;
    if (user?.id && roundId) {
      try {
        const { data: zoekprofielData } = await supabase
          .from('user_zoekprofielen')
          .select('pdf_status, zoekprofiel_content')
          .eq('user_id', user.id)
          .eq('round_id', roundId)
          .maybeSingle();
        
        // Zoekprofiel is only complete if there's actual generated content
        hasCompletedZoekprofiel = zoekprofielData && !!zoekprofielData.zoekprofiel_content;
      } catch (error) {
        console.error('Error checking zoekprofiel status:', error);
      }
    }
    
    // If zoekprofiel is completed, always show 100%
    const progressPercentage = hasCompletedZoekprofiel ? 100 : baseProgressPercentage;
    
    console.log('📊 Progress calculation:', {
      filledFields,
      totalFields: fields.length,
      baseProgressPercentage,
      hasCompletedZoekprofiel,
      finalProgressPercentage: progressPercentage,
      fields: fields.map((field, index) => ({
        index,
        value: field,
        isFilled: field && typeof field === 'string' && field.trim().length > 0
      }))
    });
    
    setProgress(progressPercentage);
    const completed = progressPercentage === 100;
    setIsCompleted(completed);
    
    console.log('✅ Progress updated:', { progressPercentage, isCompleted: completed });
  }, [user?.id, roundId]);

  const debouncedSave = useCallback(async (field: string, value: string) => {
    if (!user?.id || !roundId) return;

    // Prevent multiple saves for the same field
    if (activeSaves.current.has(field)) {
      return;
    }

    activeSaves.current.add(field);

    try {
      console.log(`💾 Saving zoekprofiel ${field}:`, value, 'for round:', roundId);

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
      
      // No need to update local state here as it's already updated optimistically

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
  }, [user?.id, roundId, responses, toast]);

  const saveResponse = useCallback(async (field: string, value: string) => {
    console.log(`🔄 Updating local state for ${field}:`, value);
    
    // Immediately update local state for optimistic UI updates
    setLocalState(prev => {
      const newState = { ...prev, [field]: value };
      
      // Calculate progress with the new state immediately
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

  // Flush all pending saves immediately
  const flushPendingSaves = useCallback(async () => {
    // Clear all debounce timeouts
    Object.keys(debounceTimeouts.current).forEach(field => {
      clearTimeout(debounceTimeouts.current[field]);
      delete debounceTimeouts.current[field];
    });

    if (!user?.id || !roundId) return;

    // Save all local state immediately
    const dataToSave = { ...localState };
    
    const saveData = {
      user_id: user.id,
      round_id: roundId,
      functie_als: dataToSave.functie_als || null,
      kerntaken: dataToSave.kerntaken || null,
      organisatie_bij: dataToSave.organisatie_bij || null,
      sector: dataToSave.sector || null,
      gewenste_regio: dataToSave.gewenste_regio || null,
      arbeidsvoorwaarden: dataToSave.arbeidsvoorwaarden || null
    };

    console.log('💾 Flushing all pending saves:', saveData);

    try {
      const { error } = await supabase
        .from('zoekprofiel_antwoorden')
        .upsert(saveData, { onConflict: 'user_id,round_id' });

      if (error) throw error;
      console.log('✅ Successfully flushed all pending saves');
    } catch (error) {
      console.error('❌ Error flushing saves:', error);
      throw error;
    }
  }, [user?.id, roundId, localState]);

  const submitToWebhook = async (submissionLanguage?: string, submissionRoundId?: string) => {
    const languageToUse = submissionLanguage || language || 'nl';
    const roundIdToUse = submissionRoundId || roundId;
    
    // Use local state for submission to ensure we have the latest values
    const dataToSubmit = { ...responses, ...localState };
    
    console.log('🚀 Submitting data to generate-zoekprofiel edge function:', dataToSubmit);
    
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
      // First flush all pending saves to ensure data is in database
      await flushPendingSaves();
      
      console.log('🚀 Calling generate-zoekprofiel edge function...');
      
      const { data, error } = await supabase.functions.invoke('generate-zoekprofiel', {
        body: { 
          user_id: user?.id,
          round_id: roundIdToUse,
          language: languageToUse 
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }

      console.log('✅ Successfully generated zoekprofiel:', data);

      toast({
        title: "Zoekprofiel gegenereerd",
        description: "Je zoekprofiel is succesvol aangemaakt!",
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error generating zoekprofiel:', error);
      toast({
        title: "Fout bij genereren",
        description: "Er ging iets mis bij het genereren van je zoekprofiel.",
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
  }, [user?.id, roundId]);

  // Use useMemo to prevent unnecessary re-renders of currentData
  const currentData = useMemo(() => {
    return { ...responses, ...localState };
  }, [responses, localState]);

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
