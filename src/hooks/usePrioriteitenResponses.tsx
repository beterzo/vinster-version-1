import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface PrioriteitenData {
  selected_activiteiten_keywords?: string[];
  extra_activiteiten_tekst?: string;
  selected_werkomstandigheden_keywords?: string[];
  extra_werkomstandigheden_tekst?: string;
  selected_interesses_keywords?: string[];
  extra_interesses_tekst?: string;
}

interface AIKeywords {
  activiteiten?: string[];
  werkomstandigheden?: string[];
  interesses?: string[];
}

export const usePrioriteitenResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<PrioriteitenData>({});
  const [aiKeywords, setAiKeywords] = useState<AIKeywords>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadResponses();
      loadAiKeywords();
    }
  }, [user]);

  const loadResponses = async () => {
    if (!user) return;

    try {
      console.log('Loading prioriteiten responses for user:', user.id);
      
      const { data, error } = await supabase
        .from('prioriteiten_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading prioriteiten responses:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded prioriteiten responses:', data);
        setResponses(data);
      } else {
        console.log('No prioriteiten responses found, using empty defaults');
      }
    } catch (error) {
      console.error('Error loading prioriteiten responses:', error);
    }
  };

  const loadAiKeywords = async () => {
    if (!user) return;

    try {
      console.log('Loading AI keywords for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_lievelings_activiteiten, ai_werkomstandigheden, ai_interesses')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading AI keywords:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded AI keywords:', data);
        
        const keywords: AIKeywords = {};
        
        if (data.ai_lievelings_activiteiten) {
          try {
            keywords.activiteiten = JSON.parse(data.ai_lievelings_activiteiten);
          } catch (e) {
            console.error('Error parsing activiteiten keywords:', e);
          }
        }
        
        if (data.ai_werkomstandigheden) {
          try {
            keywords.werkomstandigheden = JSON.parse(data.ai_werkomstandigheden);
          } catch (e) {
            console.error('Error parsing werkomstandigheden keywords:', e);
          }
        }
        
        if (data.ai_interesses) {
          try {
            keywords.interesses = JSON.parse(data.ai_interesses);
          } catch (e) {
            console.error('Error parsing interesses keywords:', e);
          }
        }
        
        setAiKeywords(keywords);
      } else {
        console.log('No AI keywords found for user');
      }
    } catch (error) {
      console.error('Error loading AI keywords:', error);
    }
  };

  const saveResponses = async (data: Partial<PrioriteitenData>) => {
    if (!user) return false;

    setLoading(true);
    try {
      console.log('Saving prioriteiten responses:', data);

      const updateData = {
        user_id: user.id,
        ...responses,
        ...data,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('prioriteiten_responses')
        .upsert(updateData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving prioriteiten responses:', error);
        throw error;
      }

      setResponses(prev => ({ ...prev, ...data }));
      
      toast({
        title: "Prioriteiten opgeslagen",
        description: "Jouw prioriteiten zijn succesvol opgeslagen.",
      });

      return true;
    } catch (error) {
      console.error('Error saving prioriteiten responses:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van je prioriteiten.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion status - each page needs at least 1 selected keyword to be considered complete
  const isPageComplete = (keywords?: string[]) => {
    return keywords && keywords.length > 0;
  };

  const isCompleted = () => {
    const activiteitenComplete = isPageComplete(responses?.selected_activiteiten_keywords);
    const werkomstandighedenComplete = isPageComplete(responses?.selected_werkomstandigheden_keywords);
    const interessesComplete = isPageComplete(responses?.selected_interesses_keywords);
    
    return !!(activiteitenComplete && werkomstandighedenComplete && interessesComplete);
  };

  // Calculate progress percentage based on completed pages (each page = 33.33%)
  const getProgress = () => {
    const pages = [
      isPageComplete(responses?.selected_activiteiten_keywords),
      isPageComplete(responses?.selected_werkomstandigheden_keywords),
      isPageComplete(responses?.selected_interesses_keywords)
    ];
    
    const completedPages = pages.filter(Boolean).length;
    return Math.round((completedPages / pages.length) * 100);
  };

  return {
    responses,
    aiKeywords,
    loading,
    saveResponses,
    isCompleted: isCompleted(),
    progress: getProgress()
  };
};
