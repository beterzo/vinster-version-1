import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatKeywordsForReport, boldQuotedKeywords } from "@/utils/keywordUtils";

interface ReportContent {
  voorblad: {
    naam: string;
    start_datum: string;
    eind_datum: string;
  };
  ideale_functie: {
    activiteiten: string[];
    werkomgeving: string[];
    interessegebieden: string[];
  };
  beroepen: {
    passend_1: {
      titel: string;
      beschrijving: string;
    };
    passend_2: {
      titel: string;
      beschrijving: string;
    };
    verrassend: {
      titel: string;
      beschrijving: string;
    };
  };
}

interface RapportViewerProps {
  reportContent: ReportContent;
  onBack: () => void;
  roundNumber?: number;
}

// Decoratieve Vinster vierkanten component
const VinsterSquares = () => (
  <div className="absolute left-8 top-1/3 flex flex-col gap-3">
    <div className="w-12 h-12 bg-[#F5D54B] rounded-sm"></div>
    <div className="w-12 h-12 bg-[#0D8FD9] rounded-sm"></div>
    <div className="w-12 h-12 bg-[#F5D54B] rounded-sm"></div>
  </div>
);

// Decoratieve zijbalk voor content pagina's
const PageDecoration = () => (
  <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col">
    <div className="flex-1 bg-[#F5D54B]"></div>
    <div className="flex-1 bg-[#0D8FD9]"></div>
  </div>
);

const RapportViewer = ({ reportContent, onBack }: RapportViewerProps) => {
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Action Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('rapport.back_to_dashboard')}
          </Button>
          
          <button
            onClick={handlePrint}
            className="bg-transparent text-[#1a2e5a] border-[1.5px] border-[#1a2e5a] rounded-[10px] px-5 py-2.5 font-semibold text-[0.9rem] flex items-center gap-2 hover:bg-[#1a2e5a]/5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            {t('rapport.print')}
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={printRef} className="max-w-[900px] mx-auto py-8 print:p-0 print:max-w-none space-y-6">
        
        {/* Page 1: Voorblad - alleen logo en naam */}
        <div className="bg-[#232D4B] text-white aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <VinsterSquares />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center px-16">
            {/* Logo groot in het midden */}
            <img 
              src="/images/vinster-logo.png" 
              alt="Vinster" 
              className="h-20 mb-16 brightness-0 invert"
            />
            
            {/* Naam van de gebruiker */}
            <p className="text-3xl md:text-4xl font-medium text-center">
              {reportContent.voorblad.naam}
            </p>
          </div>
        </div>

        {/* Page 2: Jouw ideale functie-inhoud */}
        <div className="bg-white border-[8px] border-[#232D4B] aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t('rapport.ideale_functie.title')}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-10"></div>
            
            <div className="space-y-6">
              {/* Activiteiten */}
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#F5C518] p-6">
                <h4 className="text-lg font-bold text-[#1a2e5a] mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#F5C518] text-[#1a2e5a] rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  {t('rapport.ideale_functie.activiteiten')}
                </h4>
                <div className="flex flex-wrap">
                  {reportContent.ideale_functie.activiteiten?.map((item: string, i: number) => (
                    <span key={i} className="inline-flex items-center bg-[#fffbeb] text-[#92400e] border border-[#fde68a] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Werkomgeving */}
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6">
                <h4 className="text-lg font-bold text-[#1a2e5a] mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#1a2e5a] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  {t('rapport.ideale_functie.werkomgeving')}
                </h4>
                <div className="flex flex-wrap">
                  {reportContent.ideale_functie.werkomgeving?.map((item: string, i: number) => (
                    <span key={i} className="inline-flex items-center bg-[#f3f4f6] text-[#1a2e5a] border border-[#e5e7eb] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interessegebieden */}
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#16a34a] p-6">
                <h4 className="text-lg font-bold text-[#1a2e5a] mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  {t('rapport.ideale_functie.interessegebieden')}
                </h4>
                <div className="flex flex-wrap">
                  {reportContent.ideale_functie.interessegebieden?.map((item: string, i: number) => (
                    <span key={i} className="inline-flex items-center bg-[#f3f4f6] text-[#1a2e5a] border border-[#e5e7eb] rounded-full px-3 py-1 text-[0.8rem] font-semibold m-[3px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Paginanummer */}
          <div className="absolute bottom-6 right-8 text-[#232D4B] font-medium">2</div>
        </div>

        {/* Page 3: Mogelijke beroepen */}
        <div className="bg-white border-[8px] border-[#232D4B] aspect-[210/297] relative overflow-hidden">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t('rapport.beroepen.title')}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-10"></div>
            
            <div className="space-y-5">
              {/* Beroep 1 */}
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#16a34a] text-white">
                  {t('rapport.beroepen.passend')}
                </span>
                <h3 className="text-lg font-bold text-[#1a2e5a] mb-2">
                  {reportContent.beroepen.passend_1.titel}
                </h3>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151]">
                  {boldQuotedKeywords(reportContent.beroepen.passend_1.beschrijving)}
                </p>
              </div>

              {/* Beroep 2 */}
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#16a34a] text-white">
                  {t('rapport.beroepen.passend')}
                </span>
                <h3 className="text-lg font-bold text-[#1a2e5a] mb-2">
                  {reportContent.beroepen.passend_2.titel}
                </h3>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151]">
                  {boldQuotedKeywords(reportContent.beroepen.passend_2.beschrijving)}
                </p>
              </div>

              {/* Beroep 3 (verrassend) */}
              <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#f0f0f0] border-l-[5px] border-l-[#1a2e5a] p-6 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5C518] text-[#1a2e5a]">
                  {t('rapport.beroepen.verrassend')}
                </span>
                <h3 className="text-lg font-bold text-[#1a2e5a] mb-2">
                  {reportContent.beroepen.verrassend.titel}
                </h3>
                <p className="text-[0.95rem] leading-[1.7] text-[#374151]">
                  {boldQuotedKeywords(reportContent.beroepen.verrassend.beschrijving)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Paginanummer */}
          <div className="absolute bottom-6 right-8 text-[#232D4B] font-medium">3</div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:page-break-after-always {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
};

export default RapportViewer;
