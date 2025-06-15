
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck, Info } from "lucide-react";

interface ProgressStepsGridProps {
  prioriteitenProgress: number;
  prioriteitenCompleted: boolean;
  extraInformatieProgress: number;
  extraInformatieCompleted: boolean;
  onStepClick: (stepTitle: string) => void;
}

const ProgressStepsGrid = ({
  prioriteitenProgress,
  prioriteitenCompleted,
  extraInformatieProgress,
  extraInformatieCompleted,
  onStepClick
}: ProgressStepsGridProps) => {
  const progressSteps = [
    {
      title: "Enthousiasmescan",
      progress: 100,
      isCompleted: true,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Wensberoepen",
      progress: 100,
      isCompleted: true,
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Prioriteiten stellen",
      progress: prioriteitenProgress,
      isCompleted: prioriteitenCompleted,
      icon: <ListTodo className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Extra informatie",
      progress: extraInformatieProgress,
      isCompleted: extraInformatieCompleted,
      icon: <Info className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Zoekprofiel",
      progress: 0,
      isCompleted: false,
      icon: <UserCheck className="w-5 h-5 text-yellow-500" />
    }
  ];

  return (
    <div className="flex flex-col justify-between">
      {progressSteps.map((step, index) => (
        <div key={index} onClick={() => onStepClick(step.title)} className="cursor-pointer">
          <ProgressStep
            title={step.title}
            progress={step.progress}
            isCompleted={step.isCompleted}
            icon={step.icon}
            compact={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressStepsGrid;
