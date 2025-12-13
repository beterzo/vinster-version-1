import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Printer, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RapportInlineProps {
  roundId: string;
  subStep: 'confirm' | 'complete';
  onNext: () => void;
  onPrevious: () => void;
  onReportGenerated: () => void;
}

const RapportInline = ({ roundId, subStep, onNext, onPrevious, onReportGenerated }: RapportInlineProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportContent, setReportContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateReport = async () => {
    if (!user) {
      toast({
        title: t('common.toast.no_user_found'),
        description: t('common.toast.no_user_found_description'),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🚀 Starting AI report generation for user:', user.id, 'round:', roundId);

      const { data, error } = await supabase.functions.invoke('generate-career-report', {
        body: {
          user_id: user.id,
          round_id: roundId,
          language: user.user_metadata?.language || 'nl'
        }
      });

      if (error) {
        console.error('❌ Error calling edge function:', error);
        throw error;
      }

      console.log('✅ Report generated successfully:', data);

      // Update round status to completed
      const { error: roundError } = await supabase
        .from('user_rounds')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', roundId);

      if (roundError) {
        console.error('❌ Error updating round status:', roundError);
      }

      // Reload report content
      const { data: report } = await supabase
        .from('user_reports')
        .select('report_content')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();

      if (report?.report_content) {
        setReportContent(report.report_content);
      }

      toast({
        title: t('common.rapport_confirmatie.generating'),
        description: t('common.rapport_confirmatie.please_wait')
      });

      onReportGenerated();
      onNext();
    } catch (error) {
      console.error('❌ Error generating report:', error);
      toast({
        title: t('common.toast.generate_error'),
        description: t('common.toast.generate_error_description'),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Confirm subStep - show confirmation screen
  if (subStep === 'confirm') {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold text-[#232D4B] mb-4 text-center">
            {t('common.rapport_confirmatie.title')}
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            {t('common.rapport_confirmatie.subtitle')}
          </p>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#232D4B] mb-4">
              {t('common.rapport_confirmatie.summary_title')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-[#232D4B] flex-shrink-0" />
                <span className="text-lg">
                  <strong>{t('common.rapport_confirmatie.summary_enthousiasme')}</strong>: {t('common.rapport_confirmatie.completed')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-[#232D4B] flex-shrink-0" />
                <span className="text-lg">
                  <strong>{t('common.rapport_confirmatie.summary_wensberoepen')}</strong>: {t('common.rapport_confirmatie.completed')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-6 h-6 text-[#232D4B] flex-shrink-0" />
                <span className="text-lg">
                  <strong>{t('common.rapport_confirmatie.summary_prioriteiten')}</strong>: {t('common.rapport_confirmatie.completed')}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-blue-50 rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              {t('common.rapport_confirmatie.info_text')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onPrevious} 
              disabled={isGenerating} 
              className="text-lg px-8 py-6 border-[#232D4B] text-[#232D4B]"
            >
              {t('common.button.previous')}
            </Button>
            <Button 
              size="lg" 
              onClick={handleGenerateReport} 
              disabled={isGenerating} 
              className="text-lg px-8 py-6 bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('common.rapport_confirmatie.generating')}
                </>
              ) : (
                t('common.rapport_confirmatie.confirm_button')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Complete subStep - show the report
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