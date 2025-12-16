import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
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

            <div className="flex justify-between mt-10">
              <Button 
                onClick={onPrevious}
                variant="outline"
                className="font-semibold px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('journey.onderzoeksplan.previous_button')}
              </Button>
              <Button 
                onClick={onNext}
                className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8 py-3"
              >
                {t('journey.onderzoeksplan.next_button')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B] mb-8">
              {t('journey.onderzoeksplan.page2.title')}
            </h1>
            
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#232D4B] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>

            <div className="flex justify-between mt-10">
              <Button 
                onClick={onPrevious}
                variant="outline"
                className="font-semibold px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('journey.onderzoeksplan.previous_button')}
              </Button>
              <Button 
                onClick={onNext}
                className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8"
              >
                {t('journey.onderzoeksplan.next_button')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // page3
  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-8 md:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#E8F4FD] rounded-2xl p-6 mb-8">
            <p className="text-[#232D4B] leading-relaxed text-lg">
              {t('journey.onderzoeksplan.page3.closing_text')}
            </p>
          </div>

          <div className="flex justify-between">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="font-semibold px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('journey.onderzoeksplan.previous_button')}
            </Button>
            <Button 
              onClick={() => {
                onComplete?.();
                onNext();
              }}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8"
            >
              {t('journey.onderzoeksplan.to_zoekprofiel_button')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnderzoeksplanInline;