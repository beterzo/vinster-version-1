
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ExternalLink } from "lucide-react";
import { useZoekprofiel } from "@/hooks/useZoekprofiel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ZoekprofielDownload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { downloadUrl, isLoading } = useZoekprofiel();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (downloadUrl) {
      setPdfUrl(downloadUrl);
    }
  }, [downloadUrl]);

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'vinster-zoekprofiel.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download gestart",
        description: "Je zoekprofiel wordt gedownload.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download mislukt",
        description: "Er ging iets mis bij het downloaden van je zoekprofiel.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Zoekprofiel gegevens laden...</p>
        </div>
      </div>
    );
  }

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
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-blue-900 mb-4">
                Je zoekprofiel is klaar!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Je persoonlijke zoekprofiel is succesvol gegenereerd en klaar om te gebruiken bij sollicitaties.
              </p>
            </div>

            {pdfUrl ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    size="lg"
                    className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {isDownloading ? "Downloaden..." : "Download zoekprofiel"}
                  </Button>
                  
                  <Button
                    onClick={handleOpenInNewTab}
                    variant="outline"
                    size="lg"
                    className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Bekijk in browser
                  </Button>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> Gebruik je zoekprofiel bij sollicitaties en deel het met recruiters!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Je zoekprofiel wordt nog gegenereerd. Dit kan enkele minuten duren.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-blue-900 text-blue-900 hover:bg-blue-50"
                >
                  Pagina verversen
                </Button>
              </div>
            )}

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

export default ZoekprofielDownload;
