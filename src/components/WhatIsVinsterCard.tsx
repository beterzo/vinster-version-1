
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const WhatIsVinsterCard = () => {
  const { t } = useTranslation();

  const renderTextWithHighlight = (text: string, highlight: string) => {
    const textStr = typeof text === 'string' ? text : String(text);
    const parts = textStr.split(highlight);
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span className="text-[#F5C518] font-bold">{highlight}</span>
        )}
      </span>
    ));
  };

  const title = String(t('landing.what_is_vinster.title') || '');
  const description = String(t('landing.what_is_vinster.description') || '');
  const basedOn = String(t('landing.what_is_vinster.based_on') || '');
  const twoMatchingFunctions = String(t('landing.what_is_vinster.two_matching_functions') || '');
  const oneSurprisingSuggestion = String(t('landing.what_is_vinster.one_surprising_suggestion') || '');
  const clearActionPlan = String(t('landing.what_is_vinster.clear_action_plan') || '');
  const noTests = String(t('landing.what_is_vinster.no_tests') || '');

  return (
    <Card className="p-8 md:p-10 rounded-3xl border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden h-full bg-white">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left text-[#232D4B]">
          {renderTextWithHighlight(title, 'Vinster')}
        </h2>
        
        <p className="text-base md:text-lg leading-relaxed text-left text-gray-700">
          {renderTextWithHighlight(description, 'Vinster')}
        </p>
        
        <p className="text-base md:text-lg leading-relaxed text-left text-gray-700">
          {basedOn}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-[#F5C518]" />
            <span className="text-base md:text-lg text-[#232D4B]">{twoMatchingFunctions}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-[#F5C518]" />
            <span className="text-base md:text-lg text-[#232D4B]">{oneSurprisingSuggestion}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-[#F5C518]" />
            <span className="text-base md:text-lg text-[#232D4B]">{clearActionPlan}</span>
          </div>
        </div>
        
        <p className="text-base md:text-lg leading-relaxed text-left text-gray-700">
          {noTests}
        </p>
      </div>
    </Card>
  );
};

export default WhatIsVinsterCard;
