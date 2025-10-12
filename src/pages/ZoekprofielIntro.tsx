
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useExistingZoekprofiel } from "@/hooks/useExistingZoekprofiel";
import { useTranslation } from "@/hooks/useTranslation";
import { useStepAccess } from "@/hooks/useStepAccess";
import ConditionalRoute from "@/components/ConditionalRoute";

const ZoekprofielIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stepAccess = useStepAccess();
  const { hasExistingZoekprofiel, loading } = useExistingZoekprofiel();

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;
  }

  return (
    <ConditionalRoute 
      canAccess={stepAccess.zoekprofiel.canAccess}
      blockedReason={stepAccess.zoekprofiel.blockedReason}
    >
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/69d6ab31-0032-4754-be0b-481571c371ef.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
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
              {t('zoekprofiel.intro.title')}
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('zoekprofiel.intro.what_is_title')}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t('zoekprofiel.intro.description')}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t('zoekprofiel.intro.description_details')}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('zoekprofiel.intro.duration')}
                </p>
              </div>

              {/* Conditional content based on existing zoekprofiel */}
              {hasExistingZoekprofiel ? (
                <div className="text-center pt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      {t('zoekprofiel.intro.already_created_title')}
                    </h3>
                    <p className="text-blue-700 mb-4">
                      {t('zoekprofiel.intro.already_created_description')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => navigate('/zoekprofiel-download')} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg mr-4"
                    >
                      {t('zoekprofiel.intro.download_button')}
                    </Button>
                    <Button 
                      onClick={() => navigate('/home')} 
                      variant="outline"
                      className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold text-lg px-12 py-4 rounded-lg"
                    >
                      {t('zoekprofiel.intro.back_button')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center pt-8">
                  <Button 
                    onClick={() => navigate('/zoekprofiel-antwoorden')} 
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                  >
                    {t('zoekprofiel.intro.start_button')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ConditionalRoute>
  );
};

export default ZoekprofielIntro;
