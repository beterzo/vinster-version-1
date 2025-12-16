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

// Print-only cover page component
const PrintCoverPage = ({ userName, startDate }: { userName: string; startDate: string }) => (
  <div className="print-page bg-[#232D4B] relative overflow-hidden" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    {/* Main content */}
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-20">
      <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
        Vind werk dat<br />bij je past
      </h1>
      <p className="text-[#F5C518] text-3xl mb-24">www.vinster.ai</p>
      
      <div className="text-white space-y-3">
        <p className="text-3xl font-bold">{userName}</p>
        <p className="text-2xl text-gray-300">{startDate}</p>
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
      <div className="w-10 h-10 bg-[#232D4B] border-2 border-[#78BFE3]"></div>
    </div>

    {/* Vinster logo - bottom right */}
    <img 
      src="/images/vinster-logo-print.png" 
      alt="Vinster" 
      className="absolute bottom-16 right-16 h-16 object-contain"
    />
  </div>
);

// Print-only ideale functie page
const PrintIdealeFunctiePage = ({ reportContent, t }: { reportContent: any; t: (key: string) => string }) => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    {/* Dark blue border */}
    <div className="absolute inset-4 border-[6px] border-[#232D4B]">
      {/* Content area */}
      <div className="p-12">
        {/* Title with yellow underline */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#232D4B] mb-3">Jouw ideale functie-inhoud</h2>
          <div className="w-64 h-1.5 bg-[#F5C518]"></div>
        </div>

        {/* Three sections */}
        <div className="space-y-10">
          {/* Activiteiten */}
          <div>
            <h3 className="text-2xl font-semibold text-[#78BFE3] mb-4">Wat je graag doet</h3>
            <p className="text-lg text-gray-800 leading-relaxed">
              {reportContent.ideale_functie?.activiteiten?.join(', ')}
            </p>
          </div>

          {/* Werkomgeving */}
          <div>
            <h3 className="text-2xl font-semibold text-[#78BFE3] mb-4">Jouw ideale werkomgeving</h3>
            <p className="text-lg text-gray-800 leading-relaxed">
              {reportContent.ideale_functie?.werkomgeving?.join(', ')}
            </p>
          </div>

          {/* Interessegebieden */}
          <div>
            <h3 className="text-2xl font-semibold text-[#78BFE3] mb-4">Jouw interessegebieden</h3>
            <p className="text-lg text-gray-800 leading-relaxed">
              {reportContent.ideale_functie?.interessegebieden?.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative sidebar - right */}
      <div className="absolute right-0 top-1/4 flex flex-col gap-2">
        <div className="w-4 h-16 bg-[#F5C518]"></div>
        <div className="w-4 h-16 bg-[#78BFE3]"></div>
        <div className="w-4 h-16 bg-[#232D4B]"></div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-6 right-10 text-base text-gray-500">
        Pagina 1 van 2
      </div>
    </div>
  </div>
);

// Print-only beroepen page
const PrintBeroepenPage = ({ reportContent, t }: { reportContent: any; t: (key: string) => string }) => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm' }}>
    {/* Dark blue border */}
    <div className="absolute inset-4 border-[6px] border-[#232D4B]">
      {/* Content area */}
      <div className="p-12">
        {/* Title with yellow underline */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#232D4B] mb-3">Mogelijke beroepen</h2>
          <div className="w-64 h-1.5 bg-[#F5C518]"></div>
        </div>

        {/* Three professions */}
        <div className="space-y-8">
          {/* Beroep 1 */}
          {reportContent.beroepen?.passend_1 && (
            <div>
              <h3 className="text-2xl font-semibold text-[#78BFE3] mb-3">
                {reportContent.beroepen.passend_1.titel}
              </h3>
              <p className="text-lg text-gray-800 leading-relaxed">
                {reportContent.beroepen.passend_1.beschrijving}
              </p>
            </div>
          )}

          {/* Beroep 2 */}
          {reportContent.beroepen?.passend_2 && (
            <div>
              <h3 className="text-2xl font-semibold text-[#78BFE3] mb-3">
                {reportContent.beroepen.passend_2.titel}
              </h3>
              <p className="text-lg text-gray-800 leading-relaxed">
                {reportContent.beroepen.passend_2.beschrijving}
              </p>
            </div>
          )}

          {/* Beroep 3 (verrassend) */}
          {reportContent.beroepen?.verrassend && (
            <div>
              <h3 className="text-2xl font-semibold text-[#78BFE3] mb-3">
                {reportContent.beroepen.verrassend.titel}
              </h3>
              <p className="text-lg text-gray-800 leading-relaxed">
                {reportContent.beroepen.verrassend.beschrijving}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative sidebar - right */}
      <div className="absolute right-0 top-1/4 flex flex-col gap-2">
        <div className="w-4 h-16 bg-[#F5C518]"></div>
        <div className="w-4 h-16 bg-[#78BFE3]"></div>
        <div className="w-4 h-16 bg-[#232D4B]"></div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-6 right-10 text-base text-gray-500">
        Pagina 2 van 2
      </div>
    </div>
  </div>
);

const RapportInline = ({ roundId, subStep, onNext, onPrevious, onReportGenerated }: RapportInlineProps) => {
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

          <div className="mb-8 p-6 bg-[#FEF3C7] rounded-xl border border-[#F5C518]">
            <p className="text-gray-800">
              <span className="font-bold text-[#232D4B]">{t('journey.loopbaanrapport.intro.warning_title')}: </span>
              {t('journey.loopbaanrapport.intro.warning_text')}
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
    <>
      {/* Screen content - hidden when printing */}
      <div className="space-y-8 print:hidden">
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