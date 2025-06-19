
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Briefcase, Check, AlertCircle } from "lucide-react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";

const PrioriteitenWerkomstandigheden = () => {
  const navigate = useNavigate();
  const { responses, aiKeywords, saveResponses, loading } = usePrioriteitenResponses();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState("");

  // Sync local state with loaded responses
  useEffect(() => {
    if (responses) {
      setSelectedKeywords(responses.selected_werkomstandigheden_keywords || []);
      setExtraText(responses.extra_werkomstandigheden_tekst || "");
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
      selected_werkomstandigheden_keywords: selectedKeywords,
      extra_werkomstandigheden_tekst: extraText
    });
    
    if (success) {
      navigate("/prioriteiten-interesses");
    }
  };

  const keywords = aiKeywords?.werkomstandigheden || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto mb-6" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E6F0F6' }}>
              <Briefcase className="w-5 h-5" style={{ color: '#78BFE3' }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Fijne werkomstandigheden</h1>
          </div>
          <p className="text-lg text-gray-700">
            Selecteer de werkomstandigheden die voor jou het allerbelangrijkste zijn (minimaal 3)
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#78BFE3' }}></div>
              Extra informatie
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Activiteiten
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#78BFE3' }}></div>
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
            Klik op de werkomstandigheden die voor jou het allerbelangrijkste zijn. Je moet er minimaal 3 selecteren.
          </p>
          
          {keywords.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {keywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => toggleKeyword(keyword)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedKeywords.includes(keyword)
                      ? 'text-white shadow-sm'
                      : 'border-gray-200 bg-white hover:shadow-sm'
                  }`}
                  style={selectedKeywords.includes(keyword) ? {
                    borderColor: '#78BFE3',
                    backgroundColor: '#78BFE3'
                  } : {
                    borderColor: selectedKeywords.includes(keyword) ? '#78BFE3' : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedKeywords.includes(keyword)) {
                      e.currentTarget.style.borderColor = '#78BFE3';
                      e.currentTarget.style.backgroundColor = '#E6F0F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedKeywords.includes(keyword)) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{keyword}</span>
                    {selectedKeywords.includes(keyword) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Er zijn nog geen kernwoorden beschikbaar.</p>
              <p className="text-sm">Zorg ervoor dat je eerst de enthousiasme-scan en wensberoepen hebt ingevuld.</p>
            </div>
          )}
        </Card>

        {/* Additional text input */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Aanvullende informatie</h3>
          <p className="text-gray-600 mb-4">
            Zijn er nog andere werkomstandigheden die je belangrijk vindt en die hierboven niet staan? 
            Voeg hier je eigen informatie toe.
          </p>
          <Textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Beschrijf hier andere werkomstandigheden, werksfeer elementen of omgevingsfactoren die je belangrijk vindt..."
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
            onClick={() => navigate("/prioriteiten-activiteiten")}
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
                ? 'text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={isValidToProgress() ? { backgroundColor: '#78BFE3' } : {}}
            size="lg"
            onMouseEnter={(e) => {
              if (isValidToProgress()) {
                e.currentTarget.style.backgroundColor = '#5AADD9';
              }
            }}
            onMouseLeave={(e) => {
              if (isValidToProgress()) {
                e.currentTarget.style.backgroundColor = '#78BFE3';
              }
            }}
          >
            {loading ? "Opslaan..." : "Volgende: Interesses"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrioriteitenWerkomstandigheden;
