
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const EnthousiasmeIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Main Title */}
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              {t('enthousiasme.intro.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 text-center">
              {t('enthousiasme.intro.subtitle')}
            </p>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t('enthousiasme.intro.description')}
                </p>
                
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('enthousiasme.intro.how_it_works_title')}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('enthousiasme.intro.how_it_works_description')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <Button 
                  onClick={() => navigate('/enthousiasme-step-1')} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                >
                  {t('enthousiasme.intro.start_button')}
                </Button>
                <Button 
                  onClick={() => navigate('/home')} 
                  variant="outline" 
                  className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold text-lg px-12 py-4 rounded-lg"
                >
                  {t('enthousiasme.intro.back_button')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeIntro;
