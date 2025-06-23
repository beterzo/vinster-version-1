
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck, Info, ClipboardList } from "lucide-react";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";

interface ProgressStepsGridProps {
  enthousiasmeProgress?: number;
  enthousiasmeCompleted?: boolean;
  wensberoepenProgress?: number;
  wensberoepenCompleted?: boolean;
  prioriteitenProgress?: number;
  prioriteitenCompleted?: boolean;
  extraInformatieProgress?: number;
  extraInformatieCompleted?: boolean;
  hasUserReport?: boolean;
  onStepClick?: (stepTitle: string) => void;
}

const ProgressStepsGrid = ({
  enthousiasmeProgress = 0,
  enthousiasmeCompleted = false,
  wensberoepenProgress = 0,
  wensberoepenCompleted = false,
  prioriteitenProgress = 0,
  prioriteitenCompleted = false,
  extraInformatieProgress = 0,
  extraInformatieCompleted = false,
  hasUserReport = false,
  onStepClick = () => {}
}: ProgressStepsGridProps) => {
  const { progress: zoekprofielProgress, isCompleted: zoekprofielCompleted } = useZoekprofielResponses();

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
      step: 1,
      title: "Enthousiasmescan",
      description: "Ontdek wat je echt drijft en motiveert",
      actionButton: "Start scan"
    },
    {
      step: 2,
      title: "Wensberoepen",
      description: "Verken verschillende carrièremogelijkheden",
      actionButton: "Bekijk beroepen"
    },
    {
      step: 3,
      title: "Persoonsprofiel",
      description: "Bouw je persoonlijke profiel op",
      actionButton: "Voltooien"
    },
    {
      step: 4,
      title: "Loopbaanrapport & onderzoeksplan",
      description: "Ontvang je persoonlijke aanbevelingen",
      actionButton: "Bekijk rapport"
    },
    {
      step: 5,
      title: "Zoekprofiel",
      description: "Download je zoekprofiel",
      actionButton: "Download"
    }
  ];

  const stepProgress = [
    { progress: enthousiasmeProgress, isCompleted: enthousiasmeCompleted },
    { progress: wensberoepenProgress, isCompleted: wensberoepenCompleted },
    { progress: combinedProgress(), isCompleted: extraInformatieCompleted && prioriteitenCompleted },
    { progress: hasUserReport ? 100 : 0, isCompleted: hasUserReport },
    { progress: zoekprofielProgress, isCompleted: zoekprofielCompleted }
  ];

  return (
    <div className="flex flex-col justify-between space-y-4">
      {progressSteps.map((step, index) => {
        const { progress, isCompleted } = stepProgress[index];
        const isCurrent = !isCompleted && (index === 0 || stepProgress[index - 1]?.isCompleted);
        
        return (
          <div key={index} onClick={() => onStepClick(step.title)}>
            <ProgressStep
              step={step}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              onClick={() => onStepClick(step.title)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepsGrid;
