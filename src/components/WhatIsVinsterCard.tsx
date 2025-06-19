
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const WhatIsVinsterCard = () => {
  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full" style={{
      backgroundColor: '#A9C5E2'
    }}>
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          Wat is <span style={{ color: '#FFCD3E' }}>Vinster</span>?
        </h2>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95">
          <span style={{ color: '#FFCD3E' }}>Vinster</span> is een slimme online tool die je helpt ontdekken welke functies bij jou passen.
        </p>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95">
          Op basis van wat jij vertelt — over wat je graag doet, wat je belangrijk vindt en hoe je het liefst werkt — krijg je een persoonlijk loopbaanadvies met:
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" />
            <span className="text-base md:text-lg">twee passende functies</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" />
            <span className="text-base md:text-lg">één verrassende suggestie</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" />
            <span className="text-base md:text-lg">een helder stappenplan om jouw keuze mee te realiseren</span>
          </div>
        </div>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95">
          Je hoeft geen testen in te vullen of moeilijke keuzes te maken. Jij vertelt. De AI-tool luistert. En geeft richting.
        </p>
      </div>
    </Card>
  );
};

export default WhatIsVinsterCard;
