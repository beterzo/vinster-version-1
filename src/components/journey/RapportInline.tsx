import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Printer } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";

interface RapportInlineProps {
  roundId: string;
  onNext: () => void;
}

const RapportInline = ({ roundId, onNext }: RapportInlineProps) => {
  const { t } = useTranslation();
  const [reportContent, setReportContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      const { data: report } = await supabase
        .from('user_reports')
        .select('report_content')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();

      if (report?.report_content) {
        setReportContent(report.report_content);
      }
      setLoading(false);
    };

    loadReport();
  }, [roundId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B]" />
      </div>
    );
  }

  if (!reportContent) {
    return (
      <Card className="rounded-3xl shadow-xl border-0 p-12 text-center">
        <p className="text-gray-600">{t('dashboard.round_dashboard.content.locked_message')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Ideale functie sectie - verticaal gestapeld */}
      <Card className="rounded-2xl p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-[#232D4B] mb-6">{t('rapport.ideale_functie.title')}</h3>
        <div className="space-y-6">
          {/* Activiteiten */}
          <div className="p-4 rounded-xl bg-[#FEF3C7] border-l-4 border-[#F5C518]">
            <h4 className="font-semibold text-[#232D4B] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#F5C518] rounded-full flex items-center justify-center text-[#232D4B] text-xs font-bold">1</span>
              {t('rapport.ideale_functie.activiteiten')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {reportContent.ideale_functie?.activiteiten?.map((item: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-[#232D4B] border border-[#F5C518]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Werkomgeving */}
          <div className="p-4 rounded-xl bg-[#E8F4FD] border-l-4 border-[#78BFE3]">
            <h4 className="font-semibold text-[#232D4B] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#78BFE3] rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
              {t('rapport.ideale_functie.werkomgeving')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {reportContent.ideale_functie?.werkomgeving?.map((item: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-[#232D4B] border border-[#78BFE3]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Interessegebieden */}
          <div className="p-4 rounded-xl bg-[#E8F4FD] border-l-4 border-[#232D4B]">
            <h4 className="font-semibold text-[#232D4B] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#232D4B] rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
              {t('rapport.ideale_functie.interessegebieden')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {reportContent.ideale_functie?.interessegebieden?.map((item: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-[#232D4B] border border-[#232D4B]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Beroepen sectie */}
      <Card className="rounded-2xl p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-[#232D4B] mb-6">{t('rapport.beroepen.title')}</h3>
        <div className="space-y-4">
          {/* Passend 1 - Donkerblauw */}
          {reportContent.beroepen?.passend_1 && (
            <div className="border-l-4 p-4 rounded-r-xl bg-[#E8F4FD]" style={{ borderColor: '#232D4B' }}>
              <span className="px-3 py-1 rounded-full text-xs font-medium text-white mb-2 inline-block bg-[#232D4B]">
                {t('rapport.beroepen.passend')}
              </span>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{reportContent.beroepen.passend_1.titel}</h4>
              <p className="text-gray-700">{reportContent.beroepen.passend_1.beschrijving}</p>
            </div>
          )}
          
          {/* Passend 2 - Donkerblauw */}
          {reportContent.beroepen?.passend_2 && (
            <div className="border-l-4 p-4 rounded-r-xl bg-[#E8F4FD]" style={{ borderColor: '#232D4B' }}>
              <span className="px-3 py-1 rounded-full text-xs font-medium text-white mb-2 inline-block bg-[#232D4B]">
                {t('rapport.beroepen.passend')}
              </span>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{reportContent.beroepen.passend_2.titel}</h4>
              <p className="text-gray-700">{reportContent.beroepen.passend_2.beschrijving}</p>
            </div>
          )}
          
          {/* Verrassend - Lichtblauw */}
          {reportContent.beroepen?.verrassend && (
            <div className="border-l-4 p-4 rounded-r-xl bg-[#E8F4FD]" style={{ borderColor: '#78BFE3' }}>
              <span className="px-3 py-1 rounded-full text-xs font-medium text-white mb-2 inline-block bg-[#78BFE3]">
                {t('rapport.beroepen.verrassend')}
              </span>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{reportContent.beroepen.verrassend.titel}</h4>
              <p className="text-gray-700">{reportContent.beroepen.verrassend.beschrijving}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="border-[#232D4B] text-[#232D4B] hover:bg-blue-50"
        >
          <Printer className="w-4 h-4 mr-2" />
          {t('dashboard.round_dashboard.actions.print_button')}
        </Button>
        <Button 
          onClick={onNext}
          className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8"
        >
          {t('common.button.next')}
        </Button>
      </div>
    </div>
  );
};

export default RapportInline;
