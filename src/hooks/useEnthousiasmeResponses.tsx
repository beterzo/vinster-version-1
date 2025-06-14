
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface EnthousiasmeResponses {
  step1_q1?: string;
  step1_q2?: string;
  step1_q3?: string;
  step2_q1?: string;
  step2_q2?: string;
  step2_q3?: string;
  step3_q1?: string;
  step3_q2?: string;
  step3_q3?: string;
  step4_q1?: string;
  step4_q2?: string;
  step4_q3?: string;
}

export const useEnthousiasmeResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<EnthousiasmeResponses>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing responses
  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enthousiasme_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading responses:', error);
        return;
      }

      if (data) {
        setResponses({
          step1_q1: data.step1_q1 || '',
          step1_q2: data.step1_q2 || '',
          step1_q3: data.step1_q3 || '',
          step2_q1: data.step2_q1 || '',
          step2_q2: data.step2_q2 || '',
          step2_q3: data.step2_q3 || '',
          step3_q1: data.step3_q1 || '',
          step3_q2: data.step3_q2 || '',
          step3_q3: data.step3_q3 || '',
          step4_q1: data.step4_q1 || '',
          step4_q2: data.step4_q2 || '',
          step4_q3: data.step4_q3 || '',
        });
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResponse = async (field: keyof EnthousiasmeResponses, value: string) => {
    if (!user) return;

    setSaving(true);
    
    try {
      const updateData = {
        user_id: user.id,
        [field]: value,
      };

      const { error } = await supabase
        .from('enthousiasme_responses')
        .upsert(updateData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving response:', error);
        toast({
          title: "Fout bij opslaan",
          description: "Er ging iets mis bij het opslaan van je antwoord.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setResponses(prev => ({
        ...prev,
        [field]: value
      }));

      console.log('Response saved successfully');
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Fout bij opslaan", 
        description: "Er ging iets mis bij het opslaan van je antwoord.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    responses,
    loading,
    saving,
    saveResponse,
    updateLocalResponse: (field: keyof EnthousiasmeResponses, value: string) => {
      setResponses(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
};
