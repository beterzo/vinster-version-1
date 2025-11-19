
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { cleanKeywords } from "@/utils/keywordUtils";
import { useTranslation } from "@/hooks/useTranslation";
import { Info } from "lucide-react";

interface StepProps {
  mode?: 'edit' | 'view';
}

const PrioriteitenActiviteiten = ({ mode = 'edit' }: StepProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const {
    responses,
    aiKeywords,
    saveKeywordSelection,
    saveResponses,
    loading
  } = usePrioriteitenResponses();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [extraText, setExtraText] = useState("");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Load saved data when responses change
  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setSelectedKeywords(responses.selected_activiteiten_keywords || []);
      setExtraText(responses.extra_activiteiten_tekst || "");
    }
  }, [loading, responses]);

  const handleKeywordToggle = (keyword: string) => {
    const newSelection = selectedKeywords.includes(keyword) 
      ? selectedKeywords.filter(k => k !== keyword) 
      : [...selectedKeywords, keyword];
    
    setSelectedKeywords(newSelection);
    saveKeywordSelection('activiteiten', newSelection);
  };

  const handleExtraTextChange = (value: string) => {
    setExtraText(value);
  };

  const handleExtraTextBlur = () => {
    console.log("Saving extra text:", extraText);
    saveResponses({
      extra_activiteiten_tekst: extraText
    });
  };

  const handleNext = () => {
    scrollToTop();
    navigate('/prioriteiten-werkomstandigheden');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('common.loading')}</div>;
  }

  // Use AI-generated keywords or fallback to empty array
  const availableKeywords = cleanKeywords(aiKeywords.activiteiten || []);
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
              src="/lovable-uploads/de909d64-605c-4854-a230-7da63202afba.png" 
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
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {t('profiel_voltooien.prioriteiten.activiteiten.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('profiel_voltooien.prioriteiten.activiteiten.subtitle')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('profiel_voltooien.prioriteiten.activiteiten.selected_count').replace('{count}', selectedKeywords.length.toString())}
              </p>
            </div>

            {/* Keywords Grid */}
            {availableKeywords.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                {availableKeywords.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => !isViewMode && handleKeywordToggle(keyword)}
                    disabled={isViewMode}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      selectedKeywords.includes(keyword)
                        ? "bg-blue-900 text-white border-blue-900 shadow-md"
                        : isViewMode
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : "bg-white text-blue-900 border-gray-300 hover:border-blue-900 hover:bg-blue-50"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center mb-8 p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  {t('profiel_voltooien.prioriteiten.activiteiten.missing_keywords')}
                </p>
              </div>
            )}

            {/* Extra Text Field */}
            <div className="mb-8">
              <Label htmlFor="extraText" className="text-blue-900 font-medium text-lg mb-3 block text-left">
                {t('profiel_voltooien.prioriteiten.activiteiten.extra_text_label')}
              </Label>
              <Textarea 
                id="extraText" 
                placeholder={isViewMode ? "" : t('profiel_voltooien.prioriteiten.activiteiten.extra_text_placeholder')}
                value={extraText} 
                onChange={e => handleExtraTextChange(e.target.value)}
                onBlur={!isViewMode ? handleExtraTextBlur : undefined}
                disabled={isViewMode}
                className={`min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                }`}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-8">
              <Button 
                onClick={handleNext} 
                className={`font-semibold px-8 ${
                  canProceed 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-blue-900" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`} 
                disabled={!canProceed}
              >
                {t('profiel_voltooien.prioriteiten.activiteiten.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrioriteitenActiviteiten;
