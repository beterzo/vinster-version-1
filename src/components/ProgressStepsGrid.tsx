
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck, Info, ClipboardList } from "lucide-react";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";

interface ProgressStepsGridProps {
  enthousiasmeProgress: number;
  enthousiasmeCompleted: boolean;
  wensberoepenProgress: number;
  wensberoepenCompleted: boolean;
  prioriteitenProgress: number;
  prioriteitenCompleted: boolean;
  extraInformatieProgress: number;
  extraInformatieCompleted: boolean;
  hasUserReport: boolean;
  onStepClick: (stepTitle: string) => void;
}

const ProgressStepsGrid = ({
  enthousiasmeProgress,
  enthousiasmeCompleted,
  wensberoepenProgress,
  wensberoepenCompleted,
  prioriteitenProgress,
  prioriteitenCompleted,
  extraInformatieProgress,
  extraInformatieCompleted,
  hasUserReport,
  onStepClick
}: ProgressStepsGridProps) => {
  const { progress: zoekprofielProgress, isCompleted: zoekprofielCompleted } = useZoekprofielResponses();

  // Calculate combined progress for "Profiel voltooien"
  const combinedProgress = () => {
    if (extraInformatieCompleted && prioriteitenCompleted) return 100;
    if (!extraInformatieCompleted && !prioriteitenCompleted) return 0;
    if (extraInformatieCompleted && !prioriteitenCompleted) return 50 + (prioriteitenProgress / 2);
    if (!extraInformatieCompleted && prioriteitenCompleted) return extraInformatieProgress / 2;
    return (extraInformatieProgress + prioriteitenProgress) / 2;
  };

  const progressSteps = [
    {
      title: "Enthousiasmescan",
      progress: enthousiasmeProgress,
      isCompleted: enthousiasmeCompleted,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Wensberoepen",
      progress: wensberoepenProgress,
      isCompleted: wensberoepenCompleted,
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Profiel voltooien",
      progress: combinedProgress(),
      isCompleted: extraInformatieCompleted && prioriteitenCompleted,
      icon: <ClipboardList className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Rapport & onderzoeksplan",
      progress: hasUserReport ? 100 : 0,
      isCompleted: hasUserReport,
      icon: <FileText className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Zoekprofiel",
      progress: zoekprofielProgress,
      isCompleted: zoekprofielCompleted,
      icon: <Search className="w-5 h-5 text-yellow-500" />
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
