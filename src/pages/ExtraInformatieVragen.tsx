
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const ExtraInformatieVragen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { responses, saveResponses, loading } = useExtraInformatieResponses();
  
  const [answers, setAnswers] = useState({
    opleidingsniveau: "",
    beroepsopleiding: "",
    sector_voorkeur: "",
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
        sector_voorkeur: responses.sector_voorkeur || "",
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
        title: "Vul alle velden in",
        description: "Vul alle vragen in voordat je verder gaat.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveResponses(answers);
      
      toast({
        title: "Extra informatie opgeslagen!",
        description: "Nu kun je je prioriteiten bepalen.",
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
      field: "sector_voorkeur",
      question: t('profiel_voltooien.extra_informatie.question3'),
      placeholder: t('profiel_voltooien.extra_informatie.placeholder3')
    },
    {
      field: "fysieke_beperkingen",
      question: t('profiel_voltooien.extra_informatie.question4'),
      placeholder: t('profiel_voltooien.extra_informatie.placeholder4')
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  const allFieldsFilled = answers.opleidingsniveau.trim() !== "" && 
                          answers.beroepsopleiding.trim() !== "" && 
                          answers.sector_voorkeur.trim() !== "";

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
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {t('profiel_voltooien.extra_informatie.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('profiel_voltooien.extra_informatie.subtitle')}
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
                    placeholder={item.placeholder}
                    value={answers[item.field as keyof typeof answers]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    onBlur={(e) => handleInputBlur(item.field, e.target.value)}
                    className="min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={handleBackToPriorities}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                {t('profiel_voltooien.extra_informatie.back_button')}
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
                {t('profiel_voltooien.extra_informatie.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtraInformatieVragen;
