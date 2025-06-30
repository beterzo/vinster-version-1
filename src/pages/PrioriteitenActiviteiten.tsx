
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";

const ACTIVITEITEN_KEYWORDS = [
  "Analyseren", "Begeleiden", "Beheren", "Bereiden", "Besturen", "Bouwen", "Communiceren",
  "Controleren", "Creëren", "Demonstreren", "Designen", "Experimenteren", "Geven",
  "Inspireren", "Instrueren", "Leiden", "Maken", "Motiveren", "Onderhandelen", "Onderzoeken",
  "Ondersteunen", "Ontwikkelen", "Oplossen", "Optreden", "Organiseren", "Plannen",
  "Presenteren", "Produceren", "Programmeren", "Repareren", "Spelen", "Stimuleren",
  "Trainen", "Uitleggen", "Uitvoeren", "Verkopen", "Verzorgen", "Voorbereiden"
];

const PrioriteitenActiviteiten = () => {
  const navigate = useNavigate();
  const { responses, saveResponse, isLoading } = usePrioriteitenResponses();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved data when responses change
  useEffect(() => {
    if (!isLoading && responses) {
      console.log("Loading saved responses into form:", responses);
      setSelectedKeywords(responses.selected_activiteiten_keywords || []);
      setExtraText(responses.extra_activiteiten_tekst || "");
    }
  }, [isLoading, responses]);

  const handleKeywordToggle = (keyword: string) => {
    const newSelection = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    
    setSelectedKeywords(newSelection);
    saveResponse('selected_activiteiten_keywords', newSelection);
  };

  const handleExtraTextChange = (value: string) => {
    setExtraText(value);
  };

  const handleExtraTextBlur = () => {
    console.log("Saving extra text:", extraText);
    saveResponse('extra_activiteiten_tekst', extraText);
  };

  const handleNext = () => {
    scrollToTop();
    navigate('/prioriteiten-interesses');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  const canProceed = selectedKeywords.length >= 5;

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
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Prioriteiten - Activiteiten
              </h1>
              <p className="text-xl text-gray-600">
                Selecteer minimaal 5 activiteiten die je leuk vindt om te doen
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Geselecteerd: {selectedKeywords.length} van minimaal 5
              </p>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {ACTIVITEITEN_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordToggle(keyword)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedKeywords.includes(keyword)
                      ? "bg-blue-900 text-white border-blue-900 shadow-md"
                      : "bg-white text-blue-900 border-gray-300 hover:border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* Extra Text Field */}
            <div className="mb-8">
              <Label htmlFor="extraText" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                Mis je nog activiteiten? Voeg ze hier toe (optioneel)
              </Label>
              <Textarea
                id="extraText"
                placeholder="Bijvoorbeeld: Fotograferen, Programmeren, Tuinieren..."
                value={extraText}
                onChange={(e) => handleExtraTextChange(e.target.value)}
                onBlur={handleExtraTextBlur}
                className="min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-8">
              <Button 
                onClick={handleNext}
                className={`font-semibold px-8 ${
                  canProceed
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!canProceed}
              >
                Volgende: Interesses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrioriteitenActiviteiten;
