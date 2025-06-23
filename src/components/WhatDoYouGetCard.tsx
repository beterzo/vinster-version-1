
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhatDoYouGetCard = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/signup');
  };

  const handleViewSampleReport = () => {
    window.open('/sample-report.pdf', '_blank');
  };

  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full flex flex-col" style={{
      backgroundColor: '#0476B9'
    }}>
      <div className="space-y-6 flex-grow">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left">
          Wat krijg je?
        </h2>
        
        <p className="text-base md:text-lg opacity-95 text-left">
          Een loopbaanrapport met:
        </p>
        
        <ul className="space-y-3 text-base md:text-lg opacity-95">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">Inzicht in jouw interesses en werkvoorkeuren</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">Suggesties voor werk dat écht bij je past: twee passende functies en één verrassende</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">Een concreet onderzoeksplan om verder te komen</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">Een zoekprofiel voor jouw uiteindelijke keuze</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col gap-3 mt-6">
        <Button 
          onClick={handleStartClick}
          className="bg-white hover:bg-gray-100 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full"
          style={{ color: '#0476B9' }}
        >
          Start nu voor €29 →
        </Button>
        <Button 
          onClick={handleViewSampleReport}
          className="border-2 border-white hover:bg-white hover:bg-opacity-10 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full bg-transparent text-white"
        >
          Bekijk voorbeeld rapport
        </Button>
      </div>
    </Card>
  );
};

export default WhatDoYouGetCard;
