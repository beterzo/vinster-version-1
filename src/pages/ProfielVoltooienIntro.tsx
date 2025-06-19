
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, Info, Target, CheckCircle } from "lucide-react";

const ProfielVoltooienIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 cursor-pointer mb-6" onClick={() => navigate("/home")}>
            <img 
              src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
              alt="Vinster Logo" 
              className="h-12 w-auto filter brightness-110 contrast-110" 
            />
            <span className="text-2xl font-bold text-gray-800 tracking-wide">Vinster</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loopbaanrapport maken</h1>
          <p className="text-xl text-gray-700">
            We gaan je loopbaanrapport maken in twee stappen
          </p>
        </div>

        {/* Main content */}
        <Card className="p-8 mb-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8" style={{ color: '#78BFE3' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Twee laatste stappen om jouw loopbaanrapport te genereren
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Je gaat eerst wat aanvullende informatie invullen over jezelf. 
              Daarna ga je aangeven wat voor jou het allerbelangrijkste is uit je eerdere antwoorden.
            </p>
          </div>

          {/* Two steps overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Extra informatie</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                  <span>Je opleidingsniveau en beroepsopleiding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                  <span>Eventuele (fysieke) beperkingen</span>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                  <span>Sector voorkeur (optioneel)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Prioriteiten stellen</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                  <span>Selecteer je belangrijkste activiteiten</span>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                  <span>Kies je ideale werkomgeving</span>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                  <span>Bepaal je interessegebieden</span>
                </div>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="bg-white p-6 rounded-lg mb-8">
            <h3 className="font-bold text-lg mb-4">Wat kun je verwachten?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                <span>Eerst 4 korte vragen over jouw achtergrond en voorkeuren</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                <span>Daarna selecteer je uit kernwoorden die gebaseerd zijn op je eerdere antwoorden</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                <span>Je kunt bij elke stap aanvullende informatie toevoegen</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#78BFE3' }} />
                <span>Er zijn geen goede of foute antwoorden - ga af op je gevoel</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => navigate("/home")} 
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Terug naar dashboard
          </Button>
          
          <Button 
            onClick={() => navigate("/extra-informatie-vragen")} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200" 
            size="lg"
          >
            Loopbaanrapport aanmaken
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfielVoltooienIntro;
