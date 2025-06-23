
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Star, Check, AlertCircle } from "lucide-react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";

const PrioriteitenActiviteiten = () => {
  const navigate = useNavigate();
  const { responses, aiKeywords, saveResponses, loading } = usePrioriteitenResponses();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState("");

  // Sync local state with loaded responses
  useEffect(() => {
    if (responses) {
      setSelectedKeywords(responses.selected_activiteiten_keywords || []);
      setExtraText(responses.extra_activiteiten_tekst || "");
    }
  }, [responses]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const isValidToProgress = () => {
    return selectedKeywords.length >= 3;
  };

  const handleSave = async () => {
    if (!isValidToProgress()) return;
    
    const success = await saveResponses({
      selected_activiteiten_keywords: selectedKeywords,
      extra_activiteiten_tekst: extraText
    });
    
    if (success) {
      navigate("/prioriteiten-werkomstandigheden");
    }
  };

  const keywords = aiKeywords?.activiteiten || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Wat je graag doet</h1>
          </div>
          <p className="text-lg text-gray-700">
            Selecteer de activiteiten en taken die voor jou het allerbelangrijkste zijn (minimaal 3)
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Extra informatie
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Activiteiten
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              Werkomgeving
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              Interesses
            </span>
          </div>
        </div>

        {/* Keywords grid */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            Kernwoorden gebaseerd op jouw antwoorden
          </h2>
          <p className="text-gray-600 mb-6">
            Klik op de kernwoorden die voor jou het allerbelangrijkste zijn. Je moet er minimaal 3 selecteren.
          </p>
          
          {keywords.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {keywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => toggleKeyword(keyword)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedKeywords.includes(keyword)
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-25 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{keyword}</span>
                    {selectedKeywords.includes(keyword) && (
                      <Check className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Er zijn nog geen kernwoorden beschikbaar.</p>
              <p className="text-sm">Zorg ervoor dat je eerst de enthousiasme-scan en wensberoepen hebt ingevuld.</p>
            </div>
          )}
        </Card>

        {/* Additional text input */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Aanvullende informatie</h3>
          <p className="text-gray-600 mb-4">
            Is er nog iets anders wat je graag doet of belangrijke activiteiten die hierboven niet staan? 
            Voeg hier je eigen informatie toe.
          </p>
          <Textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Beschrijf hier andere activiteiten, taken of werkzaamheden die je graag doet..."
            className="min-h-24"
          />
        </Card>

        {/* Validation error message */}
        {!isValidToProgress() && selectedKeywords.length > 0 && (
          <div className="mb-6 flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Selecteer nog {3 - selectedKeywords.length} kernwoord{3 - selectedKeywords.length === 1 ? '' : 'en'} om door te gaan naar de volgende stap.
            </span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate("/extra-informatie-vragen")}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={loading || !isValidToProgress()}
            className={`rounded-xl ${
              isValidToProgress() 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            size="lg"
          >
            {loading ? "Opslaan..." : "Volgende: werkomgeving"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrioriteitenActiviteiten;
