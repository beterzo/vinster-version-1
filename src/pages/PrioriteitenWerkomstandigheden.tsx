import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { cleanKeywords } from "@/utils/keywordUtils";

const PrioriteitenWerkomstandigheden = () => {
  const navigate = useNavigate();
  const {
    responses,
    aiKeywords,
    saveKeywordSelection,
    saveResponses,
    loading
  } = usePrioriteitenResponses();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setSelectedKeywords(responses.selected_werkomstandigheden_keywords || []);
      setExtraText(responses.extra_werkomstandigheden_tekst || "");
    }
  }, [loading, responses]);

  const handleKeywordToggle = (keyword: string) => {
    const newSelection = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    
    setSelectedKeywords(newSelection);
    saveKeywordSelection('werkomstandigheden', newSelection);
  };

  const handleExtraTextChange = (value: string) => {
    setExtraText(value);
  };

  const handleExtraTextBlur = () => {
    console.log("Saving extra text:", extraText);
    saveResponses({ extra_werkomstandigheden_tekst: extraText });
  };

  const handlePrevious = () => {
    scrollToTop();
    navigate('/prioriteiten-activiteiten');
  };

  const handleNext = () => {
    scrollToTop();
    navigate('/prioriteiten-interesses');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  // Use AI-generated keywords or fallback to empty array
  const availableKeywords = cleanKeywords(aiKeywords.werkomstandigheden || []);
  const canProceed = selectedKeywords.length >= 5;

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
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Prioriteiten - werkomstandigheden
              </h1>
              <p className="text-xl text-gray-600">
                Selecteer minimaal 5 werkomstandigheden die belangrijk voor je zijn
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Geselecteerd: {selectedKeywords.length} van minimaal 5
              </p>
            </div>

            {/* Keywords Grid */}
            {availableKeywords.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                {availableKeywords.map((keyword) => (
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
            ) : (
              <div className="text-center mb-8 p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  Er zijn nog geen persoonlijke werkomstandigheden gegenereerd. 
                  Vul eerst je enthousiasme scan en wensberoepen in.
                </p>
              </div>
            )}

            {/* Extra Text Field */}
            <div className="mb-8">
              <Label htmlFor="extraText" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                Mis je nog werkomstandigheden? Voeg ze hier toe (optioneel)
              </Label>
              <Textarea
                id="extraText"
                placeholder="Bijvoorbeeld: Hond mee naar kantoor, Goede koffie, Ergonomische werkplek..."
                value={extraText}
                onChange={(e) => handleExtraTextChange(e.target.value)}
                onBlur={handleExtraTextBlur}
                className="min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8">
              <Button 
                onClick={handlePrevious}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Vorige: Activiteiten
              </Button>
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

export default PrioriteitenWerkomstandigheden;
