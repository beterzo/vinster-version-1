
import { Card } from "@/components/ui/card";

const WhatDoYouGetCard = () => {
  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full" style={{
      backgroundColor: '#0476B9'
    }}>
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left">
          Wat krijg je?
        </h2>
        
        <p className="text-base md:text-lg opacity-95 text-left">
          Een loopbaanrapport met:
        </p>
        
        <ul className="space-y-3 text-base md:text-lg opacity-95">
          <li className="flex items-center gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#FFCD3E' }}>•</span>
            <span>Inzicht in jouw interesses en werkvoorkeuren</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#FFCD3E' }}>•</span>
            <span>Suggesties voor werk dat écht bij je past: twee passende functies en één verrassende</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#FFCD3E' }}>•</span>
            <span>Een concreet en nuchter plan om verder te komen</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#FFCD3E' }}>•</span>
            <span>Nieuw perspectief, zonder dat je meteen iets moet</span>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default WhatDoYouGetCard;
