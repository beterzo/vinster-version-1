
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useZoekprofielAntwoorden } from "@/hooks/useZoekprofielAntwoorden";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";

const ZoekprofielAntwoorden = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { antwoorden, saveAntwoorden, isLoading } = useZoekprofielAntwoorden();

  const [formData, setFormData] = useState({
    functie_als: "",
    kerntaken: "",
    organisatie_bij: "",
    sector: "",
    gewenste_regio: "",
    arbeidsvoorwaarden: ""
  });

  useEffect(() => {
    if (antwoorden) {
      setFormData({
        functie_als: antwoorden.functie_als || "",
        kerntaken: antwoorden.kerntaken || "",
        organisatie_bij: antwoorden.organisatie_bij || "",
        sector: antwoorden.sector || "",
        gewenste_regio: antwoorden.gewenste_regio || "",
        arbeidsvoorwaarden: antwoorden.arbeidsvoorwaarden || ""
      });
    }
  }, [antwoorden]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

    try {
      await saveAntwoorden(formData);
      toast({
        title: "Antwoorden opgeslagen",
        description: "Je zoekprofiel antwoorden zijn succesvol opgeslagen."
      });
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

  const questions = [
    {
      id: "functie_als",
      label: "Ik ga voor een functie als...",
      placeholder: "Welke functienaam zoek je?",
      value: formData.functie_als
    },
    {
      id: "kerntaken",
      label: "Met de volgende kerntaken...",
      placeholder: "Wat wil je vooral doen in je werk?",
      value: formData.kerntaken
    },
    {
      id: "organisatie_bij",
      label: "Bij de volgende soort organisatie...",
      placeholder: "Bij wat voor organisatie wil je werken?",
      value: formData.organisatie_bij
    },
    {
      id: "sector",
      label: "In deze sector...",
      placeholder: "In welke sector zoek je werk?",
      value: formData.sector
    },
    {
      id: "gewenste_regio",
      label: "In deze regio...",
      placeholder: "Waar wil je werken?",
      value: formData.gewenste_regio
    },
    {
      id: "arbeidsvoorwaarden",
      label: "Met deze arbeidsvoorwaarden...",
      placeholder: "Wat zijn je wensen qua voorwaarden?",
      value: formData.arbeidsvoorwaarden
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-900 mb-2">
                  Zoekprofiel Antwoorden
                </h1>
                <p className="text-gray-600">
                  Vul onderstaande velden in om je persoonlijke zoekprofiel te maken.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <Label htmlFor={question.id} className="text-sm font-medium text-gray-700">
                      {index + 1}. {question.label}
                    </Label>
                    <Textarea
                      id={question.id}
                      placeholder={question.placeholder}
                      value={question.value}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                ))}

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/home")}
                    className="flex-1"
                  >
                    Terug naar Dashboard
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-900 hover:bg-blue-800"
                  >
                    {isLoading ? "Bezig met opslaan..." : "Opslaan en Doorgaan"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ZoekprofielAntwoorden;
