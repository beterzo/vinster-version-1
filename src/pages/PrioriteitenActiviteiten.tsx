
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Star, Check } from "lucide-react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";

const PrioriteitenActiviteiten = () => {
  const navigate = useNavigate();
  const { responses, aiKeywords, saveResponses, loading } = usePrioriteitenResponses();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    responses?.selected_activiteiten_keywords || []
  );
  const [extraText, setExtraText] = useState(
    responses?.extra_activiteiten_tekst || ""
  );

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleSave = async () => {
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
          <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto mb-6" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Wat je graag doet</h1>
          </div>
          <p className="text-lg text-gray-700">
            Selecteer de activiteiten en taken die voor jou het allerbelangrijkste zijn
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
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
            Kernwoorden gebaseerd op jouw antwoorden ({keywords.length})
          </h2>
          <p className="text-gray-600 mb-6">
            Klik op de kernwoorden die voor jou het allerbelangrijkste zijn. Je kunt er zoveel selecteren als je wilt.
          </p>
          
          {keywords.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {keywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => toggleKeyword(keyword)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedKeywords.includes(keyword)
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-25'
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

          {selectedKeywords.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>{selectedKeywords.length}</strong> kernwoorden geselecteerd
              </p>
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

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/prioriteiten-intro")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {loading ? "Opslaan..." : "Volgende: Werkomgeving"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrioriteitenActiviteiten;
