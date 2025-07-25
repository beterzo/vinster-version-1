
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

export const useZoekprofielResponses = () => {
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
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading zoekprofiel antwoorden for user:', user.id);
      
      const { data, error } = await supabase
        .from('zoekprofiel_antwoorden')
        .select('*')
        .eq('user_id', user.id)
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
    
    // Check if user has a completed zoekprofiel PDF
    let hasCompletedZoekprofiel = false;
    if (user?.id) {
      try {
        const { data: zoekprofielData } = await supabase
          .from('user_zoekprofielen')
          .select('pdf_status, pdf_url')
          .eq('user_id', user.id)
          .maybeSingle();
        
        hasCompletedZoekprofiel = zoekprofielData && zoekprofielData.pdf_status === 'completed' && !!zoekprofielData.pdf_url;
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
  }, [user?.id]);

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
        .from('zoekprofiel_antwoorden')
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
  }, [user?.id, responses, toast]);

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

  const submitToWebhook = async (submissionLanguage?: string) => {
    const languageToUse = submissionLanguage || language || 'nl';
    
    // Use local state for submission to ensure we have the latest values
    const dataToSubmit = { ...responses, ...localState };
    
    console.log('🚀 Submitting data to webhook:', dataToSubmit);
    
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
      
      // Initialize PDF generation status immediately after webhook submission
      try {
        console.log('🚀 Initializing PDF generation status after webhook submission...');
        
        const { error: initError } = await supabase
          .from('user_zoekprofielen')
          .upsert({
            user_id: user?.id,
            pdf_status: 'generating'
          }, {
            onConflict: 'user_id'
          });

        if (initError) {
          console.error('❌ Error initializing PDF generation:', initError);
        } else {
          console.log('✅ PDF generation status initialized');
        }
      } catch (initError) {
        console.error('❌ Failed to initialize PDF generation:', initError);
      }

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
