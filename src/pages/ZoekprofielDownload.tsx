import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ExternalLink, CheckCircle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { useZoekprofielPdf } from "@/hooks/useZoekprofielPdf";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
const ZoekprofielDownload = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const { t } = useTranslation();
  const {
    pdfData,
    loading,
    downloading,
    downloadUrl,
    isPdfReady,
    isGenerating,
    downloadPdf,
    loadPdfData
  } = useZoekprofielPdf();
  const [isDownloading, setIsDownloading] = useState(false);

  // Set up realtime subscription for PDF status updates
  useEffect(() => {
    if (!pdfData?.user_id) return;
    console.log('Setting up realtime subscription for zoekprofiel PDF updates...');
    const channel = supabase.channel('zoekprofiel-pdf-changes').on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'user_zoekprofielen',
      filter: `user_id=eq.${pdfData.user_id}`
    }, payload => {
      console.log('Realtime PDF update received:', payload);
      const newData = payload.new as any;
      if (newData.pdf_status) {
        // If PDF is completed, refresh data to get latest info
        if (newData.pdf_status === 'completed') {
          loadPdfData();
          toast({
            title: t('journey.zoekprofiel.download.title'),
            description: t('journey.zoekprofiel.download.description')
          });
        }
      }
    }).subscribe();
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [pdfData?.user_id, loadPdfData, toast]);

  // Auto-refresh status every 30 seconds as backup to realtime
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        console.log('Polling for PDF status update...');
        loadPdfData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isGenerating, loadPdfData]);
  const handleDownload = async () => {
    if (!downloadUrl) {
      console.warn('No PDF URL available for download');
      return;
    }
    setIsDownloading(true);
    console.log('Starting download from URL:', downloadUrl);
    try {
      await downloadPdf();
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download mislukt",
        description: "Er ging iets mis bij het downloaden van je zoekprofiel.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  const handleOpenInNewTab = () => {
    if (downloadUrl) {
      console.log('Opening PDF in new tab:', downloadUrl);
      window.open(downloadUrl, '_blank');
    }
  };
  const handleNextStep = () => {
    navigate('/home');
  };
  const getStatusIcon = () => {
    switch (pdfData?.pdf_status) {
      case 'completed':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'generating':
        return <Clock className="w-12 h-12 text-blue-600 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
      default:
        return <Clock className="w-12 h-12 text-gray-400" />;
    }
  };
  const getStatusMessage = () => {
    switch (pdfData?.pdf_status) {
      case 'completed':
        return {
          title: t('journey.zoekprofiel.download.title'),
          description: t('journey.zoekprofiel.download.description')
        };
      case 'generating':
        return {
          title: t('journey.zoekprofiel.download.generating_title'),
          description: t('journey.zoekprofiel.download.generating_description')
        };
      case 'failed':
        return {
          title: t('journey.zoekprofiel.download.error_title'),
          description: t('journey.zoekprofiel.download.error_description')
        };
      default:
        return {
          title: t('journey.zoekprofiel.download.preparing_title'),
          description: t('journey.zoekprofiel.download.preparing_description')
        };
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Zoekprofiel gegevens laden...</p>
        </div>
      </div>;
  }
  const status = getStatusMessage();
  return <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img alt="Vinster Logo" onClick={() => navigate('/home')} src="/lovable-uploads/96b14b9f-3aed-45fa-b573-768a8f04d529.png" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                {isPdfReady ? <FileText className="w-10 h-10 text-green-600" /> : getStatusIcon()}
              </div>
              
              <h1 className="text-4xl font-bold text-blue-900 mb-4">
                {status.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {status.description}
              </p>
            </div>

            {isPdfReady && downloadUrl && <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleDownload} disabled={isDownloading || downloading} size="lg" className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {isDownloading || downloading ? "Downloaden..." : t('journey.zoekprofiel.download.download_button')}
                  </Button>
                  
                  <Button onClick={handleOpenInNewTab} variant="outline" size="lg" className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Bekijk in browser
                  </Button>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-4">
                    💡 <strong>Tip:</strong> Gebruik je zoekprofiel bij sollicitaties en deel het met recruiters!
                  </p>
                </div>

                {/* Next Step Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Terug naar je dashboard
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bekijk je volledige profiel en andere rapporten in je dashboard.
                  </p>
                  <Button onClick={handleNextStep} size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-4 rounded-lg flex items-center gap-2 mx-auto">
                    Ga naar dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>}

            {(isGenerating || pdfData?.pdf_status === 'pending') && <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-4">
                  Je zoekprofiel wordt gegenereerd... Dit kan 2-5 minuten duren.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> Laat deze pagina open. Je krijgt automatisch een melding zodra je zoekprofiel klaar is!
                  </p>
                </div>
                <Button onClick={loadPdfData} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  Status vernieuwen
                </Button>
              </div>}

            {pdfData?.pdf_status === 'failed' && <div className="text-center">
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-red-700">
                    Er is een technische fout opgetreden. Neem contact op met support als dit probleem aanhoudt.
                  </p>
                </div>
                <Button onClick={loadPdfData} variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-8 py-4 rounded-lg">
                  Status controleren
                </Button>
              </div>}

            {!pdfData?.pdf_status && <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Je zoekprofiel wordt nog gegenereerd. Dit kan enkele minuten duren.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  Pagina verversen
                </Button>
              </div>}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Button onClick={() => navigate('/home')} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                {t('journey.zoekprofiel.download.back_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default ZoekprofielDownload;