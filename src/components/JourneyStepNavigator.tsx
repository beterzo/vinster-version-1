import { Check, Lock } from "lucide-react";
import { JourneyStep, JOURNEY_STEPS } from "@/types/journey";
import { useTranslation } from "@/hooks/useTranslation";

interface JourneyStepNavigatorProps {
  currentStep: JourneyStep;
  completedSteps: JourneyStep[];
  onStepClick: (step: JourneyStep) => void;
}

const JourneyStepNavigator = ({ 
  currentStep, 
  completedSteps,
  onStepClick 
}: JourneyStepNavigatorProps) => {
  const { t } = useTranslation();

  const isStepAccessible = (step: JourneyStep) => {
    const stepIndex = JOURNEY_STEPS.findIndex(s => s.id === step);
    if (stepIndex === 0) return true;
    
    // Check if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(JOURNEY_STEPS[i].id)) {
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

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-max gap-2 px-4">
        {JOURNEY_STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const isAccessible = isStepAccessible(step.id);
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Button */}
              <button
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${status === 'completed'
                    ? 'bg-[#E8F4FD] text-[#232D4B] border-2 border-[#232D4B]'
                    : isCurrent 
                      ? 'bg-[#FEF9E6] text-[#232D4B] border-2 border-[#F5C518] shadow-md' 
                      : status === 'locked'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#232D4B] border-2 border-gray-300 hover:border-[#232D4B]'
                  }
                `}
              >
                {/* Icon */}
                <span className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs
                  ${status === 'completed' 
                    ? 'bg-[#232D4B] text-white' 
                    : isCurrent
                      ? 'bg-[#F5C518] text-[#232D4B]'
                      : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {status === 'completed' ? (
                    <Check className="w-3 h-3" />
                  ) : status === 'locked' ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                
                {/* Label */}
                <span className="whitespace-nowrap">
                  {t(step.labelKey)}
                </span>
              </button>

              {/* Connector Line */}
              {index < JOURNEY_STEPS.length - 1 && (
                <div className={`
                  w-8 h-0.5 mx-1
                  ${completedSteps.includes(step.id) ? 'bg-[#232D4B]' : 'bg-gray-300'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyStepNavigator;
