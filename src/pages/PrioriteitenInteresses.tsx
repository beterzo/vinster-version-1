
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
import { useTranslation } from "@/hooks/useTranslation";
import { cleanKeywords } from "@/utils/keywordUtils";
import { Info } from "lucide-react";

interface StepProps {
  mode?: 'edit' | 'view';
}

const PrioriteitenInteresses = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const isViewMode = mode === 'view';
  const {
    responses,
    aiKeywords,
    saveKeywordSelection,
    saveResponses,
    loading
  } = usePrioriteitenResponses();
  const { collectMakeWebhookDataFromDB } = useMakeWebhookData();
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
        title: t('common.toast.report_already_generated'),
        description: t('common.toast.report_already_generated_description'),
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
        title: t('common.toast.select_minimum_keywords'),
        description: t('common.toast.select_minimum_keywords_description').replace('items', 'interesses'),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t('common.toast.no_user_found'),
        description: t('common.toast.no_user_found_description'),
        variant: "destructive",
      });
      return;
    }

    // Double-check for existing report before proceeding
    if (hasExistingReport) {
      toast({
        title: t('common.toast.report_already_exists'),
        description: t('common.toast.report_already_exists_description'),
        variant: "default",
      });
      navigate('/rapport-download');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("💾 Saving interesses responses");
      await saveResponses({
        selected_interesses_keywords: selectedKeywords,
        extra_interesses_tekst: extraText
      });

      toast({
        title: t('common.toast.answers_saved'),
        description: "Je antwoorden zijn opgeslagen. Bevestig je rapportgeneratie in de volgende stap.",
      });

      // Navigate to confirmation page instead of generating report
      navigate('/rapport-genereren-confirmatie');
      
    } catch (error) {
      console.error('❌ Error saving responses:', error);
      toast({
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || reportLoading) {
    return <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">{t('common.loading')}</div>;
  }

  // Don't show the page if user already has a report
  if (hasExistingReport) {
    return <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">{t('common.redirecting')}</div>;
  }

  // Use AI-generated keywords or fallback to empty array
  const availableKeywords = cleanKeywords(aiKeywords.interesses || []);
  const canProceed = selectedKeywords.length >= 5;

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
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
        {isViewMode && (
          <div className="mb-6">
            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 font-medium">
                    {t('common.view_only_mode.title')}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    {t('common.view_only_mode.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Card className="rounded-3xl shadow-card">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-[#232D4B] mb-2">
                {t('profiel_voltooien.prioriteiten.interesses.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('profiel_voltooien.prioriteiten.interesses.subtitle')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('profiel_voltooien.prioriteiten.interesses.selected_count').replace('{count}', selectedKeywords.length.toString())}
              </p>
              {isSubmitting && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    📤 {t('common.toast.profile_completing')}
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
                    onClick={() => !isViewMode && handleKeywordToggle(keyword)}
                    disabled={isViewMode || isSubmitting}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      selectedKeywords.includes(keyword)
                        ? "bg-[#232D4B] text-white border-[#232D4B] shadow-md"
                        : isViewMode
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : "bg-white text-[#232D4B] border-gray-300 hover:border-[#232D4B] hover:bg-gray-50"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center mb-8 p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  {t('profiel_voltooien.prioriteiten.interesses.missing_keywords')}
                </p>
              </div>
            )}

            {/* Extra Text Field */}
            <div className="mb-8">
              <Label htmlFor="extraText" className="text-[#232D4B] font-semibold text-base mb-3 block text-left border-l-2 border-[#F5C518] pl-3">
                {t('profiel_voltooien.prioriteiten.interesses.extra_text_label')}
              </Label>
              <Textarea 
                id="extraText" 
                placeholder={isViewMode ? "" : t('profiel_voltooien.prioriteiten.interesses.extra_text_placeholder')} 
                value={extraText} 
                onChange={e => handleExtraTextChange(e.target.value)} 
                onBlur={!isViewMode ? handleExtraTextBlur : undefined}
                disabled={isViewMode || isSubmitting}
                className={`min-h-[80px] ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                }`}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8">
              <Button 
                onClick={handlePrevious} 
                variant="outline" 
                className="border-[#232D4B] text-[#232D4B] hover:bg-gray-50 h-12"
                disabled={isSubmitting}
              >
                {t('profiel_voltooien.prioriteiten.interesses.previous_button')}
              </Button>
              <Button 
                onClick={handleComplete} 
                className={`font-semibold px-8 h-12 ${
                  canProceed && !isSubmitting
                    ? "bg-[#232D4B] hover:bg-[#1a2350] text-white" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`} 
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? t('common.completing') : t('profiel_voltooien.prioriteiten.interesses.finish_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrioriteitenInteresses;
