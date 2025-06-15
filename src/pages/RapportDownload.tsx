
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, FileText, Home } from "lucide-react";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";

const RapportDownload = () => {
  const navigate = useNavigate();
  const { userReport, loadUserReport, loading } = useRapportGeneration();

  useEffect(() => {
    loadUserReport();
  }, []);

  const handleDownload = () => {
    // TODO: Implement actual PDF download functionality
    console.log('Download rapport:', userReport);
    
    // For now, create a simple text file with the data
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mb-6" 
          />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Jouw rapport is klaar!</h1>
          </div>
          <p className="text-lg text-gray-700">
            Gefeliciteerd! Jouw persoonlijke loopbaanrapport is succesvol gegenereerd en staat klaar voor download.
          </p>
        </div>

        {/* Success Card */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Rapport succesvol aangemaakt
            </h2>
            <p className="text-gray-600 mb-6">
              Jouw rapport bevat een complete analyse van je enthousiasme-scan, wensberoepen, 
              en prioriteiten om je te helpen bij je loopbaankeuzes.
            </p>
            
            {userReport && (
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
                    <p className="font-medium text-green-600">
                      {userReport.report_status === 'completed' ? 'Voltooid' : userReport.report_status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleDownload}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-lg px-8 py-3"
              size="lg"
              disabled={!userReport}
            >
              <Download className="w-5 h-5 mr-2" />
              Download mijn rapport
            </Button>
          </div>
        </Card>

        {/* Info Card */}
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
