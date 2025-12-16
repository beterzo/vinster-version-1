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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#232D4B] text-white p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t('journey.zoekprofiel.viewer.title')}
            </h1>
            {userName && (
              <p className="text-white/80 mt-1">{userName}</p>
            )}
          </div>
          <img 
            src="/images/vinster-logo-white.png" 
            alt="Vinster Logo" 
            className="h-10 md:h-12"
          />
        </div>
      </div>

      {/* Profile Items */}
      <div className="p-6 md:p-8 space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border-l-4 border-[#F5C518] pl-4">
            <h3 className="text-sm font-semibold text-[#232D4B]/60 uppercase tracking-wide mb-1">
              {item.heading}
            </h3>
            <p className="text-lg text-[#232D4B] font-medium">
              {item.value}
            </p>
          </div>
        ))}

        {/* Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-[#232D4B]/60 uppercase tracking-wide mb-3">
            {currentHeadings.samenvatting}
          </h3>
          <div className="bg-[#E8F4FD] rounded-xl p-4 md:p-6">
            <p className="text-[#232D4B] leading-relaxed">
              {content.samenvatting}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#F5C518] p-4 text-center">
        <p className="text-[#232D4B] text-sm font-medium">
          vinster.ai
        </p>
      </div>
    </div>
  );
};

export default ZoekprofielViewer;
