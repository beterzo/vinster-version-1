
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, Info, Target, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ProfielVoltooienIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main content */}
        <Card className="p-8 mb-8 border-0 rounded-3xl" style={{
        backgroundColor: '#E6F0F6'
      }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8" style={{
              color: '#78BFE3'
            }} />
            </div>
            <h2 className="text-2xl font-bold text-vinster-blue mb-4">
              {t('profiel_voltooien.title')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('profiel_voltooien.description')}
            </p>
          </div>

          {/*  Two steps overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-vinster-blue">{t('profiel_voltooien.step1_title')}</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{
                  color: '#78BFE3'
                }} />
                  <span>Je opleidingsniveau en beroepsopleiding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{
                  color: '#78BFE3'
                }} />
                  <span>Eventuele (fysieke) beperkingen</span>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5" style={{
                  color: '#78BFE3'
                }} />
                  <span>Sector voorkeur (optioneel)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-vinster-blue">{t('profiel_voltooien.step2_title')}</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5" style={{
                  color: '#78BFE3'
                }} />
                  <span>Selecteer je belangrijkste activiteiten</span>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5" style={{
                  color: '#78BFE3'
                }} />
                  <span>Kies je ideale werkomgeving</span>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5" style={{
                  color: '#78BFE3'
                }} />
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
                <CheckCircle className="w-5 h-5 mt-0.5" style={{
                color: '#78BFE3'
              }} />
                <span>Eerst 4 korte vragen over jouw achtergrond en voorkeuren</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{
                color: '#78BFE3'
              }} />
                <span>Daarna selecteer je uit kernwoorden die gebaseerd zijn op je eerdere antwoorden</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{
                color: '#78BFE3'
              }} />
                <span>Je kunt bij elke stap aanvullende informatie toevoegen</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{
                color: '#78BFE3'
              }} />
                <span>Er zijn geen goede of foute antwoorden - ga af op je gevoel</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate("/home")} className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200">
            {t('profiel_voltooien.back_button')}
          </Button>
          
          <Button onClick={() => navigate("/extra-informatie-vragen")} className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200" size="lg">
            {t('profiel_voltooien.start_button')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfielVoltooienIntro;
