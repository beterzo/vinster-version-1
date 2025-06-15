
import { useNavigate } from "react-router-dom";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import DashboardHeader from "./DashboardHeader";
import WelcomeCard from "./WelcomeCard";
import ImportantInfoCard from "./ImportantInfoCard";
import ProgressStepsGrid from "./ProgressStepsGrid";
import DashboardSidebar from "./DashboardSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { progress: prioriteitenProgress, isCompleted: prioriteitenCompleted } = usePrioriteitenResponses();
  const { progress: extraInformatieProgress, isCompleted: extraInformatieCompleted } = useExtraInformatieResponses();

  const handleStepClick = (stepTitle: string) => {
    if (stepTitle === "Enthousiasmescan") {
      navigate("/enthousiasme-intro");
    } else if (stepTitle === "Wensberoepen") {
      navigate("/wensberoepen-intro");
    } else if (stepTitle === "Prioriteiten stellen") {
      navigate("/prioriteiten-intro");
    } else if (stepTitle === "Extra informatie") {
      navigate("/extra-informatie-intro");
    }
    // Add more navigation logic for other steps later
  };

  // Determine which step to continue with
  const getNextStep = () => {
    if (!prioriteitenCompleted) {
      return "/prioriteiten-intro";
    } else if (!extraInformatieCompleted) {
      return "/extra-informatie-intro";
    } else {
      return "/home"; // or wherever the next step should be
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
                prioriteitenProgress={prioriteitenProgress}
                prioriteitenCompleted={prioriteitenCompleted}
                extraInformatieProgress={extraInformatieProgress}
                extraInformatieCompleted={extraInformatieCompleted}
                onStepClick={handleStepClick}
              />
            </div>
          </div>

          {/* Rechter kolom: Foto + Knop */}
          <DashboardSidebar getNextStep={getNextStep} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
