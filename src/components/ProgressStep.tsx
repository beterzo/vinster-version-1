
import React from 'react';
import { Check, Heart, Briefcase, User, FileText, Search } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ProgressStepProps {
  step: {
    step: number;
    title: string;
    description: string;
    actionButton?: string;
    icon?: string;
  };
  isCompleted: boolean;
  isCurrent: boolean;
  progress?: number;
  onClick: () => void;
}

const getStepIcon = (iconName: string, isCompleted: boolean) => {
  const iconProps = {
    className: `w-4 h-4 ${isCompleted ? 'text-gray-600' : 'text-gray-500'}`,
  };

  switch (iconName) {
    case 'heart':
      return <Heart {...iconProps} />;
    case 'briefcase':
      return <Briefcase {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    case 'file-text':
      return <FileText {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    default:
      return <span className="text-xs font-medium text-gray-600">{iconName}</span>;
  }
};

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
          ) : step.icon ? (
            getStepIcon(step.icon, isCompleted)
          ) : (
            <span className="text-xs font-medium text-gray-600">
              {step.step}
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate mb-2">
            {step.title}
          </h3>
          
          {/* Progress bar - always show */}
          <div className="mt-1">
            <Progress 
              value={isCompleted ? 100 : progress} 
              className="h-1" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStep;
