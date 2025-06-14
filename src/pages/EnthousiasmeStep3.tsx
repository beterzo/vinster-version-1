
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

  const handleInputChange = (field: 'step3_q1' | 'step3_q2' | 'step3_q3', value: string) => {
    updateLocalResponse(field, value);
  };

  const handleInputBlur = (field: 'step3_q1' | 'step3_q2' | 'step3_q3', value: string) => {
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
        <EnthousiasmeProgress currentStep={3} totalSteps={4} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Je eerste werkervaring
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
                <Label htmlFor="question1" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wat vond je het leukst in je werk? (dat kan ook in een bijbaantje zijn)
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Beschrijf wat je het leukst vond in je eerste werkervaring..."
                  value={responses.step3_q1 || ''}
                  onChange={(e) => handleInputChange('step3_q1', e.target.value)}
                  onBlur={(e) => handleInputBlur('step3_q1', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wat sprak/spreekt je aan in de werkomgeving?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Vertel wat je aantrekkelijk vond aan de werkomgeving..."
                  value={responses.step3_q2 || ''}
                  onChange={(e) => handleInputChange('step3_q2', e.target.value)}
                  onBlur={(e) => handleInputBlur('step3_q2', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wat vond/vind je fijn in samenwerken?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Beschrijf wat je fijn vindt aan samenwerken..."
                  value={responses.step3_q3 || ''}
                  onChange={(e) => handleInputChange('step3_q3', e.target.value)}
                  onBlur={(e) => handleInputBlur('step3_q3', e.target.value)}
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
                onClick={() => navigate('/enthousiasme-stap-4')}
                className="bg-blue-900 hover:bg-blue-800 text-white"
              >
                Volgende
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeStep3;
