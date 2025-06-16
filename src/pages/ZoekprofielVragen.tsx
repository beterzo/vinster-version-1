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
    functie_als: '',
    kerntaken: '',
    sector: '',
    organisatie_bij: '',
    gewenste_regio: '',
    arbeidsvoorwaarden: ''
  });

  // Update form data when responses are loaded
  useEffect(() => {
    if (responses) {
      setFormData({
        functie_als: responses.functie_als || '',
        kerntaken: responses.kerntaken || '',
        sector: responses.sector || '',
        organisatie_bij: responses.organisatie_bij || '',
        gewenste_regio: responses.gewenste_regio || '',
        arbeidsvoorwaarden: responses.arbeidsvoorwaarden || ''
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
      field: 'functie_als',
      title: 'Ik ga voor een functie als',
      examples: 'bijvoorbeeld: coördinator, projectleider, afdelingshoofd, adviseur, docent'
    },
    {
      field: 'kerntaken',
      title: 'Met de volgende kerntaken',
      examples: 'bijvoorbeeld: adviseren, aansturen, samenstellen, ontwerpen, overdragen, samenwerken, onderzoeken, bedenken'
    },
    {
      field: 'sector',
      title: 'In de sector',
      examples: 'bijvoorbeeld: overheid, zorg, zakelijke dienstverlening, onderwijs, media, bouw'
    },
    {
      field: 'organisatie_bij',
      title: 'Bij een',
      examples: 'bijvoorbeeld: adviesbureau, kenniscentrum, opleidingsinstituut, bank, gemeente'
    },
    {
      field: 'gewenste_regio',
      title: 'In deze regio',
      examples: 'deel van Nederland of buitenland'
    },
    {
      field: 'arbeidsvoorwaarden',
      title: 'Met deze arbeidsvoorwaarden',
      examples: 'noem salaris, uren, pensioen, thuis werken'
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
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{question.title}</h2>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 italic">({question.examples})</p>
                </div>
                
                <Textarea
                  value={formData[question.field as keyof typeof formData]}
                  onChange={(e) => handleInputChange(question.field, e.target.value)}
                  className="min-h-[120px] text-base text-left"
                />
              </div>
            </Card>
          ))}

          {/* Special section after kerntaken */}
          <div className="text-left">
            <p className="text-lg text-gray-700 font-medium">
              Pak het overzicht van jouw ideale werk er even bij.
            </p>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="text-left space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Je weet wat je wilt!</h3>
              <p className="text-gray-600">
                Je antwoorden worden automatisch opgeslagen. Klik op 'Profiel afronden' om je zoekprofiel te voltooien.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
