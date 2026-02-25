import { useTranslation } from "@/hooks/useTranslation";

interface ZoekprofielContent {
  functie_zin: string;
  kerntaken_zin: string;
  sector_zin: string;
  organisatie_zin: string;
  regio_zin: string;
  voorwaarden_zin: string;
  samenvatting: string;
}

interface ZoekprofielViewerProps {
  content: ZoekprofielContent;
  userName?: string;
}

const ZoekprofielViewer = ({ content, userName }: ZoekprofielViewerProps) => {
  const { t, language } = useTranslation();

  // Language-specific headings
  const headings: Record<string, Record<string, string>> = {
    nl: {
      functie: "Ik ga voor een functie als",
      kerntaken: "Met de volgende kerntaken",
      sector: "In de sector",
      organisatie: "Bij een",
      regio: "In deze regio",
      voorwaarden: "Met deze arbeidsvoorwaarden",
      samenvatting: "Samenvatting"
    },
    en: {
      functie: "I'm aiming for a role as",
      kerntaken: "With the following core tasks",
      sector: "In the sector",
      organisatie: "At an",
      regio: "In this region",
      voorwaarden: "With these employment conditions",
      samenvatting: "Summary"
    },
    de: {
      functie: "Ich strebe eine Position als … an",
      kerntaken: "Mit folgenden Kernaufgaben",
      sector: "In der Branche",
      organisatie: "Bei einem",
      regio: "In dieser Region",
      voorwaarden: "Mit diesen Arbeitsbedingungen",
      samenvatting: "Zusammenfassung"
    },
    no: {
      functie: "Jeg går for en rolle som",
      kerntaken: "Med følgende kjerneoppgaver",
      sector: "Innenfor sektoren",
      organisatie: "Hos en",
      regio: "I denne regionen",
      voorwaarden: "Med disse arbeidsvilkårene",
      samenvatting: "Sammendrag"
    }
  };

  const currentHeadings = headings[language] || headings.nl;

  const items = [
    { heading: currentHeadings.functie, value: content.functie_zin },
    { heading: currentHeadings.kerntaken, value: content.kerntaken_zin },
    { heading: currentHeadings.sector, value: content.sector_zin },
    { heading: currentHeadings.organisatie, value: content.organisatie_zin },
    { heading: currentHeadings.regio, value: content.regio_zin },
    { heading: currentHeadings.voorwaarden, value: content.voorwaarden_zin },
  ];

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            html,
            body {
              height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }

            /* Verberg alles visueel */
            body * {
              visibility: hidden !important;
            }

            /* Toon print container en alle children */
            .zoekprofiel-print-container,
            .zoekprofiel-print-container * {
              visibility: visible !important;
            }

            /* Position fixed haalt element uit document flow */
            .zoekprofiel-print-container {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
              overflow: hidden !important;
              z-index: 999999 !important;
            }

            /* Voorkom dat verborgen content ruimte inneemt */
            #root {
              height: 0 !important;
              overflow: hidden !important;
            }
          }
        `}
      </style>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden zoekprofiel-print-container print:rounded-none print:shadow-none">
        {/* Header */}
        <div className="bg-[#232D4B] text-white p-6 md:p-8 print:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold print:text-4xl">
                {t('journey.zoekprofiel.viewer.title')}
              </h1>
              {userName && (
                <p className="text-white/80 mt-1 print:text-xl">{userName}</p>
              )}
            </div>
            <img 
              src="/images/vinster-logo-white.png" 
              alt="Vinster Logo" 
              className="h-16 md:h-20 print:h-28"
            />
          </div>
        </div>

        {/* Profile Items */}
        <div className="p-6 md:p-8 space-y-6 print:p-10 print:space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border-l-4 border-[#F5C518] pl-4 print:pl-6">
              <h3 className="text-sm font-semibold text-[#232D4B]/60 uppercase tracking-wide mb-1 print:text-lg">
                {item.heading}
              </h3>
              <p className="text-lg text-[#232D4B] font-medium print:text-2xl">
                {item.value}
              </p>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200 print:mt-4 print:pt-4">
            <h3 className="text-sm font-semibold text-[#232D4B]/60 uppercase tracking-wide mb-3 print:text-lg">
              {currentHeadings.samenvatting}
            </h3>
            <div className="bg-[#fffbeb] border-l-4 border-[#F5C518] rounded-xl p-4 md:p-6 print:p-6">
              <p className="text-[#232D4B] leading-relaxed print:text-xl print:leading-relaxed">
                {content.samenvatting}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F5C518] p-4 text-center print:p-8">
          <p className="text-[#232D4B] text-sm font-medium print:text-2xl print:font-bold">
            vinster.ai
          </p>
        </div>
      </div>
    </>
  );
};

export default ZoekprofielViewer;
