
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const OverVinster = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                alt="Vinster Logo" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              />
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
              >
                {t('about.back_to_home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Heidi's Photo and Introduction */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="order-2 md:order-1">
              <div className="relative">
              <img 
                  alt="Heidi Jansen - Oprichter van Vinster" 
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-lg object-cover aspect-[4/5]" 
                  src="/lovable-uploads/heidi-les-presentatie.jpg" 
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-900 text-white p-4 rounded-xl shadow-lg">
                  <p className="text-sm font-semibold">{t('about.experience_badge')}</p>
                  <p className="text-xs opacity-90">{t('about.experience_subtitle')}</p>
                </div>
              </div>
            </div>
            
            {/* Introduction Text */}
            <div className="order-1 md:order-2">
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {t('about.introduction.greeting')} <strong className="text-blue-900">{t('about.introduction.name')}</strong> {t('about.introduction.title')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('about.introduction.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Block 1: Her Experience */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {t('about.experience.title')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('about.experience.description')}
          </p>
        </div>

        {/* Block 2: The Loopbaantrechter Method */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {t('about.method.title')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('about.method.description')}
          </p>
        </div>

        {/* Block 3: About Vinster Platform */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {t('about.platform.title')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('about.platform.description')}
          </p>
        </div>

        {/* Block 4: Mission */}
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-lg p-8 md:p-12 border-l-4 border-yellow-400">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {t('about.mission.title')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {t('about.mission.description')}
          </p>
          <div className="bg-yellow-100 rounded-2xl p-6">
            <p className="text-xl font-semibold text-yellow-800 text-center">
              {t('about.mission.quote')}
            </p>
            <p className="text-center text-yellow-700 mt-2 font-medium">{t('about.mission.signature')}</p>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              {t('about.cta.title')}
            </h3>
            <p className="text-gray-600">{t('about.cta.subtitle')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="h-12 px-8 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              {t('about.back_to_home')}
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            >
              {t('about.start_button')}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OverVinster;
