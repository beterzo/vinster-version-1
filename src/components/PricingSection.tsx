
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/signup');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card className="text-white p-8 md:p-12 rounded-3xl border-0 relative overflow-hidden" style={{
          backgroundColor: '#0476B9'
        }}>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Levenslange toegang tot jouw loopbaanprofiel – voor maar €29
              </h2>
              
              <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto">
                Om gebruik te maken van Vinster betaal je eenmalig €29. Je krijgt hiermee direct toegang tot alle tools, analyses en een persoonlijk rapport. Geen abonnement, geen verborgen kosten.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <ul className="space-y-4 text-left text-base md:text-lg opacity-95">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{
                    color: '#FFCD3E'
                  }} />
                  <span>Volledige enthusiasmescan</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{
                    color: '#FFCD3E'
                  }} />
                  <span>Wensberoepen analyse</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{
                    color: '#FFCD3E'
                  }} />
                  <span>Persoonlijk rapport (PDF)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{
                    color: '#FFCD3E'
                  }} />
                  <span>Zoekprofiel generator</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{
                    color: '#FFCD3E'
                  }} />
                  <span>Levenslange toegang</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleStartClick}
                size="lg"
                className="bg-white hover:bg-gray-100 text-blue-900 font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Start nu voor €29 →
              </Button>
              
              <p className="text-sm opacity-80">
                Maak eerst je account aan, daarna kun je veilig betalen.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PricingSection;
