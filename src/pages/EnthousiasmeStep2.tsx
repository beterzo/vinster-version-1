
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";

const EnthousiasmeStep2 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
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
        <EnthousiasmeProgress currentStep={2} totalSteps={4} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Jouw tienertijd & school
              </h1>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="question1" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wat interesseerde jou het meest op school?
                </Label>
                <Textarea
                  id="question1"
                  placeholder="Vertel over wat je het meest interesseerde op school..."
                  value={answers.question1}
                  onChange={(e) => handleInputChange('question1', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question2" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wat deed je zodra je thuis kwam?
                </Label>
                <Textarea
                  id="question2"
                  placeholder="Beschrijf wat je deed als je thuiskwam van school..."
                  value={answers.question2}
                  onChange={(e) => handleInputChange('question2', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div>
                <Label htmlFor="question3" className="text-blue-900 font-medium text-lg mb-3 block">
                  Wat deed je naast school?
                </Label>
                <Textarea
                  id="question3"
                  placeholder="Vertel over je activiteiten naast school..."
                  value={answers.question3}
                  onChange={(e) => handleInputChange('question3', e.target.value)}
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

export default EnthousiasmeStep2;
