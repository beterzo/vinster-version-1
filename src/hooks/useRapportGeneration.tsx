
import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useRapportGeneration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [userReport, setUserReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadUserReport = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setUserReport(data);
      return data;
    } catch (error) {
      console.error('Error loading user report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (rapportData: any) => {
    if (!user) return false;

    setGenerating(true);
    try {
      console.log('Generating report for user:', user.id);

      // Create report record
      const { data: reportData, error } = await supabase
        .from('user_reports')
        .upsert({
          user_id: user.id,
          report_data: rapportData,
          report_status: 'completed',
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setUserReport(reportData);
      
      toast({
        title: "Rapport gegenereerd",
        description: "Jouw persoonlijke rapport is succesvol aangemaakt!",
      });

      return true;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Fout bij genereren",
        description: "Er is een fout opgetreden bij het genereren van je rapport.",
        variant: "destructive",
      });
      return false;
    } finally {
      setGenerating(false);
    }
  };

  return {
    userReport,
    loading,
    generating,
    loadUserReport,
    generateReport
  };
};
