import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface PrioriteitenResponses {
  id?: string;
  selected_activiteiten_keywords: string[];
  selected_werkomstandigheden_keywords: string[];
  selected_interesses_keywords: string[];
  extra_activiteiten_tekst: string;
  extra_werkomstandigheden_tekst: string;
  extra_interesses_tekst: string;
}

export interface AIKeywords {
  activiteiten: string[];
  werkomstandigheden: string[];
  interesses: string[];
}

export const usePrioriteitenResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<PrioriteitenResponses | null>(null);
  const [aiKeywords, setAIKeywords] = useState<AIKeywords | null>(null);
  const [loading, setLoading] = useState(false);

  // Load existing responses and AI keywords
  useEffect(() => {
    if (user) {
      loadResponses();
      loadAIKeywords();
    }
  }, [user]);

  // Calculate progress based on completed steps
  const calculateProgress = () => {
    if (!responses) return 0;
    
    let completedSteps = 0;
    
    // Check if activiteiten step is completed
    if (responses.selected_activiteiten_keywords.length > 0 || responses.extra_activiteiten_tekst.trim()) {
      completedSteps++;
    }
    
    // Check if werkomstandigheden step is completed
    if (responses.selected_werkomstandigheden_keywords.length > 0 || responses.extra_werkomstandigheden_tekst.trim()) {
      completedSteps++;
    }
    
    // Check if interesses step is completed
    if (responses.selected_interesses_keywords.length > 0 || responses.extra_interesses_tekst.trim()) {
      completedSteps++;
    }
    
    // Return progress as percentage
    return Math.round((completedSteps / 3) * 100);
  };

  const loadResponses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prioriteiten_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading prioriteiten responses:', error);
        return;
      }

      if (data) {
        setResponses({
          id: data.id,
          selected_activiteiten_keywords: data.selected_activiteiten_keywords || [],
          selected_werkomstandigheden_keywords: data.selected_werkomstandigheden_keywords || [],
          selected_interesses_keywords: data.selected_interesses_keywords || [],
          extra_activiteiten_tekst: data.extra_activiteiten_tekst || '',
          extra_werkomstandigheden_tekst: data.extra_werkomstandigheden_tekst || '',
          extra_interesses_tekst: data.extra_interesses_tekst || ''
        });
      } else {
        // Initialize empty responses if none exist
        setResponses({
          selected_activiteiten_keywords: [],
          selected_werkomstandigheden_keywords: [],
          selected_interesses_keywords: [],
          extra_activiteiten_tekst: '',
          extra_werkomstandigheden_tekst: '',
          extra_interesses_tekst: ''
        });
      }
    } catch (error) {
      console.error('Error loading prioriteiten responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIKeywords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_lievelings_activiteiten, ai_werkomstandigheden, ai_interesses')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading AI keywords:', error);
        return;
      }

      if (data) {
        const parseKeywords = (keywordString: string | null): string[] => {
          if (!keywordString) return [];
          try {
            // Try to parse as JSON array first
            const parsed = JSON.parse(keywordString);
            if (Array.isArray(parsed)) {
              return parsed;
            }
            // If not JSON array, split by comma
            return keywordString.split(',').map(k => k.trim()).filter(k => k.length > 0);
          } catch {
            // If JSON parsing fails, split by comma
            return keywordString.split(',').map(k => k.trim()).filter(k => k.length > 0);
          }
        };

        setAIKeywords({
          activiteiten: parseKeywords(data.ai_lievelings_activiteiten),
          werkomstandigheden: parseKeywords(data.ai_werkomstandigheden),
          interesses: parseKeywords(data.ai_interesses)
        });
      }
    } catch (error) {
      console.error('Error loading AI keywords:', error);
    }
  };

  const saveResponses = async (newResponses: Partial<PrioriteitenResponses>) => {
    if (!user) return false;

    try {
      setLoading(true);
      
      const dataToSave = {
        user_id: user.id,
        ...responses,
        ...newResponses
      };

      let result;
      if (responses?.id) {
        // Update existing
        result = await supabase
          .from('prioriteiten_responses')
          .update(dataToSave)
          .eq('id', responses.id)
          .eq('user_id', user.id);
      } else {
        // Insert new
        result = await supabase
          .from('prioriteiten_responses')
          .insert([dataToSave]);
      }

      if (result.error) {
        console.error('Error saving prioriteiten responses:', result.error);
        toast({
          title: "Fout bij opslaan",
          description: "Er ging iets mis bij het opslaan van je antwoorden.",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setResponses(prev => ({
        ...prev,
        ...newResponses
      }));

      toast({
        title: "Opgeslagen",
        description: "Je antwoorden zijn succesvol opgeslagen.",
      });

      return true;
    } catch (error) {
      console.error('Error saving prioriteiten responses:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er ging iets mis bij het opslaan van je antwoorden.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    responses,
    aiKeywords,
    loading,
    progress: calculateProgress(),
    isCompleted: calculateProgress() === 100,
    saveResponses,
    refreshData: () => {
      loadResponses();
      loadAIKeywords();
    }
  };
};
