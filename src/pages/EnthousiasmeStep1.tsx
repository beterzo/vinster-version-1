
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { Loader2 } from "lucide-react";

const EnthousiasmeStep1 = () => {
  const navigate = useNavigate();
  const { responses, loading, saving, saveResponse, updateLocalResponse } = useEnthousiasmeResponses();

  // Local validation for step 1 only
  const isStep1Complete = () => {
    const question1 = responses.kindertijd_liefste_activiteiten?.trim() || '';
    const question2 = responses.kindertijd_favoriete_plekken?.trim() || '';
    const question3 = responses.kindertijd_interesses?.trim() || '';
    
    return question1 !== '' && question2 !== '' && question3 !== '';
  };

  const handleInputChange = (field: 'kindertijd_liefste_activiteiten' | 'kindertijd_favoriete_plekken' | 'kindertijd_interesses', value: string) => {
    updateLocalResponse(field, value);
  };

  const handleInputBlur = (field: 'kindertijd_liefste_activiteiten' | 'kindertijd_favoriete_plekken' | 'kindertijd_interesses', value: string) => {
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

  const step1Complete = isStep1Complete();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={handleLogoClick}>
            <img 
              src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
              alt="Vinster Logo" 
              className="h-12 w-auto filter brightness-110 contrast-110" 
            />
            <span className="text-2xl font-bold tracking-wide" style={{ color: '#253857' }}>Vinster</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <EnthousiasmeProgress currentStep={1} totalSteps={4} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Jouw kindertijd & eerste schooltijd
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
                  Welke dingen deed je het liefst als kind?
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Beschrijf wat je het liefst deed als kind..."
                  value={responses.kindertijd_liefste_activiteiten || ''}
                  onChange={(e) => handleInputChange('kindertijd_liefste_activiteiten', e.target.value)}
                  onBlur={(e) => handleInputBlur('kindertijd_liefste_activiteiten', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Waar was je graag?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Vertel over de plekken waar je graag was..."
                  value={responses.kindertijd_favoriete_plekken || ''}
                  onChange={(e) => handleInputChange('kindertijd_favoriete_plekken', e.target.value)}
                  onBlur={(e) => handleInputBlur('kindertijd_favoriete_plekken', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                  Wat interesseerde jou?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Beschrijf wat je interesseerde als kind..."
                  value={responses.kindertijd_interesses || ''}
                  onChange={(e) => handleInputChange('kindertijd_interesses', e.target.value)}
                  onBlur={(e) => handleInputBlur('kindertijd_interesses', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={() => navigate('/enthousiasme-intro')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Terug naar intro
              </Button>
              <Button 
                onClick={() => navigate('/enthousiasme-stap-2')}
                className={`font-semibold px-8 ${
                  step1Complete
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!step1Complete}
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

export default EnthousiasmeStep1;
