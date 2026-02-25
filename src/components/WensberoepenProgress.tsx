
import { Progress } from "@/components/ui/progress";

interface WensberoepenProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WensberoepenProgress = ({ currentStep, totalSteps }: WensberoepenProgressProps) => {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#232D4B]">Vraag {currentStep} van {totalSteps}</span>
        <span className="text-sm font-medium text-[#232D4B]">{Math.round(progressValue)}%</span>
      </div>
      <Progress value={progressValue} className="h-3" />
    </div>
  );
};

export default WensberoepenProgress;
