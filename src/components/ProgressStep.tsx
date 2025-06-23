
import React from 'react';
import { Check } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ProgressStepProps {
  step: {
    step: number;
    title: string;
    description: string;
    actionButton?: string;
  };
  isCompleted: boolean;
  isCurrent: boolean;
  progress?: number;
  onClick: () => void;
}

const ProgressStep = ({ step, isCompleted, isCurrent, progress = 0, onClick }: ProgressStepProps) => {
  return (
    <div 
      className="py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted 
            ? 'bg-gray-100' 
            : 'bg-gray-100'
        }`}>
          {isCompleted ? (
            <Check className="w-4 h-4 text-gray-600" />
          ) : (
            <span className="text-xs font-medium text-gray-600">
              {step.step}
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {step.title}
            </h3>
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {isCompleted ? '✓ Klaar' : `${progress}%`}
            </span>
          </div>
          
          {/* Progress bar - only show for incomplete items with progress */}
          {!isCompleted && progress > 0 && (
            <div className="mt-2">
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressStep;
