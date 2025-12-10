import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Loader2, Lock, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StepCard, { StepStatus } from "@/components/StepCard";
import RapportViewer from "@/components/RapportViewer";
import RapportActies from "@/components/RapportActies";
import ZoekprofielDialog from "@/components/ZoekprofielDialog";
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
  const [reportContent, setReportContent] = useState<any>(null);
  const [zoekprofielExists, setZoekprofielExists] = useState(false);
  const [activeTab, setActiveTab] = useState<'loopbaanrapport' | 'zoekprofiel'>('loopbaanrapport');
  const [zoekprofielDialogOpen, setZoekprofielDialogOpen] = useState(false);

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
        .select('id, report_content')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();
      
      setReportExists(!!report);
      if (report?.report_content) {
        setReportContent(report.report_content);
      }

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
  
  const first3StepsComplete = enthousiasmeProgress === 100 && wensberoepenProgress === 100 && persoonsprofielProgress === 100;

  // Determine step statuses
  const getStepStatus = (stepProgress: number, previousComplete: boolean): StepStatus => {
    if (stepProgress === 100) return 'completed';
    if (previousComplete) return 'active';
    return 'locked';
  };

  const enthousiasmeStatus: StepStatus = enthousiasmeProgress === 100 ? 'completed' : 'active';
  const wensberoepenStatus = getStepStatus(wensberoepenProgress, enthousiasmeProgress === 100);
  const persoonsprofielStatus = getStepStatus(persoonsprofielProgress, wensberoepenProgress === 100);

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
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewRound = () => {
    navigate('/traject-opnieuw-starten-uitleg');
  };

  const handleZoekprofielComplete = () => {
    setZoekprofielExists(true);
  };

  const steps = [
    {
      stepId: 'enthousiasme',
      title: t('dashboard.round_dashboard.step_enthousiasme_title'),
      description: t('dashboard.round_dashboard.step_enthousiasme_description'),
      status: enthousiasmeStatus,
      progress: enthousiasmeProgress,
    },
    {
      stepId: 'wensberoepen',
      title: t('dashboard.round_dashboard.step_wensberoepen_title'),
      description: t('dashboard.round_dashboard.step_wensberoepen_description'),
      status: wensberoepenStatus,
      progress: wensberoepenProgress,
    },
    {
      stepId: 'persoonsprofiel',
      title: t('dashboard.round_dashboard.step_persoonsprofiel_title'),
      description: t('dashboard.round_dashboard.step_persoonsprofiel_description'),
      status: persoonsprofielStatus,
      progress: persoonsprofielProgress,
    },
  ];

  const renderLoopbaanrapportContent = () => {
    if (!first3StepsComplete) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
          <Lock className="w-16 h-16 text-gray-300 mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {t('dashboard.round_dashboard.content.locked_title')}
          </h3>
          <p className="text-gray-500 text-lg">
            {t('dashboard.round_dashboard.content.locked_message')}
          </p>
        </div>
      );
    }

    if (!reportExists) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
          <FileText className="w-16 h-16 text-vinster-blue mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {t('dashboard.round_dashboard.content.rapport_generate')}
          </h3>
          <p className="text-gray-600 mb-8">
            {t('dashboard.round_dashboard.content.rapport_generate_description')}
          </p>
          <Button 
            onClick={() => navigate('/rapport-genereren-confirmatie')} 
            className="bg-vinster-blue hover:bg-vinster-blue/90"
          >
            {t('dashboard.round_dashboard.content.generate_button')}
          </Button>
        </div>
      );
    }

    // Report exists - show inline
    return (
      <div>
        {reportContent && (
          <div className="print:p-0">
            {/* Inline report content */}
            <div className="space-y-8">
              {/* Ideale functie sectie */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-2xl font-bold text-[#232D4B] mb-6">{t('rapport.ideale_functie.title')}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#232D4B] mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[#232D4B] text-xs font-bold">1</span>
                      {t('rapport.ideale_functie.activiteiten')}
                    </h4>
                    <ul className="space-y-1">
                      {reportContent.ideale_functie?.activiteiten?.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="text-yellow-500">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#232D4B] mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#78BFE3] rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                      {t('rapport.ideale_functie.werkomgeving')}
                    </h4>
                    <ul className="space-y-1">
                      {reportContent.ideale_functie?.werkomgeving?.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="text-[#78BFE3]">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#232D4B] mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#232D4B] rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                      {t('rapport.ideale_functie.interessegebieden')}
                    </h4>
                    <ul className="space-y-1">
                      {reportContent.ideale_functie?.interessegebieden?.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="text-[#232D4B]">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Beroepen sectie */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-2xl font-bold text-[#232D4B] mb-6">{t('rapport.beroepen.title')}</h3>
                <div className="space-y-4">
                  {reportContent.beroepen?.passend_1 && (
                    <div className="border-l-4 p-4 rounded-r-xl" style={{ backgroundColor: '#E8F4FD', borderColor: '#232D4B' }}>
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white mb-2 inline-block" style={{ backgroundColor: '#232D4B' }}>
                        {t('rapport.beroepen.passend')}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{reportContent.beroepen.passend_1.titel}</h4>
                      <p className="text-gray-700">{reportContent.beroepen.passend_1.beschrijving}</p>
                    </div>
                  )}
                  {reportContent.beroepen?.passend_2 && (
                    <div className="border-l-4 p-4 rounded-r-xl" style={{ backgroundColor: '#E8F4FD', borderColor: '#232D4B' }}>
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white mb-2 inline-block" style={{ backgroundColor: '#232D4B' }}>
                        {t('rapport.beroepen.passend')}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{reportContent.beroepen.passend_2.titel}</h4>
                      <p className="text-gray-700">{reportContent.beroepen.passend_2.beschrijving}</p>
                    </div>
                  )}
                  {reportContent.beroepen?.verrassend && (
                    <div className="border-l-4 p-4 rounded-r-xl" style={{ backgroundColor: '#FEF3C7', borderColor: '#92400E' }}>
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white mb-2 inline-block" style={{ backgroundColor: '#92400E' }}>
                        {t('rapport.beroepen.verrassend')}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{reportContent.beroepen.verrassend.titel}</h4>
                      <p className="text-gray-700">{reportContent.beroepen.verrassend.beschrijving}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <RapportActies 
          onPrint={handlePrint}
          onNewRound={handleNewRound}
          showNewRoundButton={true}
        />
      </div>
    );
  };

  const renderZoekprofielContent = () => {
    if (!reportExists) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
          <Lock className="w-16 h-16 text-gray-300 mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {t('dashboard.round_dashboard.content.zoekprofiel_locked_title')}
          </h3>
          <p className="text-gray-500 text-lg">
            {t('dashboard.round_dashboard.content.zoekprofiel_locked')}
          </p>
        </div>
      );
    }

    if (!zoekprofielExists) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
          <Search className="w-16 h-16 text-vinster-blue mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {t('dashboard.round_dashboard.content.zoekprofiel_start')}
          </h3>
          <p className="text-gray-600 mb-8">
            {t('dashboard.round_dashboard.content.zoekprofiel_start_description')}
          </p>
          <Button 
            onClick={() => setZoekprofielDialogOpen(true)} 
            className="bg-vinster-blue hover:bg-vinster-blue/90"
          >
            {t('dashboard.round_dashboard.content.start_zoekprofiel_button')}
          </Button>
        </div>
      );
    }

    // Zoekprofiel exists - show content
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <Search className="w-16 h-16 text-vinster-blue mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {t('dashboard.round_dashboard.content.zoekprofiel_ready')}
        </h3>
        <p className="text-gray-600 mb-8">
          {t('dashboard.round_dashboard.content.zoekprofiel_ready_description')}
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/zoekprofiel-download')} 
            className="bg-vinster-blue hover:bg-vinster-blue/90"
          >
            {t('dashboard.round_dashboard.content.view_button')}
          </Button>
        </div>
      </div>
    );
  };

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
        <Card className="p-6 mb-8 border-0 rounded-3xl bg-gradient-to-r from-[#232D4B] to-[#3B4A6B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/vinster-new-logo.png" 
                  alt="Vinster" 
                  className="w-8 h-8 object-contain brightness-0 invert"
                />
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
                ? 'bg-[#E8F4FD] text-[#232D4B]' 
                : 'bg-[#FEF3C7] text-[#92400E]'
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
            {t('dashboard.round_dashboard.your_journey')}
          </h2>
          <p className="text-gray-600">
            {t('dashboard.round_dashboard.complete_steps_subtitle')}
          </p>
        </div>

        {/* TOP: Only 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => (
            <StepCard
              key={step.stepId}
              stepNumber={index + 1}
              stepId={step.stepId}
              title={step.title}
              description={step.description}
              status={step.status}
              progress={step.progress}
              onClick={() => handleStepClick(step.stepId)}
              blockedReason={step.status === 'locked' ? t('dashboard.round_dashboard.complete_previous_step') : undefined}
            />
          ))}
        </div>

        {/* MIDDLE: Slider/Tabs Component */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1.5 rounded-full inline-flex">
            <button
              onClick={() => setActiveTab('loopbaanrapport')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'loopbaanrapport'
                  ? 'bg-white shadow-md text-[#232D4B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('dashboard.round_dashboard.tabs.loopbaanrapport')}
            </button>
            <button
              onClick={() => setActiveTab('zoekprofiel')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'zoekprofiel'
                  ? 'bg-white shadow-md text-[#232D4B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('dashboard.round_dashboard.tabs.zoekprofiel')}
            </button>
          </div>
        </div>

        {/* BOTTOM: Large Content Section */}
        <Card className="p-8 min-h-[400px] rounded-3xl border border-gray-200">
          {activeTab === 'loopbaanrapport' ? renderLoopbaanrapportContent() : renderZoekprofielContent()}
        </Card>
      </div>

      {/* Zoekprofiel Dialog */}
      <ZoekprofielDialog
        open={zoekprofielDialogOpen}
        onOpenChange={setZoekprofielDialogOpen}
        onComplete={handleZoekprofielComplete}
      />
    </div>
  );
};

export default RondeDashboard;