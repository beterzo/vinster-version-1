
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useExistingZoekprofiel } from "@/hooks/useExistingZoekprofiel";

const ZoekprofielIntro = () => {
  const navigate = useNavigate();
  const { hasExistingZoekprofiel, loading } = useExistingZoekprofiel();

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/69d6ab31-0032-4754-be0b-481571c371ef.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
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

              {/* Conditional content based on existing zoekprofiel */}
              {hasExistingZoekprofiel ? (
                <div className="text-center pt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Zoekprofiel al aangemaakt
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Je hebt al een zoekprofiel aangemaakt. Je kunt het downloaden of bekijken op de download pagina.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => navigate('/zoekprofiel-download')} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg mr-4"
                    >
                      Naar zoekprofiel download
                    </Button>
                    <Button 
                      onClick={() => navigate('/home')} 
                      variant="outline"
                      className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold text-lg px-12 py-4 rounded-lg"
                    >
                      Terug naar dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center pt-8">
                  <Button 
                    onClick={() => navigate('/zoekprofiel-antwoorden')} 
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                  >
                    Start zoekprofiel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZoekprofielIntro;
