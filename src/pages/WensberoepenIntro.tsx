
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const WensberoepenIntro = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Main Title */}
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              Nu een heel ander interview. Hier heb je je fantasie voor nodig. Ik ben benieuwd!
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Instructie wensberoepen
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Zet je fantasie aan het werk en bedenk vier beroepen die je wel (een poosje) zou willen doen. Denk zo vrij mogelijk. Hieronder vul je één voor één jouw 'wensberoepen' in en je beantwoord er een aantal vragen over. Maak je antwoord specifiek.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Doe alsof je dit werk al jaren doet. Je hoeft niet na te denken hoe het precies gaat in dat beroep, beschrijf alleen wat jou erin aanspreekt. Probeer elke vraag met 10 tot 50 woorden te beantwoorden. Sommige vragen lijken op elkaar. Beantwoord ze toch allemaal zo precies mogelijk.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Je krijgt in totaal twaalf vragen per wensberoep.
                </p>
              </div>

              {/* Start Button */}
              <div className="text-center pt-8">
                <Button 
                  onClick={() => navigate('/wensberoepen-stap-1')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                >
                  Start met wensberoepen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WensberoepenIntro;
