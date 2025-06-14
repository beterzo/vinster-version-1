
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";

const PrioriteitenInteresses = () => {
  const navigate = useNavigate();
  const { 
    responses, 
    saving, 
    saveAllResponses, 
    availableInteressesKeywords 
  } = usePrioriteitenResponses();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    responses.selected_interesses_keywords || []
  );
  const [extraText, setExtraText] = useState(responses.extra_interesses_tekst || '');

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleSave = async () => {
    const updatedResponses = {
      ...responses,
      selected_interesses_keywords: selectedKeywords,
      extra_interesses_tekst: extraText
    };

    const success = await saveAllResponses(updatedResponses);
    if (success) {
      navigate("/extra-informatie-intro");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mb-6 cursor-pointer" 
            onClick={() => navigate("/home")}
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Jouw interesses</h1>
          <p className="text-xl text-gray-700">
            Selecteer de onderwerpen en gebieden die jou het meeste boeien
          </p>
        </div>

        {/* Keywords Selection */}
        <Card className="p-8 mb-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Selecteer jouw belangrijkste interesses
          </h2>
          
          {availableInteressesKeywords.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {availableInteressesKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`keyword-${index}`}
                    checked={selectedKeywords.includes(keyword)}
                    onCheckedChange={() => handleKeywordToggle(keyword)}
                  />
                  <label 
                    htmlFor={`keyword-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {keyword}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg mb-8">
              <p className="text-gray-600">
                Je hebt nog geen eerdere stappen ingevuld. Ga eerst terug om je enthousiasme-scan en wensberoepen in te vullen.
              </p>
            </div>
          )}

          {/* Extra tekst */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Aanvullende interesses (optioneel)
            </h3>
            <p className="text-gray-600 mb-4">
              Zijn er nog andere onderwerpen of gebieden waar je geïnteresseerd in bent? 
              Vul deze hieronder in.
            </p>
            <Textarea
              placeholder="Bijv. duurzaamheid, internationale ontwikkeling, kunstmatige intelligentie..."
              value={extraText}
              onChange={(e) => setExtraText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => navigate("/prioriteiten-werkomstandigheden")} 
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Vorige stap
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50" 
            size="lg"
          >
            {saving ? (
              <>
                <Save className="w-5 h-5 mr-2 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                Opslaan en doorgaan
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrioriteitenInteresses;
