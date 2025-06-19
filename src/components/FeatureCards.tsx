
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const FeatureCards = () => {
  const handleViewSampleReport = () => {
    // Open sample report in new tab - you can replace this with actual report URL
    window.open('/sample-report.pdf', '_blank');
  };

  const scrollToProcess = () => {
    const processSection = document.getElementById('het-proces');
    if (processSection) {
      processSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="w-full">
          <Card className="text-white p-8 md:p-12 rounded-3xl border-0 relative overflow-hidden min-h-[350px]" style={{
            backgroundColor: '#A9C5E2'
          }}>
            <div className="space-y-8">
              {/* Main heading */}
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-left">
                Wat is <span style={{ color: '#FFCD3E' }}>Vinster</span>?
              </h2>
              
              {/* Introduction */}
              <p className="text-lg leading-relaxed opacity-95">
                <span style={{ color: '#FFCD3E' }}>Vinster</span> is een slimme online tool die je helpt ontdekken welke functies bij jou passen.
              </p>
              
              <p className="text-lg leading-relaxed opacity-95">
                Op basis van wat jij vertelt — over wat je graag doet, wat je belangrijk vindt en hoe je het liefst werkt — krijg je een persoonlijk loopbaanadvies met:
              </p>
              
              {/* Checkmark list */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-lg">twee passende functies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-lg">één verrassende suggestie</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-lg">een helder stappenplan om jouw keuze mee te realiseren</span>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed opacity-95">
                Je hoeft geen testen in te vullen of moeilijke keuzes te maken. Jij vertelt. De AI-tool luistert. En geeft richting.
              </p>
              
              {/* What you get section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Wat krijg je?</h3>
                <p className="text-lg opacity-95">Een loopbaanrapport met</p>
                
                <ul className="space-y-2 text-lg opacity-95 pl-4">
                  <li>• Inzicht in jouw interesses en werkvoorkeuren</li>
                  <li>• Suggesties voor werk dat écht bij je past: twee passende functies en één verrassende</li>
                  <li>• Een concreet en nuchter plan om verder te komen</li>
                  <li>• Nieuw perspectief, zonder dat je meteen iets moet</li>
                </ul>
              </div>
              
              <p className="text-2xl font-bold text-center" style={{ color: '#FFCD3E' }}>
                Doe werk waar je blij van wordt.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  onClick={handleViewSampleReport}
                  className="bg-white hover:bg-gray-100 text-blue-900 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Bekijk voorbeeldrapport
                </Button>
                <Button 
                  onClick={scrollToProcess}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Hoe het werkt
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
