
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck } from "lucide-react";

const Dashboard = () => {
  const progressSteps = [
    {
      title: "De enthousiasme-scan",
      progress: 100,
      isCompleted: true,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Jouw wensberoepen",
      progress: 45,
      isCompleted: false,
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Prioriteiten stellen",
      progress: 0,
      isCompleted: false,
      icon: <ListTodo className="w-5 h-5 text-gray-400" />
    },
    {
      title: "Laatste check",
      progress: 0,
      isCompleted: false,
      icon: <CheckCircle className="w-5 h-5 text-gray-400" />
    },
    {
      title: "Zoekprofiel",
      progress: 0,
      isCompleted: false,
      icon: <UserCheck className="w-5 h-5 text-gray-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* 2-rijen grid layout */}
        <div className="grid grid-rows-[auto_1fr] gap-y-8 min-h-[800px]">
          
          {/* Bovenste rij: Welkomstbericht + Afbeelding */}
          <div className="grid grid-cols-[1fr_400px] gap-x-8">
            {/* Welkom blok - breed tot aan afbeelding */}
            <Card className="p-8 bg-blue-50 border-0 rounded-3xl">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Welkom</h1>
                <p className="text-gray-700 font-medium leading-relaxed mb-4">
                  Dit is jouw persoonlijke dashboard. Hier zie je jouw voortgang 
                  en kun je verder gaan waar je gebleven bent.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Welkom bij de start van jouw loopbaantraject! We beginnen met de enthousiasme-scan, de eerste 
                  stap om te ontdekken waar jouw werkelijke interesses en passies liggen.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
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

            {/* Afbeelding - rechtsboven */}
            <div className="rounded-3xl h-[500px] overflow-hidden">
              <img 
                src="/lovable-uploads/4d34612b-df14-4f89-abac-7542126c6ac2.png"
                alt="Professionele vrouw met loopbaanontwikkeling materialen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Onderste rij: Belangrijk blok + Stappen + Knop - alle even hoog */}
          <div className="grid grid-cols-[auto_1fr_400px] gap-x-8 items-stretch">
            {/* Belangrijk om te weten blok - linksonder */}
            <Card className="p-6 bg-blue-400 border-0 rounded-3xl text-white w-[350px]">
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

            {/* Vijf stappenblokken - midden, gelijkmatig verdeeld */}
            <div className="flex flex-col justify-between">
              {progressSteps.map((step, index) => (
                <ProgressStep
                  key={index}
                  title={step.title}
                  progress={step.progress}
                  isCompleted={step.isCompleted}
                  icon={step.icon}
                  compact={true}
                />
              ))}
            </div>

            {/* Gele knop - rechtsonder, uitgelijnd naar beneden */}
            <div className="flex flex-col justify-end">
              <Button 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                Ga verder waar je gebleven was
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
