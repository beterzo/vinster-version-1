import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useZoekprofielAntwoorden } from "@/hooks/useZoekprofielAntwoorden";
import { HelpPopover } from "@/components/HelpPopover";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface ZoekprofielDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

type DialogStep = 'intro' | 'questions' | 'generating';

const ZoekprofielDialog = ({ open, onOpenChange, onComplete }: ZoekprofielDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { responses, saveResponse, submitToWebhook, loading } = useZoekprofielAntwoorden();
  const [step, setStep] = useState<DialogStep>('intro');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    functie_als: "",
    kerntaken: "",
    organisatie_bij: "",
    sector: "",
    gewenste_regio: "",
    arbeidsvoorwaarden: ""
  });

  useEffect(() => {
    if (responses) {
      setFormData({
        functie_als: responses.functie_als || "",
        kerntaken: responses.kerntaken || "",
        organisatie_bij: responses.organisatie_bij || "",
        sector: responses.sector || "",
        gewenste_regio: responses.gewenste_regio || "",
        arbeidsvoorwaarden: responses.arbeidsvoorwaarden || ""
      });
    }
  }, [responses]);

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setStep('intro');
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    saveResponse(field, value);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t('common.toast.not_logged_in'),
        description: t('common.toast.login_required'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setStep('generating');

    try {
      const success = await submitToWebhook();
      
      if (success) {
        toast({
          title: t('common.toast.answers_saved'),
          description: t('common.toast.zoekprofiel_generating')
        });
        onComplete();
        onOpenChange(false);
      } else {
        toast({
          title: t('common.toast.save_error'),
          description: t('common.toast.save_error_description'),
          variant: "destructive"
        });
        setStep('questions');
      }
    } catch (error) {
      console.error("Error submitting zoekprofiel:", error);
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive"
      });
      setStep('questions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    {
      id: "functie_als",
      label: t('journey.zoekprofiel.antwoorden.question1'),
      placeholder: t('journey.zoekprofiel.antwoorden.placeholder'),
      value: formData.functie_als,
      examples: t('journey.zoekprofiel.antwoorden.examples.functie_als')
    },
    {
      id: "kerntaken",
      label: t('journey.zoekprofiel.antwoorden.question2'),
      placeholder: t('journey.zoekprofiel.antwoorden.placeholder'),
      value: formData.kerntaken,
      examples: t('journey.zoekprofiel.antwoorden.examples.kerntaken')
    },
    {
      id: "organisatie_bij",
      label: t('journey.zoekprofiel.antwoorden.question3'),
      placeholder: t('journey.zoekprofiel.antwoorden.placeholder'),
      value: formData.organisatie_bij,
      examples: t('journey.zoekprofiel.antwoorden.examples.organisatie_bij')
    },
    {
      id: "sector",
      label: t('journey.zoekprofiel.antwoorden.question4'),
      placeholder: t('journey.zoekprofiel.antwoorden.placeholder'),
      value: formData.sector,
      examples: t('journey.zoekprofiel.antwoorden.examples.sector')
    },
    {
      id: "gewenste_regio",
      label: t('journey.zoekprofiel.antwoorden.question5'),
      placeholder: t('journey.zoekprofiel.antwoorden.placeholder'),
      value: formData.gewenste_regio,
      examples: t('journey.zoekprofiel.antwoorden.examples.gewenste_regio')
    },
    {
      id: "arbeidsvoorwaarden",
      label: t('journey.zoekprofiel.antwoorden.question6'),
      placeholder: t('journey.zoekprofiel.antwoorden.placeholder'),
      value: formData.arbeidsvoorwaarden,
      examples: t('journey.zoekprofiel.antwoorden.examples.arbeidsvoorwaarden')
    }
  ];

  const allFieldsFilled = Object.values(formData).every(answer => answer.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#232D4B]">
                {t('zoekprofiel.intro.title')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-[#232D4B] mb-3">
                  {t('zoekprofiel.intro.what_is_title')}
                </h3>
                <p className="text-gray-700 mb-3">
                  {t('zoekprofiel.intro.description')}
                </p>
                <p className="text-gray-700 mb-3">
                  {t('zoekprofiel.intro.description_details')}
                </p>
                <p className="text-gray-600 text-sm">
                  {t('zoekprofiel.intro.duration')}
                </p>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep('questions')}
                  className="bg-[#232D4B] hover:bg-[#232D4B]/90"
                >
                  {t('zoekprofiel.intro.start_button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'questions' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#232D4B]">
                {t('journey.zoekprofiel.antwoorden.title')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {questions.map((question, index) => (
                <div key={question.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <Label 
                      htmlFor={question.id} 
                      className="text-[#232D4B] font-medium"
                    >
                      {index + 1}. {question.label}
                    </Label>
                    <HelpPopover 
                      examples={question.examples} 
                      title={question.label}
                    />
                  </div>
                  <Textarea
                    id={question.id}
                    placeholder={question.placeholder}
                    value={question.value}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="min-h-[80px] border-gray-300 focus:border-[#232D4B] focus:ring-[#232D4B]"
                  />
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setStep('intro')}
                  className="border-[#232D4B] text-[#232D4B]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !allFieldsFilled || isSubmitting}
                  className={`${
                    allFieldsFilled && !loading && !isSubmitting
                      ? "bg-yellow-400 hover:bg-yellow-500 text-[#232D4B]" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {t('journey.zoekprofiel.antwoorden.generate_button')}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#232D4B] mb-4" />
            <h3 className="text-xl font-semibold text-[#232D4B] mb-2">
              {t('dashboard.round_dashboard.content.zoekprofiel_generating')}
            </h3>
            <p className="text-gray-600 text-center">
              {t('dashboard.round_dashboard.content.zoekprofiel_generating_desc')}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ZoekprofielDialog;