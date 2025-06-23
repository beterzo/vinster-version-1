import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProgressStepProps {
  step: {
    step: number;
    title: string;
    description: string;
    actionButton?: string;
  };
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const ProgressStep = ({ step, isCompleted, isCurrent, onClick }: ProgressStepProps) => {
  return (
    <div 
      className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        isCurrent 
          ? 'border-yellow-400 bg-yellow-50 shadow-md transform scale-105' 
          : isCompleted 
            ? 'border-green-400 bg-green-50 hover:shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted 
            ? 'bg-green-500' 
            : isCurrent 
              ? 'bg-yellow-400' 
              : 'bg-gray-200'
        }`}>
          {isCompleted ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <span className={`font-bold ${
              isCurrent ? 'text-vinster-blue' : 'text-gray-600'
            }`}>
              {step.step}
            </span>
          )}
        </div>
        <h3 className={`text-lg font-bold ${
          isCurrent ? 'text-vinster-blue' : isCompleted ? 'text-vinster-blue' : 'text-gray-600'
        }`}>
          {step.title}
        </h3>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {step.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full ${
          isCompleted 
            ? 'bg-green-100 text-green-700' 
            : isCurrent 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-gray-100 text-gray-600'
        }`}>
          {isCompleted ? 'Voltooid' : isCurrent ? 'Actief' : 'Te doen'}
        </span>
        
        {step.actionButton && (
          <Button
            size="sm"
            className={`${
              isCurrent 
                ? 'bg-yellow-400 hover:bg-yellow-500 text-vinster-blue' 
                : isCompleted 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!isCurrent && !isCompleted}
          >
            {step.actionButton}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProgressStep;
