
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardHeader from "./DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Target } from "lucide-react";

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

  // Progress data for the steps
  const progressSteps = [
    {
      title: "Enthousiasmescan",
      completed: progress.enthousiasme === 'completed',
      progress: progress.enthousiasme === 'completed' ? 100 : 0
    },
    {
      title: "Wensberoepen",
      completed: progress.wensberoepen === 'completed',
      progress: progress.wensberoepen === 'completed' ? 100 : 0
    },
    {
      title: "Loopbaanrapport maken",
      completed: false,
      progress: 0
    },
    {
      title: "Loopbaanrapport & onderzoeksplan",
      completed: false,
      progress: 0
    },
    {
      title: "Zoekprofiel",
      completed: false,
      progress: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Welcome and Info */}
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card className="p-6 border-0 rounded-3xl bg-white">
              <h1 className="text-2xl font-bold text-vinster-blue mb-2">
                Welkom {firstName}!
              </h1>
              <p className="text-gray-700 leading-relaxed">
                Begin met de enthousiasmescan om erachter te komen wat je echt drijft. 
                Dit vormt de basis voor het vinden van je ideale loopbaan.
              </p>
            </Card>

            {/* Important Info */}
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
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Voltooi alle stappen om je persoonlijke loopbaanrapport te ontvangen. 
                    Je kunt op elk moment pauzeren en later verder gaan waar je gebleven was.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Progress */}
          <div>
            <Card className="p-6 border-0 rounded-3xl bg-white">
              <h2 className="text-xl font-bold text-vinster-blue mb-6">
                Jouw voortgang
              </h2>
              
              <div className="space-y-6">
                {progressSteps.map((step, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                        <span className={`font-medium ${step.completed ? 'text-vinster-blue' : 'text-gray-600'}`}>
                          {step.title}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {step.progress}%
                      </span>
                    </div>
                    <Progress 
                      value={step.progress} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  {canStartEnthousiasme && (
                    <Button 
                      onClick={() => navigate("/enthousiasme-intro")} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-3 mb-3 w-full"
                    >
                      Start enthousiasmescan
                    </Button>
                  )}

                  {canStartWensberoepen && !canStartEnthousiasme && (
                    <Button 
                      onClick={() => navigate("/wensberoepen-intro")} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl px-8 py-3 mb-3 w-full"
                    >
                      Start wensberoepen
                    </Button>
                  )}

                  {!canStartEnthousiasme && !canStartWensberoepen && (
                    <p className="text-sm text-gray-600">
                      Voltooi de vorige stappen om verder te gaan.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Image and Actions */}
          <div className="space-y-6">
            <Card className="p-6 border-0 rounded-3xl bg-white">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/37a78841-c439-4437-b2de-5adbc7743c68.png"
                  alt="Carrière ontwikkeling"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="font-bold text-lg text-vinster-blue mb-2">
                  Ontdek je ideale carrière
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Met onze wetenschappelijk onderbouwde methode help je jezelf 
                  om de juiste keuzes te maken voor je loopbaan.
                </p>
              </div>
            </Card>

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
