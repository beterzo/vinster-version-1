import React from 'react';
import { Heart, Briefcase, User, FileText, Search, Lock, Eye, ChevronRight, Check } from 'lucide-react';
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

const getStepIcon = (iconName: string) => {
  const iconProps = { className: "w-5 h-5" };
  switch (iconName) {
    case 'heart': return <Heart {...iconProps} />;
    case 'briefcase': return <Briefcase {...iconProps} />;
    case 'user': return <User {...iconProps} />;
    case 'file-text': return <FileText {...iconProps} />;
    case 'search': return <Search {...iconProps} />;
    default: return <span className="text-sm font-medium">{iconName}</span>;
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
      className={`
        p-5 rounded-2xl mb-3 transition-all duration-200
        ${isLocked 
          ? 'bg-gray-50 opacity-50 cursor-not-allowed' 
          : isCompleted
            ? 'bg-white shadow-card hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer border-l-4 border-[#232D4B]'
            : isCurrent
              ? 'bg-white shadow-card-hover cursor-pointer border-b-4 border-[#F5C518]'
              : 'bg-white shadow-card hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer'
        }
      `}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isLocked ? 'bg-gray-200 text-gray-400' 
          : isCompleted ? 'bg-[#232D4B] text-white'
          : isCurrent ? 'bg-[#F5C518] text-[#232D4B]'
          : 'bg-gray-100 text-gray-500'
        }`}>
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : isCompleted ? (
            <Check className="w-5 h-5" />
          ) : step.icon ? (
            getStepIcon(step.icon)
          ) : (
            <span className="text-sm font-semibold">{step.step}</span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-sm font-semibold truncate ${
              isLocked ? 'text-gray-400' : 'text-[#232D4B]'
            }`}>
              {step.title}
            </h3>
            {isCompleted && (
              <span className="text-xs bg-[#232D4B] text-white px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                Voltooid
              </span>
            )}
            {isCurrent && (
              <span className="text-xs bg-[#F5C518] text-[#232D4B] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                Aan de beurt
              </span>
            )}
          </div>
          
          <Progress 
            value={isCompleted ? 100 : progress} 
            className="h-1.5" 
          />
        </div>
        
        {/* Action */}
        <div className="ml-auto flex-shrink-0">
          {isCompleted && hasCompletedReport && viewPath ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(viewPath);
              }}
              className="text-[#232D4B] hover:text-[#232D4B] hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('common.button.view_answers')}</span>
            </Button>
          ) : isCurrent ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="text-[#232D4B] hover:bg-[#F5C518]/10 font-semibold"
            >
              <span className="text-xs">Ga verder →</span>
            </Button>
          ) : isLocked ? (
            <Lock className="w-4 h-4 text-gray-300" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
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
