
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useRapportData } from "@/hooks/useRapportData";
import { useExistingZoekprofiel } from "@/hooks/useExistingZoekprofiel";
import { useStepAccess } from "@/hooks/useStepAccess";
import DashboardHeader from "./DashboardHeader";
import ProgressStepsGrid from "./ProgressStepsGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, FileText, PartyPopper } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: reportData, loading: reportLoading } = useRapportData();
  const { hasExistingZoekprofiel } = useExistingZoekprofiel();
  const stepAccess = useStepAccess();
  const {
    progress,
    canStartEnthousiasme,
    canStartWensberoepen
  } = useDashboard();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <div>{t('common.loading')}</div>;
  }

  const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'Gebruiker';

  // Check if user has a completed report
  const hasUserReport = !reportLoading && reportData && reportData.report_status === 'completed';

  const getNextStep = () => {
    if (canStartEnthousiasme) {
      return "/enthousiasme-intro";
    }
    if (canStartWensberoepen && !canStartEnthousiasme) {
      return "/wensberoepen-intro";
    }
    return "/profiel-voltooien-intro";
  };

  const handleStepClick = (stepId: string) => {
    console.log("Step clicked:", stepId);
    
    // Check if still loading
    if (stepAccess.isLoading) {
      toast({
        title: t('common.loading'),
        description: 'Even geduld, gegevens worden geladen...',
        variant: 'default'
      });
      return;
    }
    
    // Check if user has access to this step
    if (!stepAccess.canAccessStep(stepId)) {
      toast({
        title: t('dashboard.step_blocked.title'),
        description: stepAccess.getBlockedReason(stepId),
        variant: "destructive"
      });
      return;
    }
    
    switch (stepId) {
      case "enthousiasme":
        // Als enthousiasmescan voltooid is, ga naar stap 1 om te bekijken, anders naar intro
        if (progress.enthousiasme === 'completed') {
          navigate("/enthousiasme-step-1");
        } else {
          navigate("/enthousiasme-intro");
        }
        break;
      case "wensberoepen":
        // Als wensberoepen voltooid is, ga naar stap 1 om te bekijken, anders naar intro
        if (progress.wensberoepen === 'completed') {
          navigate("/wensberoepen-step-1");
        } else {
          navigate("/wensberoepen-intro");
        }
        break;
      case "persoonsprofiel":
        // Als profiel voltooid is, ga naar extra informatie, anders naar intro
        if (progress.prioriteiten === 'completed' && progress.extraInformatie === 'completed') {
          navigate("/extra-informatie-vragen");
        } else {
          navigate("/profiel-voltooien-intro");
        }
        break;
      case "loopbaanrapport":
        navigate("/rapport-download");
        break;
      case "zoekprofiel":
        navigate("/zoekprofiel-intro");
        break;
      default:
        console.log("Unknown step:", stepId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

        {/* Journey Completed Banner */}
        {stepAccess.isBlockedByCompletedReport && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <PartyPopper className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {t('dashboard.report_limit.banner_title')}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {t('dashboard.report_limit.banner_description')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {hasUserReport && (
                      <Button
                        onClick={() => navigate('/rapport-download')}
                        variant="default"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download rapport
                      </Button>
                    )}
                    {hasExistingZoekprofiel && (
                      <Button
                        onClick={() => navigate('/zoekprofiel-antwoorden')}
                        variant="outline"
                        className="gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Download zoekprofiel
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate('/traject-opnieuw-starten')}
                      variant="secondary"
                      className="gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {t('dashboard.report_limit.restart_cta')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8 mt-8">
          {/* Welcome Section - spans first 2 columns on top row */}
          <Card className="lg:col-span-2 p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
            <h1 className="text-3xl font-bold text-vinster-blue mb-4">
              {t('dashboard.welcome').replace('{name}', firstName)}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('dashboard.description')}
            </p>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{t('dashboard.intro_paragraph1')}</p>
              <p>{t('dashboard.intro_paragraph2')}</p>
              <p>{t('dashboard.intro_paragraph3')}</p>
            </div>
          </Card>

          {/* Right Column - Image and Button - spans both rows */}
          <Card className="lg:row-span-2 p-6 border-0 rounded-3xl bg-white flex flex-col">
            <div className="text-center flex-1 flex flex-col">
              <div className="flex-1 mb-6">
                <img 
                  alt="Loopbaanonderzoek" 
                  className="w-full h-full rounded-xl object-cover" 
                  src="/lovable-uploads/ee361013-bfc6-485f-b46f-ed87a3cd6c73.jpg" 
                />
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate(getNextStep())} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-4 text-lg w-full"
                >
                  {t('dashboard.continue_button')}
                </Button>
                
                {/* Restart Journey Button - only show if user has downloaded zoekprofiel */}
                {hasExistingZoekprofiel && (
                  <Card className="p-4 border-2 border-dashed border-primary/30 bg-primary/5">
                    <div className="text-center space-y-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">
                          {t('dashboard.restart_journey.title')}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {t('dashboard.restart_journey.subtitle')}
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate('/traject-opnieuw-starten')}
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {t('dashboard.restart_journey.button')}
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </Card>

          {/* Left Column - Important Info */}
          <Card className="p-6 border-0 rounded-3xl text-white" style={{
            backgroundColor: '#78BFE3'
          }}>
            <div>
              <h3 className="font-bold text-xl mb-3">
                {t('dashboard.important_info.title')}
              </h3>
              <ul className="text-sm leading-relaxed space-y-5">
                <li>{t('dashboard.important_info.point1')}</li>
                <li>{t('dashboard.important_info.point2')}</li>
                <li>{t('dashboard.important_info.point3')}</li>
                <li>{t('dashboard.important_info.point4')}</li>
                <li>{t('dashboard.important_info.point5')}</li>
                <li>{t('dashboard.important_info.point6')}</li>
                <li>{t('dashboard.important_info.point7')}</li>
              </ul>
            </div>
          </Card>

          {/* Middle Column - Process Steps */}
          <Card className="p-6 border-0 rounded-3xl bg-white">
            <h3 className="font-bold text-lg text-vinster-blue mb-4">
              {t('dashboard.progress_title')}
            </h3>
            <ProgressStepsGrid 
              enthousiasmeCompleted={progress.enthousiasme === 'completed'} 
              wensberoepenCompleted={progress.wensberoepen === 'completed'} 
              prioriteitenCompleted={progress.prioriteiten === 'completed'} 
              extraInformatieCompleted={progress.extraInformatie === 'completed'} 
              hasUserReport={hasUserReport} 
              onStepClick={handleStepClick}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
