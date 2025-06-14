
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const EnthousiasmeIntro = () => {
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
              We gaan van start! Ik heb zin om met je mee te gaan denken.
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Instructie enthousiasmescan
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Denk aan fijne periodes in je leven, van je jeugd tot aan nu. We hebben de tijd ingedeeld in vier tijdvakken. Als je niets kunt bedenken bij een bepaalde periode, sla die dan gerust over.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Je kunt later terug als je alsnog iets bedenkt. Je krijgt hier in totaal twaalf vragen.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Probeer elke vraag met 10 tot 50 woorden te beantwoorden, meer mag ook. Sommige vragen lijken op elkaar. Beantwoord ze toch allemaal zo precies mogelijk. Je mag in steekwoorden en in zinnen antwoorden. Wat jij prettig vindt.
                </p>
              </div>

              {/* Before You Start Section */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  Voor je start
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Denk terug aan vroeger en leef je in door even na te denken over de volgende vragen: Wat deed jij graag als kind? Was jij een kind dat veel buiten was? Speelde je alleen of liever met anderen? Welke spelletjes vond je leuk? Sportte je graag? Had je hobby's? Wat deed je als het mooi weer was en wat deed je als het regende? Was je een knutselkind? Wat deed je graag na school? Wat was je eerste (bij)baan? Op welke (werk)periode in je latere leven kijk je met veel plezier terug?
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
