
import React from 'react';
import { Heart, Briefcase, User, FileText, Search } from 'lucide-react';
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
    className: `w-5 h-5 ${isCompleted ? 'text-gray-600' : 'text-gray-500'}`,
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
      return <span className="text-sm font-medium text-gray-600">{iconName}</span>;
  }
};

const ProgressStep = ({ step, isCompleted, isCurrent, progress = 0, onClick }: ProgressStepProps) => {
  return (
    <div 
      className="p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-xl border border-gray-200 shadow-sm hover:shadow-md mb-3"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted 
            ? 'bg-green-100' 
            : isCurrent 
              ? 'bg-blue-100' 
              : 'bg-gray-100'
        }`}>
          {step.icon ? (
            getStepIcon(step.icon, isCompleted)
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {step.step}
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate mb-2">
            {step.title}
          </h3>
          
          {/* Progress bar */}
          <div className="mt-2">
            <Progress 
              value={isCompleted ? 100 : progress} 
              className="h-2" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStep;
