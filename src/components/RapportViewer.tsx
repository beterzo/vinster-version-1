import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, ArrowLeft, Download } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('rapport.back_to_dashboard')}
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              className="gap-2 bg-vinster-blue hover:bg-vinster-blue/90"
            >
              <Printer className="w-4 h-4" />
              {t('rapport.print')}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div ref={printRef} className="max-w-4xl mx-auto px-6 py-8 print:p-0 print:max-w-none">
        
        {/* Page 1: Voorblad */}
        <div className="bg-gradient-to-br from-vinster-blue to-vinster-blue/80 text-white rounded-3xl p-12 mb-8 print:rounded-none print:mb-0 print:page-break-after-always min-h-[600px] flex flex-col justify-center">
          <div className="text-center">
            <img 
              src="/lovable-uploads/e35e2329-dbcb-46a6-a616-711bf30bfe4f.png" 
              alt="Vinster Logo" 
              className="h-24 mx-auto mb-8 brightness-0 invert"
            />
            <h1 className="text-5xl font-bold mb-4">{t('rapport.voorblad.title')}</h1>
            <p className="text-xl opacity-90 mb-12">{t('rapport.voorblad.subtitle')}</p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
              <div className="text-left space-y-3">
                <p className="text-lg">
                  <span className="opacity-70">{t('rapport.voorblad.naam')}:</span>{' '}
                  <strong>{reportContent.voorblad.naam}</strong>
                </p>
                <p className="text-lg">
                  <span className="opacity-70">{t('rapport.voorblad.start_datum')}:</span>{' '}
                  <strong>{reportContent.voorblad.start_datum}</strong>
                </p>
                <p className="text-lg">
                  <span className="opacity-70">{t('rapport.voorblad.eind_datum')}:</span>{' '}
                  <strong>{reportContent.voorblad.eind_datum}</strong>
                </p>
                {roundNumber && (
                  <p className="text-lg">
                    <span className="opacity-70">{t('rapport.voorblad.ronde')}:</span>{' '}
                    <strong>{roundNumber}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page 2: Jouw ideale functie-inhoud */}
        <Card className="p-8 mb-8 print:shadow-none print:border-0 print:page-break-after-always">
          <h2 className="text-3xl font-bold text-vinster-blue mb-8">{t('rapport.ideale_functie.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Activiteiten */}
            <div>
              <h3 className="text-xl font-semibold text-vinster-blue mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-vinster-blue text-sm font-bold">1</span>
                {t('rapport.ideale_functie.activiteiten')}
              </h3>
              <ul className="space-y-2">
                {reportContent.ideale_functie.activiteiten.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Werkomgeving */}
            <div>
              <h3 className="text-xl font-semibold text-vinster-blue mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#78BFE3] rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                {t('rapport.ideale_functie.werkomgeving')}
              </h3>
              <ul className="space-y-2">
                {reportContent.ideale_functie.werkomgeving.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-[#78BFE3] mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Interessegebieden */}
            <div>
              <h3 className="text-xl font-semibold text-vinster-blue mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-vinster-blue rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                {t('rapport.ideale_functie.interessegebieden')}
              </h3>
              <ul className="space-y-2">
                {reportContent.ideale_functie.interessegebieden.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-vinster-blue mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Page 3: Mogelijke beroepen */}
        <Card className="p-8 mb-8 print:shadow-none print:border-0 print:page-break-after-always">
          <h2 className="text-3xl font-bold text-vinster-blue mb-8">{t('rapport.beroepen.title')}</h2>
          
          <div className="space-y-6">
            {/* Passend 1 */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t('rapport.beroepen.passend')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {reportContent.beroepen.passend_1.titel}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {reportContent.beroepen.passend_1.beschrijving}
              </p>
            </div>

            {/* Passend 2 */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t('rapport.beroepen.passend')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {reportContent.beroepen.passend_2.titel}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {reportContent.beroepen.passend_2.beschrijving}
              </p>
            </div>

            {/* Verrassend */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t('rapport.beroepen.verrassend')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {reportContent.beroepen.verrassend.titel}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {reportContent.beroepen.verrassend.beschrijving}
              </p>
            </div>
          </div>
        </Card>

        {/* Page 4: Onderzoeksplan deel 1 */}
        <Card className="p-8 mb-8 print:shadow-none print:border-0 print:page-break-after-always">
          <h2 className="text-3xl font-bold text-vinster-blue mb-4">{t('rapport.onderzoeksplan.title')}</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              {t('rapport.onderzoeksplan.intro')}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-vinster-blue mb-4">{t('rapport.onderzoeksplan.stappenplan')}</h3>
          
          <ol className="space-y-4">
            {onderzoeksplanStappen.map((stap, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-vinster-blue text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{stap}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Page 5: Onderzoeksplan deel 2 */}
        <Card className="p-8 print:shadow-none print:border-0">
          <h3 className="text-xl font-semibold text-vinster-blue mb-6">{t('rapport.onderzoeksplan.vervolg')}</h3>
          
          <ol className="space-y-4 mb-8" start={6}>
            {vervolgStappen.map((stap, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-vinster-blue text-white rounded-full flex items-center justify-center font-bold">
                  {index + 6}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{stap}</p>
              </li>
            ))}
          </ol>

          <div className="bg-gradient-to-r from-vinster-blue to-vinster-blue/80 text-white p-8 rounded-2xl text-center">
            <p className="text-xl font-medium">
              {t('rapport.onderzoeksplan.afsluiting')}
            </p>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
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
