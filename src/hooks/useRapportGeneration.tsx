import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useMakeWebhookData } from './useMakeWebhookData';
import { sendMakeWebhook } from '@/services/webhookService';

export const useRapportGeneration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { collectMakeWebhookData } = useMakeWebhookData();
  const [generating, setGenerating] = useState(false);
  const [userReport, setUserReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      console.log('Generating loopbaanrapport for user:', user.id);

      // Create report record with generating status
      const { data: reportData, error } = await supabase
        .from('user_reports')
        .upsert({
          user_id: user.id,
          report_data: rapportData,
          report_status: 'generating',
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setUserReport(reportData);
      
      // Send webhook to Make.com for PDF generation
      try {
        const webhookData = collectMakeWebhookData();
        if (webhookData) {
          console.log('Sending webhook data to Make.com for PDF generation...');
          await sendMakeWebhook(webhookData);
          console.log('Make.com webhook sent successfully - PDF generation started');
        } else {
          console.warn('No webhook data available to send');
        }
      } catch (webhookError) {
        // If webhook fails, update status to failed
        await supabase
          .from('user_reports')
          .update({
            report_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        console.error('Error sending Make.com webhook:', webhookError);
        toast({
          title: t('common.toast.generate_error'),
          description: t('common.toast.generate_error_description'),
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "PDF generatie gestart",
        description: "Je loopbaanrapport wordt gegenereerd. Je wordt automatisch doorgestuurd zodra het klaar is.",
      });

      return true;
    } catch (error) {
      console.error('Error generating loopbaanrapport:', error);
      toast({
        title: t('common.toast.generate_error'),
        description: t('common.toast.generate_error_description'),
        variant: "destructive",
      });
      return false;
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = async () => {
    if (!user || !userReport?.pdf_file_path) {
      console.warn('⚠️ No user or PDF file path available for download');
      toast({
        title: "Download niet mogelijk",
        description: "PDF bestand is nog niet beschikbaar.",
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);
    console.log('📄 Starting loopbaanrapport PDF download from path:', userReport.pdf_file_path);

    try {
      // First attempt: Direct download from Supabase storage
      console.log('🔄 Attempting Supabase storage download...');
      
      const { data, error } = await supabase.storage
        .from('user-reports')
        .download(userReport.pdf_file_path);

      if (error) {
        console.error('❌ Supabase storage download failed:', error);
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mijn-loopbaanrapport-${new Date().toISOString().split('T')[0]}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Supabase storage download successful');
      toast({
        title: "Download gestart",
        description: "Je loopbaanrapport wordt gedownload.",
      });

    } catch (storageError) {
      console.warn('⚠️ Supabase storage download failed, trying alternative methods:', storageError);
      
      try {
        // Fallback: Try to get public URL and download
        console.log('🔄 Attempting public URL download...');
        
        const { data: urlData } = supabase.storage
          .from('user-reports')
          .getPublicUrl(userReport.pdf_file_path);

        if (urlData?.publicUrl) {
          const response = await fetch(urlData.publicUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `mijn-loopbaanrapport-${new Date().toISOString().split('T')[0]}.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          console.log('✅ Public URL download successful');
          toast({
            title: "Download gestart",
            description: "Je loopbaanrapport wordt gedownload.",
          });
        } else {
          throw new Error('No public URL available');
        }

      } catch (fallbackError) {
        console.error('❌ All download methods failed:', {
          storageError: storageError,
          fallbackError: fallbackError
        });
        
        toast({
          title: "Download mislukt",
          description: "Er is een probleem opgetreden bij het downloaden. Probeer het later opnieuw of neem contact op met support.",
          variant: "destructive",
        });
      }
    } finally {
      setDownloading(false);
    }
  };

  return {
    userReport,
    loading,
    generating,
    downloading,
    loadUserReport,
    generateReport,
    downloadPdf
  };
};
