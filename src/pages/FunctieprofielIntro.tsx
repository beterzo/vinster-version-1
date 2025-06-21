
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Target, Users, MapPin } from "lucide-react";

const FunctieprofielIntro = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Gericht zoeken",
      description: "Vind passende vacatures sneller"
    },
    {
      icon: <Users className="w-6 h-6 text-yellow-500" />,
      title: "Betere gesprekken",
      description: "Voer gerichte gesprekken met je netwerk"
    },
    {
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      title: "Zichtbaar maken",
      description: "Laat anderen weten waar je naar zoekt"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center cursor-pointer justify-center mb-8" onClick={() => navigate("/home")}>
            <img 
              src="/lovable-uploads/9f446431-090f-44ce-9726-57f4cd0bd197.png" 
              alt="Vinster Logo" 
              className="h-12 w-auto filter brightness-110 contrast-110" 
            />
          </div>
          
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Je bent er bijna!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dit is de laatste stap in Vinster. Je hebt onderzoek gedaan en je gaat nu je functieprofiel opstellen. Een functieprofiel is een duidelijk overzicht van de baan die jij zoekt.
          </p>
        </div>

        {/* Main Content - New Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-stretch mb-12">
          {/* Left side - Large text block */}
          <div className="flex">
            <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full flex items-center">
              <div className="text-left">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Je geeft aan welk werk je graag wilt doen, in welke branche of richting je dat zoekt, en waar jij energie van krijgt in je werk. Ook vul je in bij wat voor type organisatie je het liefst werkt, in welke regio, en welke voorwaarden jij belangrijk vindt. Dit profiel kun je gebruiken bij het zoeken van vacatures, in gesprekken met mensen uit je netwerk, of als je een open sollicitatie stuurt. Het maakt jouw loopbaankeuze concreet en zichtbaar.
                </p>
              </div>
            </Card>
          </div>

          {/* Right side - Benefit cards */}
          <div className="space-y-4 flex flex-col">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex-1">
                <div className="flex items-start gap-4 h-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div className="text-left flex-1">
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
            onClick={() => navigate("/functieprofiel-vragen")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xl py-6 px-8 h-auto"
            size="lg"
          >
            <ArrowRight className="w-6 h-6 mr-3" />
            Start met je functieprofiel
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

export default FunctieprofielIntro;
