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
    loadAiKeywords
  };
};
