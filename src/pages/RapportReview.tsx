
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";
import { useRapportData } from "@/hooks/useRapportData";

const RapportReview = () => {
  const navigate = useNavigate();
  const { generateReport, generating } = useRapportGeneration();
  const { data: reportData, loading } = useRapportData();
  const [reportStatus, setReportStatus] = useState<'pending' | 'generating' | 'ready' | 'error'>('pending');

  useEffect(() => {
    if (reportData) {
      setReportStatus(reportData.report_status as any);
    }
  }, [reportData]);

  const handleGenerateReport = async () => {
    try {
      await generateReport({ includeUserData: true });
      // After generation starts, poll for status
      setReportStatus('generating');
    } catch (error) {
      console.error('Error generating report:', error);
      setReportStatus('error');
    }
  };

  const handleViewReport = () => {
    navigate('/rapport-download');
  };

  const getStatusIcon = () => {
    switch (reportStatus) {
      case 'ready':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'generating':
        return <Clock className="w-12 h-12 text-blue-600 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
      default:
        return <Clock className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (reportStatus) {
      case 'ready':
        return {
          title: "Je rapport is klaar!",
          description: "Je persoonlijke carrièrerapport is succesvol gegenereerd en klaar om te bekijken."
        };
      case 'generating':
        return {
          title: "Rapport wordt gegenereerd...",
          description: "We werken hard aan je persoonlijke carrièrerapport. Dit kan enkele minuten duren."
        };
      case 'error':
        return {
          title: "Er ging iets mis",
          description: "Er is een fout opgetreden bij het genereren van je rapport. Probeer het opnieuw."
        };
      default:
        return {
          title: "Klaar voor rapportgeneratie",
          description: "Je hebt alle stappen voltooid. Klik op de knop om je persoonlijke carrièrerapport te genereren."
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
              {reportStatus === 'ready' && (
                <Button
                  onClick={handleViewReport}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg"
                >
                  Bekijk je rapport
                </Button>
              )}

              {reportStatus === 'pending' && (
                <Button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  size="lg"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg"
                >
                  {generating ? "Genereren..." : "Genereer rapport"}
                </Button>
              )}

              {reportStatus === 'generating' && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Je rapport wordt gegenereerd... Dit kan 2-5 minuten duren.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-4 border-blue-900 text-blue-900 hover:bg-blue-50"
                  >
                    Status vernieuwen
                  </Button>
                </div>
              )}

              {reportStatus === 'error' && (
                <Button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  variant="outline"
                  size="lg"
                  className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-8 py-4 rounded-lg"
                >
                  {generating ? "Opnieuw genereren..." : "Probeer opnieuw"}
                </Button>
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
