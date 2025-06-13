

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck } from "lucide-react";

const Dashboard = () => {
  const progressSteps = [
    {
      title: "Enthousiasmescan",
      description: "Ontdek wat jou écht enthousiast maakt in je werk en waar je energie van krijgt.",
      progress: 100,
      isCompleted: true,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Wensberoepen",
      description: "Verken beroepen die bij jouw interesses en vaardigheden passen.",
      progress: 45,
      isCompleted: false,
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Prioriteiten stellen",
      description: "Bepaal wat voor jou het allerbelangrijkst is in je ideale baan.",
      progress: 0,
      isCompleted: false,
      icon: <ListTodo className="w-5 h-5 text-gray-400" />
    },
    {
      title: "Laatste check",
      description: "Controleer of alles klopt en verfijn je keuzes waar nodig.",
      progress: 0,
      isCompleted: false,
      icon: <CheckCircle className="w-5 h-5 text-gray-400" />
    },
    {
      title: "Zoekprofiel",
      description: "Maak je profiel compleet en start met zoeken naar jouw droombaan.",
      progress: 0,
      isCompleted: false,
      icon: <UserCheck className="w-5 h-5 text-gray-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid grid-cols-[1fr_1.3fr_0.8fr] gap-x-4">
          {/* Linker kolom - Welkom sectie */}
          <div className="space-y-4">
            {/* Welkom blok */}
            <Card className="p-6 bg-blue-50 border-0 rounded-3xl">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Welkom</h1>
                <p className="text-gray-700 font-medium leading-relaxed mb-3">
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
            <Card className="p-6 bg-blue-400 border-0 rounded-3xl text-white">
              <h3 className="font-bold text-xl mb-4">Belangrijk om te weten</h3>
              <ul className="space-y-3 text-sm">
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

          {/* Rechter kolom - Professionele afbeelding */}
          <div>
            <div className="rounded-3xl h-[450px] overflow-hidden">
              <img 
                src="/lovable-uploads/4d34612b-df14-4f89-abac-7542126c6ac2.png"
                alt="Professionele vrouw met loopbaanontwikkeling materialen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Grote gele actieknop */}
        <div className="mt-10">
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

