
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useTranslation } from "@/hooks/useTranslation";
import { Info } from "lucide-react";

interface StepProps {
  mode?: 'edit' | 'view';
}

const EnthousiasmeStep2 = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { responses, saveResponse, loading } = useEnthousiasmeResponses();
  const isViewMode = mode === 'view';
  
  const [answers, setAnswers] = useState({
    eerste_werk_leukste_taken: "",
    eerste_werk_werkomstandigheden: "",
    eerste_werk_onderwerpen: ""
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setAnswers({
        eerste_werk_leukste_taken: responses.eerste_werk_leukste_taken || "",
        eerste_werk_werkomstandigheden: responses.eerste_werk_werkomstandigheden || "",
        eerste_werk_onderwerpen: responses.eerste_werk_onderwerpen || ""
      });
    }
  }, [loading, responses]);

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
    navigate('/enthousiasme-step-1');
  };

  const handleNext = () => {
    scrollToTop();
    navigate('/enthousiasme-step-3');
  };

  const questions = [
    {
      field: "eerste_werk_leukste_taken",
      question: t('enthousiasme.step2.question1')
    },
    {
      field: "eerste_werk_werkomstandigheden", 
      question: t('enthousiasme.step2.question2')
    },
    {
      field: "eerste_werk_onderwerpen",
      question: t('enthousiasme.step2.question3')
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;
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
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {isViewMode && (
          <div className="mb-6">
            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 font-medium">
                    {t('common.view_only_mode.title')}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    {t('common.view_only_mode.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <EnthousiasmeProgress currentStep={2} totalSteps={3} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {t('enthousiasme.step2.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('enthousiasme.step2.subtitle')}
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
                    placeholder={isViewMode ? "" : t('enthousiasme.step2.placeholder')}
                    value={answers[item.field as keyof typeof answers]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    onBlur={(e) => !isViewMode && handleInputBlur(item.field, e.target.value)}
                    disabled={isViewMode}
                    className={`min-h-[100px] border-gray-300 focus:border-blue-900 focus:ring-blue-900 ${
                      isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                    }`}
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
                {t('enthousiasme.step2.previous_button')}
              </Button>
              <Button 
                onClick={handleNext}
                className={`font-semibold px-8 ${
                  isViewMode || allFieldsFilled 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isViewMode && !allFieldsFilled}
              >
                {isViewMode ? t('common.button.next') : t('enthousiasme.step2.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeStep2;
