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

const ZoekprofielAntwoorden = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { responses, saveResponse, loading } = useZoekprofielAntwoorden();
  const { hasExistingZoekprofiel, loading: zoekprofielLoading } = useExistingZoekprofiel();

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
        title: "Zoekprofiel al aangemaakt",
        description: "Je hebt al een zoekprofiel aangemaakt. Je wordt doorgestuurd naar de download pagina.",
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
        title: "Zoekprofiel al aangemaakt",
        description: "Je hebt al een zoekprofiel aangemaakt. Je wordt doorgestuurd naar de download pagina.",
        variant: "default",
      });
      navigate('/zoekprofiel-download');
      return;
    }

    try {
      toast({
        title: "Antwoorden opgeslagen",
        description: "Je zoekprofiel antwoorden zijn succesvol opgeslagen."
      });
      scrollToTop();
      navigate("/zoekprofiel-download");
    } catch (error) {
      console.error("Error saving answers:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van je antwoorden.",
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
      label: "Ik ga voor een functie als...",
      placeholder: "Beschrijf hier je antwoord...",
      value: formData.functie_als,
      examples: [
        "Marketing manager bij een tech startup",
        "Leraar op een basisschool in Amsterdam",
        "Accountant bij een middelgroot accountantskantoor"
      ]
    },
    {
      id: "kerntaken",
      label: "Met de volgende kerntaken...",
      placeholder: "Beschrijf hier je antwoord...",
      value: formData.kerntaken,
      examples: [
        "Strategie ontwikkelen, teams aansturen, klantcontact onderhouden",
        "Lesgeven, ouders begeleiden, projecten organiseren",
        "Financiële administratie, belastingaangiftes, advisering"
      ]
    },
    {
      id: "organisatie_bij",
      label: "Bij de volgende soort organisatie...",
      placeholder: "Beschrijf hier je antwoord...",
      value: formData.organisatie_bij,
      examples: [
        "Een innovatief bedrijf met jonge collega's en informele sfeer",
        "Een school met betrokken ouders en gemotiveerde leerlingen",
        "Een gerenommeerd kantoor met professionele uitstraling"
      ]
    },
    {
      id: "sector",
      label: "In deze sector...",
      placeholder: "Beschrijf hier je antwoord...",
      value: formData.sector,
      examples: [
        "Technologie en software ontwikkeling",
        "Onderwijs en jeugdzorg",
        "Financiële dienstverlening"
      ]
    },
    {
      id: "gewenste_regio",
      label: "In deze regio...",
      placeholder: "Beschrijf hier je antwoord...",
      value: formData.gewenste_regio,
      examples: [
        "Amsterdam en omgeving, max 45 min reizen",
        "Utrecht centrum, liefst op fietsafstand",
        "Rotterdam Zuid, goed bereikbaar met OV"
      ]
    },
    {
      id: "arbeidsvoorwaarden",
      label: "Met deze arbeidsvoorwaarden...",
      placeholder: "Beschrijf hier je antwoord...",
      value: formData.arbeidsvoorwaarden,
      examples: [
        "€4000-5000 bruto, 32-36 uur, thuiswerken mogelijk",
        "€3500-4200 bruto, 40 uur, goede pensioenregeling",
        "€4500-6000 bruto, flexibele werktijden, doorgroeimogelijkheden"
      ]
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
                Zoekprofiel antwoorden
              </h1>
              <p className="text-xl text-gray-600">
                Vul onderstaande velden in om je persoonlijke zoekprofiel te maken
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
                  Terug naar Dashboard
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
                  {loading ? "Bezig met opslaan..." : "Zoekprofiel afronden"}
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
