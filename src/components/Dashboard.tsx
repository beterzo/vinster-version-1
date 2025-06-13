
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search } from "lucide-react";

const Dashboard = () => {
  const progressSteps = [
    {
      title: "Enthousiasme-scan",
      description: "Ontdek wat jou écht enthousiast maakt in je werk en waar je energie van krijgt.",
      progress: 100,
      isCompleted: true,
      icon: <Star className="w-6 h-6 text-yellow-500" />
    },
    {
      title: "Wensberoepen",
      description: "Verken beroepen die bij jouw interesses en vaardigheden passen.",
      progress: 75,
      isCompleted: false,
      icon: <Target className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Prioriteiten stellen",
      description: "Bepaal wat voor jou het allerbelangrijkst is in je ideale baan.",
      progress: 0,
      isCompleted: false,
      icon: <CircleUser className="w-6 h-6 text-gray-400" />
    },
    {
      title: "Laatste check",
      description: "Controleer of alles klopt en verfijn je keuzes waar nodig.",
      progress: 0,
      isCompleted: false,
      icon: <CheckCircle className="w-6 h-6 text-gray-400" />
    },
    {
      title: "Zoekprofiel",
      description: "Maak je profiel compleet en start met zoeken naar jouw droombaan.",
      progress: 0,
      isCompleted: false,
      icon: <Search className="w-6 h-6 text-gray-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Linker kolom - Welkom sectie */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">Welkom</h1>
              <p className="text-gray-600 leading-relaxed">
                Dit is jouw persoonlijke dashboard. Hier zie je jouw voortgang en kun je verder gaan waar je gebleven bent.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Doorloop de stappen in volgorde om jouw ideale loopbaanpad te ontdekken. Elke stap bouwt voort op de vorige en helpt je dichter bij jouw droombaan te komen.
              </p>
            </div>

            {/* Belangrijk om te weten blok */}
            <Card className="p-6 bg-vinster-blue border-0 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-4">Belangrijk om te weten</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Volg de stappen in volgorde voor het beste resultaat</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je voortgang wordt automatisch opgeslagen</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Neem de tijd voor elke stap - kwaliteit boven snelheid</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je kunt altijd teruggaan om antwoorden aan te passen</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Midden kolom - Voortgangsblokken */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Jouw loopbaantraject</h2>
            <div className="space-y-4">
              {progressSteps.map((step, index) => (
                <ProgressStep
                  key={index}
                  title={step.title}
                  description={step.description}
                  progress={step.progress}
                  isCompleted={step.isCompleted}
                  icon={step.icon}
                />
              ))}
            </div>
          </div>

          {/* Rechter kolom - Afbeelding placeholder */}
          <div className="lg:col-span-3">
            <div className="bg-gray-200 rounded-2xl h-80 lg:h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <CircleUser className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Afbeelding placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grote gele actieknop */}
        <div className="mt-12 text-center">
          <Button 
            className="bg-vinster-yellow hover:bg-yellow-400 text-white font-bold px-12 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Ga verder waar je gebleven was
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
