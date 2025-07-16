import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useZoekprofielAntwoorden } from "@/hooks/useZoekprofielAntwoorden";
import { useExistingZoekprofiel } from "@/hooks/useExistingZoekprofiel";
import { HelpPopover } from "@/components/HelpPopover";
import { useTranslation } from "@/hooks/useTranslation";

const ZoekprofielAntwoorden = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { responses, saveResponse, submitToWebhook, loading } = useZoekprofielAntwoorden();
  const { hasExistingZoekprofiel, loading: zoekprofielLoading } = useExistingZoekprofiel();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    functie_als: "",
    kerntaken: "",
    organisatie_bij: "",
    sector: "",
    gewenste_regio: "",
    arbeidsvoorwaarden: ""
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Redirect if user already has a zoekprofiel
  useEffect(() => {
    if (!zoekprofielLoading && hasExistingZoekprofiel) {
      console.log('🚫 User already has a zoekprofiel, redirecting to download page');
      toast({
        title: t('common.toast.already_exists'),
        description: t('common.toast.already_exists_description'),
        variant: "default",
      });
      navigate('/zoekprofiel-download');
    }
  }, [zoekprofielLoading, hasExistingZoekprofiel, navigate, toast]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Save to backend with debouncing
    saveResponse(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Niet ingelogd",
        description: "Je moet ingelogd zijn om je antwoorden op te slaan.",
        variant: "destructive"
      });
      return;
    }

    // Double-check for existing zoekprofiel before submitting
    if (hasExistingZoekprofiel) {
      toast({
        title: t('common.toast.already_exists'),
        description: t('common.toast.already_exists_description'),
        variant: "default",
      });
      navigate('/zoekprofiel-download');
      return;
    }

    try {
      // Submit to webhook to trigger PDF generation
      const success = await submitToWebhook();
      
      if (success) {
        toast({
          title: t('common.toast.answers_saved'),
          description: t('common.toast.answers_saved_description')
        });
        scrollToTop();
        navigate("/zoekprofiel-download");
      } else {
        toast({
          title: t('common.toast.save_error'),
          description: "Er is een fout opgetreden bij het starten van de zoekprofiel generatie.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting to webhook:", error);
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive"
      });
    }
  };

  if (loading || zoekprofielLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  // Don't show the form if user already has a zoekprofiel
  if (hasExistingZoekprofiel) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Je wordt doorgestuurd...</div>;
  }

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
                {t('journey.zoekprofiel.antwoorden.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('journey.zoekprofiel.antwoorden.subtitle')}
              </p>
            </div>

            {/* Questions */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Label 
                      htmlFor={question.id} 
                      className="text-blue-900 font-medium text-lg block text-left"
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
                    className="min-h-[100px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>
              ))}

              {/* Navigation */}
              <div className="flex justify-between pt-12">
                <Button 
                  type="button"
                  onClick={() => navigate("/home")}
                  variant="outline"
                  className="border-blue-900 text-blue-900 hover:bg-blue-50"
                >
                  {t('journey.zoekprofiel.antwoorden.back_button')}
                </Button>
                <Button 
                  type="submit"
                  disabled={loading || !allFieldsFilled}
                  className={`font-semibold px-8 ${
                    allFieldsFilled && !loading
                      ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Bezig met opslaan..." : t('journey.zoekprofiel.antwoorden.generate_button')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZoekprofielAntwoorden;
