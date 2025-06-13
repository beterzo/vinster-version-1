import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressStep from "./ProgressStep";
import { CircleUser, Target, Star, CheckCircle, Search, FileText, ListTodo, UserCheck } from "lucide-react";

const Dashboard = () => {
  const progressSteps = [
    {
      title: "Enthousiasmescan",
      progress: 100,
      isCompleted: true,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Wensberoepen",
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
        {/* Grid layout met 2 kolommen: links voor content, rechts voor foto */}
        <div className="grid grid-cols-[1fr_400px] gap-x-8 min-h-[800px]">
          
          {/* Linker kolom: Content */}
          <div className="grid grid-rows-[auto_1fr] gap-y-8">
            {/* Welkom blok - bovenaan links */}
            <Card className="p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
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

            {/* Onderste rij: Belangrijk blok + Stappen */}
            <div className="grid grid-cols-[350px_1fr] gap-x-8 items-stretch">
              {/* Belangrijk om te weten blok - linksonder */}
              <Card className="p-6 border-0 rounded-3xl text-white flex flex-col" style={{ backgroundColor: '#78BFE3' }}>
                <h3 className="font-bold text-xl mb-4">Belangrijk om te weten</h3>
                <ul className="space-y-4 text-sm flex-1 flex flex-col justify-between">
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
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span>Na het invullen van het zoekprofiel ontvang je een persoonlijk zoekprofiel waarmee jij de juiste vacatures kunt vinden.</span>
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
            </div>
          </div>

          {/* Rechter kolom: Foto + Knop */}
          <div className="flex flex-col gap-8">
            {/* Afbeelding - neemt de meeste ruimte in */}
            <div className="rounded-3xl flex-1 overflow-hidden">
              <img 
                src="/lovable-uploads/4d34612b-df14-4f89-abac-7542126c6ac2.png"
                alt="Professionele vrouw met loopbaanontwikkeling materialen"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gele knop - onderaan rechts */}
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
  );
};

export default Dashboard;
