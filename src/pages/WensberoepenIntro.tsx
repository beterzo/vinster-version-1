
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
      blockedReason={stepAccess.wensberoepen.blockedReason}
    >
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/156369dd-8a1e-4584-a996-14af3efed639.png" 
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
              {t('wensberoepen.intro.title')}
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('wensberoepen.intro.instruction_title')}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t('wensberoepen.intro.instruction_description')}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t('wensberoepen.intro.instruction_details')}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('wensberoepen.intro.instruction_questions')}
                </p>
              </div>

              {/* Start Button */}
              <div className="text-center pt-8">
                <Button 
                  onClick={() => navigate('/wensberoepen-step-1')} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                >
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
