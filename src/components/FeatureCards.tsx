
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeatureCards = () => {
  const handleViewSampleReport = () => {
    // Open sample report in new tab - you can replace this with actual report URL
    window.open('/sample-report.pdf', '_blank');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Expanded Blue Card with Report */}
          <div className="max-w-4xl w-full">
            <Card className="text-white p-8 md:p-12 rounded-3xl border-0 relative overflow-hidden min-h-[400px]" style={{
              backgroundColor: '#A9C5E2'
            }}>
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Main content - takes up 2/3 of the space */}
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight text-left">
                    Voorbeeld rapport
                  </h3>
                  
                  <div className="space-y-4 text-lg leading-relaxed opacity-95">
                    <p>
                      De loopbaantrechter van Vinster helpt je stap voor stap ontdekken welk werk écht bij je past. Na het invullen van vragen over jouw interesses, werkomgeving en activiteiten ontstaat er een persoonlijk rapport.
                    </p>
                    
                    <p>
                      In dit rapport vind je concrete functievoorstellen die passen bij wie jij bent, inclusief uitleg waarom juist die functies goed bij je aansluiten.
                    </p>
                    
                    <p>
                      Je krijgt ook inzicht in de werkomgeving waarin jij het best tot je recht komt, en wat je belangrijk vindt in werk. Dit document vormt de perfecte basis om gericht te gaan solliciteren, of om met je werkgever in gesprek te gaan over je toekomst.
                    </p>
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      onClick={handleViewSampleReport}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Bekijk voorbeeldrapport
                    </Button>
                  </div>
                </div>
                
                {/* Report illustration - takes up 1/3 of the space */}
                <div className="md:col-span-1 flex justify-center md:justify-end items-center">
                  <div className="w-40 h-52 bg-white rounded-lg shadow-xl transform rotate-6 relative overflow-hidden">
                    <div className="h-8 flex items-center px-4" style={{
                      backgroundColor: '#78BFE3'
                    }}>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                        <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                        <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 rounded w-full mt-4" style={{
                        backgroundColor: '#78BFE3',
                        opacity: 0.7
                      }}></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Text section - Centered below the blue card */}
          <div className="max-w-md w-full px-2">
            <h4 className="text-lg font-bold mb-3 text-blue-900 text-left">Over deze tool</h4>
            <p className="text-sm leading-relaxed text-blue-900 text-left">
              De denkwijze achter vinster is ontwikkeld door Heidi Jansen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
