import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, CheckCircle2, FileText, Search, Lightbulb, User, ClipboardList, MapPin } from "lucide-react";

interface WelkomInlineProps {
  onNext: () => void;
}

const WelkomInline = ({ onNext }: WelkomInlineProps) => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      icon: Lightbulb,
      title: t('welkom.steps.step1.title'),
      description: t('welkom.steps.step1.description'),
      time: t('welkom.steps.step1.time')
    },
    {
      number: 2,
      icon: ClipboardList,
      title: t('welkom.steps.step2.title'),
      description: t('welkom.steps.step2.description'),
      time: t('welkom.steps.step2.time')
    },
    {
      number: 3,
      icon: User,
      title: t('welkom.steps.step3.title'),
      description: t('welkom.steps.step3.description'),
      time: t('welkom.steps.step3.time')
    },
    {
      number: 4,
      icon: FileText,
      title: t('welkom.steps.step4.title'),
      description: t('welkom.steps.step4.description'),
      time: t('welkom.steps.step4.time')
    },
    {
      number: 5,
      icon: MapPin,
      title: t('welkom.steps.step5.title'),
      description: t('welkom.steps.step5.description'),
      time: t('welkom.steps.step5.time')
    },
    {
      number: 6,
      icon: Search,
      title: t('welkom.steps.step6.title'),
      description: t('welkom.steps.step6.description'),
      time: t('welkom.steps.step6.time')
    }
  ];

  const tips = [
    t('welkom.tips.tip1'),
    t('welkom.tips.tip2'),
    t('welkom.tips.tip3')
  ];

  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F5C518] flex items-center justify-center">
            <img 
              src="/lovable-uploads/vinster-new-logo.png" 
              alt="Vinster" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#232D4B] mb-4">
            {t('welkom.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('welkom.intro')}
          </p>
        </div>

        {/* Steps overview */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#232D4B] mb-6 text-center">
            {t('welkom.steps_overview_title')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#232D4B]/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#232D4B] text-white flex items-center justify-center font-semibold">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-4 h-4 text-[#232D4B]" />
                      <h3 className="font-semibold text-[#232D4B] text-sm">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {step.description}
                    </p>
                    {step.time && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{step.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total time */}
        <div className="bg-[#E8F4FD] rounded-xl p-5 mb-10">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#232D4B]" />
            <p className="text-[#232D4B] font-medium">
              {t('welkom.total_time')}
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-[#232D4B] mb-4">
            {t('welkom.tips_title')}
          </h3>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#232D4B] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Start button */}
        <div className="flex justify-center">
          <Button 
            onClick={onNext}
            className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-6 rounded-xl"
          >
            {t('welkom.start_button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelkomInline;
