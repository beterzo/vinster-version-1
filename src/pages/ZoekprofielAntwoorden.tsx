
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
import { HelpPopover } from "@/components/HelpPopover";

const ZoekprofielAntwoorden = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { responses, saveResponse, loading } = useZoekprofielAntwoorden();

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

    try {
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
      placeholder: "Wat wil je vooral doen in je werk?",
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
      placeholder: "Bij wat voor organisatie wil je werken?",
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
      placeholder: "In welke sector zoek je werk?",
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
      placeholder: "Waar wil je werken?",
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
      placeholder: "Wat zijn je wensen qua voorwaarden?",
      value: formData.arbeidsvoorwaarden,
      examples: [
        "€4000-5000 bruto, 32-36 uur, thuiswerken mogelijk",
        "€3500-4200 bruto, 40 uur, goede pensioenregeling",
        "€4500-6000 bruto, flexibele werktijden, doorgroeimogelijkheden"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-10">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-blue-900 mb-3">
                    Zoekprofiel antwoorden
                  </h1>
                  <p className="text-lg text-blue-700 max-w-2xl mx-auto">
                    Vul onderstaande velden in om je persoonlijke zoekprofiel te maken.
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label 
                          htmlFor={question.id} 
                          className="text-base font-semibold text-gray-800"
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
                        className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-base p-4 transition-colors"
                      />
                    </div>
                  ))}

                  {/* Button Section */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/home")}
                      className="flex-1 h-12 text-base border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Terug naar Dashboard
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-blue-900 hover:bg-blue-800 text-base font-semibold transition-colors"
                    >
                      {loading ? "Bezig met opslaan..." : "Zoekprofiel afronden"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ZoekprofielAntwoorden;
