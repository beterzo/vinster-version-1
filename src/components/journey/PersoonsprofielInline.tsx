import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";
import { cleanKeywords } from "@/utils/keywordUtils";
import { useTranslation } from "@/hooks/useTranslation";
import { SubStep } from "@/types/journey";

interface PersoonsprofielInlineProps {
  subStep: SubStep;
  onNext: () => void;
  onPrevious: () => void;
}

const PersoonsprofielInline = ({ subStep, onNext, onPrevious }: PersoonsprofielInlineProps) => {
  const { t } = useTranslation();
  const {
    responses: prioriteitenResponses,
    aiKeywords,
    saveKeywordSelection,
    saveResponses: savePrioriteitenResponses,
    loading: prioriteitenLoading
  } = usePrioriteitenResponses();
  
  const {
    responses: extraInfoResponses,
    saveResponses: saveExtraInfoResponses,
    loading: extraInfoLoading
  } = useExtraInformatieResponses();

  const [extraInfoAnswers, setExtraInfoAnswers] = useState({
    opleidingsniveau: "",
    beroepsopleiding: "",
    sector_voorkeur: "",
    fysieke_beperkingen: ""
  });

  const [selectedActiviteiten, setSelectedActiviteiten] = useState<string[]>([]);
  const [selectedWerkomstandigheden, setSelectedWerkomstandigheden] = useState<string[]>([]);
  const [selectedInteresses, setSelectedInteresses] = useState<string[]>([]);
  const [extraTexts, setExtraTexts] = useState({
    activiteiten: "",
    werkomstandigheden: "",
    interesses: ""
  });

  useEffect(() => {
    if (!extraInfoLoading && extraInfoResponses) {
      setExtraInfoAnswers({
        opleidingsniveau: extraInfoResponses.opleidingsniveau || "",
        beroepsopleiding: extraInfoResponses.beroepsopleiding || "",
        sector_voorkeur: extraInfoResponses.sector_voorkeur || "",
        fysieke_beperkingen: extraInfoResponses.fysieke_beperkingen || ""
      });
    }
  }, [extraInfoLoading, extraInfoResponses]);

  useEffect(() => {
    if (!prioriteitenLoading && prioriteitenResponses) {
      setSelectedActiviteiten(prioriteitenResponses.selected_activiteiten_keywords || []);
      setSelectedWerkomstandigheden(prioriteitenResponses.selected_werkomstandigheden_keywords || []);
      setSelectedInteresses(prioriteitenResponses.selected_interesses_keywords || []);
      setExtraTexts({
        activiteiten: prioriteitenResponses.extra_activiteiten_tekst || "",
        werkomstandigheden: prioriteitenResponses.extra_werkomstandigheden_tekst || "",
        interesses: prioriteitenResponses.extra_interesses_tekst || ""
      });
    }
  }, [prioriteitenLoading, prioriteitenResponses]);

  const loading = prioriteitenLoading || extraInfoLoading;

  if (loading) {
    return <div className="flex items-center justify-center p-12">{t('common.loading')}</div>;
  }

  // Intro page
  if (subStep === 'intro') {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold text-[#232D4B] mb-8 text-center">
            {t('profiel_voltooien.intro.title')}
          </h1>
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-[#232D4B] mb-4">
              {t('profiel_voltooien.intro.last_step_title')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('profiel_voltooien.intro.description')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('profiel_voltooien.intro.description_details')}
            </p>
          </div>
          <div className="flex justify-center pt-8">
            <Button 
              onClick={onNext}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-4 rounded-lg"
            >
              {t('profiel_voltooien.intro.start_button')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extra Info page
  if (subStep === 'extra_info') {
    const questions = [
      { field: "opleidingsniveau", question: t('profiel_voltooien.extra_informatie.question1'), placeholder: t('profiel_voltooien.extra_informatie.placeholder1') },
      { field: "beroepsopleiding", question: t('profiel_voltooien.extra_informatie.question2'), placeholder: t('profiel_voltooien.extra_informatie.placeholder2') },
      { field: "sector_voorkeur", question: t('profiel_voltooien.extra_informatie.question3'), placeholder: t('profiel_voltooien.extra_informatie.placeholder3') },
      { field: "fysieke_beperkingen", question: t('profiel_voltooien.extra_informatie.question4'), placeholder: t('profiel_voltooien.extra_informatie.placeholder4') }
    ];

    const allFieldsFilled = extraInfoAnswers.opleidingsniveau.trim() !== "" && 
                            extraInfoAnswers.beroepsopleiding.trim() !== "" && 
                            extraInfoAnswers.sector_voorkeur.trim() !== "";

    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t('profiel_voltooien.extra_informatie.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('profiel_voltooien.extra_informatie.subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((item, index) => (
              <div key={index}>
                <Label htmlFor={item.field} className="text-[#232D4B] font-medium text-lg mb-3 block text-left">
                  {index + 1}. {item.question}
                </Label>
                <Textarea
                  id={item.field}
                  placeholder={item.placeholder}
                  value={extraInfoAnswers[item.field as keyof typeof extraInfoAnswers]}
                  onChange={(e) => setExtraInfoAnswers(prev => ({ ...prev, [item.field]: e.target.value }))}
                  onBlur={(e) => saveExtraInfoResponses({ ...extraInfoAnswers, [item.field]: e.target.value })}
                  className="min-h-[80px] border-gray-300 focus:border-[#232D4B] focus:ring-[#232D4B]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-12">
            <Button onClick={onPrevious} variant="outline" className="border-[#232D4B] text-[#232D4B] hover:bg-blue-50">
              {t('common.button.previous')}
            </Button>
            <Button 
              onClick={onNext}
              className={`font-semibold px-8 ${allFieldsFilled ? "bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={!allFieldsFilled}
            >
              {t('common.button.next')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Keywords pages (activiteiten, werkomstandigheden, interesses)
  const renderKeywordsPage = (
    type: 'activiteiten' | 'werkomstandigheden' | 'interesses',
    selectedKeywords: string[],
    setSelectedKeywords: (keywords: string[]) => void,
    extraText: string,
    setExtraText: (text: string) => void
  ) => {
    const availableKeywords = cleanKeywords(aiKeywords[type] || []);
    const canProceed = selectedKeywords.length >= 5;

    const handleKeywordToggle = (keyword: string) => {
      const newSelection = selectedKeywords.includes(keyword) 
        ? selectedKeywords.filter(k => k !== keyword) 
        : [...selectedKeywords, keyword];
      
      setSelectedKeywords(newSelection);
      saveKeywordSelection(type, newSelection);
    };

    const handleExtraTextBlur = () => {
      const fieldName = `extra_${type}_tekst` as keyof typeof prioriteitenResponses;
      savePrioriteitenResponses({ [fieldName]: extraText });
    };

    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t(`profiel_voltooien.prioriteiten.${type}.title`)}
            </h1>
            <p className="text-xl text-gray-600">
              {t(`profiel_voltooien.prioriteiten.${type}.subtitle`)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t(`profiel_voltooien.prioriteiten.${type}.selected_count`).replace('{count}', selectedKeywords.length.toString())}
            </p>
          </div>

          {availableKeywords.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {availableKeywords.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordToggle(keyword)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedKeywords.includes(keyword)
                      ? "bg-[#232D4B] text-white border-[#232D4B] shadow-md"
                      : "bg-white text-[#232D4B] border-gray-300 hover:border-[#232D4B] hover:bg-blue-50"
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center mb-8 p-8 bg-gray-100 rounded-lg">
              <p className="text-gray-600">
                {t(`profiel_voltooien.prioriteiten.${type}.missing_keywords`)}
              </p>
            </div>
          )}

          <div className="mb-8">
            <Label htmlFor="extraText" className="text-[#232D4B] font-medium text-lg mb-3 block text-left">
              {t(`profiel_voltooien.prioriteiten.${type}.extra_text_label`)}
            </Label>
            <Textarea 
              id="extraText" 
              placeholder={t(`profiel_voltooien.prioriteiten.${type}.extra_text_placeholder`)}
              value={extraText} 
              onChange={e => setExtraText(e.target.value)}
              onBlur={handleExtraTextBlur}
              className="min-h-[80px] border-gray-300 focus:border-[#232D4B] focus:ring-[#232D4B]"
            />
          </div>

          <div className="flex justify-between pt-8">
            <Button onClick={onPrevious} variant="outline" className="border-[#232D4B] text-[#232D4B] hover:bg-blue-50">
              {t('common.button.previous')}
            </Button>
            <Button 
              onClick={onNext} 
              className={`font-semibold px-8 ${canProceed ? "bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} 
              disabled={!canProceed}
            >
              {t('common.button.next')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (subStep === 'activiteiten') {
    return renderKeywordsPage(
      'activiteiten',
      selectedActiviteiten,
      (keywords) => setSelectedActiviteiten(keywords),
      extraTexts.activiteiten,
      (text) => setExtraTexts(prev => ({ ...prev, activiteiten: text }))
    );
  }

  if (subStep === 'werkomstandigheden') {
    return renderKeywordsPage(
      'werkomstandigheden',
      selectedWerkomstandigheden,
      (keywords) => setSelectedWerkomstandigheden(keywords),
      extraTexts.werkomstandigheden,
      (text) => setExtraTexts(prev => ({ ...prev, werkomstandigheden: text }))
    );
  }

  if (subStep === 'interesses') {
    return renderKeywordsPage(
      'interesses',
      selectedInteresses,
      (keywords) => setSelectedInteresses(keywords),
      extraTexts.interesses,
      (text) => setExtraTexts(prev => ({ ...prev, interesses: text }))
    );
  }

  return null;
};

export default PersoonsprofielInline;
