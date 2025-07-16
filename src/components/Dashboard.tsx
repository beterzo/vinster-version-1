
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useRapportData } from "@/hooks/useRapportData";
import { useExistingZoekprofiel } from "@/hooks/useExistingZoekprofiel";
import DashboardHeader from "./DashboardHeader";
import ProgressStepsGrid from "./ProgressStepsGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: reportData, loading: reportLoading } = useRapportData();
  const { hasExistingZoekprofiel } = useExistingZoekprofiel();
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

  const handleStepClick = (stepTitle: string) => {
    console.log("Step clicked:", stepTitle);
    
    switch (stepTitle) {
      case "Enthousiasmescan":
        navigate("/enthousiasme-intro");
        break;
      case "Wensberoepen":
        navigate("/wensberoepen-intro");
        break;
      case "Persoonsprofiel":
        navigate("/profiel-voltooien-intro");
        break;
      case "Loopbaanrapport":
        navigate("/rapport-download");
        break;
      case "Zoekprofiel":
        navigate("/zoekprofiel-intro");
        break;
      default:
        console.log("Unknown step:", stepTitle);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

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
            <div className="text-center flex-1 flex flex-col justify-between">
              <img 
                alt="Loopbaanonderzoek" 
                className="w-full h-auto rounded-xl mb-6 flex-1 object-cover" 
                src="/lovable-uploads/ee361013-bfc6-485f-b46f-ed87a3cd6c73.jpg" 
              />
              
              <Button 
                onClick={() => navigate(getNextStep())} 
                className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-4 text-lg w-full mt-auto"
              >
                {t('dashboard.continue_button')}
              </Button>
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
            
            {/* Restart Journey Button - only show if user has downloaded zoekprofiel */}
            {hasExistingZoekprofiel && (
              <Card className="mt-4 p-4 border-2 border-dashed border-primary/30 bg-primary/5">
                <div className="text-center space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      Wil je het traject nog een keer doen?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Start opnieuw met verse inzichten
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate('/traject-opnieuw-starten')}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Traject opnieuw starten
                  </Button>
                </div>
              </Card>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
