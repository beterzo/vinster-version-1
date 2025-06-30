
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { useMakeWebhookData } from "@/hooks/useMakeWebhookData";
import { sendMakeWebhook } from "@/services/webhookService";
import { useToast } from "@/hooks/use-toast";

const ExtraInformatieVragen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { responses, saveResponses, loading } = useExtraInformatieResponses();
  const { collectMakeWebhookData } = useMakeWebhookData();
  
  const [answers, setAnswers] = useState({
    opleidingsniveau: "",
    beroepsopleiding: "",
    sector_voorkeur: "",
    fysieke_beperkingen: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved data when responses change
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
      setIsSubmitting(true);
      
      // Save current answers first
      await saveResponses(answers);
      
      // Collect all data for Make.com webhook
      const webhookData = collectMakeWebhookData();
      
      if (!webhookData) {
        toast({
          title: "Fout",
          description: "Kan geen gebruikersgegevens vinden voor het verzenden van data.",
          variant: "destructive",
        });
        return;
      }

      // Send data to Make.com webhook
      await sendMakeWebhook(webhookData);
      
      console.log("Extra informatie completed and data sent to Make.com webhook!");
      
      toast({
        title: "Gelukt!",
        description: "Je gegevens zijn succesvol opgeslagen en verzonden.",
        variant: "default",
      });
      
      navigate('/wensberoepen-intro');
    } catch (error) {
      console.error("Error completing extra informatie:", error);
      
      toast({
        title: "Fout bij opslaan",
        description: "Er ging iets mis bij het opslaan van je gegevens. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    {
      field: "opleidingsniveau",
      question: "Wat is je hoogste opleidingsniveau?",
      placeholder: "Bijvoorbeeld: HBO, WO, MBO niveau 4, etc."
    },
    {
      field: "beroepsopleiding", 
      question: "Welke beroepsopleiding heb je gevolgd?",
      placeholder: "Bijvoorbeeld: Bedrijfskunde, Psychologie, Technische Informatica, etc."
    },
    {
      field: "sector_voorkeur",
      question: "In welke sector(en) zou je graag willen werken?",
      placeholder: "Bijvoorbeeld: ICT, Zorg, Onderwijs, Marketing, etc."
    },
    {
      field: "fysieke_beperkingen",
      question: "Zijn er fysieke beperkingen waar we rekening mee dienen te houden?",
      placeholder: "Bijvoorbeeld: Geen zware fysieke arbeid, beeldschermwerk beperken, etc. (optioneel)"
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
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
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
                Extra informatie
              </h1>
              <p className="text-xl text-gray-600">
                Laatste vragen over je achtergrond
              </p>
              {isSubmitting && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    📤 Gegevens worden verzonden...
                  </p>
                </div>
              )}
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
                disabled={isSubmitting}
              >
                Terug naar prioriteiten
              </Button>
              <Button 
                onClick={handleComplete}
                className={`font-semibold px-8 ${
                  allFieldsFilled
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isSubmitting || !allFieldsFilled}
              >
                {isSubmitting ? "Voltooien..." : "Profiel voltooien"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtraInformatieVragen;
