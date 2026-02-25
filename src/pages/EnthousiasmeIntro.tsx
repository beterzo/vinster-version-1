
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const EnthousiasmeIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img alt="Vinster Logo" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/home')} src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-card">
          <CardContent className="p-12">
            {/* Yellow accent banner */}
            <div className="bg-[#FEF9E6] border border-yellow-200 rounded-xl p-4 mb-8">
              <p className="text-[#232D4B] font-medium text-center">{t('enthousiasme.intro.title')}</p>
            </div>

            <h1 className="text-2xl font-bold text-[#232D4B] mb-8 text-center">
              {t('enthousiasme.intro.subtitle')}
            </h1>

            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-700 leading-[1.7] mb-4">{t('enthousiasme.intro.description')}</p>
                <h2 className="text-xl font-semibold text-[#232D4B] mb-4">{t('enthousiasme.intro.how_it_works_title')}</h2>
                <p className="text-lg text-gray-700 leading-[1.7]">{t('enthousiasme.intro.how_it_works_description')}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <Button onClick={() => navigate('/enthousiasme-step-1')} className="bg-[#232D4B] hover:bg-[#1a2350] text-white font-semibold text-lg px-12 py-4 rounded-[10px] h-12">
                  {t('enthousiasme.intro.start_button')}
                </Button>
                <Button onClick={() => navigate('/home')} variant="outline" className="border-[#232D4B] text-[#232D4B] hover:bg-gray-50 font-semibold text-lg px-12 py-4 rounded-[10px] h-12">
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
