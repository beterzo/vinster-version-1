
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import WensberoepenProgress from "@/components/WensberoepenProgress";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { useWebhookData } from "@/hooks/useWebhookData";
import { sendWebhookData } from "@/services/webhookService";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Info } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type WensberoepenResponse = Tables<"wensberoepen_responses">;

interface StepProps {
  mode?: 'edit' | 'view';
}

const WensberoepenStep3 = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { responses, saveResponse, isLoading } = useWensberoepenResponses();
  const { collectWebhookData } = useWebhookData();
  const isViewMode = mode === 'view';
  
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setJobTitle(responses.wensberoep_3_titel || "");
      setAnswers({
        question1: responses.wensberoep_3_werkweek_activiteiten || "",
        question2: responses.wensberoep_3_werklocatie_omgeving || "",
        question3: responses.wensberoep_3_samenwerking_contacten || "",
        question4: responses.wensberoep_3_fluitend_thuiskomen_dag || "",
        question5: responses.wensberoep_3_werk_doel || "",
        question6: responses.wensberoep_3_leukste_onderdelen || "",
        question7: responses.wensberoep_3_belangrijke_aspecten || "",
        question8: responses.wensberoep_3_kennis_focus || ""
      });
    }
  }, [isLoading, responses]);

  const handleJobTitleChange = (value: string) => {
    setJobTitle(value);
  };

  const handleJobTitleBlur = () => {
    console.log("Saving job title:", jobTitle);
    saveResponse("wensberoep_3_titel", jobTitle);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);
    const fieldMap: Record<string, keyof WensberoepenResponse> = {
      question1: "wensberoep_3_werkweek_activiteiten",
      question2: "wensberoep_3_werklocatie_omgeving",
      question3: "wensberoep_3_samenwerking_contacten",
      question4: "wensberoep_3_fluitend_thuiskomen_dag",
      question5: "wensberoep_3_werk_doel",
      question6: "wensberoep_3_leukste_onderdelen",
      question7: "wensberoep_3_belangrijke_aspecten",
      question8: "wensberoep_3_kennis_focus"
    };
    const dbField = fieldMap[field];
    if (dbField) {
      saveResponse(dbField, value);
    }
  };

  const handlePrevious = () => {
    scrollToTop();
    navigate('/wensberoepen-step-2');
  };

  // Comprehensive validation function that checks all wensberoepen with real-time state
  const isAllWensberoepenComplete = () => {
    if (!responses) return false;

    // Check current step 3 with local state (real-time)
    const step3Complete = jobTitle.trim() !== "" && Object.values(answers).every(answer => answer.trim() !== "");

    // Check step 1 from database (saved data)
    const step1Complete = [
      'wensberoep_1_titel',
      'wensberoep_1_werkweek_activiteiten',
      'wensberoep_1_werklocatie_omgeving',
      'wensberoep_1_samenwerking_contacten',
      'wensberoep_1_fluitend_thuiskomen_dag',
      'wensberoep_1_werk_doel',
      'wensberoep_1_leukste_onderdelen',
      'wensberoep_1_belangrijke_aspecten',
      'wensberoep_1_kennis_focus'
    ].every(field => {
      const value = responses[field as keyof typeof responses];
      return value && String(value).trim() !== '';
    });

    // Check step 2 from database (saved data)
    const step2Complete = [
      'wensberoep_2_titel',
      'wensberoep_2_werkweek_activiteiten',
      'wensberoep_2_werklocatie_omgeving',
      'wensberoep_2_samenwerking_contacten',
      'wensberoep_2_fluitend_thuiskomen_dag',
      'wensberoep_2_werk_doel',
      'wensberoep_2_leukste_onderdelen',
      'wensberoep_2_belangrijke_aspecten',
      'wensberoep_2_kennis_focus'
    ].every(field => {
      const value = responses[field as keyof typeof responses];
      return value && String(value).trim() !== '';
    });

    console.log('Validation status:', { step1Complete, step2Complete, step3Complete });
    return step1Complete && step2Complete && step3Complete;
  };

  const handleComplete = async () => {
    if (!isAllWensberoepenComplete()) {
      toast({
        title: t('common.toast.wensberoepen_incomplete'),
        description: t('common.toast.wensberoepen_incomplete_description'),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // First save current step 3 data to ensure everything is persisted
      await Promise.all([
        saveResponse("wensberoep_3_titel", jobTitle),
        ...Object.entries(answers).map(([key, value]) => {
          const fieldMap: Record<string, keyof WensberoepenResponse> = {
            question1: "wensberoep_3_werkweek_activiteiten",
            question2: "wensberoep_3_werklocatie_omgeving",
            question3: "wensberoep_3_samenwerking_contacten",
            question4: "wensberoep_3_fluitend_thuiskomen_dag",
            question5: "wensberoep_3_werk_doel",
            question6: "wensberoep_3_leukste_onderdelen",
            question7: "wensberoep_3_belangrijke_aspecten",
            question8: "wensberoep_3_kennis_focus"
          };
          const dbField = fieldMap[key];
          return dbField ? saveResponse(dbField, value) : Promise.resolve();
        })
      ]);
      
      // Wait a moment for the data to be saved
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if AI keywords already exist for this user
      let keywordsExist = false;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_lievelings_activiteiten')
          .eq('id', user.id)
          .maybeSingle();
        
        keywordsExist = !!profile?.ai_lievelings_activiteiten;
        console.log("Keywords already exist:", keywordsExist);
      }
      
      // Only call webhook if no keywords exist yet
      if (!keywordsExist) {
        const webhookData = collectWebhookData();
        if (!webhookData) {
          throw new Error("Could not collect webhook data - no user data available");
        }
        
        console.log("Sending webhook data:", webhookData);
        await sendWebhookData(webhookData);
        console.log("Wensberoepen scan completed and data sent to webhook!");
      } else {
        console.log("Skipping webhook call - keywords already exist");
      }
      
      toast({
        title: t('common.success'),
        description: t('common.toast.wensberoepen_completed'),
        variant: "default",
      });
      
      // Navigate to completion page
      navigate('/wensberoepen-voltooi');
      
    } catch (error) {
      console.error("Error completing wensberoepen scan:", error);
      
      // More specific error message based on the error
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: t('common.toast.completion_error'),
        description: `${t('common.toast.completion_error_description')} (${errorMessage})`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    t('journey.wensberoepen.step3.question1'),
    t('journey.wensberoepen.step3.question2'),
    t('journey.wensberoepen.step3.question3'),
    t('journey.wensberoepen.step3.question4'),
    t('journey.wensberoepen.step3.question5'),
    t('journey.wensberoepen.step3.question6'),
    t('journey.wensberoepen.step3.question7'),
    t('journey.wensberoepen.step3.question8')
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;
  }

  const canComplete = isAllWensberoepenComplete();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/c147164e-c781-4b5a-b3c0-9c74609566d8.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <LanguageSwitcher />
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
        
        <WensberoepenProgress currentStep={3} totalSteps={3} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {t('wensberoepen.step3.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('wensberoepen.step3.subtitle')}
              </p>
              {isSubmitting && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    📤 {t('wensberoepen.step3.sending_data')}
                  </p>
                </div>
              )}
            </div>

            {/* Job Title Input */}
            <div className="mb-8">
              <Label htmlFor="jobTitle" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                {t('wensberoepen.step3.job_title_label')}
              </Label>
              <Input 
                id="jobTitle" 
                placeholder={isViewMode ? "" : t('wensberoepen.step3.job_title_placeholder')} 
                value={jobTitle} 
                onChange={(e) => handleJobTitleChange(e.target.value)} 
                onBlur={!isViewMode ? handleJobTitleBlur : undefined}
                disabled={isViewMode}
                className={`text-lg border-gray-300 focus:border-blue-900 focus:ring-blue-900 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                }`}
              />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index}>
                  <Label htmlFor={`question${index + 1}`} className="text-blue-900 font-medium mb-3 block text-left">
                    {index + 1}. {question}
                  </Label>
                  <Textarea 
                    id={`question${index + 1}`} 
                    placeholder={isViewMode ? "" : t('wensberoepen.step3.answer_placeholder')} 
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

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={handlePrevious} 
                variant="outline" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50" 
                disabled={isSubmitting}
              >
                {t('wensberoepen.step3.previous_button')}
              </Button>
              <Button 
                onClick={handleComplete} 
                className={`font-semibold px-8 ${
                  canComplete 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`} 
                disabled={isSubmitting || !canComplete}
              >
                {isSubmitting ? t('wensberoepen.step3.finishing') : t('wensberoepen.step3.finish_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WensberoepenStep3;
