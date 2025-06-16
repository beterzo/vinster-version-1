
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, Home, Search, Share2 } from "lucide-react";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";

const ZoekprofielDownload = () => {
  const navigate = useNavigate();
  const { responses, loading, loadResponses } = useZoekprofielResponses();

  useEffect(() => {
    loadResponses();
  }, []);

  const handleDownload = () => {
    if (!responses) return;

    const zoekprofielText = `
MIJN ZOEKPROFIEL
Gegenereerd via Vinster

GEWENST WERK
${responses.gewenst_werk || 'Niet ingevuld'}

BRANCHE/RICHTING
${responses.branche_richting || 'Niet ingevuld'}

ENERGIE GEVENDE ASPECTEN
${responses.energie_gevende_aspecten || 'Niet ingevuld'}

TYPE ORGANISATIE
${responses.organisatie_type || 'Niet ingevuld'}

GEWENSTE REGIO
${responses.gewenste_regio || 'Niet ingevuld'}

BELANGRIJKE VOORWAARDEN
${responses.belangrijke_voorwaarden || 'Niet ingevuld'}

Aangemaakt op: ${new Date().toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })}
    `.trim();

    const blob = new Blob([zoekprofielText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mijn-zoekprofiel.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (!responses) return;

    const shareText = `Ik heb mijn zoekprofiel opgesteld via Vinster! 

🎯 Wat ik zoek: ${responses.gewenst_werk?.substring(0, 100)}...
🏢 Branche: ${responses.branche_richting?.substring(0, 80)}...
📍 Regio: ${responses.gewenste_regio}

#loopbaan #zoekprofiel #vinster`;

    if (navigator.share) {
      navigator.share({
        title: 'Mijn Zoekprofiel',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Could add a toast here to indicate it was copied
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Zoekprofiel laden...</p>
        </div>
      </div>
    );
  }

  if (!responses) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Geen zoekprofiel gevonden</h1>
          <p className="text-gray-600 mb-6">Je hebt nog geen zoekprofiel aangemaakt.</p>
          <Button onClick={() => navigate("/zoekprofiel-intro")}>
            Zoekprofiel aanmaken
          </Button>
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
          
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Je zoekprofiel is klaar!</h1>
          <p className="text-xl text-gray-600">
            Download je persoonlijke zoekprofiel en ga op zoek naar je droomjob.
          </p>
        </div>

        {/* Profile Preview */}
        <Card className="p-8 bg-white mb-8 rounded-3xl shadow-sm">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Jouw Zoekprofiel</h2>
              <p className="text-gray-600">Een overzicht van wat jij zoekt in je volgende baan</p>
            </div>
            
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">🎯 Gewenst werk</h3>
                <p className="text-gray-700 text-sm">{responses.gewenst_werk}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">🏢 Branche/Richting</h3>
                <p className="text-gray-700 text-sm">{responses.branche_richting}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">⚡ Energie gevende aspecten</h3>
                <p className="text-gray-700 text-sm">{responses.energie_gevende_aspecten}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">🏛️ Type organisatie</h3>
                <p className="text-gray-700 text-sm">{responses.organisatie_type}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">📍 Gewenste regio</h3>
                <p className="text-gray-700 text-sm">{responses.gewenste_regio}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">✅ Belangrijke voorwaarden</h3>
                <p className="text-gray-700 text-sm">{responses.belangrijke_voorwaarden}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 mb-12">
          <Button
            onClick={handleDownload}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xl py-6 h-auto"
            size="lg"
          >
            <Download className="w-6 h-6 mr-3" />
            Download je zoekprofiel
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="rounded-xl py-4 h-auto"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Delen
            </Button>
            
            <Button
              onClick={() => navigate("/zoekprofiel-vragen")}
              variant="outline"
              className="rounded-xl py-4 h-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Bewerken
            </Button>
          </div>
        </div>

        {/* Tips */}
        <Card className="p-6 bg-blue-50 border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips voor het gebruik van je zoekprofiel</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Gebruik dit profiel in gesprekken met je netwerk</li>
            <li>• Voeg het toe aan je LinkedIn profiel</li>
            <li>• Gebruik het als basis voor open sollicitaties</li>
            <li>• Deel het met recruiters en carrièrecoaches</li>
          </ul>
        </Card>

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

export default ZoekprofielDownload;
