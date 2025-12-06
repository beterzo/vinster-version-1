import { useMemo } from 'react';
import { useEnthousiasmeResponses } from './useEnthousiasmeResponses';
import { useWensberoepenValidation } from './useWensberoepenValidation';
import { usePrioriteitenResponses } from './usePrioriteitenResponses';
import { useExtraInformatieResponses } from './useExtraInformatieResponses';
import { useRapportData } from './useRapportData';
import { useTranslation } from './useTranslation';
import { useReportGenerationLimit } from './useReportGenerationLimit';

export const useStepAccess = () => {
  const { t } = useTranslation();
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses();
  const { isWensberoepenComplete, isLoading: wensberoepenLoading } = useWensberoepenValidation();
  const { isCompleted: prioriteitenCompleted, loading: prioriteitenLoading } = usePrioriteitenResponses();
  const { isCompleted: extraInformatieCompleted, loading: extraInformatieLoading } = useExtraInformatieResponses();
  const { data: reportData, loading: reportLoading } = useRapportData();
  const { hasCompletedReport, canGenerateNewReport, loading: reportLimitLoading } = useReportGenerationLimit();

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

    // Check if user is blocked from editing due to completed report
    const isBlockedByCompletedReport = hasCompletedReport && !canGenerateNewReport;

    const stepAccessData = {
      enthousiasme: {
        canAccess: true, // Always allow access for read-only viewing
        canEdit: !isBlockedByCompletedReport, // Only edit if not blocked
        isCompleted: enthousiasmeCompleted,
        blockedReason: isBlockedByCompletedReport ? t('dashboard.report_limit.blocked_reason') : undefined
      },
      wensberoepen: {
        canAccess: enthousiasmeCompleted, // Must have enthousiasme completed
        canEdit: enthousiasmeCompleted && !isBlockedByCompletedReport,
        isCompleted: isWensberoepenComplete,
        blockedReason: isBlockedByCompletedReport 
          ? t('dashboard.report_limit.blocked_reason')
          : t('dashboard.step_blocked.enthousiasme_required')
      },
      persoonsprofiel: {
        canAccess: isWensberoepenComplete,
        canEdit: isWensberoepenComplete && !isBlockedByCompletedReport,
        isCompleted: persoonsprofielCompleted,
        blockedReason: isBlockedByCompletedReport
          ? t('dashboard.report_limit.blocked_reason')
          : t('dashboard.step_blocked.wensberoepen_required')
      },
      rapport: {
        canAccess: persoonsprofielCompleted,
        canEdit: persoonsprofielCompleted && !isBlockedByCompletedReport,
        isCompleted: rapportCompleted,
        blockedReason: isBlockedByCompletedReport
          ? t('dashboard.report_limit.blocked_reason')
          : t('dashboard.step_blocked.persoonsprofiel_required')
      },
      zoekprofiel: {
        canAccess: rapportCompleted,
        canEdit: rapportCompleted,
        isCompleted: false,
        blockedReason: t('dashboard.step_blocked.rapport_required')
      }
    };

    // Helper function to get step mode
    const getStepMode = (stepId: string): 'edit' | 'view' => {
      const step = stepAccessData[stepId as keyof typeof stepAccessData];
      if (step && 'canEdit' in step) {
        return step.canEdit ? 'edit' : 'view';
      }
      return 'edit';
    };

    return {
      ...stepAccessData,
      // Export additional info for dashboard
      isBlockedByCompletedReport,
      hasCompletedReport,
      canGenerateNewReport,
      getStepMode
    };
  }, [enthousiasmeResponses, enthousiasmeLoading, isWensberoepenComplete, wensberoepenLoading, prioriteitenCompleted, extraInformatieCompleted, reportData, hasCompletedReport, canGenerateNewReport, t]);

  const isLoading = enthousiasmeLoading || wensberoepenLoading || prioriteitenLoading || extraInformatieLoading || reportLoading || reportLimitLoading;

  const canAccessStep = (stepId: string): boolean => {
    if (stepId === 'isBlockedByCompletedReport' || stepId === 'hasCompletedReport' || stepId === 'canGenerateNewReport') {
      return false;
    }
    
    // Map loopbaanrapport naar rapport
    let mappedId = stepId;
    if (stepId === 'loopbaanrapport') {
      mappedId = 'rapport';
    }
    
    const step = stepAccess[mappedId as keyof typeof stepAccess];
    
    // Als rapport is voltooid, altijd toegang geven (voor download)
    if (mappedId === 'rapport' && reportData?.report_status === 'completed') {
      return true;
    }
    
    return step && typeof step === 'object' && 'canAccess' in step ? step.canAccess : false;
  };

  const getBlockedReason = (stepId: string): string => {
    if (stepId === 'isBlockedByCompletedReport' || stepId === 'hasCompletedReport' || stepId === 'canGenerateNewReport') {
      return t('dashboard.step_blocked.title');
    }
    const step = stepAccess[stepId as keyof typeof stepAccess];
    if (step && typeof step === 'object' && 'blockedReason' in step) {
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
