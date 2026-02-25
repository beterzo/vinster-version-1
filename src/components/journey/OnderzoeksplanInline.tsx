import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface OnderzoeksplanInlineProps {
  subStep: 'page1' | 'page2' | 'page3';
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
}

const OnderzoeksplanInline = ({ subStep, onNext, onPrevious, onComplete }: OnderzoeksplanInlineProps) => {
  const { t } = useTranslation();

  if (subStep === 'page1') {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-8 md:px-10 max-w-[720px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#232D4B] mb-6">
            {t('journey.onderzoeksplan.page1.title')}
          </h1>
        </div>
        
        <div className="space-y-6 text-lg text-gray-700">
          <p>{t('journey.onderzoeksplan.page1.intro')}</p>
          <p className="font-medium text-[#232D4B]">
            {t('journey.onderzoeksplan.page1.instruction')}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#f0f0f0]">
          <Button 
            onClick={onPrevious}
            variant="outline"
            className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] min-h-[48px] px-7 font-semibold hover:bg-[#1a2e5a]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('journey.onderzoeksplan.previous_button')}
          </Button>
          <Button 
            onClick={onNext}
            className="bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white rounded-[10px] min-h-[48px] px-7 font-semibold transition-all duration-150"
          >
            {t('journey.onderzoeksplan.next_button')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (subStep === 'page2') {
    const steps = [
      t('journey.onderzoeksplan.page2.step1'),
      t('journey.onderzoeksplan.page2.step2'),
      t('journey.onderzoeksplan.page2.step3'),
      t('journey.onderzoeksplan.page2.step4'),
      t('journey.onderzoeksplan.page2.step5'),
      t('journey.onderzoeksplan.page2.step6'),
      t('journey.onderzoeksplan.page2.step7'),
      t('journey.onderzoeksplan.page2.step8'),
      t('journey.onderzoeksplan.page2.step9'),
      t('journey.onderzoeksplan.page2.step10'),
    ];

    return (
      <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-8 md:px-10 max-w-[720px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B] mb-4">
          {t('journey.onderzoeksplan.page2.title')}
        </h1>

        <p className="text-[0.95rem] leading-[1.7] text-[#6b7280] pb-5 border-b-2 border-[#f0f0f0] mb-5">
          {t('journey.onderzoeksplan.page1.instruction')}
        </p>
        
        <div>
          {steps.map((step, index) => (
            <div key={index}>
              {/* Phase dividers after step 3 and step 6 */}
              {(index === 3 || index === 6) && (
                <div className="border-t-2 border-[#F5C518] my-2 opacity-40" />
              )}
              <div className={`flex items-start gap-4 py-4 ${index < steps.length - 1 ? 'border-b border-[#f0f0f0]' : ''}`}>
                <span className="w-8 h-8 min-w-[32px] rounded-full bg-[#1a2e5a] text-white text-[0.8rem] font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151] flex-1">{step}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#f0f0f0]">
          <Button 
            onClick={onPrevious}
            variant="outline"
            className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] min-h-[48px] px-7 font-semibold hover:bg-[#1a2e5a]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('journey.onderzoeksplan.previous_button')}
          </Button>
          <Button 
            onClick={onNext}
            className="bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white rounded-[10px] min-h-[48px] px-7 font-semibold transition-all duration-150"
          >
            {t('journey.onderzoeksplan.next_button')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // page3
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-8 md:px-10 max-w-[720px] mx-auto">
      <div className="bg-[#fffbeb] border-l-4 border-[#F5C518] rounded-2xl p-6 mb-8">
        <p className="text-[#232D4B] leading-relaxed text-lg">
          {t('journey.onderzoeksplan.page3.closing_text')}
        </p>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#f0f0f0]">
        <Button 
          onClick={onPrevious}
          variant="outline"
          className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] min-h-[48px] px-7 font-semibold hover:bg-[#1a2e5a]/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('journey.onderzoeksplan.previous_button')}
        </Button>
        <Button 
          onClick={() => {
            onComplete?.();
            onNext();
          }}
          className="bg-[#1a2e5a] hover:bg-[#142347] hover:-translate-y-[1px] text-white rounded-[10px] min-h-[48px] px-7 font-semibold transition-all duration-150"
        >
          {t('journey.onderzoeksplan.to_zoekprofiel_button')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnderzoeksplanInline;
