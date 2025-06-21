
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { Loader2 } from "lucide-react";

const EnthousiasmeStep3 = () => {
  const navigate = useNavigate();
  const { responses, loading, saving, saveResponse, updateLocalResponse } = useEnthousiasmeResponses();

  // Local validation for step 3 only
  const isStep3Complete = () => {
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

  const step3Complete = isStep3Complete();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={handleLogoClick}>
            <img 
              src="/lovable-uploads/vinster-new-logo.png" 
              alt="Vinster Logo" 
              className="h-12 w-auto filter brightness-110 contrast-110" 
            />
            <span className="text-2xl font-bold tracking-wide" style={{ color: '#253857' }}>Vinster</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <EnthousiasmeProgress currentStep={3} totalSteps={3} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Je beste werkervaring
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
                  Aan welke periode denk je met heel veel plezier terug?
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Beschrijf een werkperiode waar je met heel veel plezier aan terugdenkt..."
                  value={responses.plezierige_werkperiode_beschrijving || ''}
                  onChange={(e) => handleInputChange('plezierige_werkperiode_beschrijving', e.target.value)}
                  onBlur={(e) => handleInputBlur('plezierige_werkperiode_beschrijving', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Kun je nog een leuke periode of project noemen?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Vertel over een ander leuk project of periode en je rol daarin..."
                  value={responses.leuk_project_en_rol || ''}
                  onChange={(e) => handleInputChange('leuk_project_en_rol', e.target.value)}
                  onBlur={(e) => handleInputBlur('leuk_project_en_rol', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Wanneer kom jij fluitend thuis?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Beschrijf een dag waarvan je fluitend thuiskwam van je werk..."
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
                onClick={() => navigate('/enthousiasme-stap-2')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Vorige
              </Button>
              <Button 
                onClick={() => navigate('/wensberoepen-intro')}
                className={`font-semibold px-8 ${
                  step3Complete
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!step3Complete}
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

export default EnthousiasmeStep3;
