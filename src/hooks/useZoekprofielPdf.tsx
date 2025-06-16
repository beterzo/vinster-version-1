
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ZoekprofielPdf {
  id: string;
  user_id: string;
  pdf_file_path: string | null;
  pdf_generated_at: string | null;
  pdf_status: string;
  created_at: string;
  updated_at: string;
}

export const useZoekprofielPdf = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pdfData, setPdfData] = useState<ZoekprofielPdf | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const loadPdfData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading zoekprofiel PDF data for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_zoekprofielen')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading zoekprofiel PDF data:', error);
        throw error;
      }

      console.log('✅ Loaded zoekprofiel PDF data:', data);
      setPdfData(data);

      // Generate download URL if PDF exists
      if (data?.pdf_file_path && data.pdf_status === 'completed') {
        const { data: urlData } = await supabase.storage
          .from('zoekprofiel-pdfs')
          .createSignedUrl(data.pdf_file_path, 3600); // 1 hour expiry

        if (urlData?.signedUrl) {
          setDownloadUrl(urlData.signedUrl);
        }
      }

    } catch (error) {
      console.error('❌ Failed to load zoekprofiel PDF data:', error);
      toast({
        title: "Fout bij laden",
        description: "Kon je zoekprofiel PDF gegevens niet laden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const downloadPdf = useCallback(async () => {
    if (!pdfData?.pdf_file_path) {
      toast({
        title: "Geen PDF beschikbaar",
        description: "Er is nog geen PDF gegenereerd voor je zoekprofiel.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('📄 Downloading zoekprofiel PDF...');

      if (downloadUrl) {
        // Use existing signed URL
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'mijn-zoekprofiel.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Download gestart",
          description: "Je zoekprofiel PDF wordt gedownload.",
        });
      } else {
        throw new Error('Geen download URL beschikbaar');
      }

    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      toast({
        title: "Fout bij downloaden",
        description: "Kon je zoekprofiel PDF niet downloaden.",
        variant: "destructive"
      });
    }
  }, [pdfData, downloadUrl, toast]);

  const initializePdfGeneration = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('🚀 Initializing zoekprofiel PDF generation...');
      
      const { error } = await supabase
        .from('user_zoekprofielen')
        .upsert({
          user_id: user.id,
          pdf_status: 'generating'
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Reload data after initialization
      await loadPdfData();

    } catch (error) {
      console.error('❌ Error initializing PDF generation:', error);
      toast({
        title: "Fout bij initialiseren",
        description: "Kon PDF generatie niet starten.",
        variant: "destructive"
      });
    }
  }, [user?.id, toast, loadPdfData]);

  useEffect(() => {
    loadPdfData();
  }, [loadPdfData]);

  const isPdfReady = pdfData?.pdf_status === 'completed' && pdfData?.pdf_file_path;
  const isGenerating = pdfData?.pdf_status === 'generating';

  return {
    pdfData,
    loading,
    downloadUrl,
    isPdfReady,
    isGenerating,
    downloadPdf,
    loadPdfData,
    initializePdfGeneration
  };
};
