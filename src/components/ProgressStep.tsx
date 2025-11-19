
import React from 'react';
import { Heart, Briefcase, User, FileText, Search, Lock, Eye, ChevronRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  isLocked?: boolean;
  lockedReason?: string;
  onClick: () => void;
  editPath?: string;
  viewPath?: string;
  hasCompletedReport?: boolean;
}

const getStepIcon = (iconName: string, isCompleted: boolean) => {
  const iconProps = {
    className: `w-5 h-5 text-gray-500`,
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
      return <span className="text-sm font-medium text-gray-500">{iconName}</span>;
  }
};

const ProgressStep = ({ 
  step, 
  isCompleted, 
  isCurrent, 
  progress = 0, 
  isLocked = false,
  lockedReason,
  onClick,
  editPath,
  viewPath,
  hasCompletedReport = false
}: ProgressStepProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stepContent = (
    <div 
      className={`p-4 transition-all duration-200 rounded-xl border border-gray-200 shadow-sm mb-3 ${
        isLocked 
          ? 'bg-gray-100 opacity-60 cursor-not-allowed' 
          : 'bg-white hover:bg-gray-50 cursor-pointer hover:shadow-md'
      }`}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isLocked ? 'bg-gray-200' : 'bg-gray-100'
        }`}>
          {isLocked ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : step.icon ? (
            getStepIcon(step.icon, isCompleted)
          ) : (
            <span className="text-sm font-medium text-gray-500">
              {step.step}
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate mb-2 ${
            isLocked ? 'text-gray-400' : 'text-gray-900'
          }`}>
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
        
        {/* Action button/icon */}
        <div className="ml-auto flex-shrink-0">
          {isCompleted && hasCompletedReport && viewPath ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(viewPath);
              }}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('common.button.view_answers')}</span>
            </Button>
          ) : isLocked ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
          ) : (
            <div className="flex items-center text-blue-600">
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLocked && lockedReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {stepContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{lockedReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return stepContent;
};

export default ProgressStep;
