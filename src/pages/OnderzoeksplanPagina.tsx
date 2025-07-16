
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const OnderzoeksplanPagina = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    t('journey.onderzoeksplan.step1'),
    t('journey.onderzoeksplan.step2'),
    t('journey.onderzoeksplan.step3'),
    t('journey.onderzoeksplan.step4'),
    t('journey.onderzoeksplan.step5'),
    t('journey.onderzoeksplan.step6'),
    t('journey.onderzoeksplan.step7'),
    t('journey.onderzoeksplan.step8'),
    t('journey.onderzoeksplan.step9'),
    t('journey.onderzoeksplan.step10')
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/d9afcf52-75df-4ee9-8b87-c0676bfcb583.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t('journey.onderzoeksplan.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {t('journey.onderzoeksplan.subtitle')}
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-3xl mx-auto">
            <p className="text-yellow-800 font-medium">
              {t('journey.onderzoeksplan.tip')}
            </p>
          </div>
        </div>

        <Card className="rounded-3xl shadow-xl mb-8">
          <CardContent className="p-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              {t('journey.onderzoeksplan.steps_title')}
            </h2>
            
            {/* Steps */}
            <div className="space-y-6 mb-12">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                {t('journey.onderzoeksplan.after_research_title')}
              </h3>
              <p className="text-green-700 mb-4">
                {t('journey.onderzoeksplan.after_research_description')}
              </p>
              <p className="text-green-700 mb-4">
                {t('journey.onderzoeksplan.after_research_action')}
              </p>
              <p className="text-green-700 font-semibold">
                {t('journey.onderzoeksplan.final_message')}
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                {t('journey.onderzoeksplan.time_notice_title')}
              </h3>
              <p className="text-blue-700 mb-3">
                {t('journey.onderzoeksplan.time_notice_description')}
              </p>
              <p className="text-blue-700">
                {t('journey.onderzoeksplan.time_notice_details')}
              </p>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <Button 
                onClick={() => navigate('/home')} 
                size="lg" 
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Home className="w-5 h-5" />
                {t('journey.onderzoeksplan.back_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnderzoeksplanPagina;
