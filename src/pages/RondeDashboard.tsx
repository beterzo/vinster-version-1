import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StepCard, { StepStatus } from "@/components/StepCard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserRounds } from "@/hooks/useUserRounds";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useWensberoepenValidation } from "@/hooks/useWensberoepenValidation";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { supabase } from "@/integrations/supabase/client";

const RondeDashboard = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { rounds, loading: roundsLoading } = useUserRounds();
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses();
  const { isWensberoepenComplete, isLoading: wensberoepenLoading } = useWensberoepenValidation();
  const { responses: prioriteitenResponses, loading: prioriteitenLoading } = usePrioriteitenResponses();
  const { responses: extraInfoResponses, loading: extraInfoLoading } = useExtraInformatieResponses();
  
  const [round, setRound] = useState<any>(null);
  const [reportExists, setReportExists] = useState(false);
  const [zoekprofielExists, setZoekprofielExists] = useState(false);

  useEffect(() => {
    if (!roundsLoading && rounds.length > 0 && roundId) {
      const foundRound = rounds.find(r => r.id === roundId);
      setRound(foundRound || null);
    }
  }, [rounds, roundsLoading, roundId]);

  useEffect(() => {
    const checkReportAndZoekprofiel = async () => {
      if (!roundId) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check report
      const { data: report } = await supabase
        .from('user_reports')
        .select('id')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();
      
      setReportExists(!!report);

      // Check zoekprofiel
      const { data: zoekprofiel } = await supabase
        .from('user_zoekprofielen')
        .select('id')
        .eq('user_id', user.id)
        .eq('pdf_status', 'completed')
        .maybeSingle();
      
      setZoekprofielExists(!!zoekprofiel);
    };

    checkReportAndZoekprofiel();
  }, [roundId]);

  const isLoading = roundsLoading || enthousiasmeLoading || wensberoepenLoading || prioriteitenLoading || extraInfoLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vinster-blue" />
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('dashboard.round_dashboard.not_found')}</p>
          <Button onClick={() => navigate('/home')}>
            {t('dashboard.round_dashboard.back_to_dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  // Calculate progress for each step
  const enthousiasmeProgress = enthousiasmeResponses ? 100 : 0;
  const wensberoepenProgress = isWensberoepenComplete ? 100 : 0;
  
  // Persoonsprofiel progress (prioriteiten + extra info)
  const hasPrioriteiten = prioriteitenResponses && (
    prioriteitenResponses.selected_activiteiten_keywords?.length ||
    prioriteitenResponses.selected_interesses_keywords?.length ||
    prioriteitenResponses.selected_werkomstandigheden_keywords?.length
  );
  const hasExtraInfo = extraInfoResponses && extraInfoResponses.opleidingsniveau;
  const persoonsprofielProgress = hasPrioriteiten && hasExtraInfo ? 100 : (hasPrioriteiten || hasExtraInfo ? 50 : 0);
  
  const rapportProgress = reportExists ? 100 : 0;
  const zoekprofielProgress = zoekprofielExists ? 100 : 0;

  // Determine step statuses
  const getStepStatus = (stepProgress: number, previousComplete: boolean): StepStatus => {
    if (stepProgress === 100) return 'completed';
    if (previousComplete) return 'active';
    return 'locked';
  };

  const enthousiasmeStatus: StepStatus = enthousiasmeProgress === 100 ? 'completed' : 'active';
  const wensberoepenStatus = getStepStatus(wensberoepenProgress, enthousiasmeProgress === 100);
  const persoonsprofielStatus = getStepStatus(persoonsprofielProgress, wensberoepenProgress === 100);
  const rapportStatus = getStepStatus(rapportProgress, persoonsprofielProgress === 100);
  const zoekprofielStatus = getStepStatus(zoekprofielProgress, rapportProgress === 100);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleStepClick = (stepId: string) => {
    switch (stepId) {
      case 'enthousiasme':
        navigate('/enthousiasme-intro');
        break;
      case 'wensberoepen':
        navigate('/wensberoepen-intro');
        break;
      case 'persoonsprofiel':
        navigate('/profiel-voltooien-intro');
        break;
      case 'loopbaanrapport':
        if (reportExists) {
          navigate(`/rapport-bekijken/${roundId}`);
        } else {
          navigate('/rapport-genereren-confirmatie');
        }
        break;
      case 'zoekprofiel':
        navigate('/zoekprofiel-intro');
        break;
    }
  };

  const steps = [
    {
      stepId: 'enthousiasme',
      title: t('dashboard.round_dashboard.steps.enthousiasme.title'),
      description: t('dashboard.round_dashboard.steps.enthousiasme.description'),
      status: enthousiasmeStatus,
      progress: enthousiasmeProgress,
    },
    {
      stepId: 'wensberoepen',
      title: t('dashboard.round_dashboard.steps.wensberoepen.title'),
      description: t('dashboard.round_dashboard.steps.wensberoepen.description'),
      status: wensberoepenStatus,
      progress: wensberoepenProgress,
    },
    {
      stepId: 'persoonsprofiel',
      title: t('dashboard.round_dashboard.steps.persoonsprofiel.title'),
      description: t('dashboard.round_dashboard.steps.persoonsprofiel.description'),
      status: persoonsprofielStatus,
      progress: persoonsprofielProgress,
    },
    {
      stepId: 'loopbaanrapport',
      title: t('dashboard.round_dashboard.steps.loopbaanrapport.title'),
      description: t('dashboard.round_dashboard.steps.loopbaanrapport.description'),
      status: rapportStatus,
      progress: rapportProgress,
    },
    {
      stepId: 'zoekprofiel',
      title: t('dashboard.round_dashboard.steps.zoekprofiel.title'),
      description: t('dashboard.round_dashboard.steps.zoekprofiel.description'),
      status: zoekprofielStatus,
      progress: zoekprofielProgress,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('dashboard.round_dashboard.back_to_dashboard')}
        </Button>

        {/* Round Header */}
        <Card className="p-6 mb-8 border-0 rounded-3xl bg-gradient-to-r from-vinster-blue to-vinster-blue/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {t('dashboard.rounds.round_label')} {round.round_number}
                </h1>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>{t('dashboard.round_dashboard.started')}: {formatDate(round.created_at)}</span>
                </div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              round.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {round.status === 'completed' 
                ? t('dashboard.rounds.status_completed')
                : t('dashboard.rounds.status_in_progress')
              }
            </span>
          </div>
        </Card>

        {/* Journey Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('dashboard.round_dashboard.journey_title')}
          </h2>
          <p className="text-gray-600">
            {t('dashboard.round_dashboard.journey_subtitle')}
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {steps.slice(0, 3).map((step, index) => (
            <StepCard
              key={step.stepId}
              stepNumber={index + 1}
              stepId={step.stepId}
              title={step.title}
              description={step.description}
              status={step.status}
              progress={step.progress}
              onClick={() => handleStepClick(step.stepId)}
              blockedReason={step.status === 'locked' ? t('dashboard.round_dashboard.complete_previous') : undefined}
            />
          ))}
        </div>
        
        {/* Second row - centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {steps.slice(3).map((step, index) => (
            <StepCard
              key={step.stepId}
              stepNumber={index + 4}
              stepId={step.stepId}
              title={step.title}
              description={step.description}
              status={step.status}
              progress={step.progress}
              onClick={() => handleStepClick(step.stepId)}
              blockedReason={step.status === 'locked' ? t('dashboard.round_dashboard.complete_previous') : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RondeDashboard;
