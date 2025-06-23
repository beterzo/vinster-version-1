
import { Progress } from "@/components/ui/progress";

interface EnthousiasmeProgressProps {
  currentStep: number;
  totalSteps: number;
}

const EnthousiasmeProgress = ({ currentStep, totalSteps }: EnthousiasmeProgressProps) => {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Progress value={progressValue} className="h-3" />
    </div>
  );
};

export default EnthousiasmeProgress;
