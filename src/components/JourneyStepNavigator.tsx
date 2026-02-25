import { Check, Lock } from "lucide-react";
import { JourneyStep, JourneyStepConfig, JOURNEY_STEPS } from "@/types/journey";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JourneyStepNavigatorProps {
  currentStep: JourneyStep;
  completedSteps: JourneyStep[];
  onStepClick: (step: JourneyStep) => void;
  steps?: JourneyStepConfig[];
}

const JourneyStepNavigator = ({ 
  currentStep, 
  completedSteps,
  onStepClick,
  steps,
}: JourneyStepNavigatorProps) => {
  const { t } = useTranslation();
  const activeSteps = steps || JOURNEY_STEPS;

  const isStepAccessible = (step: JourneyStep) => {
    const stepIndex = activeSteps.findIndex(s => s.id === step);
    if (stepIndex === 0) return true;
    
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(activeSteps[i].id)) {
        return false;
      }
    }
    return true;
  };

  const getStepStatus = (step: JourneyStep): 'completed' | 'active' | 'locked' => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'active';
    if (!isStepAccessible(step)) return 'locked';
    return 'active';
  };

  // Find the first locked step's prerequisite for tooltip
  const getLockedTooltip = (stepIndex: number): string => {
    for (let i = stepIndex - 1; i >= 0; i--) {
      if (!completedSteps.includes(activeSteps[i].id)) {
        return `Voltooi "${t(activeSteps[i].labelKey)}" eerst`;
      }
    }
    return 'Voltooi de vorige stap eerst';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center min-w-max">
          {activeSteps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isAccessible = isStepAccessible(step.id);
            const isCurrent = step.id === currentStep;

            const stepButton = (
              <button
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${status === 'completed'
                    ? 'bg-[#E8F4FD] text-[#232D4B] hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer'
                    : isCurrent 
                      ? 'bg-white text-[#232D4B] shadow-card border-l-[3px] border-[#F5C518]' 
                      : status === 'locked'
                        ? 'bg-gray-50 text-gray-400 opacity-50 cursor-not-allowed'
                        : 'bg-white text-[#232D4B] hover:-translate-y-0.5 hover:shadow-card cursor-pointer'
                  }
                `}
              >
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                  ${status === 'completed' 
                    ? 'bg-[#232D4B] text-white' 
                    : isCurrent
                      ? 'bg-[#F5C518] text-[#232D4B]'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {status === 'completed' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : status === 'locked' ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                
                <span className="whitespace-nowrap">
                  {t(step.labelKey)}
                </span>
              </button>
            );

            return (
              <div key={step.id} className="flex items-center">
                {status === 'locked' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {stepButton}
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>{getLockedTooltip(index)}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  stepButton
                )}

                {index < activeSteps.length - 1 && (
                  <div className={`
                    w-6 h-[2px] mx-1.5 flex-shrink-0 rounded-full
                    ${completedSteps.includes(step.id) ? 'bg-[#232D4B]' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JourneyStepNavigator;
