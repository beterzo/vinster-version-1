
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface ExtraInformatieData {
  opleidingsniveau: string;
  beroepsopleiding: string;
  fysieke_beperkingen: string;
  sector_voorkeur: string;
}

export const useExtraInformatieResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<ExtraInformatieData>({
    opleidingsniveau: '',
    beroepsopleiding: '',
    fysieke_beperkingen: '',
    sector_voorkeur: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    if (!user) return;

    try {
      console.log('Loading extra informatie responses for user:', user.id);
      
      const { data, error } = await supabase
        .from('extra_informatie_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading extra informatie responses:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded extra informatie responses:', data);
        setResponses({
          opleidingsniveau: data.opleidingsniveau || '',
          beroepsopleiding: data.beroepsopleiding || '',
          fysieke_beperkingen: data.fysieke_beperkingen || '',
          sector_voorkeur: data.sector_voorkeur || ''
        });
      } else {
        console.log('No extra informatie responses found, using empty defaults');
      }
    } catch (error) {
      console.error('Error loading extra informatie responses:', error);
      toast({
        title: "Fout bij laden",
        description: "Er is een fout opgetreden bij het laden van je gegevens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResponses = async (data: ExtraInformatieData) => {
    if (!user) return false;

    setSaving(true);
    try {
      console.log('Saving extra informatie responses:', data);

      const { error } = await supabase
        .from('extra_informatie_responses')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving extra informatie responses:', error);
        throw error;
      }

      setResponses(data);
      
      toast({
        title: "Gegevens opgeslagen",
        description: "Jouw extra informatie is succesvol opgeslagen.",
      });

      return true;
    } catch (error) {
      console.error('Error saving extra informatie responses:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van je gegevens.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const isCompleted = () => {
    return responses.opleidingsniveau !== '' && 
           responses.beroepsopleiding.trim() !== '';
  };

  const getProgress = () => {
    const fields = [responses.opleidingsniveau, responses.beroepsopleiding, responses.fysieke_beperkingen, responses.sector_voorkeur];
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  return {
    responses,
    loading,
    saving,
    saveResponses,
    isCompleted: isCompleted(),
    progress: getProgress()
  };
};
