
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardHeader from "./DashboardHeader";
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Main Welcome Content */}
          <div className="lg:col-span-2">
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

              {/* Start Button */}
              {canStartEnthousiasme && (
                <div className="mt-8">
                  <Button 
                    onClick={() => navigate("/enthousiasme-intro")} 
                    className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-3"
                  >
                    Start enthousiasmescan
                  </Button>
                </div>
              )}

              {canStartWensberoepen && !canStartEnthousiasme && (
                <div className="mt-8">
                  <Button 
                    onClick={() => navigate("/wensberoepen-intro")} 
                    className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-3"
                  >
                    Start wensberoepen
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Image and Actions */}
          <div>
            <Card className="p-6 border-0 rounded-3xl bg-white">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/37a78841-c439-4437-b2de-5adbc7743c68.png"
                  alt="Carrière ontwikkeling"
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/zoekprofiel-intro")}
                    variant="outline"
                    className="w-full py-3 border-vinster-blue text-vinster-blue hover:bg-vinster-blue hover:text-white rounded-xl"
                  >
                    Download zoekprofiel
                  </Button>
                  
                  <Button 
                    onClick={() => navigate("/rapport-review")}
                    variant="outline"
                    className="w-full py-3 border-vinster-blue text-vinster-blue hover:bg-vinster-blue hover:text-white rounded-xl"
                  >
                    Bekijk loopbaanrapport
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Two Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Info Card */}
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
                </ul>
              </div>
            </div>
          </Card>

          {/* Right Info Card */}
          <Card className="p-6 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6" style={{ color: '#78BFE3' }} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-vinster-blue mb-3">
                  Tips voor het beste resultaat
                </h3>
                <ul className="text-gray-700 text-sm leading-relaxed space-y-2">
                  <li>• Je voortgang wordt automatisch opgeslagen</li>
                  <li>• Na het invullen van beide interviews wordt automatisch een persoonlijk rapport gegenereerd</li>
                  <li>• Neem alle tijd die je nodig hebt - het is juist goed om tussen stappen door na te denken</li>
                  <li>• Reflecteer rustig op je antwoorden voor diepere inzichten</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
