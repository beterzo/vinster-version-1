
import { Progress } from "@/components/ui/progress";

interface WensberoepenProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WensberoepenProgress = ({ currentStep, totalSteps }: WensberoepenProgressProps) => {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Wensberoep {currentStep} van {totalSteps}</span>
        <span>{Math.round(progressValue)}%</span>
      </div>
      <Progress value={progressValue} className="h-3" />
    </div>
  );
};

export default WensberoepenProgress;
