
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import WensberoepenProgress from "@/components/WensberoepenProgress";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { useTranslation } from "@/hooks/useTranslation";
import { Info } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type WensberoepenResponse = Tables<"wensberoepen_responses">;

interface StepProps {
  mode?: 'edit' | 'view';
}

const WensberoepenStep2 = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { responses, saveResponse, isLoading } = useWensberoepenResponses();
  const isViewMode = mode === 'view';
  
  const [jobTitle, setJobTitle] = useState("");
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: ""
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved data when responses change (only when data is loaded)
  useEffect(() => {
    if (!isLoading && responses) {
      console.log("Loading saved responses into form:", responses);
      setJobTitle(responses.wensberoep_2_titel || "");
      setAnswers({
        question1: responses.wensberoep_2_werkweek_activiteiten || "",
        question2: responses.wensberoep_2_werklocatie_omgeving || "",
        question3: responses.wensberoep_2_samenwerking_contacten || "",
        question4: responses.wensberoep_2_fluitend_thuiskomen_dag || "",
        question5: responses.wensberoep_2_werk_doel || "",
        question6: responses.wensberoep_2_leukste_onderdelen || "",
        question7: responses.wensberoep_2_belangrijke_aspecten || "",
        question8: responses.wensberoep_2_kennis_focus || ""
      });
    }
  }, [isLoading, responses]);

  const handleJobTitleChange = (value: string) => {
    setJobTitle(value);
  };

  const handleJobTitleBlur = () => {
    console.log("Saving job title:", jobTitle);
    saveResponse("wensberoep_2_titel", jobTitle);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);
    const fieldMap: Record<string, keyof WensberoepenResponse> = {
      question1: "wensberoep_2_werkweek_activiteiten",
      question2: "wensberoep_2_werklocatie_omgeving",
      question3: "wensberoep_2_samenwerking_contacten",
      question4: "wensberoep_2_fluitend_thuiskomen_dag",
      question5: "wensberoep_2_werk_doel",
      question6: "wensberoep_2_leukste_onderdelen",
      question7: "wensberoep_2_belangrijke_aspecten",
      question8: "wensberoep_2_kennis_focus"
    };
    const dbField = fieldMap[field];
    if (dbField) {
      saveResponse(dbField, value);
    }
  };

  const handlePrevious = () => {
    scrollToTop();
    navigate('/wensberoepen-step-1');
  };

  const handleNext = () => {
    scrollToTop();
    navigate('/wensberoepen-step-3');
  };

  const questions = [
    t('wensberoepen.step2.question1'),
    t('wensberoepen.step2.question2'),
    t('wensberoepen.step2.question3'),
    t('wensberoepen.step2.question4'),
    t('wensberoepen.step2.question5'),
    t('wensberoepen.step2.question6'),
    t('wensberoepen.step2.question7'),
    t('wensberoepen.step2.question8')
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;
  }

  // Real-time validation based on current state
  const step2Complete = jobTitle.trim() !== "" && Object.values(answers).every(answer => answer.trim() !== "");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/4e0bbda6-9e6f-4c55-8880-b6656d264794.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
          </div>
        </div>
      </div>

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
        
        <WensberoepenProgress currentStep={2} totalSteps={3} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {t('wensberoepen.step2.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('wensberoepen.step2.subtitle')}
              </p>
            </div>

            <div className="mb-8">
              <Label htmlFor="jobTitle" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                {t('wensberoepen.step2.job_title_label')}
              </Label>
              <Input 
                id="jobTitle" 
                placeholder={isViewMode ? "" : t('wensberoepen.step2.job_title_placeholder')}
                value={jobTitle} 
                onChange={(e) => handleJobTitleChange(e.target.value)} 
                onBlur={!isViewMode ? handleJobTitleBlur : undefined}
                disabled={isViewMode}
                className={`text-lg border-gray-300 focus:border-blue-900 focus:ring-blue-900 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                }`}
              />
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index}>
                  <Label htmlFor={`question${index + 1}`} className="text-blue-900 font-medium mb-3 block text-left">
                    {index + 1}. {question}
                  </Label>
                  <Textarea 
                    id={`question${index + 1}`} 
                    placeholder={isViewMode ? "" : t('wensberoepen.step2.answer_placeholder')}
                    value={answers[`question${index + 1}` as keyof typeof answers]} 
                    onChange={(e) => handleInputChange(`question${index + 1}`, e.target.value)} 
                    onBlur={(e) => !isViewMode && handleInputBlur(`question${index + 1}`, e.target.value)}
                    disabled={isViewMode}
                    className={`min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900 ${
                      isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-12">
              <Button 
                onClick={handlePrevious} 
                variant="outline" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                {t('wensberoepen.step2.previous_button')}
              </Button>
              <Button 
                onClick={handleNext} 
                className={`font-semibold px-8 ${
                  isViewMode || step2Complete 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`} 
                disabled={!isViewMode && !step2Complete}
              >
                {isViewMode ? t('common.button.next') : t('wensberoepen.step2.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WensberoepenStep2;
