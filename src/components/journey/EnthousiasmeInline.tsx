import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import EnthousiasmeProgress from "@/components/EnthousiasmeProgress";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useTranslation } from "@/hooks/useTranslation";
import { SubStep } from "@/types/journey";
import WelkomInline from "./WelkomInline";

interface EnthousiasmeInlineProps {
  subStep: SubStep;
  onNext: () => void;
  onPrevious: () => void;
}

const EnthousiasmeInline = ({ subStep, onNext, onPrevious }: EnthousiasmeInlineProps) => {
  const { t } = useTranslation();
  const { responses, saveResponse, loading } = useEnthousiasmeResponses();

  const [step1Answers, setStep1Answers] = useState({
    kindertijd_activiteiten: "",
    kindertijd_plekken: "",
    kindertijd_interesses_nieuw: ""
  });

  const [step2Answers, setStep2Answers] = useState({
    eerste_werk_leukste_taken: "",
    eerste_werk_werkomstandigheden: "",
    eerste_werk_onderwerpen: ""
  });

  const [step3Answers, setStep3Answers] = useState({
    plezierige_werkperiode_beschrijving: "",
    leuk_project_en_rol: "",
    fluitend_thuiskomen_dag: ""
  });

  useEffect(() => {
    if (!loading && responses) {
      setStep1Answers({
        kindertijd_activiteiten: responses.kindertijd_activiteiten || "",
        kindertijd_plekken: responses.kindertijd_plekken || "",
        kindertijd_interesses_nieuw: responses.kindertijd_interesses_nieuw || ""
      });
      setStep2Answers({
        eerste_werk_leukste_taken: responses.eerste_werk_leukste_taken || "",
        eerste_werk_werkomstandigheden: responses.eerste_werk_werkomstandigheden || "",
        eerste_werk_onderwerpen: responses.eerste_werk_onderwerpen || ""
      });
      setStep3Answers({
        plezierige_werkperiode_beschrijving: responses.plezierige_werkperiode_beschrijving || "",
        leuk_project_en_rol: responses.leuk_project_en_rol || "",
        fluitend_thuiskomen_dag: responses.fluitend_thuiskomen_dag || ""
      });
    }
  }, [loading, responses]);

  const handleInputBlur = (field: string, value: string) => {
    saveResponse(field as keyof typeof responses, value);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12">{t('common.loading')}</div>;
  }

  // Welcome page
  if (subStep === 'welkom') {
    return <WelkomInline onNext={onNext} />;
  }

  // Intro page
  if (subStep === 'intro') {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold text-[#232D4B] mb-8 text-center">
            {t('enthousiasme.intro.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            {t('enthousiasme.intro.subtitle')}
          </p>
          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('enthousiasme.intro.description')}
            </p>
            <h2 className="text-2xl font-semibold text-[#232D4B] mb-4">
              {t('enthousiasme.intro.how_it_works_title')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('enthousiasme.intro.how_it_works_description')}
            </p>
          </div>
          <div className="flex justify-center pt-8">
            <Button 
              onClick={onNext}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-4 rounded-lg"
            >
              {t('enthousiasme.intro.start_button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step pages
  const getCurrentStepNumber = () => {
    if (subStep === 'step1') return 1;
    if (subStep === 'step2') return 2;
    if (subStep === 'step3') return 3;
    return 1;
  };

  const getCurrentAnswers = () => {
    if (subStep === 'step1') return step1Answers;
    if (subStep === 'step2') return step2Answers;
    if (subStep === 'step3') return step3Answers;
    return step1Answers;
  };

  const setCurrentAnswers = (field: string, value: string) => {
    if (subStep === 'step1') {
      setStep1Answers(prev => ({ ...prev, [field]: value }));
    } else if (subStep === 'step2') {
      setStep2Answers(prev => ({ ...prev, [field]: value }));
    } else if (subStep === 'step3') {
      setStep3Answers(prev => ({ ...prev, [field]: value }));
    }
  };

  const getQuestions = () => {
    if (subStep === 'step1') {
      return [
        { field: "kindertijd_activiteiten", question: t('enthousiasme.step1.question1') },
        { field: "kindertijd_plekken", question: t('enthousiasme.step1.question2') },
        { field: "kindertijd_interesses_nieuw", question: t('enthousiasme.step1.question3') }
      ];
    }
    if (subStep === 'step2') {
      return [
        { field: "eerste_werk_leukste_taken", question: t('enthousiasme.step2.question1') },
        { field: "eerste_werk_werkomstandigheden", question: t('enthousiasme.step2.question2') },
        { field: "eerste_werk_onderwerpen", question: t('enthousiasme.step2.question3') }
      ];
    }
    if (subStep === 'step3') {
      return [
        { field: "plezierige_werkperiode_beschrijving", question: t('enthousiasme.step3.question1') },
        { field: "leuk_project_en_rol", question: t('enthousiasme.step3.question2') },
        { field: "fluitend_thuiskomen_dag", question: t('enthousiasme.step3.question3') }
      ];
    }
    return [];
  };

  const getTitle = () => {
    if (subStep === 'step1') return t('enthousiasme.step1.title');
    if (subStep === 'step2') return t('enthousiasme.step2.title');
    if (subStep === 'step3') return t('enthousiasme.step3.title');
    return '';
  };

  const getSubtitle = () => {
    if (subStep === 'step1') return t('enthousiasme.step1.subtitle');
    if (subStep === 'step2') return t('enthousiasme.step2.subtitle');
    if (subStep === 'step3') return t('enthousiasme.step3.subtitle');
    return '';
  };

  const answers = getCurrentAnswers();
  const questions = getQuestions();
  const allFieldsFilled = Object.values(answers).every(answer => answer.trim() !== "");

  return (
    <div className="space-y-6">
      <EnthousiasmeProgress currentStep={getCurrentStepNumber()} totalSteps={3} />
      
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#232D4B] mb-2">{getTitle()}</h1>
            <p className="text-xl text-gray-600">{getSubtitle()}</p>
          </div>

          <div className="space-y-8">
            {questions.map((item, index) => (
              <div key={index}>
                <Label htmlFor={item.field} className="text-[#232D4B] font-medium text-lg mb-3 block text-left">
                  {index + 1}. {item.question}
                </Label>
                <Textarea
                  id={item.field}
                  placeholder={t('enthousiasme.step1.placeholder')}
                  value={answers[item.field as keyof typeof answers] || ""}
                  onChange={(e) => setCurrentAnswers(item.field, e.target.value)}
                  onBlur={(e) => handleInputBlur(item.field, e.target.value)}
                  className="min-h-[100px] border-gray-300 focus:border-[#232D4B] focus:ring-[#232D4B]"
                />
              </div>
            ))}
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
              onClick={onNext}
              className={`font-semibold px-8 ${
                allFieldsFilled
                  ? "bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B]" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!allFieldsFilled}
            >
              {t('common.button.next')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnthousiasmeInline;
