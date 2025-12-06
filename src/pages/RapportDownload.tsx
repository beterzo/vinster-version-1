import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ExternalLink, CheckCircle, AlertCircle, Clock, ArrowRight, Lock } from "lucide-react";
import { useRapportData } from "@/hooks/useRapportData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useStepAccess } from "@/hooks/useStepAccess";
import ConditionalRoute from "@/components/ConditionalRoute";
import { useReportGenerationLimit } from "@/hooks/useReportGenerationLimit";
const RapportDownload = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    t
  } = useTranslation();
  const stepAccess = useStepAccess();
  const {
    hasCompletedReport,
    canGenerateNewReport
  } = useReportGenerationLimit();
  const {
    data: reportData,
    loading,
    refreshData
  } = useRapportData();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportStatus, setReportStatus] = useState<'pending' | 'generating' | 'completed' | 'failed'>('pending');
  useEffect(() => {
    if (reportData) {
      setReportStatus(reportData.report_status as any);
      if (reportData?.pdf_file_path) {
        console.log('PDF file path found:', reportData.pdf_file_path);

        // Get the public URL for the PDF
        const {
          data
        } = supabase.storage.from('user-reports').getPublicUrl(reportData.pdf_file_path);
        console.log('Generated public URL:', data.publicUrl);
        setPdfUrl(data.publicUrl);
      } else {
        console.log('No PDF file path found in report data:', reportData);
      }
    }
  }, [reportData]);

  // Set up realtime subscription for report status updates
  useEffect(() => {
    if (!reportData?.user_id) return;
    console.log('Setting up realtime subscription for user reports...');
    const channel = supabase.channel('user-reports-changes').on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'user_reports',
      filter: `user_id=eq.${reportData.user_id}`
    }, payload => {
      console.log('Realtime update received:', payload);
      const newData = payload.new as any;
      if (newData.report_status) {
        setReportStatus(newData.report_status);

        // If report is completed, refresh data to get latest info
        if (newData.report_status === 'completed') {
          refreshData();
        }
      }
    }).subscribe();
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [reportData?.user_id, refreshData]);

  // Auto-refresh status every 30 seconds as backup to realtime
  useEffect(() => {
    if (reportStatus === 'generating') {
      const interval = setInterval(() => {
        console.log('Polling for report status update...');
        refreshData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [reportStatus, refreshData]);
  const handleDownload = async () => {
    if (!pdfUrl) {
      console.warn('No PDF URL available for download');
      return;
    }
    setIsDownloading(true);
    console.log('Starting download from URL:', pdfUrl);
    try {
      const response = await fetch(pdfUrl);
      console.log('Fetch response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const blob = await response.blob();
      console.log('Downloaded blob size:', blob.size, 'bytes');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'vinster-rapport.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: t('journey.rapport.download.download_button'),
        description: t('journey.rapport.download.description')
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: t('journey.rapport.download.download_failed'),
        description: t('journey.rapport.download.download_error').replace('{error}', error instanceof Error ? error.message : t('auth.unknown_error')),
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      console.log('Opening PDF in new tab:', pdfUrl);
      window.open(pdfUrl, '_blank');
    }
  };
  const handleNextStep = () => {
    navigate('/onderzoeksplan');
  };
  const getStatusIcon = () => {
    switch (reportStatus) {
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
    switch (reportStatus) {
      case 'completed':
        return {
          title: t('journey.rapport.download.title'),
          description: t('journey.rapport.download.description')
        };
      case 'generating':
        return {
          title: t('journey.rapport.download.generating_title'),
          description: t('journey.rapport.download.generating_description')
        };
      case 'failed':
        return {
          title: t('journey.rapport.download.error_title'),
          description: t('journey.rapport.download.error_description')
        };
      default:
        return {
          title: t('journey.rapport.download.pending_title'),
          description: t('journey.rapport.download.pending_description')
        };
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700">{t('journey.rapport.download.loading_data')}</p>
        </div>
      </div>;
  }
  const status = getStatusMessage();
  return <ConditionalRoute canAccess={stepAccess.rapport.canAccess} isLoading={stepAccess.isLoading} blockedReason={stepAccess.rapport.blockedReason}>
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img alt="Vinster Logo" className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/home')} src="/lovable-uploads/de495604-1c6f-44c1-b2ab-a9018e806bda.png" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="mx-auto mb-6 flex justify-center">
                {reportStatus === 'completed' ? <img src="/lovable-uploads/dab4ec5f-9a13-4472-9793-48c879bdc26e.png" alt="Vinster" className="w-24 h-24 object-contain" /> : <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    {getStatusIcon()}
                  </div>}
              </div>
              
              <h1 className="text-4xl font-bold text-blue-900 mb-4">
                {status.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {status.description}
              </p>
            </div>

            {reportStatus === 'completed' && pdfUrl && <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleDownload} disabled={isDownloading} size="lg" className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {isDownloading ? t('journey.rapport.download.downloading') : t('journey.rapport.download.download_button')}
                  </Button>
                  
                  <Button onClick={handleOpenInNewTab} variant="outline" size="lg" className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    {t('journey.rapport.download.view_browser')}
                  </Button>
                </div>
                
                

                {/* Next Step Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {t('journey.rapport.download.next_step_title')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('journey.rapport.download.next_step_description')}
                  </p>
                  <Button onClick={handleNextStep} size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-4 rounded-lg flex items-center gap-2 mx-auto">
                    {t('journey.rapport.download.research_plan_button')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Restart Journey Section */}
                {hasCompletedReport && !canGenerateNewReport && <div className="mt-8 p-6 border border-primary/20 bg-primary/5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {t('dashboard.report_limit.view_only_notice')}
                        </h3>
                        <Button onClick={() => navigate('/traject-opnieuw-starten')} variant="outline" className="mt-3 gap-2">
                          <Lock className="w-4 h-4" />
                          {t('dashboard.report_limit.restart_cta')}
                        </Button>
                      </div>
                    </div>
                  </div>}
              </div>}

            {(reportStatus === 'generating' || reportStatus === 'pending') && <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-4">
                  {t('journey.rapport.download.generating_status')}
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700">
                    {t('journey.rapport.download.generating_tip')}
                  </p>
                </div>
                <Button onClick={refreshData} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  {t('journey.rapport.download.refresh_status')}
                </Button>
              </div>}

            {reportStatus === 'failed' && <div className="text-center">
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-red-700">
                    {t('journey.rapport.download.error_technical')}
                  </p>
                </div>
                <Button onClick={refreshData} variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-8 py-4 rounded-lg">
                  {t('journey.rapport.download.check_status')}
                </Button>
              </div>}

            {reportStatus !== 'completed' && reportStatus !== 'generating' && reportStatus !== 'pending' && reportStatus !== 'failed' && !pdfUrl && <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {t('journey.rapport.download.generating_fallback')}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  {t('journey.rapport.download.refresh_page')}
                </Button>
              </div>}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Button onClick={() => navigate('/home')} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                {t('journey.rapport.download.back_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ConditionalRoute>;
};
export default RapportDownload;