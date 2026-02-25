
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

const EnthousiasmeStep1 = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { responses, saveResponse, loading } = useEnthousiasmeResponses();
  const isViewMode = mode === 'view';
  
  const [answers, setAnswers] = useState({
    kindertijd_activiteiten: "",
    kindertijd_plekken: "",
    kindertijd_interesses_nieuw: ""
  });

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  useEffect(() => {
    if (!loading && responses) {
      setAnswers({
        kindertijd_activiteiten: responses.kindertijd_activiteiten || "",
        kindertijd_plekken: responses.kindertijd_plekken || "",
        kindertijd_interesses_nieuw: responses.kindertijd_interesses_nieuw || ""
      });
    }
  }, [loading, responses]);

  const handleInputChange = (field: string, value: string) => { setAnswers(prev => ({ ...prev, [field]: value })); };
  const handleInputBlur = (field: string, value: string) => { if (!isViewMode) saveResponse(field as keyof typeof responses, value); };
  const handleBackToIntro = () => { scrollToTop(); navigate('/enthousiasme-intro'); };
  const handleNext = () => { scrollToTop(); navigate('/enthousiasme-step-2'); };

  const questions = [
    { field: "kindertijd_activiteiten", question: t('enthousiasme.step1.question1') },
    { field: "kindertijd_plekken", question: t('enthousiasme.step1.question2') },
    { field: "kindertijd_interesses_nieuw", question: t('enthousiasme.step1.question3') }
  ];

  if (loading) return <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">{t('common.loading')}</div>;

  const allFieldsFilled = Object.values(answers).every(answer => answer.trim() !== "");

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img alt="Vinster Logo" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/home')} src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" />
          </div>
        </div>
      </div>

      {isViewMode && (
        <div className="max-w-[1440px] mx-auto px-6 pt-6">
          <div className="bg-[#FEF9E6] border-l-4 border-[#F5C518] rounded-r-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#232D4B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#232D4B] font-medium">{t('common.view_only_mode.title')}</p>
                <p className="text-[#232D4B]/70 text-sm mt-1">{t('common.view_only_mode.description')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <EnthousiasmeProgress currentStep={1} totalSteps={3} />
        
        <Card className="rounded-3xl shadow-card">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-[#232D4B] mb-2">{t('enthousiasme.step1.title')}</h1>
              <p className="text-xl text-gray-600">{t('enthousiasme.step1.subtitle')}</p>
            </div>

            <div className="space-y-8">
              {questions.map((item, index) => (
                <div key={index}>
                  <Label htmlFor={item.field} className="text-[#232D4B] font-semibold text-base mb-3 block text-left border-l-2 border-[#F5C518] pl-3">
                    {index + 1}. {item.question}
                  </Label>
                  <Textarea
                    id={item.field}
                    placeholder={isViewMode ? "" : t('enthousiasme.step1.placeholder')}
                    value={answers[item.field as keyof typeof answers]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    onBlur={(e) => handleInputBlur(item.field, e.target.value)}
                    disabled={isViewMode}
                    className={`min-h-[100px] ${isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-12">
              <Button onClick={handleBackToIntro} variant="outline" className="border-[#232D4B] text-[#232D4B] hover:bg-gray-50 h-12">
                {t('enthousiasme.step1.back_button')}
              </Button>
              <Button 
                onClick={handleNext}
                className={`font-semibold px-8 h-12 ${
                  isViewMode || allFieldsFilled ? "bg-[#232D4B] hover:bg-[#1a2350] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!isViewMode && !allFieldsFilled}
              >
                {isViewMode ? t('common.button.next') : t('enthousiasme.step1.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnthousiasmeStep1;
