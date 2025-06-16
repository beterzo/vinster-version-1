
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { Loader2 } from "lucide-react";

const EnthousiasmeStep2 = () => {
  const navigate = useNavigate();
  const { responses, loading, saving, saveResponse, updateLocalResponse } = useEnthousiasmeResponses();

  // Local validation for step 2 only
  const isStep2Complete = () => {
    const question1 = responses.school_interessantste_vakken?.trim() || '';
    const question2 = responses.school_thuiskomst_activiteiten?.trim() || '';
    const question3 = responses.school_naschoolse_activiteiten?.trim() || '';
    
    return question1 !== '' && question2 !== '' && question3 !== '';
  };

  const handleInputChange = (field: 'school_interessantste_vakken' | 'school_thuiskomst_activiteiten' | 'school_naschoolse_activiteiten', value: string) => {
    updateLocalResponse(field, value);
  };

  const handleInputBlur = (field: 'school_interessantste_vakken' | 'school_thuiskomst_activiteiten' | 'school_naschoolse_activiteiten', value: string) => {
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

  const step2Complete = isStep2Complete();

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
        <EnthousiasmeProgress currentStep={2} totalSteps={4} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Jouw tienertijd & school
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
                  Wat interesseerde jou het meest op school?
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Vertel over wat je het meest interesseerde op school..."
                  value={responses.school_interessantste_vakken || ''}
                  onChange={(e) => handleInputChange('school_interessantste_vakken', e.target.value)}
                  onBlur={(e) => handleInputBlur('school_interessantste_vakken', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Wat deed je zodra je thuis kwam?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Beschrijf wat je deed als je thuiskwam van school..."
                  value={responses.school_thuiskomst_activiteiten || ''}
                  onChange={(e) => handleInputChange('school_thuiskomst_activiteiten', e.target.value)}
                  onBlur={(e) => handleInputBlur('school_thuiskomst_activiteiten', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Wat deed je naast school?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Vertel over je activiteiten naast school..."
                  value={responses.school_naschoolse_activiteiten || ''}
                  onChange={(e) => handleInputChange('school_naschoolse_activiteiten', e.target.value)}
                  onBlur={(e) => handleInputBlur('school_naschoolse_activiteiten', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={() => navigate('/enthousiasme-stap-1')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Vorige
              </Button>
              <Button 
                onClick={() => navigate('/enthousiasme-stap-3')}
                className={`font-semibold px-8 ${
                  step2Complete
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!step2Complete}
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

export default EnthousiasmeStep2;
