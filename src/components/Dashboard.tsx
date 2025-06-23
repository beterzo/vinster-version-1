import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardHeader } from "./DashboardHeader";
import { ProgressStepsGrid } from "./ProgressStepsGrid";
import { WelcomeCard } from "./WelcomeCard";
import { WhatIsVinsterCard } from "./WhatIsVinsterCard";
import { ProgressSection } from "./ProgressSection";
import { WhatDoYouGetCard } from "./WhatDoYouGetCard";
import { DataSafetySection } from "./DataSafetySection";
import { ImportantInfoCard } from "./ImportantInfoCard";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { progress } = useDashboard();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const canStartEnthousiasme = progress.enthousiasme === 'not_started' || progress.enthousiasme === 'expired';
  const canStartWensberoepen = progress.wensberoepen === 'not_started' || progress.wensberoepen === 'expired';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <DashboardHeader />

      {/* Main Progress Section */}
      <ProgressStepsGrid />
      
      {/* Additional Content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <WelcomeCard />
          <WhatIsVinsterCard />
        </div>
        
        <div className="space-y-6">
          <ProgressSection 
            title="Jouw voortgang" 
            titleClassName="text-xl font-bold text-vinster-blue mb-6"
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                Voltooi de volgende stappen om je persoonlijke loopbaanrapport te genereren:
              </p>
              
              {canStartEnthousiasme && (
                <p className="text-sm text-gray-500">
                  Start met de enthousiasmescan om je interesses te ontdekken.
                </p>
              )}
              
              {canStartWensberoepen && (
                <p className="text-sm text-gray-500">
                  Vul de wensberoepenlijst in om je ideale carrièrepad te bepalen.
                </p>
              )}
            </div>
          </ProgressSection>
          
          <WhatDoYouGetCard />
          <DataSafetySection />
        </div>
      </div>
      
      <ImportantInfoCard />

      {/* CTA Section */}
      <div className="text-center py-12">
        {canStartEnthousiasme && (
          <Button 
            onClick={() => navigate("/enthousiasme-intro")} 
            className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl"
          >
            Start enthousiasmescan
          </Button>
        )}

        {canStartWensberoepen && (
          <Button 
            onClick={() => navigate("/wensberoepen-intro")} 
            className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl"
          >
            Start wensberoepen
          </Button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
