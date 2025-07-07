import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useMakeWebhookData } from "@/hooks/useMakeWebhookData";
import { sendMakeWebhook } from "@/services/webhookService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useExistingReport } from "@/hooks/useExistingReport";
import { cleanKeywords } from "@/utils/keywordUtils";

const PrioriteitenInteresses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    responses,
    aiKeywords,
    saveKeywordSelection,
    saveResponses,
    loading
  } = usePrioriteitenResponses();
  const { collectMakeWebhookData } = useMakeWebhookData();
  const { hasExistingReport, existingReport, loading: reportLoading } = useExistingReport();
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setSelectedKeywords(responses.selected_interesses_keywords || []);
      setExtraText(responses.extra_interesses_tekst || "");
    }
  }, [loading, responses]);

  // Redirect if user already has a report
  useEffect(() => {
    if (!reportLoading && hasExistingReport) {
      console.log('🚫 User already has a report, redirecting to download page');
      toast({
        title: "Rapport al gegenereerd",
        description: "Je hebt al een loopbaanrapport. Je wordt doorgestuurd naar de download pagina.",
        variant: "default",
      });
      navigate('/rapport-download');
    }
  }, [reportLoading, hasExistingReport, navigate, toast]);

  const handleKeywordToggle = (keyword: string) => {
    const newSelection = selectedKeywords.includes(keyword) 
      ? selectedKeywords.filter(k => k !== keyword) 
      : [...selectedKeywords, keyword];
    
    setSelectedKeywords(newSelection);
    saveKeywordSelection('interesses', newSelection);
  };

  const handleExtraTextChange = (value: string) => {
    setExtraText(value);
  };

  const handleExtraTextBlur = () => {
    console.log("Saving extra text:", extraText);
    saveResponses({
      extra_interesses_tekst: extraText
    });
  };

  const handlePrevious = () => {
    scrollToTop();
    navigate('/prioriteiten-werkomstandigheden');
  };

  const handleComplete = async () => {
    if (!canProceed) {
      toast({
        title: "Selecteer minimaal 5 interesses",
        description: "Je moet minimaal 5 interesses selecteren voordat je kunt afronden.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Fout",
        description: "Geen gebruiker gevonden.",
        variant: "destructive",
      });
      return;
    }

    // Double-check for existing report before creating new one
    if (hasExistingReport) {
      toast({
        title: "Rapport al gegenereerd",
        description: "Je hebt al een loopbaanrapport gegenereerd. Je wordt doorgestuurd naar de download pagina.",
        variant: "default",
      });
      navigate('/rapport-download');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Save current responses
      await saveResponses({ 
        selected_interesses_keywords: selectedKeywords,
        extra_interesses_tekst: extraText 
      });
      
      console.log('Creating user report entry for user:', user.id);
      const { error: reportError } = await supabase
        .from('user_reports')
        .upsert({
          user_id: user.id,
          report_data: { profile_completed: true },
          report_status: 'generating',
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (reportError) {
        console.error('Error creating report entry:', reportError);
        throw reportError;
      }

      console.log('Report entry created successfully with generating status');
      
      const webhookData = collectMakeWebhookData();
      
      if (!webhookData) {
        toast({
          title: "Fout",
          description: "Kan geen gebruikersgegevens vinden voor het verzenden van data.",
          variant: "destructive",
        });
        return;
      }

      await sendMakeWebhook(webhookData);
      
      console.log("Profile completed and Make.com webhook sent - PDF generation started!");
      
      toast({
        title: "Profiel afgerond!",
        description: "Je rapport wordt nu automatisch gegenereerd. Je wordt doorgestuurd naar de rapport pagina.",
        variant: "default",
      });
      
      scrollToTop();
      navigate('/rapport-download');
    } catch (error) {
      console.error("Error completing profile:", error);
      
      toast({
        title: "Fout bij afronden",
        description: "Er ging iets mis bij het afronden van je profiel. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || reportLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  // Don't show the page if user already has a report
  if (hasExistingReport) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Je wordt doorgestuurd...</div>;
  }

  // Use AI-generated keywords or fallback to empty array
  const availableKeywords = cleanKeywords(aiKeywords.interesses || []);
  const canProceed = selectedKeywords.length >= 5;

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
              src="/lovable-uploads/62ab9b10-8f6f-47ff-b35a-f701338dddfe.png" 
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
                Prioriteiten - interesses
              </h1>
              <p className="text-xl text-gray-600">
                Selecteer minimaal 5 onderwerpen die je interesseren
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Geselecteerd: {selectedKeywords.length} van minimaal 5
              </p>
              {isSubmitting && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    📤 Profiel wordt afgerond en rapport gegenereerd...
                  </p>
                </div>
              )}
            </div>

            {/* Keywords Grid */}
            {availableKeywords.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                {availableKeywords.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      selectedKeywords.includes(keyword)
                        ? "bg-blue-900 text-white border-blue-900 shadow-md"
                        : "bg-white text-blue-900 border-gray-300 hover:border-blue-900 hover:bg-blue-50"
                    }`}
                    disabled={isSubmitting}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center mb-8 p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  Er zijn nog geen persoonlijke interesses gegenereerd. 
                  Vul eerst je enthousiasme scan en wensberoepen in.
                </p>
              </div>
            )}

            {/* Extra Text Field */}
            <div className="mb-8">
              <Label htmlFor="extraText" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                Mis je nog onderwerpen? Voeg ze hier toe (optioneel)
              </Label>
              <Textarea 
                id="extraText" 
                placeholder="Bijvoorbeeld: Blockchain, Dierenrechten, Voeding..." 
                value={extraText} 
                onChange={e => handleExtraTextChange(e.target.value)} 
                onBlur={handleExtraTextBlur} 
                className="min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                disabled={isSubmitting}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8">
              <Button 
                onClick={handlePrevious} 
                variant="outline" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
                disabled={isSubmitting}
              >
                Vorige: Werkomstandigheden
              </Button>
              <Button 
                onClick={handleComplete} 
                className={`font-semibold px-8 ${
                  canProceed && !isSubmitting
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`} 
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? "Afronden..." : "Afronden"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrioriteitenInteresses;
