import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import JourneyStepNavigator from "@/components/JourneyStepNavigator";
import WelkomInline from "@/components/journey/WelkomInline";
import EnthousiasmeInline from "@/components/journey/EnthousiasmeInline";
import WensberoepenInline from "@/components/journey/WensberoepenInline";
import PersoonsprofielInline from "@/components/journey/PersoonsprofielInline";
import RapportInline from "@/components/journey/RapportInline";
import OnderzoeksplanInline from "@/components/journey/OnderzoeksplanInline";
import OrganisatieOnderzoeksplanInline from "@/components/journey/OrganisatieOnderzoeksplanInline";
import ZoekprofielInline from "@/components/journey/ZoekprofielInline";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserRounds } from "@/hooks/useUserRounds";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useWensberoepenValidation } from "@/hooks/useWensberoepenValidation";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { useOrganisation } from "@/contexts/OrganisationContext";
import { JourneyStep, SubStep, JOURNEY_STEPS } from "@/types/journey";
import { supabase } from "@/integrations/supabase/client";

const RondeDashboard = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { rounds, loading: roundsLoading } = useUserRounds();
  const { isOrganisationMode, organisationTypeId, name: organisationName, accessCodeId: organisationAccessCodeId } = useOrganisation();
  
  const activeSteps = useMemo(() => {
    if (isOrganisationMode) {
      return JOURNEY_STEPS.filter(s => s.id !== 'zoekprofiel');
    }
    return JOURNEY_STEPS;
  }, [isOrganisationMode]);
  
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading, loadResponses: reloadEnthousiasme } = useEnthousiasmeResponses(roundId);
  const { isWensberoepenComplete, isLoading: wensberoepenLoading, reloadWensberoepen } = useWensberoepenValidation(roundId);
  const { responses: prioriteitenResponses, loading: prioriteitenLoading, loadResponses: reloadPrioriteiten } = usePrioriteitenResponses(roundId);
  const { responses: extraInfoResponses, loading: extraInfoLoading, loadResponses: reloadExtraInfo } = useExtraInformatieResponses(roundId);
  
  const [round, setRound] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStep>('enthousiasme');
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>('welkom');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [reportExists, setReportExists] = useState(false);
  const [onderzoeksplanComplete, setOnderzoeksplanComplete] = useState(false);
  const [zoekprofielComplete, setZoekprofielComplete] = useState(false);

  useEffect(() => {
    if (!roundsLoading && rounds.length > 0 && roundId) {
      const foundRound = rounds.find(r => r.id === roundId);
      setRound(foundRound || null);
    }
  }, [rounds, roundsLoading, roundId]);

  useEffect(() => {
    const checkReportAndZoekprofiel = async () => {
      if (!roundId) return;
      
      const { data: reportData } = await supabase
        .from('user_reports')
        .select('id')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();
      setReportExists(!!reportData);
      
      const { data: zoekprofielData } = await supabase
        .from('user_zoekprofielen')
        .select('zoekprofiel_content')
        .eq('round_id', roundId)
        .maybeSingle();
      setZoekprofielComplete(!!zoekprofielData?.zoekprofiel_content);
    };
    checkReportAndZoekprofiel();
  }, [roundId]);

  const isLoading = roundsLoading || enthousiasmeLoading || wensberoepenLoading || prioriteitenLoading || extraInfoLoading;

  const enthousiasmeComplete = enthousiasmeResponses && 
    enthousiasmeResponses.kindertijd_activiteiten && 
    enthousiasmeResponses.fluitend_thuiskomen_dag;
  
  const wensberoepenComplete = isWensberoepenComplete;
  
  const persoonsprofielComplete = prioriteitenResponses && 
    prioriteitenResponses.selected_activiteiten_keywords?.length >= 5 &&
    prioriteitenResponses.selected_werkomstandigheden_keywords?.length >= 5 &&
    prioriteitenResponses.selected_interesses_keywords?.length >= 5 &&
    extraInfoResponses?.opleidingsniveau;

  const getCompletedSteps = (): JourneyStep[] => {
    const completed: JourneyStep[] = [];
    if (enthousiasmeComplete) completed.push('enthousiasme');
    if (wensberoepenComplete) completed.push('wensberoepen');
    if (persoonsprofielComplete) completed.push('persoonsprofiel');
    if (reportExists) completed.push('loopbaanrapport');
    if (onderzoeksplanComplete) completed.push('onderzoeksplan');
    if (zoekprofielComplete) completed.push('zoekprofiel');
    return completed;
  };

  const completedSteps = getCompletedSteps();
  const progressPercentage = (completedSteps.length / activeSteps.length) * 100;

  const getViewSubStepForCompletedStep = (step: JourneyStep): SubStep => {
    switch (step) {
      case 'enthousiasme': return 'step1';
      case 'wensberoepen': return 'step1';
      case 'persoonsprofiel': return 'extra_info';
      case 'loopbaanrapport': return 'complete';
      case 'onderzoeksplan': return 'page1';
      case 'zoekprofiel': return 'step1';
      default: return 'step1';
    }
  };

  const handleStepClick = (step: JourneyStep) => {
    setSlideDirection(activeSteps.findIndex(s => s.id === step) > activeSteps.findIndex(s => s.id === currentStep) ? 'left' : 'right');
    setCurrentStep(step);
    
    const isStepCompleted = completedSteps.includes(step);
    
    if (isStepCompleted) {
      setCurrentSubStep(getViewSubStepForCompletedStep(step));
    } else if (step === 'loopbaanrapport') {
      setCurrentSubStep(reportExists ? 'complete' : 'confirm');
    } else {
      const stepConfig = activeSteps.find(s => s.id === step);
      // Skip 'welkom' substep so we don't loop back to the overview page
      const firstSubStep = stepConfig?.subSteps[0];
      const targetSubStep = firstSubStep === 'welkom' 
        ? (stepConfig?.subSteps[1] || 'intro') 
        : (firstSubStep || 'intro');
      setCurrentSubStep(targetSubStep);
    }
  };

  const getCurrentStepConfig = () => activeSteps.find(s => s.id === currentStep);

  const handleNext = async () => {
    const stepConfig = getCurrentStepConfig();
    if (!stepConfig) return;
    const currentSubIndex = stepConfig.subSteps.indexOf(currentSubStep);
    
    if (currentSubIndex < stepConfig.subSteps.length - 1) {
      setSlideDirection('left');
      setCurrentSubStep(stepConfig.subSteps[currentSubIndex + 1]);
    } else {
      if (currentStep === 'enthousiasme') await reloadEnthousiasme();
      else if (currentStep === 'wensberoepen') await reloadWensberoepen();
      else if (currentStep === 'persoonsprofiel') {
        await reloadPrioriteiten();
        await reloadExtraInfo();
      }
      setSlideDirection('left');
      setCurrentSubStep('overview');
    }
  };

  const handleContinueFromOverview = () => {
    const nextStep = activeSteps.find(step => !completedSteps.includes(step.id));
    if (nextStep) {
      setSlideDirection('left');
      setCurrentStep(nextStep.id);
      setCurrentSubStep(nextStep.subSteps[0]);
    }
  };

  const handleContinueFromWelkom = () => {
    const nextIncompleteStep = activeSteps.find(step => !completedSteps.includes(step.id));
    if (nextIncompleteStep) {
      setSlideDirection('left');
      setCurrentStep(nextIncompleteStep.id);
      const targetSubStep = nextIncompleteStep.subSteps[0] === 'welkom' 
        ? nextIncompleteStep.subSteps[1] 
        : nextIncompleteStep.subSteps[0];
      setCurrentSubStep(targetSubStep);
    }
  };

  const handlePrevious = () => {
    const stepConfig = getCurrentStepConfig();
    if (!stepConfig) return;
    const currentSubIndex = stepConfig.subSteps.indexOf(currentSubStep);
    
    if (currentSubIndex > 0) {
      setSlideDirection('right');
      setCurrentSubStep(stepConfig.subSteps[currentSubIndex - 1]);
    } else {
      const stepIndex = activeSteps.findIndex(s => s.id === currentStep);
      if (stepIndex > 0) {
        const prevStep = activeSteps[stepIndex - 1];
        setSlideDirection('right');
        setCurrentStep(prevStep.id);
        setCurrentSubStep(prevStep.subSteps[prevStep.subSteps.length - 1]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vinster-off-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B]" />
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-vinster-off-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('dashboard.round_dashboard.not_found')}</p>
          <Button onClick={() => navigate('/home')}>{t('dashboard.round_dashboard.back_to_dashboard')}</Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const animationClass = slideDirection === 'left' ? 'animate-slide-in-right' : 'animate-slide-in-left';

    if (currentSubStep === 'overview') {
      return (
        <div key={`overview-${currentStep}`} className={animationClass}>
          <WelkomInline 
            onNext={handleContinueFromOverview}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            isOrganisationMode={isOrganisationMode}
            organisationName={organisationName}
            organisationAccessCodeId={organisationAccessCodeId}
          />
        </div>
      );
    }

    return (
      <div key={`${currentStep}-${currentSubStep}`} className={animationClass}>
        {currentStep === 'enthousiasme' && roundId && (
          <EnthousiasmeInline 
            roundId={roundId} subStep={currentSubStep} onNext={handleNext} onPrevious={handlePrevious}
            completedSteps={completedSteps} onStepClick={handleStepClick} onContinueFromWelkom={handleContinueFromWelkom}
            isOrganisationMode={isOrganisationMode} organisationName={organisationName} organisationAccessCodeId={organisationAccessCodeId}
          />
        )}
        {currentStep === 'wensberoepen' && roundId && (
          <WensberoepenInline roundId={roundId} subStep={currentSubStep} onNext={handleNext} onPrevious={handlePrevious} />
        )}
        {currentStep === 'persoonsprofiel' && roundId && (
          <PersoonsprofielInline roundId={roundId} subStep={currentSubStep} onNext={handleNext} onPrevious={handlePrevious} />
        )}
        {currentStep === 'loopbaanrapport' && roundId && (
          <RapportInline 
            roundId={roundId} subStep={currentSubStep as 'confirm' | 'complete'} onNext={handleNext} onPrevious={handlePrevious}
            onReportGenerated={() => setReportExists(true)} organisationTypeId={isOrganisationMode ? organisationTypeId : undefined}
          />
        )}
        {currentStep === 'onderzoeksplan' && isOrganisationMode && roundId && (
          <OrganisatieOnderzoeksplanInline roundId={roundId} onComplete={() => setOnderzoeksplanComplete(true)} />
        )}
        {currentStep === 'onderzoeksplan' && !isOrganisationMode && (
          <OnderzoeksplanInline subStep={currentSubStep as 'page1' | 'page2' | 'page3'} onNext={handleNext} onPrevious={handlePrevious} onComplete={() => setOnderzoeksplanComplete(true)} />
        )}
        {currentStep === 'zoekprofiel' && roundId && (
          <ZoekprofielInline roundId={roundId} subStep={currentSubStep === 'complete' ? 'complete' : currentSubStep === 'step1' ? 'step1' : 'intro'} onNext={handleNext} onPrevious={handlePrevious} />
        )}
      </div>
    );
  };

  const currentStepIndex = activeSteps.findIndex(s => s.id === currentStep);
  const currentStepLabel = activeSteps[currentStepIndex] ? t(activeSteps[currentStepIndex].labelKey) : '';

  return (
    <div className="min-h-screen bg-vinster-off-white">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/home')} 
            className="text-gray-500 hover:text-[#232D4B] hover:bg-white/60 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('dashboard.round_dashboard.back_to_dashboard')}
          </Button>
        </div>

        <div className="bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] rounded-2xl p-6 md:p-8 mb-6 border-t-4 border-[#F5C518]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#232D4B]">
                Jouw loopbaantraject
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Stap {currentStepIndex + 1} van {activeSteps.length} — {currentStepLabel}
              </p>
              {isOrganisationMode && organisationName && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FEF9E6] text-[#232D4B] px-3 py-1 rounded-full mt-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {organisationName}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 min-w-[180px]">
              <Progress value={progressPercentage} className="h-2.5 flex-1 w-full" />
              <span className="text-xs font-medium text-gray-500">
                {Math.round(progressPercentage)}% voltooid
              </span>
            </div>
          </div>

          <JourneyStepNavigator 
            currentStep={currentStep} 
            completedSteps={completedSteps} 
            onStepClick={handleStepClick} 
            steps={activeSteps} 
          />
        </div>

        <div className="overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RondeDashboard;

