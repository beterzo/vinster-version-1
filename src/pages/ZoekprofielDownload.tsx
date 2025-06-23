
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, FileText, Download, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          <Card className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-xl font-semibold text-vinster-blue mb-2">
              Zoekprofiel gegevens laden...
            </h1>
            <p className="text-gray-600">
              Even geduld, we laden je zoekprofiel informatie.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <Card className="bg-white shadow-lg rounded-lg p-8 text-center">
          {isGenerating && (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Zoekprofiel wordt gegenereerd...
              </h1>
              <p className="text-gray-600 mb-4">
                Even geduld, we genereren je persoonlijke zoekprofiel PDF.
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </>
          )}

          {isPdfReady && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Zoekprofiel klaar!
              </h1>
              <p className="text-gray-600 mb-6">
                Je zoekprofiel PDF is succesvol aangemaakt en kan nu gedownload worden.
              </p>
              <Button
                onClick={downloadPdf}
                disabled={downloading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-4 w-full"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Downloaden...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download zoekprofiel
                  </>
                )}
              </Button>
            </>
          )}

          {pdfData?.pdf_status === 'failed' && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Er is een fout opgetreden
              </h1>
              <p className="text-gray-600 mb-6">
                Er is een fout opgetreden bij het genereren van je zoekprofiel. Probeer het later opnieuw.
              </p>
            </>
          )}

          {!pdfData && !loading && (
            <>
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Zoekprofiel wordt geïnitialiseerd...
              </h1>
              <p className="text-gray-600 mb-6">
                We starten de generatie van je zoekprofiel PDF.
              </p>
            </>
          )}

          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Button>

          {pdfData && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Status: {pdfData.pdf_status}</p>
              {pdfData.pdf_generated_at && (
                <p>PDF gegenereerd: {new Date(pdfData.pdf_generated_at).toLocaleString('nl-NL')}</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ZoekprofielDownload;
