
import ProgressStep from "./ProgressStep";
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
      actionButton: "Start scan",
      icon: "heart"
    },
    {
      step: 2,
      title: "Wensberoepen",
      description: "Verken verschillende carrièremogelijkheden",
      actionButton: "Bekijk beroepen",
      icon: "briefcase"
    },
    {
      step: 3,
      title: "Persoonsprofiel",
      description: "Bouw je persoonlijke profiel op",
      actionButton: "Voltooien",
      icon: "user"
    },
    {
      step: 4,
      title: "Loopbaanrapport",
      description: "Ontvang je persoonlijke aanbevelingen",
      actionButton: "Bekijk rapport",
      icon: "file-text"
    },
    {
      step: 5,
      title: "Zoekprofiel",
      description: "Download je zoekprofiel",
      actionButton: "Download",
      icon: "search"
    }
  ];

  const stepProgress = [
    { progress: enthousiasmeCompleted ? 100 : enthousiasmeProgress, isCompleted: enthousiasmeCompleted },
    { progress: wensberoepenCompleted ? 100 : wensberoepenProgress, isCompleted: wensberoepenCompleted },
    { progress: (extraInformatieCompleted && prioriteitenCompleted) ? 100 : combinedProgress(), isCompleted: extraInformatieCompleted && prioriteitenCompleted },
    { progress: hasUserReport ? 100 : 0, isCompleted: hasUserReport },
    { progress: zoekprofielCompleted ? 100 : zoekprofielProgress, isCompleted: zoekprofielCompleted }
  ];

  const handleStepClick = (stepTitle: string) => {
    console.log("ProgressStepsGrid - step clicked:", stepTitle);
    onStepClick(stepTitle);
  };

  return (
    <div className="space-y-1">
      {progressSteps.map((step, index) => {
        const { progress, isCompleted } = stepProgress[index];
        const isCurrent = !isCompleted && (index === 0 || stepProgress[index - 1]?.isCompleted);
        
        return (
          <div key={index}>
            <ProgressStep
              step={step}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              progress={progress}
              onClick={() => handleStepClick(step.title)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepsGrid;
