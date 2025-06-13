import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText } from "lucide-react";

const Dashboard = () => {
  const progressSteps = [
    {
      title: "De enthousiasme-scan",
      description: "Ontdek wat jou écht enthousiast maakt in je werk en waar je energie van krijgt.",
      progress: 100,
      isCompleted: true,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Jouw wensberoepen",
      description: "Verken beroepen die bij jouw interesses en vaardigheden passen.",
      progress: 45,
      isCompleted: false,
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Jouw rapport en aanbevelingen",
      description: "Krijg een overzicht van jouw resultaten en persoonlijke aanbevelingen.",
      progress: 0,
      isCompleted: false,
      icon: <FileText className="w-5 h-5 text-gray-400" />
    },
    {
      title: "Jouw antwoorden",
      description: "Bekijk en pas je antwoorden aan waar nodig voor het beste resultaat.",
      progress: 0,
      isCompleted: false,
      icon: <Search className="w-5 h-5 text-gray-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Linker kolom - Welkom sectie */}
          <div className="lg:col-span-4 space-y-6">
            {/* Welkom blok */}
            <Card className="p-8 bg-blue-50 border-0 rounded-3xl">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welkom</h1>
                <p className="text-gray-700 font-medium leading-relaxed mb-4">
                  Dit is jouw persoonlijke dashboard. Hier zie je jouw voortgang 
                  en kun je verder gaan waar je gebleven bent.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Welkom bij de start van jouw loopbaantraject! We beginnen met de enthousiasme-scan, de eerste 
                  stap om te ontdekken waar jouw werkelijke interesses en passies liggen.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  In deze scan gaan we op zoek naar de activiteiten en omgevingen waar jij van nature enthousiast 
                  van wordt. Door vragen te stellen over je jeugd, schooltijd en werk brengen we jouw unieke patroon 
                  van interesses in kaart.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Jouw enthousiasme is de belangrijkste indicator voor wat je echt leuk vindt. Wanneer je iets doet 
                  waar je enthousiast van wordt, ontstaat er energie en voldoening.
                </p>
              </div>
            </Card>

            {/* Belangrijk om te weten blok */}
            <Card className="p-8 bg-blue-400 border-0 rounded-3xl text-white">
              <h3 className="font-bold text-xl mb-6">Belangrijk om te weten</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Er zijn geen goede of foute antwoorden - wees eerlijk over wat jij echt leuk vindt.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Denk aan concrete situaties en ervaringen uit jouw leven.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je kunt je antwoorden altijd aanpassen tijdens het traject.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je voortgang wordt automatisch opgeslagen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Na het invullen van beide interviews wordt automatisch een persoonlijk rapport gegenereerd.</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Midden kolom - Voortgangsblokken */}
          <div className="lg:col-span-5 space-y-6">
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

          {/* Rechter kolom - Professionele afbeelding */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl h-80 lg:h-96 overflow-hidden">
              <img 
                src="/lovable-uploads/5c9e857b-c318-4c07-8c67-12a698a13be3.png"
                alt="Professionele vrouw met loopbaanontwikkeling materialen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Grote gele actieknop */}
        <div className="mt-12">
          <Button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-6 text-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
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
