
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck, Info, ClipboardList } from "lucide-react";
import { useFunctieprofielResponses } from "@/hooks/useFunctieprofielResponses";

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
  const { progress: functieprofielProgress, isCompleted: functieprofielCompleted } = useFunctieprofielResponses();

  // Calculate page-based progress for "Profiel voltooien"
  const combinedProgress = () => {
    const extraInformatieWeight = 25; // 25% for extra informatie page
    const prioriteitenWeight = 75; // 75% for prioriteiten (3 pages combined)
    
    const extraInformatieContribution = extraInformatieCompleted ? extraInformatieWeight : 0;
    const prioriteitenContribution = (prioriteitenProgress / 100) * prioriteitenWeight;
    
    return Math.round(extraInformatieContribution + prioriteitenContribution);
  };

  const progressSteps = [
    {
      title: "Enthousiasmescan",
      progress: enthousiasmeProgress,
      isCompleted: enthousiasmeCompleted,
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      tooltipContent: "Ontdek wat je echt leuk vindt door terug te kijken naar je kindertijd en werkverleden"
    },
    {
      title: "Wensberoepen",
      progress: wensberoepenProgress,
      isCompleted: wensberoepenCompleted,
      icon: <Target className="w-5 h-5 text-blue-400" />,
      tooltipContent: "Stel drie ideale banen samen die passen bij jouw interesses en wensen"
    },
    {
      title: "Loopbaanrapport maken",
      progress: combinedProgress(),
      isCompleted: extraInformatieCompleted && prioriteitenCompleted,
      icon: <ClipboardList className="w-5 h-5 text-yellow-500" />,
      tooltipContent: "Vul je profiel aan met persoonlijke informatie en prioriteiten"
    },
    {
      title: "Loopbaanrapport & onderzoeksplan",
      progress: hasUserReport ? 100 : 0,
      isCompleted: hasUserReport,
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      tooltipContent: "Ontvang je persoonlijke loopbaanadvies en concrete actieplan"
    },
    {
      title: "Functieprofiel",
      progress: functieprofielProgress,
      isCompleted: functieprofielCompleted,
      icon: <Search className="w-5 h-5 text-yellow-500" />,
      tooltipContent: "Creëer een professioneel document voor je sollicitaties"
    }
  ];

  return (
    <div className="flex flex-col justify-between space-y-4">
      {progressSteps.map((step, index) => (
        <div key={index} onClick={() => onStepClick(step.title)}>
          <ProgressStep
            title={step.title}
            progress={step.progress}
            isCompleted={step.isCompleted}
            icon={step.icon}
            compact={true}
            tooltipContent={step.tooltipContent}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressStepsGrid;
