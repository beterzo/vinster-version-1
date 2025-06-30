
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";

const EnthousiasmeStep3 = () => {
  const navigate = useNavigate();
  const { responses, saveResponse, isLoading } = useEnthousiasmeResponses();
  
  const [answers, setAnswers] = useState({
    plezierige_werkperiode_beschrijving: "",
    leuk_project_en_rol: "",
    fluitend_thuiskomen_dag: ""
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved data when responses change
  useEffect(() => {
    if (!isLoading && responses) {
      console.log("Loading saved responses into form:", responses);
      setAnswers({
        plezierige_werkperiode_beschrijving: responses.plezierige_werkperiode_beschrijving || "",
        leuk_project_en_rol: responses.leuk_project_en_rol || "",
        fluitend_thuiskomen_dag: responses.fluitend_thuiskomen_dag || ""
      });
    }
  }, [isLoading, responses]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);
    saveResponse(field as keyof typeof responses, value);
  };

  const handlePrevious = () => {
    scrollToTop();
    navigate('/enthousiasme-step-2');
  };

  const handleComplete = () => {
    scrollToTop();
    navigate('/prioriteiten-activiteiten');
  };

  const questions = [
    {
      field: "plezierige_werkperiode_beschrijving",
      question: "Beschrijf de meest plezierige werkperiode in je loopbaan. Wat maakte het zo leuk?"
    },
    {
      field: "leuk_project_en_rol", 
      question: "Denk aan het leukste project waar je aan hebt gewerkt. Wat was je rol daarin?"
    },
    {
      field: "fluitend_thuiskomen_dag",
      question: "Beschrijf een dag waarop je fluitend thuiskwam van je werk. Wat was er die dag zo bijzonder?"
    }
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  const allFieldsFilled = Object.values(answers).every(answer => answer.trim() !== "");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
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
                Enthousiasme - Stap 3
              </h1>
              <p className="text-xl text-gray-600">
                Vragen over plezierige werkervaringen
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {questions.map((item, index) => (
                <div key={index}>
                  <Label htmlFor={item.field} className="text-blue-900 font-medium text-lg mb-3 block text-left">
                    {index + 1}. {item.question}
                  </Label>
                  <Textarea
                    id={item.field}
                    placeholder="Beschrijf hier je antwoord..."
                    value={answers[item.field as keyof typeof answers]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    onBlur={(e) => handleInputBlur(item.field, e.target.value)}
                    className="min-h-[100px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={handlePrevious}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Vorige stap
              </Button>
              <Button 
                onClick={handleComplete}
                className={`font-semibold px-8 ${
                  allFieldsFilled
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!allFieldsFilled}
              >
                Enthousiasme voltooien
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeStep3;
