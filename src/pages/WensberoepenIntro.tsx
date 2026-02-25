
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useStepAccess } from "@/hooks/useStepAccess";
import ConditionalRoute from "@/components/ConditionalRoute";

const WensberoepenIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stepAccess = useStepAccess();

  return (
    <ConditionalRoute 
      canAccess={stepAccess.wensberoepen.canAccess}
      isLoading={stepAccess.isLoading}
      blockedReason={stepAccess.wensberoepen.blockedReason}
    >
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img alt="Vinster Logo" onClick={() => navigate('/home')} src="/lovable-uploads/156369dd-8a1e-4584-a996-14af3efed639.png" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-card">
          <CardContent className="p-12">
            <div className="bg-[#FEF9E6] border border-yellow-200 rounded-xl p-4 mb-8">
              <p className="text-[#232D4B] font-medium text-center">{t('wensberoepen.intro.title')}</p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-[#232D4B] mb-4">{t('wensberoepen.intro.instruction_title')}</h2>
                <p className="text-lg text-gray-700 leading-[1.7] mb-4">{t('wensberoepen.intro.instruction_description')}</p>
                <p className="text-lg text-gray-700 leading-[1.7] mb-4">{t('wensberoepen.intro.instruction_details')}</p>
                <p className="text-lg text-gray-700 leading-[1.7]">{t('wensberoepen.intro.instruction_questions')}</p>
              </div>

              <div className="text-center pt-8">
                <Button onClick={() => navigate('/wensberoepen-step-1')} className="bg-[#232D4B] hover:bg-[#1a2350] text-white font-semibold text-lg px-12 py-4 rounded-[10px] h-12">
                  {t('wensberoepen.intro.start_button')}
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

export default WensberoepenIntro;
