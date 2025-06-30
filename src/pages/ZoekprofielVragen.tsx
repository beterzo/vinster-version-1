
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";
import { useZoekprofielPdf } from "@/hooks/useZoekprofielPdf";
import { useToast } from "@/hooks/use-toast";

const ZoekprofielVragen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { responses, saveResponse, loading } = useZoekprofielResponses();
  const { initializePdfGeneration, isGenerating } = useZoekprofielPdf();
  
  const [answers, setAnswers] = useState({
    functie_als: "",
    kerntaken: "",
    organisatie_bij: "",
    sector: "",
    gewenste_regio: "",
    arbeidsvoorwaarden: ""
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved data when responses change
  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setAnswers({
        functie_als: responses.functie_als || "",
        kerntaken: responses.kerntaken || "",
        organisatie_bij: responses.organisatie_bij || "",
        sector: responses.sector || "",
        gewenste_regio: responses.gewenste_regio || "",
        arbeidsvoorwaarden: responses.arbeidsvoorwaarden || ""
      });
    }
  }, [loading, responses]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);
    saveResponse(field as keyof typeof responses, value);
  };

  const handleComplete = async () => {
    if (!allFieldsFilled) {
      toast({
        title: "Vul alle velden in",
        description: "Vul alle vragen in voordat je het zoekprofiel genereert.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Generating zoekprofiel PDF...");
      await initializePdfGeneration();
      
      toast({
        title: "Zoekprofiel gegenereerd!",
        description: "Je zoekprofiel is succesvol aangemaakt.",
      });
      
      navigate('/zoekprofiel-download');
    } catch (error) {
      console.error("Error generating zoekprofiel:", error);
      
      toast({
        title: "Fout bij genereren",
        description: "Er ging iets mis bij het genereren van je zoekprofiel. Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  const questions = [
    {
      field: "functie_als",
      question: "Functie als... (Welke functienaam zoek je?)",
      placeholder: "Bijvoorbeeld: Marketing Manager, Software Developer, HR Adviseur..."
    },
    {
      field: "kerntaken", 
      question: "Kerntaken (Wat wil je vooral doen in je werk?)",
      placeholder: "Bijvoorbeeld: Strategieën ontwikkelen, teams aansturen, klanten adviseren..."
    },
    {
      field: "organisatie_bij",
      question: "Organisatie bij... (Bij wat voor organisatie wil je werken?)",
      placeholder: "Bijvoorbeeld: Innovatief techbedrijf, Non-profit organisatie, Grote multinational..."
    },
    {
      field: "sector",
      question: "Sector (In welke sector(en) zoek je werk?)",
      placeholder: "Bijvoorbeeld: ICT, Zorg, Onderwijs, Marketing & Communicatie..."
    },
    {
      field: "gewenste_regio",
      question: "Gewenste regio (Waar wil je werken?)",
      placeholder: "Bijvoorbeeld: Amsterdam en omgeving, geheel Nederland, remote..."
    },
    {
      field: "arbeidsvoorwaarden",
      question: "Arbeidsvoorwaarden (Wat zijn je wensen qua voorwaarden?)",
      placeholder: "Bijvoorbeeld: 32-40 uur, flexibele werktijden, thuiswerkmogelijkheden..."
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  const allFieldsFilled = Object.values(answers).every(answer => answer.trim() !== "");

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
                Zoekprofiel vragen
              </h1>
              <p className="text-xl text-gray-600">
                Beantwoord de vragen om je persoonlijke zoekprofiel te maken
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
                onClick={() => navigate('/zoekprofiel-intro')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
                disabled={isGenerating}
              >
                Terug naar intro
              </Button>
              <Button 
                onClick={handleComplete}
                className={`font-semibold px-8 ${
                  allFieldsFilled
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isGenerating || !allFieldsFilled}
              >
                {isGenerating ? "Genereren..." : "Zoekprofiel genereren"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZoekprofielVragen;
