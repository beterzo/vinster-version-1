
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ZoekprofielIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Main Title */}
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              Zoekprofiel opstellen
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Wat is een zoekprofiel?
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Een zoekprofiel is jouw persoonlijke document waarin staat wat voor soort werk je zoekt. Het helpt je om gericht te solliciteren en laat werkgevers zien wat jij te bieden hebt.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Op basis van je antwoorden maken we een professioneel zoekprofiel dat je kunt gebruiken bij je sollicitaties of delen met recruiters.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Het invullen duurt ongeveer 10 minuten.
                </p>
              </div>

              {/* Start Button */}
              <div className="text-center pt-8">
                <Button 
                  onClick={() => navigate('/zoekprofiel-antwoorden')} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                >
                  Start zoekprofiel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZoekprofielIntro;
