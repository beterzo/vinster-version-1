
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getStorageUrl } from "@/hooks/useStorageUrl";

const EnthousiasmeIntro = () => {
  const navigate = useNavigate();
  const logoUrl = getStorageUrl('assets', 'vinster-logo.png');

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <img 
              src={logoUrl}
              alt="Vinster Logo" 
              className="h-12 w-auto filter brightness-110 contrast-110" 
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
              We gaan van start!
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Instructie enthousiasmescan
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  We gaan ontdekken wanneer jij in je element bent en stellen je daarvoor vragen over drie verschillende periodes in je leven. Je kunt later terug als je nog iets bedenkt. Je krijgt drie vragen per periode.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Beantwoord elke vraag met zeker 10 tot 20 woorden, meer mag ook. Beantwoord de vragen zo precies mogelijk. Je mag in steekwoorden of in zinnen antwoorden. Wat jij prettig vindt.
                </p>
              </div>

              {/* Before You Start Section */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  Voor je start
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Denk terug aan vroeger en leef je even in in de periode die genoemd wordt. Wat deed jij toen graag? Waar was je veel mee bezig? Wat boeide jou? Waar heb je de beste herinneringen aan? Wat was speciaal in die periode? Waar was je graag?
                </p>
              </div>

              {/* Start Button */}
              <div className="text-center pt-8">
                <Button 
                  onClick={() => navigate('/enthousiasme-stap-1')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                >
                  Start de scan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeIntro;
