
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";
import { Search, ArrowRight, Home, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ZoekprofielVragen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { responses, loading, saveResponse, submitToWebhook, isCompleted } = useZoekprofielResponses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for form fields
  const [formData, setFormData] = useState({
    gewenst_werk: '',
    branche_richting: '',
    energie_gevende_aspecten: '',
    organisatie_type: '',
    gewenste_regio: '',
    belangrijke_voorwaarden: ''
  });

  // Update form data when responses are loaded
  useEffect(() => {
    if (responses) {
      setFormData({
        gewenst_werk: responses.gewenst_werk || '',
        branche_richting: responses.branche_richting || '',
        energie_gevende_aspecten: responses.energie_gevende_aspecten || '',
        organisatie_type: responses.organisatie_type || '',
        gewenste_regio: responses.gewenste_regio || '',
        belangrijke_voorwaarden: responses.belangrijke_voorwaarden || ''
      });
    }
  }, [responses]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-save with debounce
    const timeoutId = setTimeout(() => {
      saveResponse(field, value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async () => {
    if (!isCompleted) {
      toast({
        title: "Profiel niet compleet",
        description: "Vul alle vragen in voordat je doorgaat.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const success = await submitToWebhook();
    
    if (success) {
      navigate("/zoekprofiel-download");
    }
    
    setIsSubmitting(false);
  };

  const questions = [
    {
      field: 'gewenst_werk',
      title: 'Welk werk wil je graag doen?',
      description: 'Beschrijf het soort werk, taken en verantwoordelijkheden die je graag zou willen hebben.',
      placeholder: 'Bijvoorbeeld: projectmanagement, klantcontact, strategische planning...'
    },
    {
      field: 'branche_richting',
      title: 'In welke branche of richting zoek je dat?',
      description: 'Geef aan in welke sector(en) of type organisaties je graag zou willen werken.',
      placeholder: 'Bijvoorbeeld: zorg, onderwijs, technologie, finance...'
    },
    {
      field: 'energie_gevende_aspecten',
      title: 'Waar krijg je energie van in je werk?',
      description: 'Wat motiveert je en geeft je voldoening in je dagelijkse werkzaamheden?',
      placeholder: 'Bijvoorbeeld: mensen helpen, problemen oplossen, creatief bezig zijn...'
    },
    {
      field: 'organisatie_type',
      title: 'Bij wat voor type organisatie werk je het liefst?',
      description: 'Denk aan grootte, cultuur, werksfeer en organisatiestructuur.',
      placeholder: 'Bijvoorbeeld: startup, groot bedrijf, non-profit, familiebedrijf...'
    },
    {
      field: 'gewenste_regio',
      title: 'In welke regio zoek je werk?',
      description: 'Geef aan waar je geografisch gezien graag zou willen werken.',
      placeholder: 'Bijvoorbeeld: Amsterdam, binnen 30 km van Utrecht, heel Nederland...'
    },
    {
      field: 'belangrijke_voorwaarden',
      title: 'Welke voorwaarden zijn belangrijk voor jou?',
      description: 'Denk aan salaris, werktijden, thuiswerken, doorgroeimogelijkheden, etc.',
      placeholder: 'Bijvoorbeeld: flexibele werktijden, thuiswerkmogelijkheid, 32-40 uur...'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Zoekprofiel laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-8" 
          />
          
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stel je zoekprofiel op</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Beantwoord de onderstaande vragen om je persoonlijke zoekprofiel te maken.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-12">
          {questions.map((question, index) => (
            <Card key={question.field} className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{question.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{question.description}</p>
                </div>
                
                <Textarea
                  value={formData[question.field as keyof typeof formData]}
                  onChange={(e) => handleInputChange(question.field, e.target.value)}
                  placeholder={question.placeholder}
                  className="min-h-[120px] text-base"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Klaar om je zoekprofiel af te ronden?</h3>
              <p className="text-gray-600">
                Je antwoorden worden automatisch opgeslagen. Klik op 'Profiel afronden' om je zoekprofiel te voltooien.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!isCompleted || isSubmitting}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xl py-6 px-8 h-auto disabled:opacity-50"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Profiel verwerken...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-6 h-6 mr-3" />
                    Profiel afronden
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => navigate("/home")}
                variant="outline"
                className="rounded-xl py-6 px-8 h-auto"
              >
                <Home className="w-4 h-4 mr-2" />
                Terug naar dashboard
              </Button>
            </div>
            
            {!isCompleted && (
              <p className="text-amber-600 text-sm">
                Vul alle vragen in om je zoekprofiel af te kunnen ronden.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoekprofielVragen;
