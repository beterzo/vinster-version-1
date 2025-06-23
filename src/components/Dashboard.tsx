
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardHeader from "./DashboardHeader";
import ProgressStepsGrid from "./ProgressStepsGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Info } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { progress, canStartEnthousiasme, canStartWensberoepen } = useDashboard();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'Gebruiker';

  const getNextStep = () => {
    if (canStartEnthousiasme) {
      return "/enthousiasme-intro";
    }
    if (canStartWensberoepen && !canStartEnthousiasme) {
      return "/wensberoepen-intro";
    }
    // Add logic for other steps based on progress
    return "/profiel-voltooien-intro";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="p-8 border-0 rounded-3xl bg-white">
              <h1 className="text-3xl font-bold text-vinster-blue mb-4">
                Welkom {firstName}!
              </h1>
              <p className="text-gray-700 leading-relaxed mb-6">
                Dit is jouw persoonlijke dashboard. Hier zie je de voortgang van jouw loopbaanonderzoek 
                en kun je verder gaan waar je gebleven bent.
              </p>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Hier start jouw loopbaantraject! We beginnen met de enthousiasmescan, de eerste stap 
                  om te ontdekken wat jij graag doet en hoe jij graag werkt. In deze scan gaan we op zoek 
                  naar momenten waarop jij in je element bent.
                </p>
                
                <p>
                  Door vragen te stellen over je jeugd, schooltijd en werkervaringen brengen we jouw 
                  unieke patroon van voorkeuren en interesses in kaart.
                </p>
                
                <p>
                  Jouw enthousiasme is een belangrijke indicator voor wat je echt leuk vindt. Wanneer je 
                  iets doet waar je enthousiast van wordt, ontstaat er energie en voldoening. Dáár gaan 
                  we naar op zoek.
                </p>
              </div>
            </Card>

            {/* Bottom Row - Process Steps and Important Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Process Steps */}
              <Card className="p-6 border-0 rounded-3xl bg-white">
                <h3 className="font-bold text-lg text-vinster-blue mb-4">
                  Stappen in het proces
                </h3>
                <ProgressStepsGrid
                  enthousiasmeCompleted={progress.enthousiasme === 'completed'}
                  wensberoepenCompleted={progress.wensberoepen === 'completed'}
                  prioriteitenCompleted={progress.prioriteiten === 'completed'}
                  extraInformatieCompleted={progress.extraInformatie === 'completed'}
                  hasUserReport={false}
                />
              </Card>

              {/* Important to Know */}
              <Card className="p-6 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6" style={{ color: '#78BFE3' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-vinster-blue mb-3">
                      Belangrijk om te weten
                    </h3>
                    <ul className="text-gray-700 text-sm leading-relaxed space-y-2">
                      <li>• Er zijn geen goede of foute antwoorden - wees eerlijk over wat jij echt leuk vindt</li>
                      <li>• Denk aan concrete situaties en ervaringen uit jouw leven</li>
                      <li>• Je kunt je antwoorden altijd aanpassen tijdens het traject</li>
                      <li>• Je voortgang wordt automatisch opgeslagen</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Image and Continue Button */}
          <div>
            <Card className="p-6 border-0 rounded-3xl bg-white">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/c1b77eab-70ba-4d41-85ea-5ec3b49d96b4.png"
                  alt="Loopbaanonderzoek"
                  className="w-full h-auto rounded-xl mb-6"
                />
                
                <Button 
                  onClick={() => navigate(getNextStep())}
                  className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-4 text-lg w-full"
                >
                  Ga verder
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
