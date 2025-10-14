import { useMemo } from 'react';
import { useEnthousiasmeResponses } from './useEnthousiasmeResponses';
import { useWensberoepenValidation } from './useWensberoepenValidation';
import { usePrioriteitenResponses } from './usePrioriteitenResponses';
import { useExtraInformatieResponses } from './useExtraInformatieResponses';
import { useRapportData } from './useRapportData';
import { useTranslation } from './useTranslation';

export const useStepAccess = () => {
  const { t } = useTranslation();
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses();
  const { isWensberoepenComplete, isLoading: wensberoepenLoading } = useWensberoepenValidation();
  const { isCompleted: prioriteitenCompleted, loading: prioriteitenLoading } = usePrioriteitenResponses();
  const { isCompleted: extraInformatieCompleted, loading: extraInformatieLoading } = useExtraInformatieResponses();
  const { data: reportData, loading: reportLoading } = useRapportData();

  const stepAccess = useMemo(() => {
    // Check if enthousiasme is completed (at least one field filled in any of the 3 pages)
    const enthousiasmeCompleted = !enthousiasmeLoading && 
      enthousiasmeResponses && 
      Object.values(enthousiasmeResponses).some(value => 
        value && String(value).trim() !== '' && String(value).trim().length > 0
      );

    console.log('🔐 Step Access Check:', {
      enthousiasmeCompleted,
      enthousiasmeLoading,
      enthousiasmeResponsesCount: Object.keys(enthousiasmeResponses || {}).length,
      isWensberoepenComplete,
      wensberoepenLoading
    });

    // Check if persoonsprofiel is completed (both extra info and prioriteiten)
    const persoonsprofielCompleted = prioriteitenCompleted && extraInformatieCompleted;

    // Check if rapport is completed
    const rapportCompleted = reportData?.report_status === 'completed';

    return {
      enthousiasme: {
        canAccess: true,
        isCompleted: enthousiasmeCompleted
      },
      wensberoepen: {
        canAccess: enthousiasmeCompleted,
        isCompleted: isWensberoepenComplete,
        blockedReason: t('dashboard.step_blocked.enthousiasme_required')
      },
      persoonsprofiel: {
        canAccess: isWensberoepenComplete,
        isCompleted: persoonsprofielCompleted,
        blockedReason: t('dashboard.step_blocked.wensberoepen_required')
      },
      rapport: {
        canAccess: persoonsprofielCompleted,
        isCompleted: rapportCompleted,
        blockedReason: t('dashboard.step_blocked.persoonsprofiel_required')
      },
      zoekprofiel: {
        canAccess: rapportCompleted,
        isCompleted: false, // We don't track zoekprofiel completion for blocking
        blockedReason: t('dashboard.step_blocked.rapport_required')
      }
    };
  }, [enthousiasmeResponses, enthousiasmeLoading, isWensberoepenComplete, wensberoepenLoading, prioriteitenCompleted, extraInformatieCompleted, reportData, t]);

  const isLoading = enthousiasmeLoading || wensberoepenLoading || prioriteitenLoading || extraInformatieLoading || reportLoading;

  const canAccessStep = (stepId: string): boolean => {
    const step = stepAccess[stepId as keyof typeof stepAccess];
    return step ? step.canAccess : false;
  };

  const getBlockedReason = (stepId: string): string => {
    const step = stepAccess[stepId as keyof typeof stepAccess];
    if (step && 'blockedReason' in step) {
      return step.blockedReason || t('dashboard.step_blocked.title');
    }
    return t('dashboard.step_blocked.title');
  };

  return {
    ...stepAccess,
    isLoading,
    canAccessStep,
    getBlockedReason
  };
};
