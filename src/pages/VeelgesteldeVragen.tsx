
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const VeelgesteldeVragen = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "Wat is Vinster precies?",
      answer: "Vinster is een slimme digitale loopbaantool die je helpt om helder te krijgen wat je wil, wat bij je past en welke richting je op kunt. Je beantwoordt een paar gerichte vragen en krijgt daarna een persoonlijk rapport met concrete beroepssuggesties en vervolgstappen."
    },
    {
      question: "Voor wie is Vinster bedoeld?",
      answer: "Voor iedereen die keuzes wil maken die écht bij ze passen. Jongeren, werkzoekenden, heroriënteerders, ouders die hun kind willen helpen, loopbaancoaches en scholen."
    },
    {
      question: "Hoe lang duurt het traject?",
      answer: "De meeste mensen ronden alles binnen 1 tot 2 uur af. Maar je mag je tijd nemen. Je voortgang wordt automatisch opgeslagen."
    },
    {
      question: "Wat zit er in het rapport?",
      answer: "Je rapport bevat een samenvatting van jouw voorkeuren, een lijst met passende functies (waarvan eentje verrassend) en een concreet zoekprofiel waarmee je direct vacatures kunt filteren of door kunt naar een coach of vervolgstap."
    },
    {
      question: "Moet ik iets installeren?",
      answer: "Nee. Alles werkt online, gewoon in je browser. Je hoeft niks te downloaden of te installeren."
    },
    {
      question: "Kan ik tussendoor stoppen en later verdergaan?",
      answer: "Ja, jouw voortgang wordt automatisch opgeslagen. Je kunt op elk moment pauzeren en later weer verdergaan waar je was gebleven."
    },
    {
      question: "Wat gebeurt er met mijn gegevens?",
      answer: "Je gegevens worden veilig opgeslagen en alleen gebruikt om jouw rapport te genereren. We verkopen niks door en houden ons aan de AVG (privacywetgeving). Lees meer in onze [privacyverklaring]."
    },
    {
      question: "Kan ik dit ook doen met mijn coach of ouder?",
      answer: "Zeker. Veel mensen doen dit traject juist samen. Het rapport helpt om het gesprek aan te gaan, zonder dat je het alleen hoeft uit te zoeken."
    },
    {
      question: "Wat kost het?",
      answer: "Eenmalig €29. Geen abonnement, geen kleine lettertjes. Je krijgt direct toegang tot het volledige traject én jouw persoonlijke rapport."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-vinster-blue border-vinster-blue hover:bg-vinster-blue hover:text-white"
            >
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#232D4B' }}>
          Veelgestelde vragen
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger
                  onClick={() => toggleItem(index)}
                  className="flex items-center justify-between w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold" style={{ color: '#232D4B' }}>
                    {item.question}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                    style={{ color: '#232D4B' }}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-base leading-relaxed" style={{ color: '#232D4B' }}>
                      {item.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeelgesteldeVragen;
