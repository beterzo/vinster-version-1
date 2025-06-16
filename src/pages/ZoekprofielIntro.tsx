
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Target, Users, MapPin, CheckCircle } from "lucide-react";

const ZoekprofielIntro = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Gericht zoeken",
      description: "Vind passende vacatures sneller"
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "Betere gesprekken",
      description: "Voer gerichte gesprekken met je netwerk"
    },
    {
      icon: <MapPin className="w-6 h-6 text-purple-500" />,
      title: "Zichtbaar maken",
      description: "Laat anderen weten waar je naar zoekt"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-8" 
          />
          
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Je bent er bijna!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dit is de laatste stap in Vinster. Je gaat nu je zoekprofiel opstellen: een duidelijk overzicht van wat jij zoekt in je volgende baan.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-6">
            <div className="prose prose-lg text-gray-700">
              <p>
                Zo'n profiel helpt om gericht te zoeken, goede gesprekken te voeren én anderen te laten weten waar jij naar op zoek bent.
              </p>
              <p>
                Je geeft aan welk werk je graag wilt doen, in welke branche of richting je dat zoekt, en waar jij energie van krijgt in je werk. Ook vul je in bij wat voor type organisatie je het liefst werkt, in welke regio, en welke voorwaarden jij belangrijk vindt.
              </p>
              <p>
                Dit profiel kun je gebruiken bij het zoeken van vacatures, in gesprekken met mensen uit je netwerk, of als je een open sollicitatie stuurt. Het maakt jouw loopbaankeuze concreet en zichtbaar.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Je weet nu wat je wilt</h3>
              </div>
              <p className="text-blue-800 font-medium">Tijd om het te gaan vinden.</p>
            </div>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/zoekprofiel-vragen")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xl py-6 px-8 h-auto"
            size="lg"
          >
            <ArrowRight className="w-6 h-6 mr-3" />
            Start met je zoekprofiel
          </Button>
          
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="rounded-xl py-6 px-8 h-auto"
          >
            Terug naar dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZoekprofielIntro;
