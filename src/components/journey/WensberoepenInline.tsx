import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WensberoepenProgress from "@/components/WensberoepenProgress";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { SubStep } from "@/types/journey";
import KeywordsConfirmDialog from "./KeywordsConfirmDialog";
import type { Tables } from "@/integrations/supabase/types";

type WensberoepenResponse = Tables<"wensberoepen_responses">;

interface WensberoepenInlineProps {
  roundId: string;
  subStep: SubStep;
  onNext: () => void;
  onPrevious: () => void;
  onNavigateToPersoonsprofiel: () => void;
}

const WensberoepenInline = ({ roundId, subStep, onNext, onPrevious, onNavigateToPersoonsprofiel }: WensberoepenInlineProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { responses, saveResponse, isLoading } = useWensberoepenResponses(roundId);
  const { generateAiKeywords, hasAiKeywords } = usePrioriteitenResponses(roundId);
  
  const [showKeywordsDialog, setShowKeywordsDialog] = useState(false);

  const [jobTitles, setJobTitles] = useState(["", "", ""]);
  const [allAnswers, setAllAnswers] = useState<Record<string, Record<string, string>>>({
    step1: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "", q8: "" },
    step2: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "", q8: "" },
    step3: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "", q8: "" }
  });

  useEffect(() => {
    if (!isLoading && responses) {
      setJobTitles([
        responses.wensberoep_1_titel || "",
        responses.wensberoep_2_titel || "",
        responses.wensberoep_3_titel || ""
      ]);
      setAllAnswers({
        step1: {
          q1: responses.wensberoep_1_werkweek_activiteiten || "",
          q2: responses.wensberoep_1_werklocatie_omgeving || "",
          q3: responses.wensberoep_1_samenwerking_contacten || "",
          q4: responses.wensberoep_1_fluitend_thuiskomen_dag || "",
          q5: responses.wensberoep_1_werk_doel || "",
          q6: responses.wensberoep_1_leukste_onderdelen || "",
          q7: responses.wensberoep_1_belangrijke_aspecten || "",
          q8: responses.wensberoep_1_kennis_focus || ""
        },
        step2: {
          q1: responses.wensberoep_2_werkweek_activiteiten || "",
          q2: responses.wensberoep_2_werklocatie_omgeving || "",
          q3: responses.wensberoep_2_samenwerking_contacten || "",
          q4: responses.wensberoep_2_fluitend_thuiskomen_dag || "",
          q5: responses.wensberoep_2_werk_doel || "",
          q6: responses.wensberoep_2_leukste_onderdelen || "",
          q7: responses.wensberoep_2_belangrijke_aspecten || "",
          q8: responses.wensberoep_2_kennis_focus || ""
        },
        step3: {
          q1: responses.wensberoep_3_werkweek_activiteiten || "",
          q2: responses.wensberoep_3_werklocatie_omgeving || "",
          q3: responses.wensberoep_3_samenwerking_contacten || "",
          q4: responses.wensberoep_3_fluitend_thuiskomen_dag || "",
          q5: responses.wensberoep_3_werk_doel || "",
          q6: responses.wensberoep_3_leukste_onderdelen || "",
          q7: responses.wensberoep_3_belangrijke_aspecten || "",
          q8: responses.wensberoep_3_kennis_focus || ""
        }
      });
    }
  }, [isLoading, responses]);

  const getStepNumber = () => {
    if (subStep === 'step1') return 1;
    if (subStep === 'step2') return 2;
    if (subStep === 'step3') return 3;
    return 1;
  };

  const getFieldPrefix = () => {
    const stepNum = getStepNumber();
    return `wensberoep_${stepNum}`;
  };

  const getFieldMap = (): Record<string, keyof WensberoepenResponse> => {
    const prefix = getFieldPrefix();
    return {
      title: `${prefix}_titel` as keyof WensberoepenResponse,
      q1: `${prefix}_werkweek_activiteiten` as keyof WensberoepenResponse,
      q2: `${prefix}_werklocatie_omgeving` as keyof WensberoepenResponse,
      q3: `${prefix}_samenwerking_contacten` as keyof WensberoepenResponse,
      q4: `${prefix}_fluitend_thuiskomen_dag` as keyof WensberoepenResponse,
      q5: `${prefix}_werk_doel` as keyof WensberoepenResponse,
      q6: `${prefix}_leukste_onderdelen` as keyof WensberoepenResponse,
      q7: `${prefix}_belangrijke_aspecten` as keyof WensberoepenResponse,
      q8: `${prefix}_kennis_focus` as keyof WensberoepenResponse
    };
  };

  const handleJobTitleBlur = () => {
    const stepNum = getStepNumber();
    const fieldMap = getFieldMap();
    saveResponse(fieldMap.title, jobTitles[stepNum - 1]);
  };

  const handleInputBlur = (qKey: string, value: string) => {
    const fieldMap = getFieldMap();
    const dbField = fieldMap[qKey];
    if (dbField) {
      saveResponse(dbField, value);
    }
  };

  // Handler for step3 completion - open keywords dialog
  const handleStep3Complete = () => {
    setShowKeywordsDialog(true);
  };

  // Handler for generating keywords and navigating to persoonsprofiel
  const handleGenerateKeywords = async () => {
    // Check if keywords already exist for this round
    if (!hasAiKeywords()) {
      const language = user?.user_metadata?.language || 'nl';
      await generateAiKeywords(language);
    }
    setShowKeywordsDialog(false);
    onNavigateToPersoonsprofiel();
  };

  // Handler for adjusting answers - go back to welkom/overview
  const handleAdjustAnswers = () => {
    setShowKeywordsDialog(false);
    onPrevious();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-12">{t('common.loading')}</div>;
  }

  // Intro page
  if (subStep === 'intro') {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold text-[#232D4B] mb-8 text-center">
            {t('wensberoepen.intro.title')}
          </h1>
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-[#232D4B] mb-4">
              {t('wensberoepen.intro.instruction_title')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('wensberoepen.intro.instruction_description')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('wensberoepen.intro.instruction_details')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('wensberoepen.intro.instruction_questions')}
            </p>
          </div>
          <div className="flex justify-center pt-8">
            <Button 
              onClick={onNext}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-4 rounded-lg"
            >
              {t('wensberoepen.intro.start_button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step pages
  const stepNum = getStepNumber();
  const stepKey = `step${stepNum}`;
  const answers = allAnswers[stepKey] || {};
  const jobTitle = jobTitles[stepNum - 1] || "";

  const questions = [
    t('wensberoepen.step1.question1'),
    t('wensberoepen.step1.question2'),
    t('wensberoepen.step1.question3'),
    t('wensberoepen.step1.question4'),
    t('wensberoepen.step1.question5'),
    t('wensberoepen.step1.question6'),
    t('wensberoepen.step1.question7'),
    t('wensberoepen.step1.question8')
  ];

  const allFieldsFilled = jobTitle.trim() !== "" && 
    Object.values(answers).every(answer => answer.trim() !== "");

  return (
    <div className="space-y-6">
      <WensberoepenProgress currentStep={stepNum} totalSteps={3} />
      
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t(`wensberoepen.step${stepNum}.title`)}
            </h1>
            <p className="text-xl text-gray-600">
              {t('wensberoepen.step1.subtitle')}
            </p>
          </div>

          <div className="mb-8">
            <Label htmlFor="jobTitle" className="text-[#232D4B] font-medium text-lg mb-3 block text-left">
              {t('wensberoepen.step1.job_title_label')}
            </Label>
            <Input 
              id="jobTitle" 
              placeholder={t('wensberoepen.step1.job_title_placeholder')}
              value={jobTitle} 
              onChange={(e) => {
                const newTitles = [...jobTitles];
                newTitles[stepNum - 1] = e.target.value;
                setJobTitles(newTitles);
              }} 
              onBlur={handleJobTitleBlur}
              className="text-lg border-gray-300 focus:border-[#232D4B] focus:ring-[#232D4B]"
            />
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const qKey = `q${index + 1}`;
              return (
                <div key={index}>
                  <Label htmlFor={qKey} className="text-[#232D4B] font-medium mb-3 block text-left">
                    {index + 1}. {question}
                  </Label>
                  <Textarea 
                    id={qKey} 
                    placeholder={t('wensberoepen.step1.answer_placeholder')}
                    value={answers[qKey] || ""} 
                    onChange={(e) => {
                      setAllAnswers(prev => ({
                        ...prev,
                        [stepKey]: { ...prev[stepKey], [qKey]: e.target.value }
                      }));
                    }} 
                    onBlur={(e) => handleInputBlur(qKey, e.target.value)}
                    className="min-h-[80px] border-gray-300 focus:border-[#232D4B] focus:ring-[#232D4B]"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-12">
            <Button 
              onClick={onPrevious} 
              variant="outline" 
              className="border-[#232D4B] text-[#232D4B] hover:bg-blue-50"
            >
              {t('common.button.previous')}
            </Button>
            <Button 
              onClick={stepNum === 3 ? handleStep3Complete : onNext} 
              className={`font-semibold px-8 ${
                allFieldsFilled 
                  ? "bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B]" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`} 
              disabled={!allFieldsFilled}
            >
              {stepNum === 3 ? t('wensberoepen.step3.finish_button') : t('common.button.next')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <KeywordsConfirmDialog
        open={showKeywordsDialog}
        onOpenChange={setShowKeywordsDialog}
        onConfirm={handleGenerateKeywords}
        onAdjust={handleAdjustAnswers}
      />
    </div>
  );
};

export default WensberoepenInline;
