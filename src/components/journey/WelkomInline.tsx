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

  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-8 md:p-12">
        {/* Header with logo and title */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/vinster-new-logo.png" 
            alt="Vinster" 
            className="w-16 h-16 mx-auto mb-6 object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B] mb-4">
            {hasProgress ? t('welkom.progress_title') : t('welkom.steps_overview_title')}
          </h1>
          
          {/* Progress bar - only show if there is progress */}
          {hasProgress && (
            <div className="max-w-md mx-auto">
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <p className="text-gray-600">
                {t('welkom.completed_count').replace('{{count}}', String(completedSteps.length))}
              </p>
            </div>
          )}
        </div>

        {/* Steps overview - unified grid layout */}
        <div className="mb-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';
              const isLocked = status === 'locked';

              return (
                <div 
                  key={step.number}
                  className={`rounded-xl p-5 border transition-colors ${
                    isCompleted 
                      ? 'bg-blue-50 border-blue-200' 
                      : isCurrent 
                        ? 'bg-yellow-50 border-yellow-300' 
                        : 'bg-gray-50 border-gray-100 hover:border-[#232D4B]/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Number/Status icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isCompleted 
                        ? 'bg-[#232D4B] text-white' 
                        : isCurrent 
                          ? 'bg-yellow-400 text-[#232D4B]' 
                          : 'bg-[#232D4B] text-white'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + icon + status badge */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <step.icon className={`w-4 h-4 ${isLocked ? 'text-gray-400' : 'text-[#232D4B]'}`} />
                        <h3 className={`font-semibold text-sm ${isLocked ? 'text-gray-400' : 'text-[#232D4B]'}`}>
                          {step.title}
                        </h3>
                        {/* Status badges */}
                        {isCompleted && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {t('welkom.step_completed')}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                            {t('welkom.step_current')}
                          </span>
                        )}
                      </div>
                      
                      {/* Description (always visible) */}
                      <p className={`text-sm mb-2 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                      
                      {/* Time indicator */}
                      {step.time && (
                        <div className={`flex items-center gap-1 text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock className="w-3 h-3" />
                          <span>{step.time}</span>
                        </div>
                      )}
                      
                      {/* View button for completed steps */}
                      {isCompleted && onStepClick && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onStepClick(step.id)}
                          className="mt-3 text-[#232D4B] border-[#232D4B]/30 hover:bg-[#232D4B] hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t('welkom.view_button')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total time - only show if no progress yet */}
        {!hasProgress && (
          <div className="bg-[#E8F4FD] rounded-xl p-5 mb-10">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#232D4B]" />
              <p className="text-[#232D4B] font-medium">
                {t('welkom.total_time')}
              </p>
            </div>
          </div>
        )}

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

        {/* Start/Continue button */}
        <div className="flex justify-center">
          <Button 
            onClick={onNext}
            className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-6 rounded-xl"
          >
            {hasProgress 
              ? t('welkom.continue_button').replace('{{step}}', getNextStepLabel())
              : t('welkom.start_button')
            }
            {hasProgress && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelkomInline;
