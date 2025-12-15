import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, CheckCircle2, FileText, Search, Lightbulb, User, ClipboardList, MapPin, Lock, ChevronRight, Eye } from "lucide-react";
import { JourneyStep, JOURNEY_STEPS } from "@/types/journey";
import { Progress } from "@/components/ui/progress";

interface WelkomInlineProps {
  onNext: () => void;
  completedSteps?: JourneyStep[];
  onStepClick?: (step: JourneyStep) => void;
}

const WelkomInline = ({ onNext, completedSteps = [], onStepClick }: WelkomInlineProps) => {
  const { t } = useTranslation();
  const hasProgress = completedSteps.length > 0;

  const steps = [
    {
      id: 'enthousiasme' as JourneyStep,
      number: 1,
      icon: Lightbulb,
      title: t('welkom.steps.step1.title'),
      description: t('welkom.steps.step1.description'),
      time: t('welkom.steps.step1.time')
    },
    {
      id: 'wensberoepen' as JourneyStep,
      number: 2,
      icon: ClipboardList,
      title: t('welkom.steps.step2.title'),
      description: t('welkom.steps.step2.description'),
      time: t('welkom.steps.step2.time')
    },
    {
      id: 'persoonsprofiel' as JourneyStep,
      number: 3,
      icon: User,
      title: t('welkom.steps.step3.title'),
      description: t('welkom.steps.step3.description'),
      time: t('welkom.steps.step3.time')
    },
    {
      id: 'loopbaanrapport' as JourneyStep,
      number: 4,
      icon: FileText,
      title: t('welkom.steps.step4.title'),
      description: t('welkom.steps.step4.description'),
      time: t('welkom.steps.step4.time')
    },
    {
      id: 'onderzoeksplan' as JourneyStep,
      number: 5,
      icon: MapPin,
      title: t('welkom.steps.step5.title'),
      description: t('welkom.steps.step5.description'),
      time: t('welkom.steps.step5.time')
    },
    {
      id: 'zoekprofiel' as JourneyStep,
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

  const getStepStatus = (stepId: JourneyStep): 'completed' | 'current' | 'locked' => {
    if (completedSteps.includes(stepId)) return 'completed';
    
    const stepIndex = JOURNEY_STEPS.findIndex(s => s.id === stepId);
    const completedCount = completedSteps.length;
    
    // The next step after all completed ones is current
    if (stepIndex === completedCount) return 'current';
    
    return 'locked';
  };

  const getNextStepLabel = (): string => {
    const nextStep = steps.find(step => !completedSteps.includes(step.id));
    return nextStep?.title || '';
  };

  const progressPercentage = (completedSteps.length / 6) * 100;

  // Progress mode - show voortgang
  if (hasProgress) {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12">
          {/* Header with progress title */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/vinster-new-logo.png" 
              alt="Vinster" 
              className="w-16 h-16 mx-auto mb-6 object-contain"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B] mb-4">
              {t('welkom.progress_title')}
            </h1>
            <div className="max-w-md mx-auto">
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <p className="text-gray-600">
                {t('welkom.completed_count').replace('{{count}}', String(completedSteps.length))}
              </p>
            </div>
          </div>

          {/* Steps with status */}
          <div className="mb-10">
            <div className="space-y-3">
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';
                const isLocked = status === 'locked';

                return (
                  <div 
                    key={step.number}
                    className={`rounded-xl p-4 border transition-all ${
                      isCompleted 
                        ? 'bg-blue-50 border-blue-200' 
                        : isCurrent 
                          ? 'bg-yellow-50 border-yellow-300' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-[#232D4B] text-white' 
                            : isCurrent 
                              ? 'bg-yellow-400 text-[#232D4B]' 
                              : 'bg-gray-300 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <span className="font-semibold">{step.number}</span>
                          )}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-[#232D4B]'}`}>
                            {step.title}
                          </h3>
                          <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                            {isCompleted 
                              ? t('welkom.step_completed')
                              : isCurrent 
                                ? t('welkom.step_current')
                                : t('welkom.step_locked')
                            }
                          </p>
                        </div>
                      </div>
                      
                      {isCompleted && onStepClick && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onStepClick(step.id)}
                          className="text-[#232D4B] border-[#232D4B]/30 hover:bg-[#232D4B] hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t('welkom.view_button')}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue button */}
          <div className="flex justify-center">
            <Button 
              onClick={onNext}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-6 rounded-xl"
            >
              {t('welkom.continue_button').replace('{{step}}', getNextStepLabel())}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Initial mode - no progress yet
  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-8 md:p-12">
        {/* Header with logo and title */}
        <div className="text-center mb-10">
          <img 
            src="/lovable-uploads/vinster-new-logo.png" 
            alt="Vinster" 
            className="w-16 h-16 mx-auto mb-6 object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B]">
            {t('welkom.steps_overview_title')}
          </h1>
        </div>

        {/* Steps overview */}
        <div className="mb-10">
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
