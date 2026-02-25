
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useStepAccess } from "@/hooks/useStepAccess";
import ConditionalRoute from "@/components/ConditionalRoute";

const ProfielVoltooienIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stepAccess = useStepAccess();

  return (
    <ConditionalRoute 
      canAccess={stepAccess.persoonsprofiel.canAccess}
      isLoading={stepAccess.isLoading}
      blockedReason={stepAccess.persoonsprofiel.blockedReason}
    >
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/76f1f710-75af-4bc2-9bec-ec5581999434.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Navy Banner */}
          <div className="bg-[#1a2e5a] p-6 px-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="w-8 h-8 rounded-full bg-[#F5C518] text-[#1a2e5a] font-bold text-sm flex items-center justify-center flex-shrink-0">
                3
              </span>
              <h1 className="text-[1.75rem] font-bold text-white">
                {t('profiel_voltooien.intro.title')}
              </h1>
            </div>
            <p className="text-[0.95rem] text-white/70 mt-1 ml-12">
              {t('profiel_voltooien.intro.last_step_title')}
            </p>
          </div>

          <CardContent className="p-8">
            {/* Instructions Section */}
            <div className="space-y-5">
              <p className="text-[0.95rem] leading-[1.8] text-[#374151]">
                {t('profiel_voltooien.intro.description')}
              </p>
              <p className="text-[0.95rem] leading-[1.8] text-[#374151]">
                {t('profiel_voltooien.intro.description_details')}
              </p>

              {/* Start Button */}
              <div className="text-center mt-8">
                <Button 
                  onClick={() => navigate('/extra-informatie-vragen')} 
                  className="bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white font-semibold text-base min-h-[48px] min-w-[240px] rounded-[10px] transition-all duration-150"
                >
                  {t('profiel_voltooien.intro.start_button')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ConditionalRoute>
  );
};

export default ProfielVoltooienIntro;
