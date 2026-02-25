import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Printer, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatKeywordsForReport, boldQuotedKeywords } from "@/utils/keywordUtils";

interface RapportInlineProps {
  roundId: string;
  subStep: 'confirm' | 'complete';
  onNext: () => void;
  onPrevious: () => void;
  onReportGenerated: () => void;
  organisationTypeId?: string | null;
}

// Print-only cover page component - White background, dark blue text
const PrintCoverPage = ({ userName, startDate }: { userName: string; startDate: string }) => (
  <div className="print-page bg-white relative overflow-hidden" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    {/* Main content */}
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-20">
      <h1 className="text-7xl font-bold text-[#232D4B] mb-6 leading-tight">
        Vind werk dat<br />bij je past
      </h1>
      <p className="text-[#F5C518] text-3xl mb-24">www.vinster.ai</p>
      
      <div className="space-y-3">
        <p className="text-3xl font-bold text-[#232D4B]">{userName}</p>
        <p className="text-2xl text-gray-500">{startDate}</p>
      </div>
    </div>

    {/* Decorative squares - bottom left */}
    <div className="absolute bottom-16 left-16 flex gap-3">
      <div className="w-10 h-10 bg-[#78BFE3]"></div>
      <div className="w-10 h-10 bg-[#F5C518]"></div>
      <div className="w-10 h-10 bg-[#78BFE3]"></div>
    </div>
    <div className="absolute bottom-28 left-16 flex gap-3">
      <div className="w-10 h-10 bg-[#F5C518]"></div>
      <div className="w-10 h-10 bg-white border-2 border-[#78BFE3]"></div>
    </div>

    {/* Vinster logo - bottom right */}
    <img 
      src="/images/vinster-logo-print.png" 
      alt="Vinster" 
      className="absolute bottom-16 right-16 h-16 object-contain"
    />
  </div>
);

// Print-only ideale functie page - No border, decorative sidebar only
const PrintIdealeFunctiePage = ({ reportContent, t }: { reportContent: any; t: (key: string) => string }) => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    {/* Content area - no border */}
    <div className="p-16 h-full relative">
      {/* Title with yellow underline */}
      <div className="mb-14">
        <h2 className="text-5xl font-bold text-[#232D4B] mb-4">Jouw ideale functie-inhoud</h2>
        <div className="w-80 h-2 bg-[#F5C518]"></div>
      </div>

      {/* Three sections with overflow protection */}
      <div className="space-y-10">
        {/* Activiteiten */}
        <div>
          <h3 className="text-3xl font-semibold text-[#78BFE3] mb-4">Wat je graag doet</h3>
          <p className="text-xl text-gray-800 leading-relaxed line-clamp-6 overflow-hidden break-words">
            {formatKeywordsForReport(reportContent.ideale_functie?.activiteiten || [])}
          </p>
        </div>

        {/* Werkomgeving */}
        <div>
          <h3 className="text-3xl font-semibold text-[#78BFE3] mb-4">Jouw ideale werkomgeving</h3>
          <p className="text-xl text-gray-800 leading-relaxed line-clamp-6 overflow-hidden break-words">
            {formatKeywordsForReport(reportContent.ideale_functie?.werkomgeving || [])}
          </p>
        </div>

        {/* Interessegebieden */}
        <div>
          <h3 className="text-3xl font-semibold text-[#78BFE3] mb-4">Jouw interessegebieden</h3>
          <p className="text-xl text-gray-800 leading-relaxed line-clamp-6 overflow-hidden break-words">
            {formatKeywordsForReport(reportContent.ideale_functie?.interessegebieden || [])}
          </p>
        </div>
      </div>

      {/* Decorative sidebar - right edge of page */}
      <div className="absolute right-0 top-1/3 flex flex-col gap-3">
        <div className="w-5 h-20 bg-[#F5C518]"></div>
        <div className="w-5 h-20 bg-[#78BFE3]"></div>
        <div className="w-5 h-20 bg-[#232D4B]"></div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-8 right-8 text-base text-gray-400">
        Pagina 1 van 2
      </div>
    </div>
  </div>
);

// Print-only beroepen page - No border, decorative sidebar only
const PrintBeroepenPage = ({ reportContent, t }: { reportContent: any; t: (key: string) => string }) => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm' }}>
    {/* Content area - no border */}
    <div className="p-16 h-full relative">
      {/* Title with yellow underline */}
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-[#232D4B] mb-4">Mogelijke beroepen</h2>
        <div className="w-80 h-2 bg-[#F5C518]"></div>
      </div>

      {/* Three professions with overflow protection */}
      <div className="space-y-8">
        {/* Beroep 1 */}
        {reportContent.beroepen?.passend_1 && (
          <div>
            <h3 className="text-3xl font-semibold text-[#78BFE3] mb-3">
              {reportContent.beroepen.passend_1.titel}
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed break-words">
              {reportContent.beroepen.passend_1.beschrijving}
            </p>
          </div>
        )}

        {/* Beroep 2 */}
        {reportContent.beroepen?.passend_2 && (
          <div>
            <h3 className="text-3xl font-semibold text-[#78BFE3] mb-3">
              {reportContent.beroepen.passend_2.titel}
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed break-words">
              {reportContent.beroepen.passend_2.beschrijving}
            </p>
          </div>
        )}

        {/* Beroep 3 (verrassend) */}
        {reportContent.beroepen?.verrassend && (
          <div>
            <h3 className="text-3xl font-semibold text-[#78BFE3] mb-3">
              {reportContent.beroepen.verrassend.titel}
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed break-words">
              {reportContent.beroepen.verrassend.beschrijving}
            </p>
          </div>
        )}
      </div>

      {/* Decorative sidebar - right edge of page */}
      <div className="absolute right-0 top-1/3 flex flex-col gap-3">
        <div className="w-5 h-20 bg-[#F5C518]"></div>
        <div className="w-5 h-20 bg-[#78BFE3]"></div>
        <div className="w-5 h-20 bg-[#232D4B]"></div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-8 right-8 text-base text-gray-400">
        Pagina 2 van 2
      </div>
    </div>
  </div>
);

const RapportInline = ({ roundId, subStep, onNext, onPrevious, onReportGenerated, organisationTypeId }: RapportInlineProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportContent, setReportContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      // Load report content
      const { data: report } = await supabase
        .from('user_reports')
        .select('report_content')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();

      if (report?.report_content) {
        setReportContent(report.report_content);
      }

      // Load user profile for name
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setUserName(`${profile.first_name} ${profile.last_name}`);
        }
      }

      // Load round start date
      const { data: round } = await supabase
        .from('user_rounds')
        .select('started_at')
        .eq('id', roundId)
        .maybeSingle();

      if (round?.started_at) {
        const date = new Date(round.started_at);
        setStartDate(date.toLocaleDateString('nl-NL', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }));
      }

      setLoading(false);
    };

    loadReport();
  }, [roundId, user]);

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
          language: user.user_metadata?.language || 'nl',
          ...(organisationTypeId ? { organisation_type_id: organisationTypeId } : {})
        }
      });

      if (error) {
        console.error('❌ Error calling edge function:', error);
        throw error;
      }

      console.log('✅ Report generated successfully:', data);

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
      <div className="fixed bottom-6 right-6 z-50 bg-[#1a2e5a] text-white rounded-[10px] px-5 py-3 flex items-center gap-3 shadow-lg text-sm font-medium">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {t('common.rapport_confirmatie.generating')}
      </div>
    );
  }

  // Confirm subStep - show confirmation screen with warning
  if (subStep === 'confirm') {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-12">
          <h1 className="text-4xl font-bold text-[#232D4B] mb-4 text-center">
            {t('journey.loopbaanrapport.intro.title')}
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            {t('journey.loopbaanrapport.intro.subtitle')}
          </p>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('journey.loopbaanrapport.intro.description')}
            </p>
            
            <h3 className="text-xl font-bold text-[#232D4B] mb-4">
              {t('journey.loopbaanrapport.intro.what_you_get_title')}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-[#232D4B] flex-shrink-0 mt-0.5" />
                <span>{t('journey.loopbaanrapport.intro.what_you_get_item1')}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-[#232D4B] flex-shrink-0 mt-0.5" />
                <span>{t('journey.loopbaanrapport.intro.what_you_get_item2')}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleGenerateReport} 
              disabled={isGenerating} 
              className="w-full sm:w-auto text-lg px-8 py-6 bg-[#232D4B] hover:bg-[#1a2350] text-white font-bold h-12"
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
    <>
      {/* Screen content - hidden when printing */}
      <div className="space-y-8 print:hidden">
        {/* Ideale functie sectie - verticaal gestapeld */}
        <Card className="rounded-2xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-[#232D4B] mb-6">{t('rapport.ideale_functie.title')}</h3>
          <div className="space-y-6">
            {/* Activiteiten */}
            <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#F5C518] p-8">
              <h4 className="text-lg font-bold text-[#1a2e5a] mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#F5C518] text-[#1a2e5a] rounded-full flex items-center justify-center text-sm font-bold">1</span>
                {t('rapport.ideale_functie.activiteiten')}
              </h4>
              <div className="flex flex-wrap">
                {reportContent.ideale_functie?.activiteiten?.map((item: string, i: number) => (
                  <span key={i} className="inline-flex items-center bg-[#fffbeb] text-[#92400e] border border-[#fde68a] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Werkomgeving */}
            <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-8">
              <h4 className="text-lg font-bold text-[#1a2e5a] mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#1a2e5a] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                {t('rapport.ideale_functie.werkomgeving')}
              </h4>
              <div className="flex flex-wrap">
                {reportContent.ideale_functie?.werkomgeving?.map((item: string, i: number) => (
                  <span key={i} className="inline-flex items-center bg-[#f3f4f6] text-[#1a2e5a] border border-[#e5e7eb] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Interessegebieden */}
            <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#16a34a] p-8">
              <h4 className="text-lg font-bold text-[#1a2e5a] mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                {t('rapport.ideale_functie.interessegebieden')}
              </h4>
              <div className="flex flex-wrap">
                {reportContent.ideale_functie?.interessegebieden?.map((item: string, i: number) => (
                  <span key={i} className="inline-flex items-center bg-[#f3f4f6] text-[#1a2e5a] border border-[#e5e7eb] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]">
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
          <div className="space-y-5">
            {/* Passend 1 */}
            {reportContent.beroepen?.passend_1 && (
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#16a34a] text-white">
                  {t('rapport.beroepen.passend')}
                </span>
                <h4 className="text-lg font-bold text-[#1a2e5a] mb-2">{reportContent.beroepen.passend_1.titel}</h4>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151]">{boldQuotedKeywords(reportContent.beroepen.passend_1.beschrijving)}</p>
              </div>
            )}
            
            {/* Passend 2 */}
            {reportContent.beroepen?.passend_2 && (
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#16a34a] text-white">
                  {t('rapport.beroepen.passend')}
                </span>
                <h4 className="text-lg font-bold text-[#1a2e5a] mb-2">{reportContent.beroepen.passend_2.titel}</h4>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151]">{boldQuotedKeywords(reportContent.beroepen.passend_2.beschrijving)}</p>
              </div>
            )}
            
            {/* Verrassend */}
            {reportContent.beroepen?.verrassend && (
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5C518] text-[#1a2e5a]">
                  {t('rapport.beroepen.verrassend')}
                </span>
                <h4 className="text-lg font-bold text-[#1a2e5a] mb-2">{reportContent.beroepen.verrassend.titel}</h4>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151]">{boldQuotedKeywords(reportContent.beroepen.verrassend.beschrijving)}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrint}
            className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] px-5 py-2.5 font-semibold text-[0.9rem] flex items-center gap-2 hover:bg-[#1a2e5a]/5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            {t('dashboard.round_dashboard.actions.print_button')}
          </button>
          <Button 
            onClick={onNext}
            className="bg-[#1a2e5a] hover:bg-[#142347] text-white font-semibold px-8"
          >
            {t('common.button.next')}
          </Button>
        </div>
      </div>

      {/* Print-only content - hidden on screen, visible when printing */}
      <div className="hidden print:block print-root">
        <PrintCoverPage userName={userName} startDate={startDate} />
        <PrintIdealeFunctiePage reportContent={reportContent} t={t} />
        <PrintBeroepenPage reportContent={reportContent} t={t} />
      </div>
    </>
  );
};

export default RapportInline;