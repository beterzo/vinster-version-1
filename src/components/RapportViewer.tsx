import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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

const RapportViewer = ({ reportContent, onBack, roundNumber }: RapportViewerProps) => {
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const onderzoeksplanStappen = [
    t('rapport.onderzoeksplan.stap1'),
    t('rapport.onderzoeksplan.stap2'),
    t('rapport.onderzoeksplan.stap3'),
    t('rapport.onderzoeksplan.stap4'),
    t('rapport.onderzoeksplan.stap5'),
  ];

  const vervolgStappen = [
    t('rapport.onderzoeksplan.stap6'),
    t('rapport.onderzoeksplan.stap7'),
    t('rapport.onderzoeksplan.stap8'),
    t('rapport.onderzoeksplan.stap9'),
    t('rapport.onderzoeksplan.stap10'),
    t('rapport.onderzoeksplan.stap11'),
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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
          
          <Button
            onClick={handlePrint}
            className="gap-2 bg-[#232D4B] hover:bg-[#232D4B]/90"
          >
            <Printer className="w-4 h-4" />
            {t('rapport.print')}
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={printRef} className="max-w-[900px] mx-auto py-8 print:p-0 print:max-w-none space-y-6">
        
        {/* Page 1: Voorblad */}
        <div className="bg-[#232D4B] text-white aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <VinsterSquares />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center px-16">
            <h1 className="text-5xl md:text-6xl font-light italic text-center mb-6">
              Vind werk dat bij je past
            </h1>
            <p className="text-[#F5D54B] text-lg mb-16">www.vinster.ai</p>
            
            <div className="text-left w-full max-w-md space-y-2">
              <p className="text-lg">
                <span className="text-white/70">{t('rapport.voorblad.naam')}:</span>{' '}
                <span className="font-medium">{reportContent.voorblad.naam}</span>
              </p>
              <p className="text-lg">
                <span className="text-white/70">{t('rapport.voorblad.start_datum')}:</span>{' '}
                <span className="font-medium">{reportContent.voorblad.start_datum}</span>
              </p>
              <p className="text-lg">
                <span className="text-white/70">{t('rapport.voorblad.eind_datum')}:</span>{' '}
                <span className="font-medium">{reportContent.voorblad.eind_datum}</span>
              </p>
              {roundNumber && (
                <p className="text-lg">
                  <span className="text-white/70">{t('rapport.voorblad.ronde')}:</span>{' '}
                  <span className="font-medium">{roundNumber}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Vinster logo rechtsonder */}
          <img 
            src="/images/vinster-logo.png" 
            alt="Vinster" 
            className="absolute bottom-8 right-8 h-10 brightness-0 invert"
          />
        </div>

        {/* Page 2: Jouw ideale functie-inhoud */}
        <div className="bg-white border-[8px] border-[#232D4B] aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t('rapport.ideale_functie.title')}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-10"></div>
            
            <div className="space-y-10">
              {/* Activiteiten */}
              <div>
                <h3 className="text-xl font-semibold text-[#0D8FD9] mb-4">
                  {t('rapport.ideale_functie.activiteiten')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {reportContent.ideale_functie.activiteiten.join(', ')}
                </p>
              </div>

              {/* Werkomgeving */}
              <div>
                <h3 className="text-xl font-semibold text-[#0D8FD9] mb-4">
                  {t('rapport.ideale_functie.werkomgeving')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {reportContent.ideale_functie.werkomgeving.join(', ')}
                </p>
              </div>

              {/* Interessegebieden */}
              <div>
                <h3 className="text-xl font-semibold text-[#0D8FD9] mb-4">
                  {t('rapport.ideale_functie.interessegebieden')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {reportContent.ideale_functie.interessegebieden.join(', ')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Paginanummer */}
          <div className="absolute bottom-6 right-8 text-[#232D4B] font-medium">2</div>
        </div>

        {/* Page 3: Mogelijke beroepen */}
        <div className="bg-white border-[8px] border-[#232D4B] aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t('rapport.beroepen.title')}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-10"></div>
            
            <div className="space-y-8">
              {/* Passend 1 */}
              <div>
                <h3 className="text-xl font-bold text-[#0D8FD9] mb-2">
                  {reportContent.beroepen.passend_1.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {reportContent.beroepen.passend_1.beschrijving}
                </p>
              </div>

              {/* Passend 2 */}
              <div>
                <h3 className="text-xl font-bold text-[#0D8FD9] mb-2">
                  {reportContent.beroepen.passend_2.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {reportContent.beroepen.passend_2.beschrijving}
                </p>
              </div>

              {/* Verrassend */}
              <div>
                <h3 className="text-xl font-bold text-[#0D8FD9] mb-2">
                  {reportContent.beroepen.verrassend.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {reportContent.beroepen.verrassend.beschrijving}
                </p>
              </div>
            </div>
          </div>
          
          {/* Paginanummer */}
          <div className="absolute bottom-6 right-8 text-[#232D4B] font-medium">3</div>
        </div>

        {/* Page 4: Onderzoeksplan deel 1 */}
        <div className="bg-white border-[8px] border-[#232D4B] aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {t('rapport.onderzoeksplan.title')}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-8"></div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#0D8FD9] mb-3">En nu?</h3>
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {t('rapport.onderzoeksplan.intro')}
              </p>
            </div>

            <h3 className="text-lg font-semibold text-[#232D4B] mb-4">
              {t('rapport.onderzoeksplan.stappenplan')}
            </h3>
            
            <ol className="space-y-4">
              {onderzoeksplanStappen.map((stap, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-[#232D4B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed text-[15px] pt-0.5">{stap}</p>
                </li>
              ))}
            </ol>
          </div>
          
          {/* Paginanummer */}
          <div className="absolute bottom-6 right-8 text-[#232D4B] font-medium">4</div>
        </div>

        {/* Page 5: Onderzoeksplan deel 2 */}
        <div className="bg-white border-[8px] border-[#232D4B] aspect-[210/297] relative overflow-hidden">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h3 className="text-lg font-semibold text-[#232D4B] mb-6">
              {t('rapport.onderzoeksplan.vervolg')}
            </h3>
            
            <ol className="space-y-4 mb-10">
              {vervolgStappen.map((stap, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-[#232D4B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 6}
                  </span>
                  <p className="text-gray-700 leading-relaxed text-[15px] pt-0.5">{stap}</p>
                </li>
              ))}
            </ol>

            <p className="text-gray-700 italic text-lg mt-8">
              {t('rapport.onderzoeksplan.afsluiting')}
            </p>
          </div>
          
          {/* Vinster logo rechtsonder */}
          <img 
            src="/images/vinster-logo.png" 
            alt="Vinster" 
            className="absolute bottom-8 right-8 h-8"
          />
          
          {/* Paginanummer */}
          <div className="absolute bottom-6 left-10 text-[#232D4B] font-medium">5</div>
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
