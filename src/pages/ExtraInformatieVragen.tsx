
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

interface StepProps {
  mode?: 'edit' | 'view';
}

const ExtraInformatieVragen = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { responses, saveResponses, loading } = useExtraInformatieResponses();
  const isViewMode = mode === 'view';
  
  const [answers, setAnswers] = useState({
    opleidingsniveau: "",
    beroepsopleiding: "",
    fysieke_beperkingen: ""
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setAnswers({
        opleidingsniveau: responses.opleidingsniveau || "",
        beroepsopleiding: responses.beroepsopleiding || "",
        fysieke_beperkingen: responses.fysieke_beperkingen || ""
      });
    }
  }, [loading, responses]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = async (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);
    await saveResponses({ ...answers, [field]: value });
  };

  const handleBackToPriorities = () => {
    scrollToTop();
    navigate('/prioriteiten-werkomstandigheden');
  };

  const handleComplete = async () => {
    if (!allFieldsFilled) {
      toast({
        title: t('common.toast.fill_all_fields'),
        description: t('common.toast.fill_all_fields_description'),
        variant: "destructive",
      });
      return;
    }

    try {
      await saveResponses(answers);
      
      toast({
        title: t('common.toast.extra_info_saved'),
        description: t('common.toast.extra_info_saved_description'),
        variant: "default",
      });
      
      scrollToTop();
      navigate('/prioriteiten-activiteiten');
    } catch (error) {
      console.error("Error saving extra informatie:", error);
      
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
    }
  };

  const questions = [
    {
      field: "opleidingsniveau",
      question: t('profiel_voltooien.extra_informatie.question1'),
      placeholder: t('profiel_voltooien.extra_informatie.placeholder1')
    },
    {
      field: "beroepsopleiding", 
      question: t('profiel_voltooien.extra_informatie.question2'),
      placeholder: t('profiel_voltooien.extra_informatie.placeholder2')
    },
    {
      field: "fysieke_beperkingen",
      question: t('profiel_voltooien.extra_informatie.question3'),
      placeholder: t('profiel_voltooien.extra_informatie.placeholder3')
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">{t('common.loading')}</div>;
  }

  const allFieldsFilled = answers.opleidingsniveau.trim() !== "" && 
                          answers.beroepsopleiding.trim() !== "";

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
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
            <div className="bg-[#FEF9E6] border-l-4 border-[#F5C518] rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#232D4B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#232D4B] font-medium">
                    {t('common.view_only_mode.title')}
                  </p>
                  <p className="text-[#232D4B]/70 text-sm mt-1">
                    {t('common.view_only_mode.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Card className="rounded-3xl shadow-card">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <p className="text-xs text-gray-400 mb-2">Stap 3 van 6 – Profiel</p>
              <h1 className="text-2xl font-bold text-[#232D4B] mb-2">
                {t('profiel_voltooien.extra_informatie.title')}
              </h1>
              <p className="text-sm text-gray-500">
                {t('profiel_voltooien.extra_informatie.subtitle')}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-10">
              {questions.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1a2e5a] text-white text-xs font-bold mr-2.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <Label htmlFor={item.field} className="text-base font-semibold text-[#1a2e5a]">
                      {item.question}
                    </Label>
                  </div>
                  <Textarea
                    id={item.field}
                    placeholder={isViewMode ? "" : item.placeholder}
                    value={answers[item.field as keyof typeof answers]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    onBlur={(e) => !isViewMode && handleInputBlur(item.field, e.target.value)}
                    disabled={isViewMode}
                    className={`min-h-[100px] border-[1.5px] border-[#d1d5db] rounded-[10px] p-3 text-[0.95rem] leading-[1.6] focus:border-[#1a2e5a] focus:bg-[#f8faff] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(26,46,90,0.08)] ${
                      isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10 pt-6 border-t border-[#f0f0f0]">
              <Button 
                onClick={handleBackToPriorities}
                variant="outline"
                className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] min-h-[48px] px-7 font-semibold hover:bg-gray-50"
              >
                {t('profiel_voltooien.extra_informatie.back_button')}
              </Button>
              <Button 
                onClick={handleComplete}
                className={`font-semibold px-8 min-h-[48px] rounded-[10px] ${
                  isViewMode || allFieldsFilled
                    ? "bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white transition-all duration-150" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!isViewMode && !allFieldsFilled}
              >
                {isViewMode ? t('common.button.next') : t('profiel_voltooien.extra_informatie.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtraInformatieVragen;
