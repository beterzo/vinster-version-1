import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, FileText, Download, ArrowLeft } from "lucide-react";
import { useZoekprofiel } from "@/hooks/useZoekprofiel";

const ZoekprofielDownload = () => {
  const navigate = useNavigate();
  const { success, error, isLoading, generateZoekprofiel, downloadUrl } = useZoekprofiel();

  useEffect(() => {
    generateZoekprofiel();
  }, [generateZoekprofiel]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <Card className="bg-white shadow-lg rounded-lg p-8 text-center">
          {isLoading && (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Zoekprofiel wordt gegenereerd...
              </h1>
              <p className="text-gray-600">
                Even geduld, we genereren je persoonlijke zoekprofiel.
              </p>
            </>
          )}

          {success && !isLoading && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-vinster-blue mb-2">
                Zoekprofiel klaar!
              </h1>
              <p className="text-gray-600 mb-6">
                Je zoekprofiel is succesvol aangemaakt.
              </p>
              <Button
                asChild
                disabled={!downloadUrl}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download zoekprofiel
                </a>
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar dashboard
              </Button>
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
              <p className="text-gray-600 mb-6">
                Er is een fout opgetreden bij het genereren van je zoekprofiel. Probeer het later opnieuw.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Terug naar dashboard
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ZoekprofielDownload;
