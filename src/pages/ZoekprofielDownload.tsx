import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, FileText, Download, ArrowLeft, Clock, AlertTriangle, Home, ArrowRight } from "lucide-react";
import { useZoekprofielPdf } from "@/hooks/useZoekprofielPdf";
const ZoekprofielDownload = () => {
  const navigate = useNavigate();
  const {
    pdfData,
    loading,
    downloading,
    isPdfReady,
    isGenerating,
    downloadPdf,
    initializePdfGeneration
  } = useZoekprofielPdf();
  useEffect(() => {
    // Initialize PDF generation when component mounts if no data exists
    if (!loading && !pdfData) {
      console.log('No zoekprofiel data found, initializing PDF generation...');
      initializePdfGeneration();
    }
  }, [loading, pdfData, initializePdfGeneration]);
  if (loading) {
    return <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Zoekprofiel gegevens laden...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto mx-auto mb-8" />
          
          {isPdfReady && <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Zoekprofiel klaar!</h1>
              <p className="text-2xl text-gray-700 mb-4">Je zoekprofiel is succesvol aangemaakt</p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Download je persoonlijke zoekprofiel en ontdek de functies die perfect bij jou passen!</p>
            </>}

          {isGenerating && <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Zoekprofiel wordt gemaakt!</h1>
              <p className="text-2xl text-gray-700 mb-4">
                Je zoekprofiel wordt momenteel gegenereerd
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We zijn bezig met het creëren van je persoonlijke zoekprofiel. 
                Dit duurt enkele minuten.
              </p>
            </>}

          {pdfData?.pdf_status === 'failed' && <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Er ging iets mis</h1>
              <p className="text-2xl text-gray-700 mb-4">
                Het genereren van je zoekprofiel is mislukt
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ga terug naar het dashboard en probeer het opnieuw.
              </p>
            </>}

          {!pdfData && !loading && <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Zoekprofiel wordt geïnitialiseerd...
              </h1>
              <p className="text-gray-600">
                We starten de generatie van je zoekprofiel PDF.
              </p>
            </>}
        </div>

        {/* Main Download Section */}
        <Card className="mb-12 rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="p-8 md:p-12" style={{
          backgroundColor: '#A9C5E2'
        }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  {isPdfReady && 'Je zoekprofiel is klaar!'}
                  {isGenerating && 'Je zoekprofiel wordt gegenereerd!'}
                  {pdfData?.pdf_status === 'failed' && 'Zoekprofiel generatie mislukt'}
                  {!pdfData && 'Zoekprofiel wordt voorbereid'}
                </h2>
                <p className="text-lg mb-6 opacity-95">
                  {isPdfReady && 'Download je persoonlijke zoekprofiel en ontdek welke functies perfect bij jou passen.'}
                  {isGenerating && 'We zijn bezig met het genereren van je persoonlijke zoekprofiel PDF. Dit duurt even.'}
                  {pdfData?.pdf_status === 'failed' && 'Er is een fout opgetreden bij het genereren. Probeer het opnieuw.'}
                  {!pdfData && 'Je zoekprofiel wordt voorbereid voor download.'}
                </p>
                
                {isPdfReady ? <Button onClick={downloadPdf} disabled={downloading} className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200" size="lg">
                    {downloading ? <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900 mr-3"></div>
                        Downloaden...
                      </> : <>
                        <Download className="w-6 h-6 mr-3" />
                        Download je zoekprofiel
                      </>}
                  </Button> : isGenerating ? <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="text-lg font-medium">Genereren...</span>
                  </div> : null}
              </div>
              
              <div className="flex justify-center">
                <div className="w-40 h-56 bg-white rounded-xl shadow-2xl transform rotate-3 relative overflow-hidden">
                  <div className="h-8 flex items-center px-4" style={{
                  backgroundColor: '#78BFE3'
                }}>
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
                  
                  {!isPdfReady && <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                      {isGenerating ? <Clock className="w-8 h-8 text-gray-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Simple Status Info */}
        {pdfData}

        {/* Navigation */}
        <div className="flex justify-center">
          <Button onClick={() => navigate("/home")} variant="outline" className="rounded-xl px-8 py-3">
            <Home className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Button>
        </div>
      </div>
    </div>;
};
export default ZoekprofielDownload;