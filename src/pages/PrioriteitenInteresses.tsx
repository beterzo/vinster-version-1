
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Heart, Check } from "lucide-react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";

const PrioriteitenInteresses = () => {
  const navigate = useNavigate();
  const { 
    responses, 
    loading, 
    saveResponses, 
    saveKeywordSelection,
    hasMinimumKeywords,
    aiKeywords 
  } = usePrioriteitenResponses();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState('');

  // Sync local state with loaded responses
  useEffect(() => {
    if (responses) {
      setSelectedKeywords(responses.selected_interesses_keywords || []);
      setExtraText(responses.extra_interesses_tekst || '');
    }
  }, [responses]);

  const availableInteressesKeywords = aiKeywords?.interesses || [];

  const toggleKeyword = async (keyword: string) => {
    const newKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    
    setSelectedKeywords(newKeywords);
    
    // Save immediately to Supabase
    await saveKeywordSelection('interesses', newKeywords);
  };

  const handleSave = async () => {
    const success = await saveResponses({
      extra_interesses_tekst: extraText
    });
    
    if (success) {
      navigate("/");
    }
  };

  const canProceed = hasMinimumKeywords('interesses') || (extraText && extraText.trim() !== '');
  const selectedCount = selectedKeywords.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-vinster-blue">Jouw interesses</h1>
          </div>
          <p className="text-lg text-gray-700">
            Selecteer de onderwerpen en gebieden die voor jou belangrijk zijn
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              Extra informatie
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Activiteiten
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              Werkomgeving
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Interesses
            </span>
          </div>
        </div>

        {/* Keywords grid */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Kernwoorden gebaseerd op jouw antwoorden
            </h2>
            <div className="text-sm text-gray-600">
              <span className={`font-medium ${selectedCount >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                {selectedCount}/3 kernwoorden geselecteerd
              </span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Selecteer minimaal 3 kernwoorden die voor jou belangrijk zijn. Je selecties worden automatisch opgeslagen.
          </p>
          
          {selectedCount < 3 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700 text-sm">
                ⚠️ Selecteer nog {3 - selectedCount} kernwoord{3 - selectedCount !== 1 ? 'en' : ''} om door te kunnen gaan naar de volgende stap.
              </p>
            </div>
          )}
          
          {availableInteressesKeywords.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableInteressesKeywords.map((keyword, index) => (
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
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Er zijn nog geen kernwoorden beschikbaar.</p>
              <p className="text-sm">Zorg ervoor dat je eerst de enthousiasme-scan en wensberoepen hebt ingevuld.</p>
            </div>
          )}
        </Card>

        {/* Additional text input */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Aanvullende informatie</h3>
          <p className="text-gray-600 mb-4">
            Zijn er nog andere onderwerpen of gebieden waar je geïnteresseerd in bent? 
            Voeg hier je eigen informatie toe. (Dit kan een alternatief zijn voor de 3 kernwoorden)
          </p>
          <Textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Beschrijf hier andere interesses, onderwerpen of gebieden die je boeien..."
            className="min-h-24"
          />
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate("/prioriteiten-werkomstandigheden")}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          
          <div className="flex flex-col items-end gap-2">
            {!canProceed && (
              <p className="text-sm text-red-600">
                Selecteer minimaal 3 kernwoorden of voeg aanvullende informatie toe
              </p>
            )}
            <Button
              onClick={handleSave}
              disabled={loading || !canProceed}
              className={`rounded-xl ${
                canProceed 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              size="lg"
            >
              {loading ? "Opslaan..." : "Loopbaanrapport voltooien"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioriteitenInteresses;
