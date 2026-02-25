import { useTranslation } from "@/hooks/useTranslation";
import { Printer } from "lucide-react";

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
  onPrint?: () => void;
}

const ZoekprofielViewer = ({ content, userName, onPrint }: ZoekprofielViewerProps) => {
  const { t, language } = useTranslation();

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Language-specific headings
  const headings: Record<string, Record<string, string>> = {
    nl: {
      title: "Jouw zoekprofiel",
      functie: "Ik ga voor een functie als",
      kerntaken: "Met de volgende kerntaken",
      sector: "In de sector",
      organisatie: "Bij een",
      regio: "In deze regio",
      voorwaarden: "Met deze arbeidsvoorwaarden",
      samenvatting: "Samenvatting",
      print: "Afdrukken"
    },
    en: {
      title: "Your search profile",
      functie: "I'm aiming for a role as",
      kerntaken: "With the following core tasks",
      sector: "In the sector",
      organisatie: "At an",
      regio: "In this region",
      voorwaarden: "With these employment conditions",
      samenvatting: "Summary",
      print: "Print"
    },
    de: {
      title: "Dein Suchprofil",
      functie: "Ich strebe eine Position als … an",
      kerntaken: "Mit folgenden Kernaufgaben",
      sector: "In der Branche",
      organisatie: "Bei einem",
      regio: "In dieser Region",
      voorwaarden: "Mit diesen Arbeitsbedingungen",
      samenvatting: "Zusammenfassung",
      print: "Drucken"
    },
    no: {
      title: "Din søkeprofil",
      functie: "Jeg går for en rolle som",
      kerntaken: "Med følgende kjerneoppgaver",
      sector: "Innenfor sektoren",
      organisatie: "Hos en",
      regio: "I denne regionen",
      voorwaarden: "Med disse arbeidsvilkårene",
      samenvatting: "Sammendrag",
      print: "Skriv ut"
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

  const generationDate = new Date().toLocaleDateString(language === 'nl' ? 'nl-NL' : language === 'de' ? 'de-DE' : language === 'no' ? 'nb-NO' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
              background: white !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }

            body * {
              visibility: hidden !important;
            }

            .zoekprofiel-print-container,
            .zoekprofiel-print-container * {
              visibility: visible !important;
            }

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
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            .zoekprofiel-print-container .zoekprofiel-header {
              background: #1a2e5a !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              border-radius: 0 !important;
            }

            .zoekprofiel-print-container .zoekprofiel-footer {
              background: #F5C518 !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              border-radius: 0 !important;
            }

            .zoekprofiel-print-hide {
              display: none !important;
            }

            #root {
              height: 0 !important;
              overflow: hidden !important;
            }
          }
        `}
      </style>

      {/* Section 6: Overall card wrapper */}
      <div className="bg-white rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.1)] overflow-hidden max-w-[800px] mx-auto zoekprofiel-print-container print:rounded-none print:shadow-none">
        
        {/* Section 1: Header */}
        <div className="zoekprofiel-header bg-[#1a2e5a] p-8 md:px-10 flex items-center justify-between">
          <div>
            <h1 className="text-[1.75rem] font-bold text-white print:text-4xl">
              {currentHeadings.title}
            </h1>
            {userName && (
              <p className="text-[0.95rem] text-white/70 mt-1 print:text-xl">{userName}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <img 
              src="/images/vinster-logo-white.png" 
              alt="Vinster Logo" 
              className="h-14 md:h-16 print:h-24"
            />
            <button
              onClick={handlePrint}
              className="zoekprofiel-print-hide bg-white text-[#1a2e5a] border-2 border-white rounded-[10px] px-5 py-2.5 font-bold text-sm flex items-center gap-2 transition-all duration-150 hover:bg-white/15 hover:text-white"
            >
              <Printer className="w-4 h-4" />
              {currentHeadings.print}
            </button>
          </div>
        </div>

        {/* Section 2: Content blocks */}
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className={`bg-white border-l-4 border-[#F5C518] px-7 py-5 ${
                index < items.length - 1 ? 'border-b border-b-[#f0f0f0]' : ''
              }`}
            >
              <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#9ca3af] mb-1 print:text-base">
                {item.heading}
              </p>
              <p className="text-[1.05rem] font-semibold text-[#1a2e5a] leading-[1.6] print:text-xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Section 3: Samenvatting */}
        <div className="mx-7 my-6">
          <div className="bg-[#fffbeb] border border-[#fde68a] border-l-4 border-l-[#F5C518] rounded-lg p-6">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#92400e] mb-2 print:text-base">
              {currentHeadings.samenvatting}
            </p>
            <p className="text-[0.95rem] leading-[1.7] text-[#374151] print:text-lg print:leading-relaxed">
              {content.samenvatting}
            </p>
          </div>
        </div>

        {/* Section 5: Footer */}
        <div className="zoekprofiel-footer bg-[#F5C518] px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/images/vinster-logo.png" 
              alt="Vinster" 
              className="h-6 print:h-10"
            />
            <span className="text-[#1a2e5a] text-sm font-semibold print:text-lg">vinster.ai</span>
          </div>
          <span className="text-[0.75rem] text-[#1a2e5a]/60 print:text-sm">
            {generationDate}
          </span>
        </div>
      </div>
    </>
  );
};

export default ZoekprofielViewer;
