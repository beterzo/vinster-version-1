import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useJourneyReset } from '@/contexts/JourneyResetContext';

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

export const usePrioriteitenResponses = (roundId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { registerRefreshCallback, unregisterRefreshCallback } = useJourneyReset();
  const [responses, setResponses] = useState<PrioriteitenData>({});
  const [aiKeywords, setAiKeywords] = useState<AIKeywords>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && roundId) {
      loadResponses();
      loadAiKeywords();
    }
  }, [user, roundId]);

  // Register for journey reset refresh
  useEffect(() => {
    const refreshCallback = () => {
      console.log('🔄 Refreshing prioriteiten responses after journey reset');
      setResponses({});
      setAiKeywords({});
      if (user && roundId) {
        loadResponses();
        loadAiKeywords();
      }
    };

    registerRefreshCallback(refreshCallback);
    return () => unregisterRefreshCallback(refreshCallback);
  }, [user, roundId, registerRefreshCallback, unregisterRefreshCallback]);

  const loadResponses = async () => {
    if (!user || !roundId) return;

    try {
      console.log('Loading prioriteiten responses for user:', user.id, 'round:', roundId);
      
      const { data, error } = await supabase
        .from('prioriteiten_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('round_id', roundId)
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
    if (!user || !roundId) return;

    try {
      console.log('Loading AI keywords for user:', user.id, 'round:', roundId);
      
      // Load AI keywords from prioriteiten_responses (per round)
      const { data, error } = await supabase
        .from('prioriteiten_responses')
        .select('ai_activiteiten_keywords, ai_werkomstandigheden_keywords, ai_interesses_keywords')
        .eq('user_id', user.id)
        .eq('round_id', roundId)
        .maybeSingle();

      if (error) {
        console.error('Error loading AI keywords:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded AI keywords from prioriteiten_responses:', data);
        
        const keywords: AIKeywords = {};
        
        // AI keywords are stored as JSONB arrays directly
        if (data.ai_activiteiten_keywords) {
          keywords.activiteiten = data.ai_activiteiten_keywords as string[];
        }
        
        if (data.ai_werkomstandigheden_keywords) {
          keywords.werkomstandigheden = data.ai_werkomstandigheden_keywords as string[];
        }
        
        if (data.ai_interesses_keywords) {
          keywords.interesses = data.ai_interesses_keywords as string[];
        }
        
        setAiKeywords(keywords);
      } else {
        console.log('No AI keywords found for this round');
      }
    } catch (error) {
      console.error('Error loading AI keywords:', error);
    }
  };

  // Check if a category has minimum 3 keywords selected
  const hasMinimumKeywords = (category: 'activiteiten' | 'werkomstandigheden' | 'interesses') => {
    const fieldMap = {
      activiteiten: 'selected_activiteiten_keywords',
      werkomstandigheden: 'selected_werkomstandigheden_keywords',
      interesses: 'selected_interesses_keywords'
    };
    
    const keywords = responses[fieldMap[category] as keyof PrioriteitenData] as string[] || [];
    return keywords.length >= 3;
  };

  // Direct save function for keyword selections - saves immediately to Supabase
  const saveKeywordSelection = async (category: 'activiteiten' | 'werkomstandigheden' | 'interesses', keywords: string[]) => {
    if (!user || !roundId) return false;

    try {
      console.log(`Saving ${category} keywords:`, keywords);

      const fieldMap = {
        activiteiten: 'selected_activiteiten_keywords',
        werkomstandigheden: 'selected_werkomstandigheden_keywords', 
        interesses: 'selected_interesses_keywords'
      };

      const updateData = {
        user_id: user.id,
        round_id: roundId,
        ...responses,
        [fieldMap[category]]: keywords,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('prioriteiten_responses')
        .upsert(updateData, {
          onConflict: 'user_id,round_id'
        });

      if (error) {
        console.error(`Error saving ${category} keywords:`, error);
        throw error;
      }

      // Update local state
      setResponses(prev => ({ 
        ...prev, 
        [fieldMap[category]]: keywords 
      }));

      return true;
    } catch (error) {
      console.error(`Error saving ${category} keywords:`, error);
      return false;
    }
  };

  // Save other responses (extra text fields)
  const saveResponses = async (data: Partial<PrioriteitenData>) => {
    if (!user || !roundId) return false;

    setLoading(true);
    try {
      console.log('Saving prioriteiten responses:', data);

      const updateData = {
        user_id: user.id,
        round_id: roundId,
        ...responses,
        ...data,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('prioriteiten_responses')
        .upsert(updateData, {
          onConflict: 'user_id,round_id'
        });

      if (error) {
        console.error('Error saving prioriteiten responses:', error);
        throw error;
      }

      setResponses(prev => ({ ...prev, ...data }));
      
      toast({
        title: t('common.toast.save_success'),
        description: t('common.toast.save_success_description'),
      });

      return true;
    } catch (error) {
      console.error('Error saving prioriteiten responses:', error);
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if a page has been visited/used (any data entered AND minimum keywords)
  const isPageComplete = (keywords?: string[], extraText?: string) => {
    const hasMinKeywords = keywords && keywords.length >= 3;
    const hasExtraText = extraText && extraText.trim() !== '';
    return hasMinKeywords || hasExtraText;
  };

  const isCompleted = () => {
    const activiteitenComplete = isPageComplete(responses?.selected_activiteiten_keywords, responses?.extra_activiteiten_tekst);
    const werkomstandighedenComplete = isPageComplete(responses?.selected_werkomstandigheden_keywords, responses?.extra_werkomstandigheden_tekst);
    const interessesComplete = isPageComplete(responses?.selected_interesses_keywords, responses?.extra_interesses_tekst);
    
    console.log('Prioriteiten completion check:', {
      activiteitenComplete,
      werkomstandighedenComplete,
      interessesComplete,
      activiteitenCount: responses?.selected_activiteiten_keywords?.length || 0,
      werkomstandighedenCount: responses?.selected_werkomstandigheden_keywords?.length || 0,
      interessesCount: responses?.selected_interesses_keywords?.length || 0
    });
    
    return !!(activiteitenComplete && werkomstandighedenComplete && interessesComplete);
  };

  // Calculate progress percentage based on completed pages (each page = 33.33%)
  const getProgress = () => {
    const pages = [
      isPageComplete(responses?.selected_activiteiten_keywords, responses?.extra_activiteiten_tekst),
      isPageComplete(responses?.selected_werkomstandigheden_keywords, responses?.extra_werkomstandigheden_tekst),
      isPageComplete(responses?.selected_interesses_keywords, responses?.extra_interesses_tekst)
    ];
    
    const completedPages = pages.filter(Boolean).length;
    return Math.round((completedPages / pages.length) * 100);
  };

  // Generate AI keywords by calling the Edge Function
  const generateAiKeywords = async (language: string = 'nl') => {
    if (!user || !roundId) return false;

    try {
      console.log('Generating AI keywords for round:', roundId, 'language:', language);
      
      const { data, error } = await supabase.functions.invoke('generate-profile-keywords', {
        body: { user_id: user.id, round_id: roundId, language }
      });

      if (error) {
        console.error('Error generating AI keywords:', error);
        toast({
          title: t('common.toast.error'),
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('AI keywords generated:', data);
      
      if (data?.keywords) {
        setAiKeywords({
          activiteiten: data.keywords.activiteiten || [],
          werkomstandigheden: data.keywords.werkomgeving || [],
          interesses: data.keywords.interesses || []
        });
      }

      return true;
    } catch (error) {
      console.error('Error generating AI keywords:', error);
      toast({
        title: t('common.toast.error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
      return false;
    }
  };

  // Check if AI keywords exist for this round
  const hasAiKeywords = () => {
    return (aiKeywords.activiteiten?.length || 0) > 0 || 
           (aiKeywords.werkomstandigheden?.length || 0) > 0 || 
           (aiKeywords.interesses?.length || 0) > 0;
  };

  return {
    responses,
    aiKeywords,
    loading,
    saveResponses,
    saveKeywordSelection,
    hasMinimumKeywords,
    isCompleted: isCompleted(),
    progress: getProgress(),
    loadResponses,
    loadAiKeywords,
    generateAiKeywords,
    hasAiKeywords
  };
};
