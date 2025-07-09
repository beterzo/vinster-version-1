
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const Ervaringen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const testimonials = t('experiences.testimonials');

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
                src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
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
                {t('experiences.back_to_home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            {t('experiences.page_title')}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t('experiences.intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials?.map((testimonial: {quote: string}, index: number) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <blockquote className="text-lg md:text-xl leading-relaxed text-gray-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {t('experiences.cta.title')}
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {t('experiences.cta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="h-12 px-8 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              {t('experiences.back_to_home')}
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            >
              {t('experiences.start_button')}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ervaringen;
