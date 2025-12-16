import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import JourneyStepNavigator from "@/components/JourneyStepNavigator";
import WelkomInline from "@/components/journey/WelkomInline";
import EnthousiasmeInline from "@/components/journey/EnthousiasmeInline";
import WensberoepenInline from "@/components/journey/WensberoepenInline";
import PersoonsprofielInline from "@/components/journey/PersoonsprofielInline";
import RapportInline from "@/components/journey/RapportInline";
import OnderzoeksplanInline from "@/components/journey/OnderzoeksplanInline";
import ZoekprofielInline from "@/components/journey/ZoekprofielInline";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserRounds } from "@/hooks/useUserRounds";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useWensberoepenValidation } from "@/hooks/useWensberoepenValidation";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { JourneyStep, SubStep, JOURNEY_STEPS } from "@/types/journey";
import { supabase } from "@/integrations/supabase/client";

const RondeDashboard = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { rounds, loading: roundsLoading } = useUserRounds();
  
  // Pass roundId to all response hooks
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses(roundId);
  const { isWensberoepenComplete, isLoading: wensberoepenLoading } = useWensberoepenValidation(roundId);
  const { responses: prioriteitenResponses, loading: prioriteitenLoading } = usePrioriteitenResponses(roundId);
  const { responses: extraInfoResponses, loading: extraInfoLoading } = useExtraInformatieResponses(roundId);
  
  const [round, setRound] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStep>('enthousiasme');
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>('welkom');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [reportExists, setReportExists] = useState(false);
  const [onderzoeksplanComplete, setOnderzoeksplanComplete] = useState(false);

  useEffect(() => {
    if (!roundsLoading && rounds.length > 0 && roundId) {
      const foundRound = rounds.find(r => r.id === roundId);
      setRound(foundRound || null);
    }
  }, [rounds, roundsLoading, roundId]);

  useEffect(() => {
    const checkReport = async () => {
      if (!roundId) return;
      const { data } = await supabase
        .from('user_reports')
        .select('id')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();
      setReportExists(!!data);
    };
    checkReport();
  }, [roundId]);

  const isLoading = roundsLoading || enthousiasmeLoading || wensberoepenLoading || prioriteitenLoading || extraInfoLoading;

  // Calculate completed steps
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
    if (reportExists) {
      completed.push('loopbaanrapport');
    }
    if (onderzoeksplanComplete) {
      completed.push('onderzoeksplan');
    }
    return completed;
  };

  const completedSteps = getCompletedSteps();

  // Bepaal de juiste substep voor het bekijken van voltooide stappen (skip intro/welkom)
  const getViewSubStepForCompletedStep = (step: JourneyStep): SubStep => {
    switch (step) {
      case 'enthousiasme':
        return 'step1';  // Direct naar eerste vraag-pagina
      case 'wensberoepen':
        return 'step1';  // Direct naar wensberoep 1
      case 'persoonsprofiel':
        return 'extra_info';  // Direct naar inhoud
      case 'loopbaanrapport':
        return 'complete';  // Naar het rapport
      case 'onderzoeksplan':
        return 'page1';  // Naar eerste pagina
      case 'zoekprofiel':
        return 'step1';  // Direct naar vragen
      default:
        return 'step1';
    }
  };

  const handleStepClick = (step: JourneyStep) => {
    setSlideDirection(JOURNEY_STEPS.findIndex(s => s.id === step) > JOURNEY_STEPS.findIndex(s => s.id === currentStep) ? 'left' : 'right');
    setCurrentStep(step);
    
    // Check of de stap voltooid is
    const isStepCompleted = completedSteps.includes(step);
    
    if (isStepCompleted) {
      // Voltooide stap: direct naar inhoud (skip intro/welkom)
      setCurrentSubStep(getViewSubStepForCompletedStep(step));
    } else if (step === 'loopbaanrapport') {
      // Loopbaanrapport: check report status
      setCurrentSubStep(reportExists ? 'complete' : 'confirm');
    } else {
      // Niet voltooide stap: naar eerste substep (intro/welkom)
      const stepConfig = JOURNEY_STEPS.find(s => s.id === step);
      setCurrentSubStep(stepConfig?.subSteps[0] || 'intro');
    }
  };

  const getCurrentStepConfig = () => JOURNEY_STEPS.find(s => s.id === currentStep);

  const handleNext = () => {
    const stepConfig = getCurrentStepConfig();
    if (!stepConfig) return;

    const currentSubIndex = stepConfig.subSteps.indexOf(currentSubStep);
    
    if (currentSubIndex < stepConfig.subSteps.length - 1) {
      setSlideDirection('left');
      setCurrentSubStep(stepConfig.subSteps[currentSubIndex + 1]);
    } else {
      // End of current step's substeps - show overview
      setSlideDirection('left');
      setCurrentSubStep('overview');
    }
  };

  const handleContinueFromOverview = () => {
    // Find the next incomplete step
    const nextStep = JOURNEY_STEPS.find(step => !completedSteps.includes(step.id));
    if (nextStep) {
      setSlideDirection('left');
      setCurrentStep(nextStep.id);
      setCurrentSubStep(nextStep.subSteps[0]);
    }
  };

  // Specifieke functie voor navigatie vanuit welkom scherm naar volgende incomplete stap
  const handleContinueFromWelkom = () => {
    const nextIncompleteStep = JOURNEY_STEPS.find(step => !completedSteps.includes(step.id));
    if (nextIncompleteStep) {
      setSlideDirection('left');
      setCurrentStep(nextIncompleteStep.id);
      setCurrentSubStep(nextIncompleteStep.subSteps[0]);
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
      const stepIndex = JOURNEY_STEPS.findIndex(s => s.id === currentStep);
      if (stepIndex > 0) {
        const prevStep = JOURNEY_STEPS[stepIndex - 1];
        setSlideDirection('right');
        setCurrentStep(prevStep.id);
        setCurrentSubStep(prevStep.subSteps[prevStep.subSteps.length - 1]);
      }
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B]" />
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('dashboard.round_dashboard.not_found')}</p>
          <Button onClick={() => navigate('/home')}>{t('dashboard.round_dashboard.back_to_dashboard')}</Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const animationClass = slideDirection === 'left' ? 'animate-slide-in-right' : 'animate-slide-in-left';

    // Show WelkomInline with progress when substep is 'overview'
    if (currentSubStep === 'overview') {
      return (
        <div key={`overview-${currentStep}`} className={animationClass}>
          <WelkomInline 
            onNext={handleContinueFromOverview}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>
      );
    }

    return (
      <div key={`${currentStep}-${currentSubStep}`} className={animationClass}>
        {currentStep === 'enthousiasme' && roundId && (
          <EnthousiasmeInline 
            roundId={roundId} 
            subStep={currentSubStep} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            onContinueFromWelkom={handleContinueFromWelkom}
          />
        )}
        {currentStep === 'wensberoepen' && roundId && (
          <WensberoepenInline 
            roundId={roundId} 
            subStep={currentSubStep} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
            onNavigateToPersoonsprofiel={() => {
              setSlideDirection('left');
              setCurrentStep('persoonsprofiel');
              setCurrentSubStep('extra_info');
            }}
          />
        )}
        {currentStep === 'persoonsprofiel' && roundId && (
          <PersoonsprofielInline roundId={roundId} subStep={currentSubStep} onNext={handleNext} onPrevious={handlePrevious} />
        )}
        {currentStep === 'loopbaanrapport' && roundId && (
          <RapportInline 
            roundId={roundId} 
            subStep={currentSubStep as 'confirm' | 'complete'}
            onNext={handleNext} 
            onPrevious={handlePrevious}
            onReportGenerated={() => setReportExists(true)}
          />
        )}
        {currentStep === 'onderzoeksplan' && (
          <OnderzoeksplanInline 
            subStep={currentSubStep as 'page1' | 'page2' | 'page3'} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
            onComplete={() => setOnderzoeksplanComplete(true)}
          />
        )}
        {currentStep === 'zoekprofiel' && roundId && (
          <ZoekprofielInline 
            roundId={roundId} 
            subStep={currentSubStep === 'complete' ? 'complete' : currentSubStep === 'step1' ? 'step1' : 'intro'} 
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/home')} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('dashboard.round_dashboard.back_to_dashboard')}
          </Button>
        </div>

        <Card className="p-4 mb-6 border-0 rounded-2xl bg-white shadow-md">
          <JourneyStepNavigator currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />
        </Card>

        <div className="overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RondeDashboard;
