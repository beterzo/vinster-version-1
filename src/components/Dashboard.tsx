import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Users, Target, Search } from "lucide-react";
import ProgressStep from "./ProgressStep";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleEnthousiasmeClick = () => {
    navigate('/enthousiasme-intro');
  };

  const handleWensberoepenClick = () => {
    navigate('/wensberoepen-intro');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto" />
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Welkom bij jouw carrière-ontdekking
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek stap voor stap wat jou echt enthousiast maakt en welke carrière bij jou past
          </p>
        </div>

        {/* Progress Steps */}
        <div className="grid gap-6 mb-12">
          <div onClick={handleEnthousiasmeClick} className="cursor-pointer">
            <ProgressStep
              title="Enthousiasmescan"
              description="Ontdek waar jij energie van krijgt en wat jou echt enthousiast maakt"
              progress={0}
              icon={<Sparkles className="w-6 h-6 text-yellow-500" />}
            />
          </div>
          
          <div onClick={handleWensberoepenClick} className="cursor-pointer opacity-50">
            <ProgressStep
              title="Wensberoepen"
              description="Verken verschillende carrièremogelijkheden die bij jou passen"
              progress={0}
              icon={<Users className="w-6 h-6 text-blue-400" />}
            />
          </div>
          
          <ProgressStep
            title="Prioriteiten stellen"
            description="Bepaal wat voor jou het belangrijkst is in je carrière"
            progress={0}
            icon={<Target className="w-6 h-6 text-blue-900" />}
          />
          
          <ProgressStep
            title="Laatste check"
            description="Verfijn je keuzes en krijg je persoonlijke carrière-advies"
            progress={0}
            icon={<Search className="w-6 h-6 text-gray-600" />}
          />
        </div>

        {/* Summary Card */}
        <Card className="rounded-3xl shadow-xl bg-gradient-to-br from-blue-50 to-yellow-50 border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  Je voortgang
                </h3>
                <p className="text-gray-600 mb-4">
                  Je bent net begonnen met je carrière-ontdekking
                </p>
                <div className="flex items-center gap-4">
                  <Progress value={0} className="w-48 h-2" />
                  <span className="text-sm text-gray-500">0% voltooid</span>
                </div>
              </div>
              <div className="text-6xl">🚀</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
