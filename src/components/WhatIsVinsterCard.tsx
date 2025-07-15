
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const WhatIsVinsterCard = () => {
  const { t } = useTranslation();

  const renderTextWithHighlight = (text: string, highlight: string) => {
    // Ensure text is a string
    const textStr = typeof text === 'string' ? text : String(text);
    const parts = textStr.split(highlight);
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span style={{ color: '#FFCD3E' }}>{highlight}</span>
        )}
      </span>
    ));
  };

  // Get translation strings with safety checks
  const title = String(t('landing.what_is_vinster.title') || '');
  const description = String(t('landing.what_is_vinster.description') || '');
  const basedOn = String(t('landing.what_is_vinster.based_on') || '');
  const twoMatchingFunctions = String(t('landing.what_is_vinster.two_matching_functions') || '');
  const oneSurprisingSuggestion = String(t('landing.what_is_vinster.one_surprising_suggestion') || '');
  const clearActionPlan = String(t('landing.what_is_vinster.clear_action_plan') || '');
  const noTests = String(t('landing.what_is_vinster.no_tests') || '');

  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full" style={{
      backgroundColor: '#A8C6E3'
    }}>
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left">
          {renderTextWithHighlight(title, 'Vinster')}
        </h2>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95 text-left">
          {renderTextWithHighlight(description, 'Vinster')}
        </p>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95 text-left">
          {basedOn}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#FFCD3E' }} />
            <span className="text-base md:text-lg">{twoMatchingFunctions}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#FFCD3E' }} />
            <span className="text-base md:text-lg">{oneSurprisingSuggestion}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#FFCD3E' }} />
            <span className="text-base md:text-lg">{clearActionPlan}</span>
          </div>
        </div>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95 text-left">
          {noTests}
        </p>
      </div>
    </Card>
  );
};

export default WhatIsVinsterCard;
