import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const EnthousiasmeIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
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
              Wat brengt je tot leven?
            </h1>

            {/* Instructions Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  Instructie enthousiasme
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  In dit deel willen we weten wat je tot leven brengt. Het gaat om enthousiasme, interesse en passie. We vragen je terug te kijken naar vroeger, naar je eerste baan en naar wat je nu aanspreekt.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Beantwoord elke vraag met 10-20 woorden, meer mag ook. Sommige vragen lijken op elkaar. Beantwoord ze toch allemaal zo precies mogelijk.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Je krijgt in totaal acht vragen.
                </p>
              </div>

              {/* Start Button */}
              <div className="text-center pt-8">
                <Button 
                  onClick={() => navigate('/enthousiasme-step-1')} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold text-lg px-12 py-4 rounded-lg"
                >
                  Start met enthousiasme
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
