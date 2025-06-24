
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const VoorWieIsHet = () => {
  const navigate = useNavigate();

  const targetGroups = [
    {
      title: "Voor wie toe is aan een volgende stap",
      description: "Je wilt doorgroeien, maar je weet niet waar naartoe. Of je hebt juist honderd ideeën, maar geen richting. Vinster helpt je ontdekken waar je energie van krijgt, wat voor werk bij je past en wat jouw volgende stap kan zijn. Zonder eindeloze testen of vaag advies. Gewoon helder, concreet en visueel tastbaar."
    },
    {
      title: "Voor werkenden die vastlopen",
      description: "Je merkt dat je werk niet meer past. Je mist richting, energie of het gevoel dat je ergens naartoe werkt. Dit traject geeft je inzicht in wat je wilt, wat je belangrijk vindt en welke functie of omgeving beter bij je aansluit."
    },
    {
      title: "Voor loopbaanbegeleiders en coaches",
      description: "Vinster ondersteunt jouw begeleidingstraject met slimme technologie. Laat jouw cliënten thuis voorwerk doen en gebruik het resultaat als vertrekpunt voor verdieping en actie."
    },
    {
      title: "Voor ouders/verzorgers die willen helpen kiezen",
      description: "Je wil je kind helpen, maar je weet niet goed hoe. Vinster maakt het makkelijk om samen het gesprek aan te gaan. De tool maakt wensen, voorkeuren en richtingen inzichtelijk — zodat jullie zicht krijgen op passende mogelijkheden."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                alt="Vinster Logo" 
                className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
              />
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
            Voor wie is Vinster?
          </h1>
          
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              Vinster is er voor iedereen die richting zoekt in z'n loopbaan. Of je nou net begint, vastloopt of iemand anders helpt die keuzes moet maken — dit traject helpt je om keuzes te maken die écht bij je passen.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 flex justify-center">
            <img 
              src="/lovable-uploads/634341b7-07f8-4cc2-8ba1-b54650117aae.png"
              alt="Professionele man in pak die lacht in een moderne kantooromgeving"
              className="rounded-xl shadow-lg max-w-full h-auto max-h-96 object-cover"
            />
          </div>

          {/* Target Groups */}
          <div className="grid gap-8 md:gap-6">
            {targetGroups.map((group, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    {group.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {group.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="h-12 px-8 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Terug naar homepage
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            >
              Starten met Vinster
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VoorWieIsHet;
