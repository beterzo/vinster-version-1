
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { cleanKeywords } from "@/utils/keywordUtils";
import { useTranslation } from "@/hooks/useTranslation";
import { Info, Check } from "lucide-react";

interface StepProps {
  mode?: 'edit' | 'view';
}

const PrioriteitenWerkomstandigheden = ({ mode = 'edit' }: StepProps) => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading && responses) {
      console.log("Loading saved responses into form:", responses);
      setSelectedKeywords(responses.selected_werkomstandigheden_keywords || []);
      setExtraText(responses.extra_werkomstandigheden_tekst || "");
    }
  }, [loading, responses]);

  const handleKeywordToggle = (keyword: string) => {
    const newSelection = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    
    setSelectedKeywords(newSelection);
    saveKeywordSelection('werkomstandigheden', newSelection);
  };

  const handleExtraTextChange = (value: string) => {
    setExtraText(value);
  };

  const handleExtraTextBlur = () => {
    console.log("Saving extra text:", extraText);
    saveResponses({ extra_werkomstandigheden_tekst: extraText });
  };

  const handlePrevious = () => {
    scrollToTop();
    navigate('/prioriteiten-activiteiten');
  };

  const handleNext = () => {
    scrollToTop();
    navigate('/prioriteiten-interesses');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">{t('common.loading')}</div>;
  }

  const availableKeywords = cleanKeywords(aiKeywords.werkomstandigheden || []);
  const canProceed = selectedKeywords.length >= 8;
  const minReached = selectedKeywords.length >= 8;

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
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {isViewMode && (
          <div className="mb-6">
            <div className="bg-[#FEF9E6] border-l-4 border-[#F5C518] rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#232D4B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#232D4B] font-medium">
                    {t('common.view_only_mode.title')}
                  </p>
                  <p className="text-[#232D4B]/70 text-sm mt-1">
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#232D4B] mb-2">
                {t('profiel_voltooien.prioriteiten.werkomstandigheden.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('profiel_voltooien.prioriteiten.werkomstandigheden.subtitle')}
              </p>
            </div>

            {/* Selection Counter */}
            <div className="flex items-center gap-4 p-3 bg-white rounded-[10px] border border-[#e5e7eb] mb-5 max-w-md mx-auto">
              <span className={`text-sm font-medium ${minReached ? 'text-[#16a34a]' : 'text-[#374151]'}`}>
                {minReached ? 'Minimaal bereikt ✓' : 'Geselecteerd'}
              </span>
              <span className="text-sm font-bold text-[#1a2e5a]">{selectedKeywords.length} / 8</span>
              <div className="h-1.5 rounded-full bg-[#e5e7eb] flex-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-200 ${minReached ? 'bg-[#16a34a]' : 'bg-[#F5C518]'}`}
                  style={{ width: `${Math.min((selectedKeywords.length / 8) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Keywords Grid */}
            {availableKeywords.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {availableKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => !isViewMode && handleKeywordToggle(keyword)}
                    disabled={isViewMode}
                    className={`relative p-3 rounded-[10px] transition-all duration-150 text-sm text-center ${
                      selectedKeywords.includes(keyword)
                        ? "bg-[#F5C518]/10 border-2 border-[#F5C518] text-[#1a2e5a] font-bold shadow-sm"
                        : isViewMode
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-[1.5px] border-gray-200'
                          : "bg-white text-[#374151] border-[1.5px] border-[#d1d5db] font-medium hover:bg-[#f9fafb] hover:border-[#9ca3af] cursor-pointer"
                    }`}
                  >
                    {selectedKeywords.includes(keyword) && (
                      <Check className="absolute top-1.5 right-2 w-3.5 h-3.5 text-[#F5C518] stroke-[3]" />
                    )}
                    {keyword}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center mb-8 p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  {t('profiel_voltooien.prioriteiten.werkomstandigheden.missing_keywords')}
                </p>
              </div>
            )}

            {/* Extra Text Field */}
            <div className="mb-8">
              <Label htmlFor="extraText" className="text-[#232D4B] font-semibold text-base mb-3 block text-left border-l-2 border-[#F5C518] pl-3">
                {t('profiel_voltooien.prioriteiten.werkomstandigheden.extra_text_label')}
              </Label>
              <Textarea
                id="extraText"
                placeholder={isViewMode ? "" : t('profiel_voltooien.prioriteiten.werkomstandigheden.extra_text_placeholder')}
                value={extraText}
                onChange={(e) => handleExtraTextChange(e.target.value)}
                onBlur={!isViewMode ? handleExtraTextBlur : undefined}
                disabled={isViewMode}
                className={`min-h-[80px] ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                }`}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#f0f0f0]">
              <Button 
                onClick={handlePrevious}
                variant="outline"
                className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] min-h-[48px] px-7 font-semibold hover:bg-gray-50"
              >
                {t('profiel_voltooien.prioriteiten.werkomstandigheden.previous_button')}
              </Button>
              <Button 
                onClick={handleNext}
                className={`font-semibold px-8 min-h-[48px] rounded-[10px] ${
                  canProceed
                    ? "bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white transition-all duration-150" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!canProceed}
              >
                {t('profiel_voltooien.prioriteiten.werkomstandigheden.next_button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrioriteitenWerkomstandigheden;
