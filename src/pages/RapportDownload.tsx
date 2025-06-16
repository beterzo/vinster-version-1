import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, FileText, Home, Clock, AlertTriangle, Search } from "lucide-react";
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
      }, 5000); // Poll every 5 seconds

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

  const getStatusInfo = () => {
    switch (userReport?.report_status) {
      case 'generating':
        return {
          icon: Clock,
          title: 'PDF wordt gegenereerd...',
          description: 'Je rapport wordt momenteel verwerkt. Dit kan enkele minuten duren.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'Jouw rapport is klaar!',
          description: 'Jouw persoonlijke loopbaanrapport is succesvol gegenereerd en staat klaar voor download.',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'failed':
        return {
          icon: AlertTriangle,
          title: 'Er is een fout opgetreden',
          description: 'Het genereren van je rapport is mislukt. Probeer het opnieuw of neem contact op.',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: FileText,
          title: 'Rapport status onbekend',
          description: 'De status van je rapport kon niet worden bepaald.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
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

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mb-6" 
          />
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{statusInfo.title}</h1>
          </div>
          <p className="text-lg text-gray-700">
            {statusInfo.description}
          </p>
        </div>

        {/* Status Card */}
        <Card className={`p-8 mb-8 bg-gradient-to-r from-gray-50 to-blue-50 ${statusInfo.borderColor}`}>
          <div className="text-center">
            <div className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {userReport?.report_status === 'generating' && 'Rapport wordt verwerkt'}
              {userReport?.report_status === 'completed' && 'Rapport succesvol aangemaakt'}
              {userReport?.report_status === 'failed' && 'Generatie mislukt'}
              {!userReport?.report_status && 'Status onbekend'}
            </h2>
            
            {userReport?.report_status === 'generating' && (
              <p className="text-gray-600 mb-6">
                Je rapport wordt momenteel gegenereerd door onze AI. Dit proces kan enkele minuten duren. 
                De pagina wordt automatisch bijgewerkt zodra je rapport klaar is.
              </p>
            )}
            
            {userReport?.report_status === 'completed' && (
              <p className="text-gray-600 mb-6">
                Jouw rapport bevat een complete analyse van je enthousiasme-scan, wensberoepen, 
                en prioriteiten om je te helpen bij je loopbaankeuzes.
              </p>
            )}

            {userReport?.report_status === 'failed' && (
              <p className="text-gray-600 mb-6">
                Er is een fout opgetreden tijdens het genereren van je rapport. 
                Ga terug naar het overzicht om het opnieuw te proberen.
              </p>
            )}
            
            {userReport && userReport.report_status !== 'failed' && (
              <div className="bg-white rounded-lg p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Rapport aangemaakt:</span>
                    <p className="font-medium">
                      {new Date(userReport.generated_at).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium">
                      {userReport.report_status === 'completed' && <span className="text-green-600">Voltooid</span>}
                      {userReport.report_status === 'generating' && <span className="text-blue-600">Genereren...</span>}
                      {userReport.report_status === 'failed' && <span className="text-red-600">Mislukt</span>}
                    </p>
                  </div>
                </div>
                {userReport.pdf_generated_at && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-gray-500">PDF gegenereerd:</span>
                    <p className="font-medium">
                      {new Date(userReport.pdf_generated_at).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {userReport?.report_status === 'completed' && (
              <Button
                onClick={handleDownload}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-lg px-8 py-3"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                {userReport.pdf_file_path ? 'Download PDF rapport' : 'Download rapport (JSON)'}
              </Button>
            )}

            {userReport?.report_status === 'generating' && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>PDF wordt gegenereerd...</span>
              </div>
            )}
          </div>
        </Card>

        {/* Info Card - only show when completed */}
        {userReport?.report_status === 'completed' && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Wat zit er in jouw rapport?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Enthousiasme-analyse</h4>
                    <p className="text-sm text-gray-600">Inzichten in wat jou energie geeft</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Beroepen-matching</h4>
                    <p className="text-sm text-gray-600">Passende beroepen bij jouw profiel</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Prioriteiten overzicht</h4>
                    <p className="text-sm text-gray-600">Jouw belangrijkste werkfactoren</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Persoonlijke aanbevelingen</h4>
                    <p className="text-sm text-gray-600">Concrete stappen voor je loopbaan</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Research Plan - only show when completed */}
        {userReport?.report_status === 'completed' && (
          <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-yellow-50 border-blue-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">En nu?</h2>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Onderzoek doen!</h3>
              <p className="text-gray-700 mb-6">
                Nu je je rapport hebt, is het tijd om dieper te duiken in de beroepen die bij je passen. 
                Volg dit onderzoeksplan om de beste keuze te maken:
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Dit is jouw onderzoeksplan:</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <p className="text-gray-700">
                    Vraag AI naar een functie- of beroepsbeschrijving. Vraag ook naar vergelijkbare functies. 
                    Welk werk lijkt erop? Wat spreekt je aan in de antwoorden die je krijgt?
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <p className="text-gray-700">
                    Kijk of je vacatures kunt vinden die een beeld geven van de inhoud van dit beroep.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <p className="text-gray-700">
                    Zoek op LinkedIn naar mensen die dit werk doen. Wat is hun achtergrond?
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <p className="text-gray-700">
                    Is er een beroepsvereniging? Wat lees je op de website over ontwikkelingen in de sector en het beroep?
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">5</span>
                  </div>
                  <p className="text-gray-700">
                    Heeft het beroep een vakblad? Zo ja, vraag er één of meerdere op en lees ze. 
                    Wat valt je op? Word je enthousiast van de onderwerpen?
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">6</span>
                  </div>
                  <p className="text-gray-700">
                    Zoek organisaties waar mensen met dit beroep werken.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">7</span>
                  </div>
                  <p className="text-gray-700">
                    Welke opleiding heb je eventueel nodig voor dit werk? 
                    Schrijf alle vragen die bij je opkomen op. Die kun je gaan stellen aan mensen die al werkzaam zijn in deze richting.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-yellow-600 font-bold text-sm">8</span>
                  </div>
                  <p className="text-gray-700">
                    Maak een lijstje met mensen die je zou willen spreken over dit werk en benader hen.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-700 font-medium">
                  Als je genoeg aan de weet bent gekomen kies dan de functie die het allerbest bij je past 
                  en ga verder met <span className="text-yellow-600 font-bold">de allerlaatste stap: het maken van jouw zoekprofiel!</span>
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/home")}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Naar dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RapportDownload;
