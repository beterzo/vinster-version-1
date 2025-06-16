
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
        <div className="max-w-4xl w-full">
          <Card className="text-white p-8 md:p-12 rounded-3xl border-0 relative overflow-hidden min-h-[350px]" style={{
            backgroundColor: '#A9C5E2'
          }}>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Main content - takes up 2/3 of the space, fully left-aligned */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold leading-tight text-left">
                  Daarom doe je dit
                </h3>
                
                <div className="space-y-4 text-lg leading-relaxed opacity-95 text-left">
                  <p>
                    Het doel van Vinster is simpel: jou helpen ontdekken welk werk echt bij je past.
                  </p>
                  
                  <p>
                    Om dat te bereiken stellen we je slimme vragen over wat je graag doet, waar je energie van krijgt en in welke omgeving je het beste tot je recht komt.
                  </p>
                  
                  <p>
                    Daaruit ontstaat een persoonlijk rapport met concrete functievoorstellen, passend bij jouw voorkeuren, interesses en talenten.
                  </p>
                  
                  <p>
                    Zo weet je niet alleen wat je zoekt, maar ook waarom.
                  </p>
                </div>
                
                <div className="pt-4 text-left">
                  <Button 
                    onClick={handleViewSampleReport}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Bekijk voorbeeldrapport
                  </Button>
                </div>
              </div>
              
              {/* Report illustration - smaller and more subtle */}
              <div className="md:col-span-1 flex justify-center md:justify-end items-center">
                <div className="w-32 h-44 bg-white rounded-lg shadow-xl transform rotate-6 relative overflow-hidden">
                  <div className="h-6 flex items-center px-3" style={{
                    backgroundColor: '#78BFE3'
                  }}>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 rounded w-full mt-3" style={{
                      backgroundColor: '#78BFE3',
                      opacity: 0.7
                    }}></div>
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
