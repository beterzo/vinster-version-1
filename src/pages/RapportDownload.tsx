import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, Home, Clock, AlertTriangle, ArrowRight, FileText, AlertCircle } from "lucide-react";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";

const RapportDownload = () => {
  const navigate = useNavigate();
  const { userReport, loadUserReport, loading, downloadPdf, isLoading, rapportData, error } = useRapportGeneration();
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
        link.download = 'mijn-loopbaanrapport.json';
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
          <p className="mt-4 text-gray-600">Loopbaanrapport laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-8" 
          />
          
          {userReport?.report_status === 'completed' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Gefeliciteerd!</h1>
              <p className="text-2xl text-gray-700 mb-4">
                Je hebt een belangrijke stap gezet in je loopbaan
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bedankt dat je de tijd hebt genomen om je loopbaanrapport op te stellen. 
                Je weet nu precies welke richting je op wilt!
              </p>
            </>
          )}

          {userReport?.report_status === 'generating' && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Loopbaanrapport wordt gemaakt!</h1>
              <p className="text-2xl text-gray-700 mb-4">
                Je loopbaanrapport wordt momenteel gegenereerd
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We zijn bezig met het creëren van je persoonlijke loopbaanrapport. 
                Dit duurt enkele minuten.
              </p>
            </>
          )}

          {userReport?.report_status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Er ging iets mis</h1>
              <p className="text-2xl text-gray-700 mb-4">
                Het genereren van je loopbaanrapport is mislukt
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ga terug naar het dashboard en probeer het opnieuw.
              </p>
            </>
          )}

          {isLoading && (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Rapport wordt gegenereerd...
              </h1>
              <p className="text-gray-600">
                Even geduld terwijl we jouw persoonlijke loopbaanrapport genereren.
              </p>
            </>
          )}

          {rapportData && !isLoading && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Rapport klaar!
              </h1>
            </>
          )}

          {error && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Er is een fout opgetreden
              </h1>
            </>
          )}
        </div>

        {/* Main Download Section */}
        <Card className="mb-12 rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="p-8 md:p-12" style={{ backgroundColor: '#A9C5E2' }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  {userReport?.report_status === 'completed' && 'Je loopbaanrapport is klaar!'}
                  {userReport?.report_status === 'generating' && 'Je loopbaanrapport wordt gegenereerd!'}
                  {userReport?.report_status === 'failed' && 'Loopbaanrapport generatie mislukt'}
                </h2>
                <p className="text-lg mb-6 opacity-95">
                  {userReport?.report_status === 'completed' && 
                    'Download je persoonlijke loopbaanrapport en ontdek de volgende stappen in je carrière.'
                  }
                  {userReport?.report_status === 'generating' && 
                    'We zijn bezig met het genereren van je persoonlijke loopbaanrapport PDF. Dit duurt even.'
                  }
                  {userReport?.report_status === 'failed' && 
                    'Er is een fout opgetreden bij het genereren. Probeer het opnieuw.'
                  }
                </p>
                
                {userReport?.report_status === 'completed' ? (
                  <Button
                    onClick={handleDownload}
                    className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download je loopbaanrapport
                  </Button>
                ) : userReport?.report_status === 'generating' ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="text-lg font-medium">Genereren...</span>
                  </div>
                ) : null}
              </div>
              
              <div className="flex justify-center">
                <div className="w-40 h-56 bg-white rounded-xl shadow-2xl transform rotate-3 relative overflow-hidden">
                  <div className="h-8 flex items-center px-4" style={{ backgroundColor: '#78BFE3' }}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                      <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                      <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="h-2 bg-gray-300 rounded w-full"></div>
                    <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-2 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 rounded w-full mt-4" style={{
                      backgroundColor: '#78BFE3',
                      opacity: 0.7
                    }}></div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                  
                  {userReport?.report_status !== 'completed' && (
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                      {userReport?.report_status === 'generating' ? (
                        <Clock className="w-8 h-8 text-gray-500" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button - Only show when completed */}
        {userReport?.report_status === 'completed' && (
          <div className="flex justify-center mb-12">
            <Button
              onClick={() => navigate("/onderzoeksplan")}
              className="text-white rounded-xl text-xl py-6 h-auto px-8"
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
          <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 mb-12">
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                Loopbaanrapport aangemaakt: {new Date(userReport.generated_at).toLocaleDateString('nl-NL', {
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
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="rounded-xl px-8 py-3"
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
