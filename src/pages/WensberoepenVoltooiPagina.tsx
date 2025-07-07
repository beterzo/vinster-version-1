
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, User, Target, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const WensberoepenVoltooiPagina = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProfielVoltooien = () => {
    navigate("/profiel-voltooien-intro");
  };

  const handleNaarDashboard = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/5d3316ef-25de-476e-a36d-e2739fec8439.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-green-100 rounded-full p-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              {t('wensberoepen.voltooi.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('wensberoepen.voltooi.subtitle')}
            </p>

            {/* What happened explanation */}
            <div className="bg-blue-50 rounded-2xl p-8 mb-12 text-left">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Wat is er gebeurd?
              </h2>
              <p className="text-gray-700">
                Er zijn nu kernwoorden samengesteld om te bepalen wat jij belangrijk vindt in je werk. 
                Om jouw persoonlijke loopbaanrapport te genereren hebben we nog wat aanvullende informatie van je nodig.
              </p>
            </div>

            {/* Next steps */}
            <div className="bg-yellow-50 rounded-2xl p-8 mb-12 text-left">
              <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                Volgende stap
              </h2>
              <p className="text-gray-700 mb-6">
                Vul je persoonsprofiel aan met wat extra informatie over je achtergrond en voorkeuren, 
                en geef aan wat je belangrijk vindt in je werk.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-yellow-200 rounded-full p-4 mb-3">
                    <Heart className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Prioriteiten bepalen</h3>
                  <p className="text-sm text-gray-600">Wat vind je belangrijk in je werk?</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-yellow-200 rounded-full p-4 mb-3">
                    <User className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Extra informatie</h3>
                  <p className="text-sm text-gray-600">Je achtergrond en voorkeuren</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-yellow-200 rounded-full p-4 mb-3">
                    <Target className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Rapport genereren</h3>
                  <p className="text-sm text-gray-600">Je persoonlijke loopbaanrapport</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={handleProfielVoltooien} 
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-3 text-lg"
              >
                Persoonsprofiel voltooien
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={handleNaarDashboard} 
                variant="outline" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              >
                Naar dashboard
              </Button>
            </div>

            {/* Additional info */}
            <div className="mt-8 text-sm text-gray-500">
              <p>Tip: Het invullen van je persoonsprofiel duurt ongeveer 5-10 minuten.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WensberoepenVoltooiPagina;
