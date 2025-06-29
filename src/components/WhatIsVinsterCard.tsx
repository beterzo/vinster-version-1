
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const WhatIsVinsterCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full" style={{
      backgroundColor: '#A8C6E3'
    }}>
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left">
          {t('landing.what_is_vinster.title').replace('Vinster', <span style={{ color: '#FFCD3E' }}>Vinster</span>)}
        </h2>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95 text-left">
          {t('landing.what_is_vinster.description').replace('Vinster', <span style={{ color: '#FFCD3E' }}>Vinster</span>)}
        </p>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95 text-left">
          {t('landing.what_is_vinster.based_on')}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#FFCD3E' }} />
            <span className="text-base md:text-lg">{t('landing.what_is_vinster.two_matching_functions')}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#FFCD3E' }} />
            <span className="text-base md:text-lg">{t('landing.what_is_vinster.one_surprising_suggestion')}</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#FFCD3E' }} />
            <span className="text-base md:text-lg">{t('landing.what_is_vinster.clear_action_plan')}</span>
          </div>
        </div>
        
        <p className="text-base md:text-lg leading-relaxed opacity-95 text-left">
          {t('landing.what_is_vinster.no_tests')}
        </p>
      </div>
    </Card>
  );
};

export default WhatIsVinsterCard;
