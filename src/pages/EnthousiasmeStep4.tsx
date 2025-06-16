
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnthousiasmeStep4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { responses, loading, saving, saveResponse, updateLocalResponse } = useEnthousiasmeResponses();

  // Local validation for step 4 only
  const isStep4Complete = () => {
    const question1 = responses.plezierige_werkperiode_beschrijving?.trim() || '';
    const question2 = responses.leuk_project_en_rol?.trim() || '';
    const question3 = responses.fluitend_thuiskomen_dag?.trim() || '';
    
    return question1 !== '' && question2 !== '' && question3 !== '';
  };

  const handleInputChange = (field: 'plezierige_werkperiode_beschrijving' | 'leuk_project_en_rol' | 'fluitend_thuiskomen_dag', value: string) => {
    updateLocalResponse(field, value);
  };

  const handleInputBlur = (field: 'plezierige_werkperiode_beschrijving' | 'leuk_project_en_rol' | 'fluitend_thuiskomen_dag', value: string) => {
    saveResponse(field, value);
  };

  const handleComplete = () => {
    toast({
      title: "Enthousiasme scan afgerond!",
      description: "Je antwoorden zijn opgeslagen. Je kunt ze altijd aanpassen door terug te gaan naar de stappen.",
    });
    navigate('/home');
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const step4Complete = isStep4Complete();

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
        <EnthousiasmeProgress currentStep={4} totalSteps={4} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Je leukste werkervaring
              </h1>
              {saving && (
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Bezig met opslaan...
                </p>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="question1" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Aan welke periode denk je met heel veel plezier terug? Wat deed je toen?
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Vertel over de periode waar je met veel plezier aan terugdenkt..."
                  value={responses.plezierige_werkperiode_beschrijving || ''}
                  onChange={(e) => handleInputChange('plezierige_werkperiode_beschrijving', e.target.value)}
                  onBlur={(e) => handleInputBlur('plezierige_werkperiode_beschrijving', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Kun je nog een leuke periode of project noemen? Wat was jouw rol?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Beschrijf een ander leuk project of periode en jouw rol daarin..."
                  value={responses.leuk_project_en_rol || ''}
                  onChange={(e) => handleInputChange('leuk_project_en_rol', e.target.value)}
                  onBlur={(e) => handleInputBlur('leuk_project_en_rol', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Wanneer kom jij fluitend thuis? Wat heb je dan meegemaakt op een dag?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Vertel over een dag waarna je fluitend thuiskwam..."
                  value={responses.fluitend_thuiskomen_dag || ''}
                  onChange={(e) => handleInputChange('fluitend_thuiskomen_dag', e.target.value)}
                  onBlur={(e) => handleInputBlur('fluitend_thuiskomen_dag', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={() => navigate('/enthousiasme-stap-3')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Vorige
              </Button>
              <Button 
                onClick={handleComplete}
                className={`font-semibold px-8 ${
                  step4Complete
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!step4Complete}
              >
                Afronden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeStep4;
