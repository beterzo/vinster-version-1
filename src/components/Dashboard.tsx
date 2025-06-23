import { useAuth } from '@/hooks/useAuth';
import { useEnthousiasmeResponses } from '@/hooks/useEnthousiasmeResponses';
import { useWensberoepenResponses } from '@/hooks/useWensberoepenResponses';
import { useExtraInformatieResponses } from '@/hooks/useExtraInformatieResponses';
import { usePrioriteitenResponses } from '@/hooks/usePrioriteitenResponses';
import { useZoekprofielResponses } from '@/hooks/useZoekprofielResponses';
import { useRapportData } from '@/hooks/useRapportData';
import { useZoekprofielPdf } from '@/hooks/useZoekprofielPdf';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import ProgressStepsGrid from './ProgressStepsGrid';
import WelcomeCard from './WelcomeCard';
import ImportantInfoCard from './ImportantInfoCard';
import { useToast } from '@/hooks/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // User data loading states
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses, isLoading: wensberoepenLoading } = useWensberoepenResponses();
  const { responses: extraInformatieResponses, loading: extraInformatieLoading } = useExtraInformatieResponses();
  const { responses: prioriteitenResponses, loading: prioriteitenLoading } = usePrioriteitenResponses();
  const { progress: zoekprofielProgress, isCompleted: zoekprofielCompleted, loading: zoekprofielLoading } = useZoekprofielResponses();

  // Report and PDF states
  const { data: userReport, loading: rapportLoading } = useRapportData();
  const { isPdfReady, downloadPdf: downloadZoekprofielPdf } = useZoekprofielPdf();

  // Loading states for downloads
  const [downloadingRapport, setDownloadingRapport] = useState(false);
  const [downloadingZoekprofiel, setDownloadingZoekprofiel] = useState(false);

  // Calculate progress for each section
  const enthousiasmeProgress = useMemo(() => {
    if (enthousiasmeLoading || !enthousiasmeResponses) return 0;
    
    const fields = [
      enthousiasmeResponses.kindertijd_activiteiten,
      enthousiasmeResponses.kindertijd_interesses_nieuw,
      enthousiasmeResponses.kindertijd_plekken,
      enthousiasmeResponses.eerste_werk_onderwerpen,
      enthousiasmeResponses.eerste_werk_werkomstandigheden,
      enthousiasmeResponses.eerste_werk_leukste_taken,
      enthousiasmeResponses.leuk_project_en_rol,
      enthousiasmeResponses.plezierige_werkperiode_beschrijving,
      enthousiasmeResponses.fluitend_thuiskomen_dag
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }, [enthousiasmeResponses, enthousiasmeLoading]);

  const wensberoepenProgress = useMemo(() => {
    if (wensberoepenLoading || !wensberoepenResponses) return 0;
    
    const fieldSuffixes = [
      'titel', 'werkweek_activiteiten', 'werklocatie_omgeving', 'samenwerking_contacten',
      'fluitend_thuiskomen_dag', 'werk_doel', 'leukste_onderdelen', 'belangrijke_aspecten', 'kennis_focus'
    ];
    
    const wensberoepPrefixes = ['wensberoep_1', 'wensberoep_2', 'wensberoep_3'];
    let totalFields = 0;
    let filledFields = 0;
    
    wensberoepPrefixes.forEach(prefix => {
      fieldSuffixes.forEach(suffix => {
        totalFields++;
        const fieldName = `${prefix}_${suffix}`;
        const value = wensberoepenResponses[fieldName as keyof typeof wensberoepenResponses];
        if (value && String(value).trim() !== '') filledFields++;
      });
    });
    
    return Math.round((filledFields / totalFields) * 100);
  }, [wensberoepenResponses, wensberoepenLoading]);

  const extraInformatieProgress = useMemo(() => {
    if (extraInformatieLoading || !extraInformatieResponses) return 0;
    
    const fields = [
      extraInformatieResponses.opleidingsniveau,
      extraInformatieResponses.beroepsopleiding,
      extraInformatieResponses.sector_voorkeur,
      extraInformatieResponses.fysieke_beperkingen
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }, [extraInformatieResponses, extraInformatieLoading]);

  const prioriteitenProgress = useMemo(() => {
    if (prioriteitenLoading || !prioriteitenResponses) return 0;
    
    const hasActiviteiten = prioriteitenResponses.selected_activiteiten_keywords && prioriteitenResponses.selected_activiteiten_keywords.length > 0;
    const hasInteresses = prioriteitenResponses.selected_interesses_keywords && prioriteitenResponses.selected_interesses_keywords.length > 0;
    const hasWerkomstandigheden = prioriteitenResponses.selected_werkomstandigheden_keywords && prioriteitenResponses.selected_werkomstandigheden_keywords.length > 0;
    
    const completedSections = [hasActiviteiten, hasInteresses, hasWerkomstandigheden].filter(Boolean).length;
    return Math.round((completedSections / 3) * 100);
  }, [prioriteitenResponses, prioriteitenLoading]);

  // Completion states
  const enthousiasmeCompleted = enthousiasmeProgress === 100;
  const wensberoepenCompleted = wensberoepenProgress === 100;
  const extraInformatieCompleted = extraInformatieProgress === 100;
  const prioriteitenCompleted = prioriteitenProgress === 100;

  // Overall completion tracking
  const hasStarted = enthousiasmeProgress > 0 || wensberoepenProgress > 0 || extraInformatieProgress > 0 || prioriteitenProgress > 0 || zoekprofielProgress > 0;
  const hasUserReport = !!userReport;

  // Navigation logic
  const getNextStep = useCallback(() => {
    if (!enthousiasmeCompleted) return '/enthousiasme-intro';
    if (!wensberoepenCompleted) return '/wensberoepen-intro';
    if (!extraInformatieCompleted || !prioriteitenCompleted) return '/profiel-voltooien-intro';
    if (!hasUserReport) return '/rapport-review';
    if (!zoekprofielCompleted) return '/zoekprofiel-intro';
    return '/zoekprofiel-download';
  }, [enthousiasmeCompleted, wensberoepenCompleted, extraInformatieCompleted, prioriteitenCompleted, hasUserReport, zoekprofielCompleted]);

  const handleStepClick = useCallback((stepTitle: string) => {
    const stepRoutes = {
      'Enthousiasmescan': '/enthousiasme-intro',
      'Wensberoepen': '/wensberoepen-intro',
      'Loopbaanrapport maken': '/profiel-voltooien-intro',
      'Loopbaanrapport & onderzoeksplan': hasUserReport ? '/rapport-download' : '/rapport-review',
      'Zoekprofiel': zoekprofielCompleted ? '/zoekprofiel-download' : '/zoekprofiel-intro'
    };
    
    const route = stepRoutes[stepTitle as keyof typeof stepRoutes];
    if (route) navigate(route);
  }, [navigate, hasUserReport, zoekprofielCompleted]);

  // Mock rapport download for now since useRapportData doesn't provide downloadPdf
  const handleRapportDownload = useCallback(async () => {
    if (!userReport || downloadingRapport) return;
    
    setDownloadingRapport(true);
    try {
      // For now, just navigate to rapport download page
      navigate('/rapport-download');
    } catch (error) {
      console.error('❌ Error downloading rapport:', error);
      toast({
        title: "Download mislukt",
        description: "Er ging iets mis bij het downloaden van je loopbaanrapport.",
        variant: "destructive"
      });
    } finally {
      setDownloadingRapport(false);
    }
  }, [userReport, downloadingRapport, toast, navigate]);

  const handleZoekprofielDownload = useCallback(async () => {
    if (!isPdfReady || downloadingZoekprofiel) return;
    
    setDownloadingZoekprofiel(true);
    try {
      await downloadZoekprofielPdf();
    } catch (error) {
      console.error('❌ Error downloading zoekprofiel:', error);
      toast({
        title: "Download mislukt",
        description: "Er ging iets mis bij het downloaden van je zoekprofiel.",
        variant: "destructive"
      });
    } finally {
      setDownloadingZoekprofiel(false);
    }
  }, [isPdfReady, downloadZoekprofielPdf, downloadingZoekprofiel, toast]);

  // Early loading state
  if (enthousiasmeLoading || wensberoepenLoading || extraInformatieLoading || prioriteitenLoading || zoekprofielLoading || rapportLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left: Content Area (2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Card - Full Width */}
              <WelcomeCard />
              
              {/* Bottom Row: Important Info and Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Important Info Card */}
                <ImportantInfoCard />
                
                {/* Progress Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Jouw voortgang</h3>
                  <ProgressStepsGrid
                    enthousiasmeProgress={enthousiasmeProgress}
                    enthousiasmeCompleted={enthousiasmeCompleted}
                    wensberoepenProgress={wensberoepenProgress}
                    wensberoepenCompleted={wensberoepenCompleted}
                    prioriteitenProgress={prioriteitenProgress}
                    prioriteitenCompleted={prioriteitenCompleted}
                    extraInformatieProgress={extraInformatieProgress}
                    extraInformatieCompleted={extraInformatieCompleted}
                    hasUserReport={hasUserReport}
                    onStepClick={handleStepClick}
                  />
                </div>
              </div>
            </div>

            {/* Right: Action Sidebar */}
            <div className="lg:col-span-1">
              <DashboardSidebar
                getNextStep={getNextStep}
                hasUserReport={hasUserReport}
                hasStarted={hasStarted}
                hasZoekprofielPdf={Boolean(isPdfReady)}
                downloadRapportPdf={handleRapportDownload}
                downloadZoekprofielPdf={handleZoekprofielDownload}
                downloadingRapport={downloadingRapport}
                downloadingZoekprofiel={downloadingZoekprofiel}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
