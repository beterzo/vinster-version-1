import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Language = "en" | "de" | "no";

interface ReportContent {
  voorblad: {
    naam: string;
    datum: string;
  };
  ideale_functie: {
    activiteiten: string[];
    werkomgeving: string[];
    interessegebieden: string[];
  };
  beroepen: {
    beroep_1: {
      titel: string;
      beschrijving: string;
    };
    beroep_2: {
      titel: string;
      beschrijving: string;
    };
    beroep_3: {
      titel: string;
      beschrijving: string;
    };
  };
}

const sampleReports: Record<Language, ReportContent> = {
  en: {
    voorblad: {
      naam: "Sarah Johnson",
      datum: "January 15, 2025",
    },
    ideale_functie: {
      activiteiten: [
        "coaching individuals",
        "presenting to groups",
        "writing content",
        "organizing events",
        "networking",
        "problem-solving",
        "creative thinking",
        "leading teams",
        "mentoring colleagues",
        "strategic planning",
        "facilitating workshops",
        "building relationships",
        "analyzing data",
        "developing strategies",
        "inspiring others"
      ],
      werkomgeving: [
        "a flexible workspace",
        "a dynamic team",
        "an international environment",
        "a modern office",
        "remote work options",
        "collaborative culture",
        "an innovative company",
        "diverse colleagues",
        "open communication",
        "growth opportunities",
        "work-life balance",
        "supportive management",
        "creative freedom",
        "meaningful projects",
        "continuous learning"
      ],
      interessegebieden: [
        "personal development",
        "communication",
        "leadership",
        "innovation",
        "psychology",
        "education",
        "business strategy",
        "technology",
        "sustainability",
        "health and wellness",
        "social impact",
        "entrepreneurship",
        "culture and arts",
        "future trends",
        "human behavior"
      ]
    },
    beroepen: {
      beroep_1: {
        titel: "Learning & Development Specialist",
        beschrijving: "As a Learning & Development Specialist, you design and deliver training programs that help employees grow. Your coaching skills and passion for personal development make this role ideal. You'll facilitate workshops, create learning materials, and mentor colleagues in their professional journey."
      },
      beroep_2: {
        titel: "Communications Manager",
        beschrijving: "Your talent for writing, presenting, and building relationships makes you perfect for a Communications Manager role. You'll craft compelling messages, manage internal and external communications, and lead strategic initiatives that connect people with your organization's mission."
      },
      beroep_3: {
        titel: "Community Manager",
        beschrijving: "A surprising but fitting choice! Your networking abilities, event organization skills, and genuine interest in people would thrive in community management. You'd build engaged communities, facilitate meaningful connections, and create spaces where people grow together."
      }
    }
  },
  de: {
    voorblad: {
      naam: "Lisa Müller",
      datum: "15. Januar 2025",
    },
    ideale_functie: {
      activiteiten: [
        "Menschen coachen",
        "Präsentationen halten",
        "Texte schreiben",
        "Veranstaltungen organisieren",
        "Netzwerken",
        "Probleme lösen",
        "kreativ denken",
        "Teams leiten",
        "Kollegen begleiten",
        "strategisch planen",
        "Workshops moderieren",
        "Beziehungen aufbauen",
        "Daten analysieren",
        "Strategien entwickeln",
        "andere inspirieren"
      ],
      werkomgeving: [
        "ein flexibler Arbeitsplatz",
        "ein dynamisches Team",
        "ein internationales Umfeld",
        "ein modernes Büro",
        "Homeoffice-Möglichkeiten",
        "kollaborative Kultur",
        "ein innovatives Unternehmen",
        "vielfältige Kollegen",
        "offene Kommunikation",
        "Entwicklungschancen",
        "Work-Life-Balance",
        "unterstützende Führung",
        "kreative Freiheit",
        "sinnvolle Projekte",
        "kontinuierliches Lernen"
      ],
      interessegebieden: [
        "persönliche Entwicklung",
        "Kommunikation",
        "Führung",
        "Innovation",
        "Psychologie",
        "Bildung",
        "Unternehmensstrategie",
        "Technologie",
        "Nachhaltigkeit",
        "Gesundheit und Wellness",
        "soziale Wirkung",
        "Unternehmertum",
        "Kultur und Kunst",
        "Zukunftstrends",
        "menschliches Verhalten"
      ]
    },
    beroepen: {
      beroep_1: {
        titel: "Personalentwicklerin",
        beschrijving: "Als Personalentwicklerin gestalten Sie Trainingsprogramme, die Mitarbeitern beim Wachsen helfen. Ihre Coaching-Fähigkeiten und Ihre Leidenschaft für persönliche Entwicklung machen diese Rolle ideal. Sie moderieren Workshops, erstellen Lernmaterialien und begleiten Kollegen auf ihrem Karriereweg."
      },
      beroep_2: {
        titel: "Kommunikationsmanagerin",
        beschrijving: "Ihr Talent für Schreiben, Präsentieren und Beziehungsaufbau macht Sie perfekt für eine Rolle als Kommunikationsmanagerin. Sie entwickeln überzeugende Botschaften, steuern interne und externe Kommunikation und leiten strategische Initiativen, die Menschen mit der Mission Ihrer Organisation verbinden."
      },
      beroep_3: {
        titel: "Community Managerin",
        beschrijving: "Eine überraschende, aber passende Wahl! Ihre Netzwerkfähigkeiten, Ihr Organisationstalent und Ihr echtes Interesse an Menschen würden im Community Management aufblühen. Sie bauen engagierte Gemeinschaften auf, fördern sinnvolle Verbindungen und schaffen Räume, in denen Menschen gemeinsam wachsen."
      }
    }
  },
  no: {
    voorblad: {
      naam: "Emma Hansen",
      datum: "15. januar 2025",
    },
    ideale_functie: {
      activiteiten: [
        "veilede mennesker",
        "holde presentasjoner",
        "skrive innhold",
        "organisere arrangementer",
        "nettverksbygging",
        "problemløsning",
        "kreativ tenkning",
        "lede team",
        "veilede kolleger",
        "strategisk planlegging",
        "fasilitere workshops",
        "bygge relasjoner",
        "analysere data",
        "utvikle strategier",
        "inspirere andre"
      ],
      werkomgeving: [
        "en fleksibel arbeidsplass",
        "et dynamisk team",
        "et internasjonalt miljø",
        "et moderne kontor",
        "hjemmekontor-muligheter",
        "samarbeidskultur",
        "en innovativ bedrift",
        "mangfoldige kolleger",
        "åpen kommunikasjon",
        "utviklingsmuligheter",
        "balanse mellom jobb og fritid",
        "støttende ledelse",
        "kreativ frihet",
        "meningsfulle prosjekter",
        "kontinuerlig læring"
      ],
      interessegebieden: [
        "personlig utvikling",
        "kommunikasjon",
        "ledelse",
        "innovasjon",
        "psykologi",
        "utdanning",
        "forretningsstrategi",
        "teknologi",
        "bærekraft",
        "helse og velvære",
        "sosial påvirkning",
        "entreprenørskap",
        "kultur og kunst",
        "fremtidige trender",
        "menneskelig atferd"
      ]
    },
    beroepen: {
      beroep_1: {
        titel: "Lærings- og utviklingsspesialist",
        beschrijving: "Som lærings- og utviklingsspesialist designer og leverer du opplæringsprogrammer som hjelper ansatte å vokse. Dine veiledningsferdigheter og lidenskap for personlig utvikling gjør denne rollen ideell. Du fasiliterer workshops, lager læringsmateriell og veileder kolleger i deres profesjonelle reise."
      },
      beroep_2: {
        titel: "Kommunikasjonsansvarlig",
        beschrijving: "Ditt talent for skriving, presentasjon og relasjonsbygging gjør deg perfekt for en rolle som kommunikasjonsansvarlig. Du utformer overbevisende budskap, styrer intern og ekstern kommunikasjon, og leder strategiske initiativer som kobler mennesker med organisasjonens oppdrag."
      },
      beroep_3: {
        titel: "Community Manager",
        beschrijving: "Et overraskende, men passende valg! Dine nettverksferdigheter, evne til å organisere arrangementer og genuine interesse for mennesker vil blomstre i community management. Du bygger engasjerte fellesskap, fremmer meningsfulle forbindelser og skaper rom der mennesker vokser sammen."
      }
    }
  }
};

const languageLabels: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  no: "Norsk"
};

const translations = {
  en: {
    mainTitle: "Find work\nthat fits you",
    website: "www.vinster.ai",
    idealJobTitle: "Your ideal job content",
    activitiesSubtitle: "What you enjoy doing",
    environmentSubtitle: "Your ideal work environment",
    interestsSubtitle: "Your interest areas",
    careersTitle: "Possible careers",
    pageOf: "Page"
  },
  de: {
    mainTitle: "Finde Arbeit,\ndie zu dir passt",
    website: "www.vinster.ai",
    idealJobTitle: "Dein idealer Arbeitsinhalt",
    activitiesSubtitle: "Was du gerne tust",
    environmentSubtitle: "Deine ideale Arbeitsumgebung",
    interestsSubtitle: "Deine Interessengebiete",
    careersTitle: "Mögliche Berufe",
    pageOf: "Seite"
  },
  no: {
    mainTitle: "Finn arbeid\nsom passer deg",
    website: "www.vinster.ai",
    idealJobTitle: "Ditt ideelle jobbinnhold",
    activitiesSubtitle: "Hva du liker å gjøre",
    environmentSubtitle: "Ditt ideelle arbeidsmiljø",
    interestsSubtitle: "Dine interesseområder",
    careersTitle: "Mulige yrker",
    pageOf: "Side"
  }
};

// Decorative squares for cover page (bottom left)
const CoverSquares = () => (
  <div className="absolute left-10 bottom-16">
    <div className="flex gap-1">
      <div className="w-14 h-14 bg-[#F5D54B]"></div>
      <div className="w-14 h-14 border-2 border-[#78BFE3]"></div>
    </div>
    <div className="flex gap-1 mt-1">
      <div className="w-14 h-14 bg-[#78BFE3]"></div>
      <div className="w-14 h-14 bg-[#F5D54B]"></div>
      <div className="w-14 h-14 bg-[#232D4B]"></div>
    </div>
  </div>
);

// Decorative sidebar for content pages (3 vertical bars)
const PageSidebar = () => (
  <div className="absolute right-0 top-0 bottom-0 w-5 flex">
    <div className="w-1/3 bg-[#F5D54B]"></div>
    <div className="w-1/3 bg-[#78BFE3]"></div>
    <div className="w-1/3 bg-[#232D4B]"></div>
  </div>
);

const VoorbeeldrapportGenerator = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  
  const reportContent = sampleReports[selectedLanguage];
  const t = translations[selectedLanguage];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {(Object.keys(sampleReports) as Language[]).map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  onClick={() => setSelectedLanguage(lang)}
                  className={selectedLanguage === lang ? "bg-[#232D4B]" : ""}
                >
                  {languageLabels[lang]}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={handlePrint}
              className="gap-2 bg-[#232D4B] hover:bg-[#232D4B]/90"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions - Hidden in print */}
      <div className="print:hidden max-w-[900px] mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-[#232D4B] mb-2">Instructies:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Selecteer een taal (English, Deutsch, of Norsk)</li>
            <li>Klik op "Print / Save as PDF"</li>
            <li>In het print dialoog, kies "Save as PDF" als bestemming</li>
            <li>Sla het bestand op met de naam: Voorbeeld loopbaanrapport [taal].pdf</li>
            <li>Upload de PDF naar de public folder</li>
          </ol>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-[900px] mx-auto py-8 print:p-0 print:max-w-none space-y-6 print:space-y-0">
        
        {/* Page 1: Cover page */}
        <div className="bg-white aspect-[210/297] relative overflow-hidden shadow-lg print:shadow-none print:page-break-after-always">
          <CoverSquares />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center px-16">
            {/* Main title */}
            <h1 className="text-5xl md:text-6xl font-bold text-[#232D4B] text-center leading-tight whitespace-pre-line mb-4">
              {t.mainTitle}
            </h1>
            
            {/* Website URL */}
            <p className="text-xl text-[#F5D54B] font-medium mb-16">
              {t.website}
            </p>
            
            {/* User name */}
            <p className="text-3xl font-semibold text-[#232D4B] mb-2">
              {reportContent.voorblad.naam}
            </p>
            
            {/* Date */}
            <p className="text-lg text-gray-600">
              {reportContent.voorblad.datum}
            </p>
          </div>
          
          {/* Vinster logo bottom right */}
          <div className="absolute right-10 bottom-10">
            <img 
              src="/images/vinster-logo.png" 
              alt="Vinster" 
              className="h-24"
            />
          </div>
        </div>

        {/* Page 2: Ideal job content */}
        <div className="bg-white aspect-[210/297] relative overflow-hidden shadow-lg print:shadow-none print:page-break-after-always">
          <PageSidebar />
          
          <div className="p-12 pr-16 h-full flex flex-col">
            {/* Title with yellow underline */}
            <div className="mb-10">
              <h2 className="text-5xl md:text-6xl font-bold text-[#232D4B] mb-3">
                {t.idealJobTitle}
              </h2>
              <div className="w-64 h-1.5 bg-[#F5D54B]"></div>
            </div>
            
            <div className="space-y-10 flex-1">
              {/* Activities section */}
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#78BFE3] mb-3 italic">
                  {t.activitiesSubtitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                  {reportContent.ideale_functie.activiteiten.join(', ')}
                </p>
              </div>

              {/* Work environment section */}
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#78BFE3] mb-3 italic">
                  {t.environmentSubtitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                  {reportContent.ideale_functie.werkomgeving.join(', ')}
                </p>
              </div>

              {/* Interests section */}
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#78BFE3] mb-3 italic">
                  {t.interestsSubtitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                  {reportContent.ideale_functie.interessegebieden.join(', ')}
                </p>
              </div>
            </div>
            
            {/* Page number */}
            <div className="text-right text-gray-500 text-sm mt-auto pt-4">
              {t.pageOf} 1 van 2
            </div>
          </div>
        </div>

        {/* Page 3: Career suggestions */}
        <div className="bg-white aspect-[210/297] relative overflow-hidden shadow-lg print:shadow-none">
          <PageSidebar />
          
          <div className="p-12 pr-16 h-full flex flex-col">
            {/* Title with yellow underline */}
            <div className="mb-10">
              <h2 className="text-5xl md:text-6xl font-bold text-[#232D4B] mb-3">
                {t.careersTitle}
              </h2>
              <div className="w-64 h-1.5 bg-[#F5D54B]"></div>
            </div>
            
            <div className="space-y-10 flex-1">
              {/* Career 1 */}
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#78BFE3] mb-3">
                  {reportContent.beroepen.beroep_1.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
                  {reportContent.beroepen.beroep_1.beschrijving}
                </p>
              </div>

              {/* Career 2 */}
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#78BFE3] mb-3">
                  {reportContent.beroepen.beroep_2.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
                  {reportContent.beroepen.beroep_2.beschrijving}
                </p>
              </div>

              {/* Career 3 */}
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#78BFE3] mb-3">
                  {reportContent.beroepen.beroep_3.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
                  {reportContent.beroepen.beroep_3.beschrijving}
                </p>
              </div>
            </div>
            
            {/* Page number */}
            <div className="text-right text-gray-500 text-sm mt-auto pt-4">
              {t.pageOf} 2 van 2
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            width: 210mm;
            height: 297mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:page-break-after-always {
            page-break-after: always;
          }
          .print\\:space-y-0 > * + * {
            margin-top: 0 !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VoorbeeldrapportGenerator;
