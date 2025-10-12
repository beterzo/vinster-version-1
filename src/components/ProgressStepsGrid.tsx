
import ProgressStep from "./ProgressStep";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";
import { useStepAccess } from "@/hooks/useStepAccess";
import { useTranslation } from "@/hooks/useTranslation";

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
  onStepClick?: (stepId: string) => void;
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
  const { t } = useTranslation();
  const stepAccess = useStepAccess();

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
      id: "enthousiasme",
      title: t('common.enthousiasmescan'),
      description: t('dashboard.steps.enthousiasme.description'),
      actionButton: t('dashboard.steps.enthousiasme.action'),
      icon: "heart"
    },
    {
      step: 2,
      id: "wensberoepen",
      title: t('common.wensberoepen'),
      description: t('dashboard.steps.wensberoepen.description'),
      actionButton: t('dashboard.steps.wensberoepen.action'),
      icon: "briefcase"
    },
    {
      step: 3,
      id: "persoonsprofiel",
      title: t('common.persoonsprofiel'),
      description: t('dashboard.steps.persoonsprofiel.description'),
      actionButton: t('dashboard.steps.persoonsprofiel.action'),
      icon: "user"
    },
    {
      step: 4,
      id: "loopbaanrapport",
      title: t('common.loopbaanrapport'),
      description: t('dashboard.steps.loopbaanrapport.description'),
      actionButton: t('dashboard.steps.loopbaanrapport.action'),
      icon: "file-text"
    },
    {
      step: 5,
      id: "zoekprofiel",
      title: t('common.zoekprofiel'),
      description: t('dashboard.steps.zoekprofiel.description'),
      actionButton: t('dashboard.steps.zoekprofiel.action'),
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

  const handleStepClick = (stepId: string) => {
    console.log("ProgressStepsGrid - step clicked:", stepId);
    onStepClick(stepId);
  };

  const getStepLockStatus = (stepId: string) => {
    const canAccess = stepAccess.canAccessStep(stepId);
    const blockedReason = canAccess ? undefined : stepAccess.getBlockedReason(stepId);
    return { isLocked: !canAccess, lockedReason: blockedReason };
  };

  return (
    <div className="space-y-1">
      {progressSteps.map((step, index) => {
        const { progress, isCompleted } = stepProgress[index];
        const isCurrent = !isCompleted && (index === 0 || stepProgress[index - 1]?.isCompleted);
        const lockStatus = getStepLockStatus(step.id);
        
        return (
          <div key={index}>
            <ProgressStep
              step={step}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              progress={progress}
              isLocked={lockStatus.isLocked}
              lockedReason={lockStatus.lockedReason}
              onClick={() => handleStepClick(step.id)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepsGrid;
