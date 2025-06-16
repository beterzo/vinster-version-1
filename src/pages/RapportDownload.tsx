
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, Home, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";

const RapportDownload = () => {
  const navigate = useNavigate();
  const { userReport, loadUserReport, loading, downloadPdf } = useRapportGeneration();
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadUserReport();
  }, []);

  // Set up polling for generating status
  useEffect(() => {
    if (userReport?.report_status === 'generating') {
      const interval = setInterval(() => {
        console.log('Polling for PDF status...');
        loadUserReport();
      }, 5000);

      setPollingInterval(interval);
      
      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      };
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [userReport?.report_status]);

  const handleDownload = () => {
    if (userReport?.pdf_file_path) {
      downloadPdf();
    } else {
      // Fallback to JSON download if PDF not available
      if (userReport?.report_data) {
        const dataStr = JSON.stringify(userReport.report_data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mijn-loopbaan-rapport.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Rapport laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-8" 
          />
          
          {userReport?.report_status === 'completed' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Je rapport is klaar!</h1>
              <p className="text-xl text-gray-600">
                Download je persoonlijke loopbaanrapport en ontdek de volgende stappen.
              </p>
            </>
          )}

          {userReport?.report_status === 'generating' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Rapport wordt gemaakt...</h1>
              <p className="text-xl text-gray-600 mb-6">
                Je rapport wordt momenteel gegenereerd. Dit duurt enkele minuten.
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Bezig met genereren...</span>
              </div>
            </>
          )}

          {userReport?.report_status === 'failed' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Er ging iets mis</h1>
              <p className="text-xl text-gray-600">
                Het genereren van je rapport is mislukt. Ga terug naar het dashboard en probeer het opnieuw.
              </p>
            </>
          )}
        </div>

        {/* Action Buttons - Only show when completed */}
        {userReport?.report_status === 'completed' && (
          <div className="space-y-4 mb-12">
            <Button
              onClick={handleDownload}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xl py-6 h-auto"
              size="lg"
            >
              <Download className="w-6 h-6 mr-3" />
              Download je rapport
            </Button>
            
            <Button
              onClick={() => navigate("/onderzoeksplan")}
              className="w-full text-white rounded-xl text-xl py-6 h-auto"
              style={{ backgroundColor: '#21324E' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a3b5c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#21324E'}
              size="lg"
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              Ga verder met je onderzoeksplan
            </Button>
          </div>
        )}

        {/* Simple Status Info */}
        {userReport && (
          <Card className="p-6 bg-white">
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                Rapport aangemaakt: {new Date(userReport.generated_at).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {userReport.pdf_generated_at && (
                <p>
                  PDF beschikbaar sinds: {new Date(userReport.pdf_generated_at).toLocaleDateString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center mt-12">
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RapportDownload;
