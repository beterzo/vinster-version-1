
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, Home, Share2, Search, Target, Users, Briefcase, ArrowRight } from "lucide-react";
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

FUNCTIE ALS
${responses.functie_als || 'Niet ingevuld'}

SECTOR
${responses.sector || 'Niet ingevuld'}

KERNTAKEN
${responses.kerntaken || 'Niet ingevuld'}

ORGANISATIE BIJ
${responses.organisatie_bij || 'Niet ingevuld'}

GEWENSTE REGIO
${responses.gewenste_regio || 'Niet ingevuld'}

ARBEIDSVOORWAARDEN
${responses.arbeidsvoorwaarden || 'Niet ingevuld'}

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

🎯 Functie als: ${responses.functie_als?.substring(0, 100)}...
🏢 Sector: ${responses.sector?.substring(0, 80)}...
📍 Regio: ${responses.gewenste_regio}

#loopbaan #zoekprofiel #vinster`;

    if (navigator.share) {
      navigator.share({
        title: 'Mijn Zoekprofiel',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
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
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header with Thank You */}
        <div className="text-center mb-16">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-8" 
          />
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Proficiat!</h1>
          <p className="text-2xl text-gray-700 mb-4">
            Je hebt een belangrijke stap gezet in je loopbaan
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bedankt dat je de tijd hebt genomen om je zoekprofiel op te stellen. 
            Je weet nu precies wat je zoekt in je volgende baan!
          </p>
        </div>

        {/* Main Download Section */}
        <Card className="mb-12 rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="p-8 md:p-12" style={{ backgroundColor: '#A9C5E2' }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Je zoekprofiel is klaar!</h2>
                <p className="text-lg mb-6 opacity-95">
                  Download je persoonlijke zoekprofiel en gebruik het om gericht op zoek te gaan 
                  naar banen die echt bij je passen.
                </p>
                <Button
                  onClick={handleDownload}
                  className="bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download je zoekprofiel
                </Button>
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
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* What's Next Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Wat kun je nu doen?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Deel met je netwerk</h3>
                <p className="text-gray-600 mb-4">
                  Laat vrienden, familie en collega's weten wat voor werk je zoekt. 
                  Ze kunnen je helpen met tips en contacten.
                </p>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="rounded-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Delen
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gebruik bij sollicitaties</h3>
                <p className="text-gray-600 mb-4">
                  Je zoekprofiel helpt je om gericht te solliciteren en 
                  duidelijk te communiceren wat je zoekt.
                </p>
                <Button
                  onClick={() => navigate("/zoekprofiel-vragen")}
                  variant="outline"
                  className="rounded-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Bewerken
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Voeg toe aan LinkedIn</h3>
                <p className="text-gray-600 mb-4">
                  Update je LinkedIn profiel met je zoekprofiel om 
                  recruiters te laten weten wat je zoekt.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => window.open('https://linkedin.com', '_blank')}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Naar LinkedIn
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Profile Preview */}
        <Card className="p-8 bg-white mb-8 rounded-3xl shadow-sm">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Jouw zoekprofiel samenvatting</h2>
              <p className="text-gray-600">Dit staat in je gedownloade bestand</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">🎯 Functie als</h3>
                <p className="text-gray-700 text-sm">{responses.functie_als}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">🏢 Sector</h3>
                <p className="text-gray-700 text-sm">{responses.sector}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">⚡ Kerntaken</h3>
                <p className="text-gray-700 text-sm">{responses.kerntaken}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">📍 Gewenste regio</h3>
                <p className="text-gray-700 text-sm">{responses.gewenste_regio}</p>
              </div>
            </div>
          </div>
        </Card>

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

export default ZoekprofielDownload;
