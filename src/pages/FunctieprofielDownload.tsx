import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, Home, Share2, Target, ArrowRight, Clock, Linkedin } from "lucide-react";
import { useFunctieprofielPdf } from "@/hooks/useFunctieprofielPdf";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/hooks/useStorageUrl";

const FunctieprofielDownload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    pdfData,
    loading,
    isPdfReady,
    isGenerating,
    downloadPdf,
    loadPdfData,
    initializePdfGeneration
  } = useFunctieprofielPdf();
  const logoUrl = getStorageUrl('assets', 'vinster-logo.png');

  useEffect(() => {
    loadPdfData();
  }, []);

  const handleShare = async () => {
    if (!pdfData?.pdf_url) {
      toast({
        title: "Geen PDF beschikbaar",
        description: "Er is nog geen PDF om te delen.",
        variant: "destructive"
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(pdfData.pdf_url);
      toast({
        title: "PDF URL gekopieerd!",
        description: "De link naar je functieprofiel is gekopieerd naar het klembord."
      });
    } catch (error) {
      console.error('Failed to copy PDF URL:', error);
      toast({
        title: "Kopiëren mislukt",
        description: "Kon de PDF URL niet kopiëren naar het klembord.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Functieprofiel laden...</p>
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
            src={logoUrl}
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-8" 
          />
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Gefeliciteerd!</h1>
          <p className="text-2xl text-gray-700 mb-4">
            Je hebt een belangrijke stap gezet in je loopbaan
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bedankt dat je de tijd hebt genomen om je functieprofiel op te stellen. 
            Je weet nu precies wat je zoekt in je volgende baan!
          </p>
        </div>

        {/* Main Download Section */}
        <Card className="mb-12 rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="p-8 md:p-12" style={{ backgroundColor: '#A9C5E2' }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  {isPdfReady ? 'Je functieprofiel is klaar!' : 'Je functieprofiel wordt gegenereerd!'}
                </h2>
                <p className="text-lg mb-6 opacity-95">
                  {isPdfReady ? 'Download je persoonlijke functieprofiel en gebruik het om gericht op zoek te gaan naar banen die echt bij je passen.' : 'We zijn bezig met het genereren van je persoonlijke functieprofiel PDF. Dit duurt even.'}
                </p>
                
                {isPdfReady ? (
                  <Button 
                    onClick={downloadPdf} 
                    className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                    size="lg"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download je functieprofiel
                  </Button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="text-lg font-medium">
                      {isGenerating ? 'Genereren...' : 'Wachten op generatie...'}
                    </span>
                  </div>
                )}
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
                    <div className="h-4 rounded w-full mt-4" style={{ backgroundColor: '#78BFE3', opacity: 0.7 }}></div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                  
                  {!isPdfReady && (
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[280px]">
            <div className="text-center flex-1 flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deel met je netwerk</h3>
              <p className="text-gray-600 mb-4 flex-1">
                Laat vrienden, familie en collega's weten wat voor werk je zoekt. 
                Ze kunnen je helpen met tips en contacten.
              </p>
              <div className="flex justify-center">
                <Button onClick={handleShare} variant="outline" className="rounded-full h-10 px-6 min-w-[120px]">
                  <Share2 className="w-4 h-4 mr-2" />
                  Delen
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[280px]">
            <div className="text-center flex-1 flex flex-col">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Voeg toe aan LinkedIn</h3>
              <p className="text-gray-600 mb-4 flex-1">
                Update je LinkedIn profiel met je functieprofiel om 
                recruiters te laten weten wat je zoekt.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" className="rounded-full h-10 px-6 min-w-[120px]" onClick={() => window.open('https://linkedin.com', '_blank')}>
                  <Linkedin className="w-4 h-4 mr-2" />
                  Naar LinkedIn
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button onClick={() => navigate("/home")} variant="outline" className="rounded-xl px-8 py-3">
            <Home className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FunctieprofielDownload;
