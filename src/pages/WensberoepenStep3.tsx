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
import type { Tables } from "@/integrations/supabase/types";
type WensberoepenResponse = Tables<"wensberoepen_responses">;
const WensberoepenStep3 = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    t
  } = useTranslation();
  const {
    responses,
    getFieldValue,
    saveResponse,
    isLoading
  } = useWensberoepenResponses();
  const {
    collectWebhookData
  } = useWebhookData();
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedJobTitle, setLastSavedJobTitle] = useState("");
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
  const [lastSavedAnswers, setLastSavedAnswers] = useState({
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Comprehensive validation function that checks all wensberoepen
  const isAllWensberoepenComplete = () => {
    if (!responses) return false;

    // Check current step 3 with local state (includes unsaved changes)
    const step3JobTitle = jobTitle.trim() || responses.wensberoep_3_titel?.trim() || '';
    const step3Complete = step3JobTitle !== '' && Object.values(answers).every(answer => answer.trim() !== "");

    // Check step 1 from database
    const step1Complete = ['wensberoep_1_titel', 'wensberoep_1_werkweek_activiteiten', 'wensberoep_1_werklocatie_omgeving', 'wensberoep_1_samenwerking_contacten', 'wensberoep_1_fluitend_thuiskomen_dag', 'wensberoep_1_werk_doel', 'wensberoep_1_leukste_onderdelen', 'wensberoep_1_belangrijke_aspecten', 'wensberoep_1_kennis_focus'].every(field => {
      const value = responses[field as keyof typeof responses];
      return value && String(value).trim() !== '';
    });

    // Check step 2 from database
    const step2Complete = ['wensberoep_2_titel', 'wensberoep_2_werkweek_activiteiten', 'wensberoep_2_werklocatie_omgeving', 'wensberoep_2_samenwerking_contacten', 'wensberoep_2_fluitend_thuiskomen_dag', 'wensberoep_2_werk_doel', 'wensberoep_2_leukste_onderdelen', 'wensberoep_2_belangrijke_aspecten', 'wensberoep_2_kennis_focus'].every(field => {
      const value = responses[field as keyof typeof responses];
      return value && String(value).trim() !== '';
    });
    console.log('Validation status:', {
      step1Complete,
      step2Complete,
      step3Complete
    });
    return step1Complete && step2Complete && step3Complete;
  };

  // Load saved data when responses change (only when data is loaded)
  useEffect(() => {
    if (!isLoading && responses) {
      console.log("Loading saved responses into form:", responses);
      const savedJobTitle = responses.wensberoep_3_titel || "";
      const savedAnswers = {
        question1: responses.wensberoep_3_werkweek_activiteiten || "",
        question2: responses.wensberoep_3_werklocatie_omgeving || "",
        question3: responses.wensberoep_3_samenwerking_contacten || "",
        question4: responses.wensberoep_3_fluitend_thuiskomen_dag || "",
        question5: responses.wensberoep_3_werk_doel || "",
        question6: responses.wensberoep_3_leukste_onderdelen || "",
        question7: responses.wensberoep_3_belangrijke_aspecten || "",
        question8: responses.wensberoep_3_kennis_focus || ""
      };
      setJobTitle(savedJobTitle);
      setLastSavedJobTitle(savedJobTitle);
      setAnswers(savedAnswers);
      setLastSavedAnswers(savedAnswers);
    }
  }, [isLoading, responses]);

  // Auto-save job title when it changes
  useEffect(() => {
    if (jobTitle !== lastSavedJobTitle && jobTitle.trim() !== "") {
      const timeoutId = setTimeout(() => {
        console.log("Auto-saving job title:", jobTitle);
        saveResponse("wensberoep_3_titel", jobTitle);
        setLastSavedJobTitle(jobTitle);
      }, 1000); // Save after 1 second of no typing

      return () => clearTimeout(timeoutId);
    }
  }, [jobTitle, lastSavedJobTitle, saveResponse]);
  const handleJobTitleChange = (value: string) => {
    setJobTitle(value);
  };
  const handleJobTitleBlur = () => {
    if (jobTitle !== lastSavedJobTitle) {
      console.log("Saving job title on blur:", jobTitle);
      saveResponse("wensberoep_3_titel", jobTitle);
      setLastSavedJobTitle(jobTitle);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-save after 1 second if not empty
    if (value.trim() !== "") {
      setTimeout(() => {
        handleInputBlur(field, value);
      }, 1000);
    }
  };
  const handleInputBlur = (field: string, value: string) => {
    const currentSavedValue = lastSavedAnswers[field as keyof typeof lastSavedAnswers];
    if (value !== currentSavedValue) {
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
        setLastSavedAnswers(prev => ({
          ...prev,
          [field]: value
        }));
      }
    }
  };
  const handlePrevious = () => {
    scrollToTop();
    navigate('/wensberoepen-step-2');
  };
  const handleComplete = async () => {
    if (!isAllWensberoepenComplete()) {
      toast({
        title: "Wensberoepen scan niet compleet",
        description: "Vul alle wensberoepen velden in voordat je de scan afrondt.",
        variant: "destructive"
      });
      return;
    }
    try {
      setIsSubmitting(true);

      // Collect all data for webhook (now includes language)
      const webhookData = collectWebhookData();
      if (!webhookData) {
        toast({
          title: "Fout",
          description: "Kan geen gebruikersgegevens vinden voor het verzenden van data.",
          variant: "destructive"
        });
        return;
      }

      // Send data to webhook
      await sendWebhookData(webhookData);
      console.log("Wensberoepen scan completed and data sent to webhook!");
      toast({
        title: "Gelukt!",
        description: "Je wensberoepen scan is succesvol afgerond en de gegevens zijn verzonden.",
        variant: "default"
      });
      navigate('/wensberoepen-voltooi');
    } catch (error) {
      console.error("Error completing wensberoepen scan:", error);
      toast({
        title: "Fout bij afronden",
        description: "Er ging iets mis bij het afronden van je scan. Probeer het opnieuw.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const questions = ["Wat doe je in een werkweek? Antwoord in werkwoorden en activiteiten.", "Waar doe je je werk? Beschrijf de omgeving, het gebouw, de ruimte ....", "Werk je meer samen of meer alleen? Met wat voor mensen heb je contact?", "Wat heb je gedaan op een dag dat je fluitend thuiskomt?", "Wat is je doel met dit werk?", "Welke onderdelen uit je werk zijn het leukst?", "Wat is voor jou belangrijk in dit werk?", "Waar gaat het vooral over in jouw werk? Waar moet je veel van weten?"];
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;
  }
  const canComplete = isAllWensberoepenComplete();
  return <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img alt="Vinster Logo" onClick={() => navigate('/home')} src="/lovable-uploads/c147164e-c781-4b5a-b3c0-9c74609566d8.png" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
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
              {isSubmitting && <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    📤 {t('wensberoepen.step3.sending_data')}
                  </p>
                </div>}
            </div>

            {/* Job Title Input */}
            <div className="mb-8">
              <Label htmlFor="jobTitle" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                {t('wensberoepen.step3.job_title_label')}
              </Label>
              <Input id="jobTitle" placeholder={t('wensberoepen.step3.job_title_placeholder')} value={jobTitle} onChange={e => handleJobTitleChange(e.target.value)} onBlur={handleJobTitleBlur} className="text-lg border-gray-300 focus:border-blue-900 focus:ring-blue-900" />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((question, index) => <div key={index}>
                  <Label htmlFor={`question${index + 1}`} className="text-blue-900 font-medium mb-3 block text-left">
                    {index + 1}. {question}
                  </Label>
                  <Textarea id={`question${index + 1}`} placeholder={t('wensberoepen.step3.answer_placeholder')} value={answers[`question${index + 1}` as keyof typeof answers]} onChange={e => handleInputChange(`question${index + 1}`, e.target.value)} onBlur={e => handleInputBlur(`question${index + 1}`, e.target.value)} className="min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900" />
                </div>)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button onClick={handlePrevious} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50" disabled={isSubmitting}>
                {t('wensberoepen.step3.previous_button')}
              </Button>
              <Button onClick={handleComplete} className={`font-semibold px-8 ${canComplete ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} disabled={isSubmitting || !canComplete}>
                {isSubmitting ? t('wensberoepen.step3.finishing') : t('wensberoepen.step3.finish_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default WensberoepenStep3;