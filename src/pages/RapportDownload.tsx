
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ExternalLink } from "lucide-react";
import { useRapportData } from "@/hooks/useRapportData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RapportDownload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: reportData, loading } = useRapportData();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (reportData?.pdf_file_path) {
      console.log('PDF file path found:', reportData.pdf_file_path);
      
      // Get the public URL for the PDF
      const { data } = supabase.storage
        .from('user-reports')
        .getPublicUrl(reportData.pdf_file_path);
      
      console.log('Generated public URL:', data.publicUrl);
      setPdfUrl(data.publicUrl);
    } else {
      console.log('No PDF file path found in report data:', reportData);
    }
  }, [reportData]);

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
        title: "Download gestart",
        description: "Je rapport wordt gedownload.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download mislukt",
        description: `Er ging iets mis bij het downloaden: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
        variant: "destructive",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Rapport gegevens laden...</p>
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
                Je rapport is klaar!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Je persoonlijke carrièrerapport is succesvol gegenereerd en klaar om te bekijken.
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
                    {isDownloading ? "Downloaden..." : "Download rapport"}
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
                    💡 <strong>Tip:</strong> Bewaar je rapport goed. Het bevat waardevolle inzichten voor je carrière!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Je rapport wordt nog gegenereerd. Dit kan enkele minuten duren.
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

export default RapportDownload;
