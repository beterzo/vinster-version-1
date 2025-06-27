
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardHeader from "./DashboardHeader";
import ProgressStepsGrid from "./ProgressStepsGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
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
        // Navigate to rapport review/download when available
        navigate("/rapport-review");
        break;
      case "Zoekprofiel":
        navigate("/zoekprofiel-intro");
        break;
      default:
        console.log("Unknown step:", stepTitle);
    }
  };

  return <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8 mt-8">
          {/* Welcome Section - spans first 2 columns on top row */}
          <Card className="lg:col-span-2 p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
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
                persoonlijke patroon van voorkeuren en interesses in kaart.
              </p>
              
              <p>
                Jouw enthousiasme is een belangrijke indicator voor wat je echt leuk vindt. Wanneer je 
                iets doet waar je enthousiast van wordt, ontstaat er energie en voldoening. Dáár gaan 
                we naar op zoek.
              </p>
            </div>
          </Card>

          {/* Right Column - Image and Button - spans both rows */}
          <Card className="lg:row-span-2 p-6 border-0 rounded-3xl bg-white flex flex-col">
            <div className="text-center flex-1 flex flex-col justify-between">
              <img alt="Loopbaanonderzoek" className="w-full h-auto rounded-xl mb-6 flex-1 object-cover" src="/lovable-uploads/ee361013-bfc6-485f-b46f-ed87a3cd6c73.jpg" />
              
              <Button onClick={() => navigate(getNextStep())} className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-4 text-lg w-full mt-auto">
                Ga verder
              </Button>
            </div>
          </Card>

          {/* Left Column - Important Info */}
          <Card className="p-6 border-0 rounded-3xl text-white" style={{
          backgroundColor: '#78BFE3'
        }}>
            <div>
              <h3 className="font-bold text-xl mb-3">
                Belangrijk om te weten
              </h3>
              <ul className="text-sm leading-relaxed space-y-5">
                <li>• Er zijn geen goede of foute antwoorden - wees eerlijk over wat jij echt leuk vindt</li>
                <li>• Denk aan concrete situaties en ervaringen uit jouw leven</li>
                <li>• Je kunt zoveel tijd nemen als je wilt - er zit geen tijdsdruk op dit traject</li>
                <li>• Het is juist goed om de antwoorden een dag te laten bezinken voordat je verdergaat</li>
                <li>• Je kunt je antwoorden altijd aanpassen tijdens het traject</li>
                <li>• Je voortgang wordt automatisch opgeslagen</li>
                <li>• Alle informatie wordt vertrouwelijk behandeld</li>
              </ul>
            </div>
          </Card>

          {/* Middle Column - Process Steps */}
          <Card className="p-6 border-0 rounded-3xl bg-white">
            <h3 className="font-bold text-lg text-vinster-blue mb-4">
              Jouw voortgang
            </h3>
            <ProgressStepsGrid 
              enthousiasmeCompleted={progress.enthousiasme === 'completed'} 
              wensberoepenCompleted={progress.wensberoepen === 'completed'} 
              prioriteitenCompleted={progress.prioriteiten === 'completed'} 
              extraInformatieCompleted={progress.extraInformatie === 'completed'} 
              hasUserReport={false} 
              onStepClick={handleStepClick}
            />
          </Card>
        </div>
      </div>
    </div>;
};

export default Dashboard;
