
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnderzoeksplanPagina = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Enthousiasme ontdekken",
      description: "We beginnen met vragen over wat je tot leven brengt - je kindertijd, eerste baan en positieve werkervaringen.",
      duration: "10-15 minuten",
      completed: false
    },
    {
      title: "Prioriteiten bepalen", 
      description: "Je selecteert je favoriete activiteiten, interessegebieden en gewenste werkomstandigheden.",
      duration: "15-20 minuten",
      completed: false
    },
    {
      title: "Wensberoepen verkennen",
      description: "Met je fantasie bedenk je drie beroepen die je aantrekelijk vindt en beschrijf je wat je erin aanspreekt.",
      duration: "20-25 minuten", 
      completed: false
    },
    {
      title: "Profiel voltooien",
      description: "Laatste vragen over je achtergrond om je advies nog specifieker te maken.",
      duration: "5-10 minuten",
      completed: false
    },
    {
      title: "Persoonlijk rapport ontvangen",
      description: "Je krijgt een uitgebreid PDF-rapport met je carrièreadvies, passende beroepen en vervolgstappen.",
      duration: "Direct beschikbaar",
      completed: false
    }
  ];

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Jouw carrière-onderzoeksplan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek stap voor stap wat jou motiveert en welke carrièrepaden bij je passen. 
            Volg deze wetenschappelijk onderbouwde methode voor persoonlijk inzicht.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        step.completed ? 'bg-green-500' : 'bg-blue-900'
                      }`}>
                        {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⏱️ {step.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  💡 Wat maakt dit onderzoek bijzonder?
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Gebaseerd op wetenschappelijke loopbaantheorieën</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Persoonlijke benadering, niet generiek</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Praktische vervolgstappen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Direct bruikbaar rapport</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  ⏰ Totale tijdsinvestering
                </h3>
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  50-70 minuten
                </div>
                <p className="text-gray-600 mb-4">
                  Je kunt tussendoor pauzeren en later verder gaan. 
                  Je voortgang wordt automatisch opgeslagen.
                </p>
                <div className="text-sm text-gray-500">
                  💾 Automatisch opslaan geactiveerd
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Card className="inline-block">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Klaar om te beginnen?
              </h2>
              <p className="text-gray-600 mb-6">
                Start je persoonlijke carrière-onderzoek en ontdek welke richting bij je past.
              </p>
              
              <Button 
                onClick={() => navigate('/enthousiasme-intro')}
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-4 rounded-lg flex items-center gap-2 mx-auto"
              >
                Start onderzoek
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnderzoeksplanPagina;
