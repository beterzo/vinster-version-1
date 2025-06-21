
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
          <div className="flex items-center space-x-4 cursor-pointer" onClick={handleLogoClick}>
            <img 
              src="/lovable-uploads/vinster-new-logo.png" 
              alt="Vinster Logo" 
              className="h-12 w-auto filter brightness-110 contrast-110" 
            />
            <span className="text-2xl font-bold tracking-wide" style={{ color: '#253857' }}>Vinster</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Main Title */}
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              Nu een heel ander onderwerp. Hier heb je je fantasie voor nodig.
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Instructie wensberoepen
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Zet je fantasie aan het werk en bedenk drie beroepen die je wel (een poosje) zou willen doen. Denk zo vrij mogelijk. Er zijn nu even geen beperkingen. Hieronder vul je dadelijk één voor één je wensberoepen in. Beantwoord de vragen alsof je dat beroep al uitoefent. Je hoeft niet na te denken over hoe het precies gaat in dat werk, beschrijf alleen wat jou erin aanspreekt.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Probeer met tenminste 10 tot 20 woorden te antwoorden, meer mag ook. Sommige vragen lijken op elkaar. Beantwoord ze toch allemaal zo precies mogelijk.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Je krijgt in totaal acht vragen per beroep.
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
