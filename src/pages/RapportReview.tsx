
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useRapportData } from "@/hooks/useRapportData";
import { supabase } from "@/integrations/supabase/client";

const RapportReview = () => {
  const navigate = useNavigate();
  const { data: reportData, loading, refreshData } = useRapportData();
  const [reportStatus, setReportStatus] = useState<'pending' | 'generating' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    if (reportData) {
      setReportStatus(reportData.report_status as any);
    }
  }, [reportData]);

  // Set up realtime subscription for report status updates
  useEffect(() => {
    if (!reportData?.user_id) return;

    console.log('Setting up realtime subscription for user reports...');
    
    const channel = supabase
      .channel('user-reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_reports',
          filter: `user_id=eq.${reportData.user_id}`
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          const newData = payload.new as any;
          if (newData.report_status) {
            setReportStatus(newData.report_status);
            
            // If report is completed, refresh data to get latest info
            if (newData.report_status === 'completed') {
              refreshData();
            }
          }
        }
      )
      .subscribe();

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

  const handleViewReport = () => {
    navigate('/rapport-download');
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
          title: "Je rapport is klaar!",
          description: "Je persoonlijke carrièrerapport is succesvol gegenereerd en klaar om te bekijken."
        };
      case 'generating':
        return {
          title: "Je rapport wordt gegenereerd...",
          description: "We werken hard aan je persoonlijke carrièrerapport. Dit kan enkele minuten duren."
        };
      case 'failed':
        return {
          title: "Er ging iets mis",
          description: "Er is een fout opgetreden bij het genereren van je rapport. Probeer het opnieuw of neem contact op met support."
        };
      default:
        return {
          title: "Rapport wordt voorbereid...",
          description: "Je profiel is voltooid en je rapport wordt automatisch gegenereerd."
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Rapport status laden...</p>
        </div>
      </div>
    );
  }

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                {getStatusIcon()}
              </div>
              
              <h1 className="text-4xl font-bold text-blue-900 mb-4">
                {status.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {status.description}
              </p>
            </div>

            <div className="space-y-4">
              {reportStatus === 'completed' && (
                <Button
                  onClick={handleViewReport}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg"
                >
                  Bekijk je rapport
                </Button>
              )}

              {(reportStatus === 'generating' || reportStatus === 'pending') && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4"></div>
                  <p className="text-gray-600 mb-4">
                    Je rapport wordt gegenereerd... Dit kan 2-5 minuten duren.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> Laat deze pagina open. Je krijgt automatisch een melding zodra je rapport klaar is!
                    </p>
                  </div>
                  <Button
                    onClick={refreshData}
                    variant="outline"
                    className="mt-4 border-blue-900 text-blue-900 hover:bg-blue-50"
                  >
                    Status vernieuwen
                  </Button>
                </div>
              )}

              {reportStatus === 'failed' && (
                <div className="text-center">
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-red-700">
                      Er is een technische fout opgetreden. Neem contact op met support als dit probleem aanhoudt.
                    </p>
                  </div>
                  <Button
                    onClick={refreshData}
                    variant="outline"
                    size="lg"
                    className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-8 py-4 rounded-lg"
                  >
                    Status controleren
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Button
                onClick={() => navigate('/home')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Terug naar dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RapportReview;
