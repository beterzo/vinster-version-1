import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Language = "en" | "de" | "no";

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

const sampleReports: Record<Language, ReportContent> = {
  en: {
    voorblad: {
      naam: "Sarah Johnson",
      start_datum: "2025-01-10",
      eind_datum: "2025-01-15",
    },
    ideale_functie: {
      activiteiten: [
        "Coaching individuals",
        "Presenting to groups",
        "Writing content",
        "Organizing events",
        "Networking",
        "Problem-solving",
        "Creative thinking",
        "Leading teams",
        "Mentoring colleagues",
        "Strategic planning",
        "Facilitating workshops",
        "Building relationships"
      ],
      werkomgeving: [
        "Flexible workspace",
        "Dynamic team",
        "International environment",
        "Modern office",
        "Remote work options",
        "Collaborative culture",
        "Innovative company",
        "Diverse colleagues",
        "Open communication",
        "Growth opportunities",
        "Work-life balance",
        "Supportive management"
      ],
      interessegebieden: [
        "Personal development",
        "Communication",
        "Leadership",
        "Innovation",
        "Psychology",
        "Education",
        "Business strategy",
        "Technology",
        "Sustainability",
        "Health and wellness",
        "Social impact",
        "Entrepreneurship"
      ]
    },
    beroepen: {
      passend_1: {
        titel: "Learning & Development Specialist",
        beschrijving: "As a Learning & Development Specialist, you design and deliver training programs that help employees grow. Your coaching skills and passion for personal development make this role ideal. You'll facilitate workshops, create learning materials, and mentor colleagues in their professional journey."
      },
      passend_2: {
        titel: "Communications Manager",
        beschrijving: "Your talent for writing, presenting, and building relationships makes you perfect for a Communications Manager role. You'll craft compelling messages, manage internal and external communications, and lead strategic initiatives that connect people with your organization's mission."
      },
      verrassend: {
        titel: "Community Manager",
        beschrijving: "A surprising but fitting choice! Your networking abilities, event organization skills, and genuine interest in people would thrive in community management. You'd build engaged communities, facilitate meaningful connections, and create spaces where people grow together."
      }
    }
  },
  de: {
    voorblad: {
      naam: "Lisa Müller",
      start_datum: "2025-01-10",
      eind_datum: "2025-01-15",
    },
    ideale_functie: {
      activiteiten: [
        "Menschen coachen",
        "Präsentationen halten",
        "Texte schreiben",
        "Veranstaltungen organisieren",
        "Netzwerken",
        "Probleme lösen",
        "Kreativ denken",
        "Teams leiten",
        "Kollegen begleiten",
        "Strategisch planen",
        "Workshops moderieren",
        "Beziehungen aufbauen"
      ],
      werkomgeving: [
        "Flexibler Arbeitsplatz",
        "Dynamisches Team",
        "Internationales Umfeld",
        "Modernes Büro",
        "Homeoffice-Möglichkeiten",
        "Kollaborative Kultur",
        "Innovatives Unternehmen",
        "Vielfältige Kollegen",
        "Offene Kommunikation",
        "Entwicklungschancen",
        "Work-Life-Balance",
        "Unterstützende Führung"
      ],
      interessegebieden: [
        "Persönliche Entwicklung",
        "Kommunikation",
        "Führung",
        "Innovation",
        "Psychologie",
        "Bildung",
        "Unternehmensstrategie",
        "Technologie",
        "Nachhaltigkeit",
        "Gesundheit und Wellness",
        "Soziale Wirkung",
        "Unternehmertum"
      ]
    },
    beroepen: {
      passend_1: {
        titel: "Personalentwicklerin",
        beschrijving: "Als Personalentwicklerin gestalten Sie Trainingsprogramme, die Mitarbeitern beim Wachsen helfen. Ihre Coaching-Fähigkeiten und Ihre Leidenschaft für persönliche Entwicklung machen diese Rolle ideal. Sie moderieren Workshops, erstellen Lernmaterialien und begleiten Kollegen auf ihrem Karriereweg."
      },
      passend_2: {
        titel: "Kommunikationsmanagerin",
        beschrijving: "Ihr Talent für Schreiben, Präsentieren und Beziehungsaufbau macht Sie perfekt für eine Rolle als Kommunikationsmanagerin. Sie entwickeln überzeugende Botschaften, steuern interne und externe Kommunikation und leiten strategische Initiativen, die Menschen mit der Mission Ihrer Organisation verbinden."
      },
      verrassend: {
        titel: "Community Managerin",
        beschrijving: "Eine überraschende, aber passende Wahl! Ihre Netzwerkfähigkeiten, Ihr Organisationstalent und Ihr echtes Interesse an Menschen würden im Community Management aufblühen. Sie bauen engagierte Gemeinschaften auf, fördern sinnvolle Verbindungen und schaffen Räume, in denen Menschen gemeinsam wachsen."
      }
    }
  },
  no: {
    voorblad: {
      naam: "Emma Hansen",
      start_datum: "2025-01-10",
      eind_datum: "2025-01-15",
    },
    ideale_functie: {
      activiteiten: [
        "Veilede mennesker",
        "Holde presentasjoner",
        "Skrive innhold",
        "Organisere arrangementer",
        "Nettverksbygging",
        "Problemløsning",
        "Kreativ tenkning",
        "Lede team",
        "Veilede kolleger",
        "Strategisk planlegging",
        "Fasilitere workshops",
        "Bygge relasjoner"
      ],
      werkomgeving: [
        "Fleksibel arbeidsplass",
        "Dynamisk team",
        "Internasjonalt miljø",
        "Moderne kontor",
        "Hjemmekontor-muligheter",
        "Samarbeidskultur",
        "Innovativ bedrift",
        "Mangfoldige kolleger",
        "Åpen kommunikasjon",
        "Utviklingsmuligheter",
        "Balanse mellom jobb og fritid",
        "Støttende ledelse"
      ],
      interessegebieden: [
        "Personlig utvikling",
        "Kommunikasjon",
        "Ledelse",
        "Innovasjon",
        "Psykologi",
        "Utdanning",
        "Forretningsstrategi",
        "Teknologi",
        "Bærekraft",
        "Helse og velvære",
        "Sosial påvirkning",
        "Entreprenørskap"
      ]
    },
    beroepen: {
      passend_1: {
        titel: "Lærings- og utviklingsspesialist",
        beschrijving: "Som lærings- og utviklingsspesialist designer og leverer du opplæringsprogrammer som hjelper ansatte å vokse. Dine veiledningsferdigheter og lidenskap for personlig utvikling gjør denne rollen ideell. Du fasiliterer workshops, lager læringsmateriell og veileder kolleger i deres profesjonelle reise."
      },
      passend_2: {
        titel: "Kommunikasjonsansvarlig",
        beschrijving: "Ditt talent for skriving, presentasjon og relasjonsbygging gjør deg perfekt for en rolle som kommunikasjonsansvarlig. Du utformer overbevisende budskap, styrer intern og ekstern kommunikasjon, og leder strategiske initiativer som kobler mennesker med organisasjonens oppdrag."
      },
      verrassend: {
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

// Decorative Vinster squares component
const VinsterSquares = () => (
  <div className="absolute left-8 top-1/3 flex flex-col gap-3">
    <div className="w-12 h-12 bg-[#F5D54B] rounded-sm"></div>
    <div className="w-12 h-12 bg-[#0D8FD9] rounded-sm"></div>
    <div className="w-12 h-12 bg-[#F5D54B] rounded-sm"></div>
  </div>
);

// Decorative sidebar for content pages
const PageDecoration = () => (
  <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col">
    <div className="flex-1 bg-[#F5D54B]"></div>
    <div className="flex-1 bg-[#0D8FD9]"></div>
  </div>
);

const VoorbeeldrapportGenerator = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  
  const reportContent = sampleReports[selectedLanguage];

  const handlePrint = () => {
    window.print();
  };

  const titles = {
    en: {
      ideale_functie: "Your ideal job content",
      beroepen: "Possible careers"
    },
    de: {
      ideale_functie: "Ihr idealer Arbeitsinhalt",
      beroepen: "Mögliche Berufe"
    },
    no: {
      ideale_functie: "Ditt ideelle jobbinnhold",
      beroepen: "Mulige yrker"
    }
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
      <div className="max-w-[900px] mx-auto py-8 print:p-0 print:max-w-none space-y-6">
        
        {/* Page 1: Cover page */}
        <div className="bg-white aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <VinsterSquares />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center px-16">
            <img 
              src="/images/vinster-logo.png" 
              alt="Vinster" 
              className="h-20 mb-16"
            />
            
            <p className="text-3xl md:text-4xl font-medium text-center text-[#232D4B]">
              {reportContent.voorblad.naam}
            </p>
          </div>
        </div>

        {/* Page 2: Ideal job content */}
        <div className="bg-white aspect-[210/297] relative overflow-hidden print:page-break-after-always">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {titles[selectedLanguage].ideale_functie}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-10"></div>
            
            <div className="space-y-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {reportContent.ideale_functie.activiteiten.join(', ')}
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                {reportContent.ideale_functie.werkomgeving.join(', ')}
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                {reportContent.ideale_functie.interessegebieden.join(', ')}
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-8 text-[#232D4B] font-medium">2</div>
        </div>

        {/* Page 3: Career suggestions */}
        <div className="bg-white aspect-[210/297] relative overflow-hidden">
          <PageDecoration />
          
          <div className="p-10 pr-12">
            <h2 className="text-3xl font-bold text-[#232D4B] mb-2">
              {titles[selectedLanguage].beroepen}
            </h2>
            <div className="w-32 h-1 bg-[#F5D54B] mb-10"></div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#0D8FD9] mb-2">
                  {reportContent.beroepen.passend_1.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {reportContent.beroepen.passend_1.beschrijving}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0D8FD9] mb-2">
                  {reportContent.beroepen.passend_2.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {reportContent.beroepen.passend_2.beschrijving}
                </p>
              </div>

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

export default VoorbeeldrapportGenerator;
