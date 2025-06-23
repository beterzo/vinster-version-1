
import { Progress } from "@/components/ui/progress";

interface WensberoepenProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WensberoepenProgress = ({ currentStep, totalSteps }: WensberoepenProgressProps) => {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Progress value={progressValue} className="h-3" />
    </div>
  );
};

export default WensberoepenProgress;
