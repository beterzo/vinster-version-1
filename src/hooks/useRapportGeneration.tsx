
import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useMakeWebhookData } from './useMakeWebhookData';
import { sendMakeWebhook } from '@/services/webhookService';

export const useRapportGeneration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { collectMakeWebhookData } = useMakeWebhookData();
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
      
      // Send webhook to Make.com after successful report generation
      try {
        const webhookData = collectMakeWebhookData();
        if (webhookData) {
          console.log('Sending webhook data to Make.com...');
          await sendMakeWebhook(webhookData);
          console.log('Make.com webhook sent successfully');
        } else {
          console.warn('No webhook data available to send');
        }
      } catch (webhookError) {
        // Don't fail the entire report generation if webhook fails
        console.error('Error sending Make.com webhook:', webhookError);
        toast({
          title: "Webhook waarschuwing",
          description: "Het rapport is succesvol gegenereerd, maar er was een probleem met het versturen van de notificatie.",
          variant: "destructive",
        });
      }
      
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
