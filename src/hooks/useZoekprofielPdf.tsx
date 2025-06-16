
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ZoekprofielPdf {
  id: string;
  user_id: string;
  pdf_url: string | null;
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
  
  // Refs for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannelRef = useRef<any>(null);

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

  // Setup real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔄 Setting up real-time subscription for zoekprofiel updates');

    // Create real-time subscription
    const channel = supabase
      .channel('zoekprofiel-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_zoekprofielen',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 Real-time update received:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as ZoekprofielPdf;
            setPdfData(newData);
            
            // Show success message when PDF is completed
            if (newData.pdf_status === 'completed' && newData.pdf_url) {
              toast({
                title: "PDF gereed!",
                description: "Je zoekprofiel PDF is succesvol gegenereerd en kan nu gedownload worden.",
              });
              
              // Stop polling when completed
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
            }
          }
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      console.log('🧹 Cleaning up real-time subscription');
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [user?.id, toast]);

  // Setup polling for generating status
  useEffect(() => {
    if (!pdfData || pdfData.pdf_status !== 'generating') {
      // Clear any existing polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    console.log('⏰ Starting polling for PDF generation status');

    // Poll every 3 seconds while generating
    pollingIntervalRef.current = setInterval(() => {
      console.log('🔄 Polling PDF status...');
      loadPdfData();
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [pdfData?.pdf_status, loadPdfData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, []);

  const downloadPdf = useCallback(async () => {
    if (!pdfData?.pdf_url) {
      toast({
        title: "Geen PDF beschikbaar",
        description: "Er is nog geen PDF gegenereerd voor je zoekprofiel.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('📄 Downloading zoekprofiel PDF from URL:', pdfData.pdf_url);

      // Create download link using the external PDF URL
      const link = document.createElement('a');
      link.href = pdfData.pdf_url;
      link.download = 'mijn-zoekprofiel.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download gestart",
        description: "Je zoekprofiel PDF wordt gedownload.",
      });

    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      toast({
        title: "Fout bij downloaden",
        description: "Kon je zoekprofiel PDF niet downloaden.",
        variant: "destructive"
      });
    }
  }, [pdfData, toast]);

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

  // Initial load
  useEffect(() => {
    loadPdfData();
  }, [loadPdfData]);

  const isPdfReady = pdfData?.pdf_status === 'completed' && pdfData?.pdf_url;
  const isGenerating = pdfData?.pdf_status === 'generating';

  return {
    pdfData,
    loading,
    downloadUrl: pdfData?.pdf_url || null,
    isPdfReady,
    isGenerating,
    downloadPdf,
    loadPdfData,
    initializePdfGeneration
  };
};
