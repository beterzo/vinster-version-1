import { Check, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JourneyStep, JOURNEY_STEPS } from "@/types/journey";
import { useTranslation } from "@/hooks/useTranslation";

interface JourneyOverviewProps {
  completedSteps: JourneyStep[];
  onContinue: () => void;
}

const JourneyOverview = ({ completedSteps, onContinue }: JourneyOverviewProps) => {
  const { t } = useTranslation();

  const getNextStep = (): JourneyStep | null => {
    for (const step of JOURNEY_STEPS) {
      if (!completedSteps.includes(step.id)) {
        return step.id;
      }
    }
    return null;
  };

  const nextStep = getNextStep();
  const progressPercentage = (completedSteps.length / JOURNEY_STEPS.length) * 100;
  const allComplete = completedSteps.length === JOURNEY_STEPS.length;

  const getStepStatus = (stepId: JourneyStep): 'completed' | 'next' | 'locked' => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === nextStep) return 'next';
    return 'locked';
  };

  const getStepDescription = (stepId: JourneyStep): string => {
    const stepNumber = JOURNEY_STEPS.findIndex(s => s.id === stepId) + 1;
    return t(`journey.welkom.steps.step${stepNumber}.description`);
  };

  const getNextStepLabel = (): string => {
    if (!nextStep) return '';
    const stepConfig = JOURNEY_STEPS.find(s => s.id === nextStep);
    return stepConfig ? t(stepConfig.labelKey) : '';
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto border-0 shadow-lg rounded-2xl bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#232D4B] mb-2">
          {t('journey.overview.title')}
        </h2>
        <p className="text-gray-600">
          {t('journey.overview.completed_count').replace('{{count}}', String(completedSteps.length))}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-3 bg-gray-100" />
      </div>

      {/* Steps List */}
      <div className="space-y-4 mb-8">
        {JOURNEY_STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <div 
              key={step.id}
              className={`
                flex items-start gap-4 p-4 rounded-xl transition-all
                ${status === 'completed' 
                  ? 'bg-[#E8F4FD] border-2 border-[#232D4B]' 
                  : status === 'next'
                    ? 'bg-[#FEF3C7] border-2 border-[#92400E]'
                    : 'bg-gray-50 border-2 border-gray-200'
                }
              `}
            >
              {/* Status Icon */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${status === 'completed' 
                  ? 'bg-[#232D4B] text-white' 
                  : status === 'next'
                    ? 'bg-[#92400E] text-white'
                    : 'bg-gray-300 text-gray-500'
                }
              `}>
                {status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : status === 'locked' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`
                    font-semibold
                    ${status === 'completed' 
                      ? 'text-[#232D4B]' 
                      : status === 'next'
                        ? 'text-[#92400E]'
                        : 'text-gray-400'
                    }
                  `}>
                    {t(step.labelKey)}
                  </h3>
                  <span className={`
                    text-sm px-3 py-1 rounded-full
                    ${status === 'completed' 
                      ? 'bg-[#232D4B] text-white' 
                      : status === 'next'
                        ? 'bg-[#92400E] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {status === 'completed' 
                      ? t('journey.overview.step_completed')
                      : status === 'next'
                        ? t('journey.overview.step_current')
                        : t('journey.overview.step_locked')
                    }
                  </span>
                </div>
                <p className={`
                  text-sm mt-1
                  ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {getStepDescription(step.id)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        className="w-full py-6 text-lg font-semibold rounded-full bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] border-2 border-[#92400E]"
      >
        {allComplete 
          ? t('journey.overview.all_done_button')
          : t('journey.overview.continue_button').replace('{{step}}', getNextStepLabel())
        }
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </Card>
  );
};

export default JourneyOverview;
