import { Card } from "@/components/ui/card";

const FeatureCards = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Yellow Card */}
          <div className="col-span-4">
            <Card className="bg-yellow-400 text-white p-6 rounded-3xl border-0 h-48">
              <h3 className="text-xl font-bold mb-4 leading-tight text-left">
                Bekijk hier<br />
                hoe ons advies<br />
                tot stand komt.
              </h3>
            </Card>
          </div>
          
          {/* Blue Card with Report */}
          <div className="col-span-4">
            <Card className="text-white p-6 rounded-3xl border-0 relative overflow-hidden h-48" style={{
              backgroundColor: '#A9C5E2'
            }}>
              <h3 className="text-xl font-bold mb-4 leading-tight text-left">
                Voorbeeld<br />rapport
              </h3>
              <div className="absolute bottom-0 right-0">
                <div className="w-36 h-48 bg-white rounded-lg shadow-xl transform rotate-12 relative overflow-hidden">
                  <div className="h-7 flex items-center px-3" style={{
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
            </Card>
          </div>
          
          {/* Right Column - Dashboard Card + Text */}
          <div className="col-span-4 flex flex-col space-y-4">
            {/* Dark Blue Dashboard Card */}
            <Card className="bg-blue-900 text-white p-6 rounded-3xl border-0 h-24">
              <h3 className="text-xl font-bold leading-tight text-white text-left">
                Je persoonlijke<br />dashboard
              </h3>
            </Card>
            
            {/* Text directly on white background */}
            <div className="px-2">
              <h4 className="text-lg font-bold mb-3 text-blue-900 text-left">Over deze tool</h4>
              <p className="text-sm leading-relaxed text-blue-900 text-left">
                De denkwijze achter vinster is ontwikkeld door Heidi Jansen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
