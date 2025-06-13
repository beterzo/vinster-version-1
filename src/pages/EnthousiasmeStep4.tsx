import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";

const EnthousiasmeStep4 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    // Here you would typically save all the answers
    console.log("Scan completed!", answers);
    // For now, navigate back to home or show a completion message
    alert("Enthousiasme scan afgerond!");
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto" />
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
            </div>

            {/* Questions */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="question1" className="text-blue-900 font-medium text-lg mb-3 block">
                  Aan welke periode denk je met heel veel plezier terug? Wat deed je toen?
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Vertel over de periode waar je met veel plezier aan terugdenkt..."
                  value={answers.question1}
                  onChange={(e) => handleInputChange('question1', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block">
                  Kun je nog een leuke periode of project noemen? Wat was jouw rol?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Beschrijf een ander leuk project of periode en jouw rol daarin..."
                  value={answers.question2}
                  onChange={(e) => handleInputChange('question2', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wanneer kom jij fluitend thuis? Wat heb je dan meegemaakt op een dag?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Vertel over een dag waarna je fluitend thuiskwam..."
                  value={answers.question3}
                  onChange={(e) => handleInputChange('question3', e.target.value)}
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
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8"
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
