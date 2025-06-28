
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, AlertCircle, Target, Heart, User, Lightbulb, Download, Search, ArrowLeft, ArrowRight } from "lucide-react";

const RapportReview = () => {
  const navigate = useNavigate();
  const [rapportData, setRapportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRapportData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching data from API or local storage
        const response = await fetch('/api/rapport');
        if (!response.ok) {
          throw new Error('Failed to fetch rapport data');
        }
        const data = await response.json();
        setRapportData(data);
      } catch (err: any) {
        setError(err.message || 'Onbekende fout');
      } finally {
        setLoading(false);
      }
    };

    fetchRapportData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-vinster-blue">Jouw loopbaanrapport</h1>
          </div>
          <p className="text-lg text-gray-700">
            Bekijk hier een samenvatting van jouw persoonlijke loopbaananalyse voordat je het volledige rapport downloadt.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Rapport wordt geladen...</p>
          </div>
        )}

        {error && (
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-vinster-blue mb-2">Fout bij laden rapport</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Probeer opnieuw
            </Button>
          </Card>
        )}

        {rapportData && (
          <div className="space-y-8">
            {/* Top Functies */}
            <Card className="p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6" style={{ color: '#78BFE3' }} />
                <h2 className="text-2xl font-bold text-vinster-blue">Jouw top functies</h2>
              </div>
              <div className="grid gap-4">
                {rapportData.top_functies?.map((functie: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="font-bold text-vinster-blue">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-vinster-blue">{functie.naam}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{functie.beschrijving}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Enthousiasme Samenvatting */}
            <Card className="p-8 border-0 rounded-3xl bg-white">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-vinster-blue">Wat jou enthousiast maakt</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-vinster-blue mb-2">Belangrijkste activiteiten:</h3>
                  <div className="flex flex-wrap gap-2">
                    {rapportData.belangrijkste_activiteiten?.map((activiteit: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {activiteit}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-vinster-blue mb-2">Ideale werkomgeving:</h3>
                  <div className="flex flex-wrap gap-2">
                    {rapportData.ideale_werkomgeving?.map((omgeving: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {omgeving}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-vinster-blue mb-2">Interessegebieden:</h3>
                  <div className="flex flex-wrap gap-2">
                    {rapportData.interessegebieden?.map((interesse: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {interesse}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Persoonlijke Informatie */}
            <Card className="p-8 border-0 rounded-3xl bg-white">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-vinster-blue">Jouw profiel</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-vinster-blue mb-2">Opleidingsniveau:</h3>
                  <p className="text-gray-700">{rapportData.opleidingsniveau || 'Niet opgegeven'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-vinster-blue mb-2">Beroepsopleiding:</h3>
                  <p className="text-gray-700">{rapportData.beroepsopleiding || 'Niet opgegeven'}</p>
                </div>
                {rapportData.fysieke_beperkingen && (
                  <div>
                    <h3 className="text-lg font-semibold text-vinster-blue mb-2">Aandachtspunten:</h3>
                    <p className="text-gray-700">{rapportData.fysieke_beperkingen}</p>
                  </div>
                )}
                {rapportData.sector_voorkeur && (
                  <div>
                    <h3 className="text-lg font-semibold text-vinster-blue mb-2">Sectorvoorkeur:</h3>
                    <p className="text-gray-700">{rapportData.sector_voorkeur}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Advies sectie */}
            <Card className="p-8 border-0 rounded-3xl" style={{ backgroundColor: '#FEF3C7' }}>
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-vinster-blue">Jouw vervolgstappen</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Gebaseerd op jouw profiel raden we je aan om verder onderzoek te doen naar de voorgestelde functies. 
                  Kijk naar vacatures, zoek contactpersonen op LinkedIn en informeer naar de dagelijkse praktijk van deze beroepen.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-vinster-blue mb-2">Aanbevolen acties:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Zoek vacatures voor de voorgestelde functies</li>
                    <li>Maak een lijst van bedrijven die je interesseren</li>
                    <li>Zoek contactpersonen via LinkedIn</li>
                    <li>Informeer naar benodigde aanvullende vaardigheden</li>
                    <li>Overweeg een zoekprofiel aan te maken</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Download sectie */}
            <Card className="p-8 text-center border-0 rounded-3xl bg-white">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-vinster-blue mb-4">Download je volledige rapport</h2>
              <p className="text-gray-700 mb-6">
                Krijg toegang tot je complete persoonlijke loopbaananalyse in PDF-formaat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/rapport-download')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold px-8 py-3 rounded-xl"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download rapport (PDF)
                </Button>
                <Button
                  onClick={() => navigate('/onderzoeksplan')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Bekijk onderzoeksplan
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => navigate("/home")}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Button>
          
          <Button
            onClick={() => navigate("/zoekprofiel-intro")}
            className="bg-yellow-500 hover:bg-yellow-600 text-vinster-blue rounded-xl"
          >
            Maak zoekprofiel
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RapportReview;
