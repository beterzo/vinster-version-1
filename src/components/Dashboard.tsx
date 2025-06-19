import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";
import { useZoekprofielPdf } from "@/hooks/useZoekprofielPdf";
import DashboardHeader from "./DashboardHeader";
import WelcomeCard from "./WelcomeCard";
import ImportantInfoCard from "./ImportantInfoCard";
import ProgressStepsGrid from "./ProgressStepsGrid";
import DashboardSidebar from "./DashboardSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { progress: prioriteitenProgress, isCompleted: prioriteitenCompleted } = usePrioriteitenResponses();
  const { progress: extraInformatieProgress, isCompleted: extraInformatieCompleted } = useExtraInformatieResponses();
  const { responses: enthousiasmeResponses, loading: enthousiasmeLoading } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses, isLoading: wensberoepenLoading } = useWensberoepenResponses();
  const { userReport, loadUserReport, downloadPdf: downloadRapportPdf, downloading: downloadingRapport } = useRapportGeneration();
  const { isPdfReady: isZoekprofielReady, downloadPdf: downloadZoekprofielPdf, downloading: downloadingZoekprofiel } = useZoekprofielPdf();

  useEffect(() => {
    loadUserReport();
  }, []);

  // Calculate Enthousiasmescan progress - updated with correct field names (9 total fields)
  const calculateEnthousiasmeProgress = () => {
    if (enthousiasmeLoading) return 0;
    if (!enthousiasmeResponses) return 0;
    
    // Define the exact fields we expect to be filled (9 fields total)
    const enthousiasmeFields = [
      'kindertijd_activiteiten',
      'kindertijd_plekken', 
      'kindertijd_interesses_nieuw',
      'eerste_werk_leukste_taken',
      'eerste_werk_werkomstandigheden',
      'eerste_werk_onderwerpen',
      'plezierige_werkperiode_beschrijving',
      'leuk_project_en_rol',
      'fluitend_thuiskomen_dag'
    ];
    
    const filledFields = enthousiasmeFields.filter(field => {
      const value = enthousiasmeResponses[field as keyof typeof enthousiasmeResponses];
      return value && String(value).trim() !== '';
    }).length;
    
    return Math.round((filledFields / enthousiasmeFields.length) * 100);
  };

  // Calculate Wensberoepen progress - updated with correct field count (27 total: 3 careers × 9 fields each)
  const calculateWensberoepenProgress = () => {
    if (wensberoepenLoading) return 0;
    if (!wensberoepenResponses) return 0;
    
    // Define all wensberoepen fields we expect (3 careers × 9 fields each = 27 total)
    const wensberoepenFieldPrefixes = ['wensberoep_1', 'wensberoep_2', 'wensberoep_3'];
    const fieldSuffixes = [
      'titel',
      'werkweek_activiteiten',
      'werklocatie_omgeving',
      'samenwerking_contacten',
      'fluitend_thuiskomen_dag',
      'werk_doel',
      'leukste_onderdelen',
      'belangrijke_aspecten',
      'kennis_focus'
    ];
    
    let totalFields = 0;
    let filledFields = 0;
    
    wensberoepenFieldPrefixes.forEach(prefix => {
      fieldSuffixes.forEach(suffix => {
        const fieldName = `${prefix}_${suffix}`;
        totalFields++;
        
        const value = wensberoepenResponses[fieldName as keyof typeof wensberoepenResponses];
        if (value && String(value).trim() !== '') {
          filledFields++;
        }
      });
    });
    
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const enthousiasmeProgress = calculateEnthousiasmeProgress();
  const wensberoepenProgress = calculateWensberoepenProgress();
  const enthousiasmeCompleted = enthousiasmeProgress === 100;
  const wensberoepenCompleted = wensberoepenProgress === 100;

  // Improved hasStarted logic - check for actual responses, not just progress
  const hasStarted = () => {
    // Check if loading
    if (enthousiasmeLoading || wensberoepenLoading) return false;
    
    // Check enthousiasmescan responses
    if (enthousiasmeResponses) {
      const hasEnthousiasmeData = Object.values(enthousiasmeResponses).some(value => 
        value && String(value).trim() !== ''
      );
      if (hasEnthousiasmeData) return true;
    }
    
    // Check wensberoepen responses
    if (wensberoepenResponses) {
      const excludeFields = ['id', 'user_id', 'created_at', 'updated_at'];
      const hasWensberoepenData = Object.entries(wensberoepenResponses)
        .filter(([key]) => !excludeFields.includes(key))
        .some(([_, value]) => value && String(value).trim() !== '');
      if (hasWensberoepenData) return true;
    }
    
    // Check other progress indicators
    if (prioriteitenProgress > 0 || extraInformatieProgress > 0) return true;
    
    return false;
  };

  const userHasStarted = hasStarted();

  const handleStepClick = (stepTitle: string) => {
    if (stepTitle === "Enthousiasmescan") {
      navigate("/enthousiasme-intro");
    } else if (stepTitle === "Wensberoepen") {
      navigate("/wensberoepen-intro");
    } else if (stepTitle === "Profiel voltooien") {
      navigate("/profiel-voltooien-intro");
    } else if (stepTitle === "Rapport & onderzoeksplan") {
      if (userReport) {
        navigate("/rapport-download");
      } else {
        navigate("/rapport-review");
      }
    } else if (stepTitle === "Zoekprofiel") {
      navigate("/zoekprofiel-intro");
    }
  };

  // Determine which step to continue with
  const getNextStep = () => {
    if (enthousiasmeProgress < 100) {
      return "/enthousiasme-intro";
    } else if (wensberoepenProgress < 100) {
      return "/wensberoepen-intro";
    } else if (!extraInformatieCompleted || !prioriteitenCompleted) {
      return "/profiel-voltooien-intro";
    } else if (!userReport) {
      return "/rapport-review";
    } else {
      return "/zoekprofiel-intro";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader />

        {/* Mobile-first responsive layout with stretch alignment on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] lg:items-stretch gap-x-8 min-h-[800px]">
          
          {/* Main content - full width on mobile, left column on desktop */}
          <div className="flex flex-col gap-y-6 lg:gap-y-8">
            {/* Welcome card - full width */}
            <WelcomeCard />

            {/* Content area - stacked on mobile, side-by-side on desktop */}
            <div className="flex flex-col lg:grid lg:grid-cols-[350px_1fr] gap-6 lg:gap-x-8 lg:items-stretch lg:flex-1">
              {/* Important info card */}
              <ImportantInfoCard />

              {/* Progress steps grid */}
              <ProgressStepsGrid
                enthousiasmeProgress={enthousiasmeProgress}
                enthousiasmeCompleted={enthousiasmeCompleted}
                wensberoepenProgress={wensberoepenProgress}
                wensberoepenCompleted={wensberoepenCompleted}
                prioriteitenProgress={prioriteitenProgress}
                prioriteitenCompleted={prioriteitenCompleted}
                extraInformatieProgress={extraInformatieProgress}
                extraInformatieCompleted={extraInformatieCompleted}
                hasUserReport={!!userReport}
                onStepClick={handleStepClick}
              />
            </div>
          </div>

          {/* Sidebar - full width on mobile, right column on desktop */}
          <div className="mt-6 lg:mt-0 lg:h-full">
            <DashboardSidebar 
              getNextStep={getNextStep} 
              hasUserReport={!!userReport}
              hasStarted={userHasStarted}
              hasZoekprofielPdf={!!isZoekprofielReady}
              downloadRapportPdf={downloadRapportPdf}
              downloadZoekprofielPdf={downloadZoekprofielPdf}
              downloadingRapport={downloadingRapport}
              downloadingZoekprofiel={downloadingZoekprofiel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
