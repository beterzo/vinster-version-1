
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const ProcessSteps = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <div id="het-proces" className="max-w-[1440px] mx-auto px-4 sm:px-6 py-16 bg-gray-50">
      <div className="text-center mb-16">
        <div className="text-yellow-400 text-sm font-semibold mb-4 uppercase tracking-wider">
          {t('landing.process_steps.subtitle')}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 leading-tight max-w-4xl mx-auto">
          {t('landing.process_steps.title')}
        </h2>
      </div>

      {/* Simple Process Flow */}
      <div className="relative">
        {/* Background gradient line - hide on mobile */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-blue-300 to-blue-900 rounded-full transform -translate-y-1/2 opacity-30"></div>
        
        {/* Process steps container - responsive grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          
          {/* Step 1: Enthousiasmescan - Yellow */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6 lg:mb-8">
              {/* Simple yellow circle */}
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
                <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-blue-900 mb-3 text-center">
              {t('landing.process_steps.step1_title')}
            </h3>
            <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
              {t('landing.process_steps.step1_desc')}
            </p>
          </div>

          {/* Step 2: Wensberoepen - Light Blue */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6 lg:mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-lg flex items-center justify-center" style={{
                backgroundColor: '#A9C5E2'
              }}>
                <Users className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-blue-900 mb-3 text-center">
              {t('landing.process_steps.step2_title')}
            </h3>
            <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
              {t('landing.process_steps.step2_desc')}
            </p>
          </div>

          {/* Step 3: Prioriteiten stellen - Dark Blue */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6 lg:mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-blue-900 rounded-full shadow-lg flex items-center justify-center">
                <Target className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-blue-900 mb-3 text-center">
              {t('landing.process_steps.step3_title')}
            </h3>
            <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
              {t('landing.process_steps.step3_desc')}
            </p>
          </div>

          {/* Step 4: Laatste check - White with blue accent */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6 lg:mb-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white border-2 border-blue-900 rounded-full shadow-lg flex items-center justify-center">
                <Search className="w-8 h-8 lg:w-10 lg:h-10 text-blue-900" />
              </div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-blue-900 mb-3 text-center">
              {t('landing.process_steps.step4_title')}
            </h3>
            <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
              {t('landing.process_steps.step4_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center mt-16">
        <Button 
          onClick={handleStartJourney} 
          className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          {t('landing.process_steps.start_button')}
        </Button>
      </div>
    </div>
  );
};

export default ProcessSteps;
