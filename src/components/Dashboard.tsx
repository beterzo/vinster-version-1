
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";
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
  const { userReport, loadUserReport } = useRapportGeneration();

  useEffect(() => {
    loadUserReport();
  }, []);

  // Calculate Enthousiasmescan progress
  const calculateEnthousiasmeProgress = () => {
    if (enthousiasmeLoading || !enthousiasmeResponses) return 0;
    
    const totalFields = 12; // Total number of enthousiasme questions
    const filledFields = Object.values(enthousiasmeResponses).filter(value => value && value.trim() !== '').length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  // Calculate Wensberoepen progress
  const calculateWensberoepenProgress = () => {
    if (wensberoepenLoading || !wensberoepenResponses) return 0;
    
    // Count all non-null, non-empty string fields except id, user_id, created_at, updated_at
    const excludeFields = ['id', 'user_id', 'created_at', 'updated_at'];
    const allFields = Object.keys(wensberoepenResponses).filter(key => !excludeFields.includes(key));
    const filledFields = allFields.filter(key => {
      const value = wensberoepenResponses[key as keyof typeof wensberoepenResponses];
      return value !== null && value !== undefined && String(value).trim() !== '';
    }).length;
    
    return allFields.length > 0 ? Math.round((filledFields / allFields.length) * 100) : 0;
  };

  const enthousiasmeProgress = calculateEnthousiasmeProgress();
  const wensberoepenProgress = calculateWensberoepenProgress();
  const enthousiasmeCompleted = enthousiasmeProgress === 100;
  const wensberoepenCompleted = wensberoepenProgress === 100;

  // Check if user has started (has any progress)
  const hasStarted = enthousiasmeProgress > 0 || wensberoepenProgress > 0 || prioriteitenProgress > 0 || extraInformatieProgress > 0;

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
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

        {/* Grid layout met 2 kolommen: links voor content, rechts voor foto */}
        <div className="grid grid-cols-[1fr_400px] gap-x-8 min-h-[800px]">
          
          {/* Linker kolom: Content */}
          <div className="grid grid-rows-[auto_1fr] gap-y-8">
            {/* Welkom blok - bovenaan links */}
            <WelcomeCard />

            {/* Onderste rij: Belangrijk blok + Stappen */}
            <div className="grid grid-cols-[350px_1fr] gap-x-8 items-stretch">
              {/* Belangrijk om te weten blok - linksonder */}
              <ImportantInfoCard />

              {/* Vijf stappenblokken - midden, gelijkmatig verdeeld */}
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

          {/* Rechter kolom: Foto + Knop */}
          <DashboardSidebar 
            getNextStep={getNextStep} 
            hasUserReport={!!userReport}
            hasStarted={hasStarted}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
