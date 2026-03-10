import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, Language as AppLanguage } from "@/contexts/LanguageContext";
import { formatKeywordsForReport } from "@/utils/keywordUtils";

type Language = "nl" | "en" | "de" | "no";

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
  nl: {
    voorblad: {
      naam: "Lisa de Vries",
      datum: "15 januari 2025",
    },
    ideale_functie: {
      activiteiten: [
        "Graag mensen coachen en begeleiden",
        "Inspirerende presentaties geven aan groepen",
        "Creatieve teksten schrijven met impact",
        "Evenementen organiseren van A tot Z",
        "Actief netwerken en contacten leggen",
        "Complexe problemen stap voor stap oplossen",
        "Creatief denken over nieuwe mogelijkheden",
        "Teams aansturen en motiveren",
        "Collega's begeleiden in hun ontwikkeling",
        "Strategische plannen maken voor lange termijn",
        "Interactieve workshops faciliteren en leiden",
        "Duurzame relaties opbouwen met stakeholders",
        "Data analyseren en inzichten vertalen",
        "Innovatieve strategieën ontwikkelen voor groei",
        "Anderen inspireren met enthousiasme en visie"
      ],
      werkomgeving: [
        "Werken op een flexibele werkplek",
        "Samenwerken in een dynamisch team",
        "Actief zijn in internationale omgeving",
        "Werken in een modern ingericht kantoor",
        "Mogelijkheid om vanuit huis te werken",
        "Gedijen in een samenwerkende cultuur",
        "Werken bij een innovatief bedrijf",
        "Omringd zijn door diverse collega's",
        "Werken met open en eerlijke communicatie",
        "Volop groeimogelijkheden binnen de organisatie",
        "Goede balans tussen werk en privé",
        "Ondersteunend management dat vertrouwen geeft",
        "Creatieve vrijheid in eigen aanpak",
        "Werken aan zinvolle en impactvolle projecten",
        "Continu blijven leren en ontwikkelen"
      ],
      interessegebieden: [
        "Geïnteresseerd in persoonlijke ontwikkeling en groei",
        "Gefascineerd door effectieve communicatie",
        "Nieuwsgierig naar leiderschap en management",
        "Passie voor innovatie en vernieuwing",
        "Geïnteresseerd in psychologie en gedrag",
        "Betrokken bij onderwijs en kennisdeling",
        "Gefascineerd door bedrijfsstrategie en groei",
        "Nieuwsgierig naar technologie en digitalisering",
        "Passie voor duurzaamheid en milieubewustzijn",
        "Geïnteresseerd in gezondheid en welzijn",
        "Gedreven door maatschappelijke impact maken",
        "Nieuwsgierig naar ondernemerschap en startups",
        "Geïnspireerd door cultuur en kunst",
        "Geïnteresseerd in toekomstige trends en ontwikkelingen",
        "Gefascineerd door menselijk gedrag en motivatie"
      ]
    },
    beroepen: {
      beroep_1: {
        titel: "Loopbaanadviseur",
        beschrijving: "Als loopbaanadviseur begeleid je mensen bij het vinden van werk dat bij hen past. Je coachingsvaardigheden en passie voor persoonlijke ontwikkeling maken deze rol ideaal. Je faciliteert gesprekken, analyseert talenten en helpt mensen hun loopbaanpad te ontdekken."
      },
      beroep_2: {
        titel: "Communicatieadviseur",
        beschrijving: "Je talent voor schrijven, presenteren en relaties opbouwen maakt je perfect voor een rol als communicatieadviseur. Je ontwikkelt overtuigende boodschappen, beheert interne en externe communicatie en leidt strategische initiatieven die mensen verbinden met de missie van je organisatie."
      },
      beroep_3: {
        titel: "Community Manager",
        beschrijving: "Een verrassende maar passende keuze! Je netwerkvaardigheden, organisatietalent en oprechte interesse in mensen zouden floreren in community management. Je bouwt betrokken gemeenschappen, bevordert betekenisvolle connecties en creëert ruimtes waar mensen samen groeien."
      }
    }
  },
  en: {
    voorblad: {
      naam: "Sarah Johnson",
      datum: "January 15, 2025",
    },
    ideale_functie: {
      activiteiten: [
        "Enjoy coaching and mentoring individuals",
        "Presenting inspiring ideas to groups",
        "Writing creative and impactful content",
        "Organizing events from start to finish",
        "Actively networking and building connections",
        "Solving complex problems step by step",
        "Thinking creatively about new possibilities",
        "Leading and motivating diverse teams",
        "Mentoring colleagues in their growth",
        "Creating strategic plans for long term",
        "Facilitating interactive and engaging workshops",
        "Building lasting relationships with stakeholders",
        "Analyzing data and translating insights",
        "Developing innovative strategies for growth",
        "Inspiring others with enthusiasm and vision"
      ],
      werkomgeving: [
        "Working in a flexible workspace",
        "Collaborating within a dynamic team",
        "Active in an international environment",
        "Working in a modern well-equipped office",
        "Having options for remote work",
        "Thriving in a collaborative work culture",
        "Working at an innovative forward-thinking company",
        "Surrounded by diverse and inspiring colleagues",
        "Working with open and honest communication",
        "Plenty of growth opportunities within organization",
        "Maintaining good work-life balance daily",
        "Supportive management that gives trust",
        "Creative freedom in own approach",
        "Working on meaningful and impactful projects",
        "Continuously learning and developing new skills"
      ],
      interessegebieden: [
        "Interested in personal development and growth",
        "Fascinated by effective communication strategies",
        "Curious about leadership and management styles",
        "Passionate about innovation and renewal",
        "Interested in psychology and human behavior",
        "Engaged in education and knowledge sharing",
        "Fascinated by business strategy and growth",
        "Curious about technology and digital transformation",
        "Passionate about sustainability and environment",
        "Interested in health and overall wellness",
        "Driven by making meaningful social impact",
        "Curious about entrepreneurship and startups",
        "Inspired by culture and creative arts",
        "Interested in future trends and developments",
        "Fascinated by human motivation and behavior"
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
        "Menschen gerne coachen und begleiten",
        "Inspirierende Präsentationen vor Gruppen halten",
        "Kreative Texte mit Wirkung schreiben",
        "Veranstaltungen von A bis Z organisieren",
        "Aktiv netzwerken und Kontakte knüpfen",
        "Komplexe Probleme Schritt für Schritt lösen",
        "Kreativ über neue Möglichkeiten nachdenken",
        "Teams anleiten und motivieren",
        "Kollegen in ihrer Entwicklung begleiten",
        "Strategische Pläne langfristig erstellen",
        "Interaktive Workshops moderieren und leiten",
        "Nachhaltige Beziehungen zu Stakeholdern aufbauen",
        "Daten analysieren und Erkenntnisse übersetzen",
        "Innovative Strategien für Wachstum entwickeln",
        "Andere mit Begeisterung und Vision inspirieren"
      ],
      werkomgeving: [
        "Arbeiten an einem flexiblen Arbeitsplatz",
        "Zusammenarbeiten in einem dynamischen Team",
        "Aktiv in einem internationalen Umfeld",
        "Arbeiten in einem modern eingerichteten Büro",
        "Möglichkeit von zu Hause zu arbeiten",
        "Gedeihen in einer kollaborativen Kultur",
        "Arbeiten bei einem innovativen Unternehmen",
        "Umgeben von vielfältigen inspirierenden Kollegen",
        "Arbeiten mit offener ehrlicher Kommunikation",
        "Reichlich Entwicklungschancen in der Organisation",
        "Gute Balance zwischen Arbeit und Privatleben",
        "Unterstützende Führung die Vertrauen gibt",
        "Kreative Freiheit im eigenen Ansatz",
        "Arbeiten an sinnvollen wirkungsvollen Projekten",
        "Kontinuierlich lernen und weiterentwickeln"
      ],
      interessegebieden: [
        "Interessiert an persönlicher Entwicklung und Wachstum",
        "Fasziniert von effektiver Kommunikation",
        "Neugierig auf Führung und Managementstile",
        "Leidenschaft für Innovation und Erneuerung",
        "Interessiert an Psychologie und Verhalten",
        "Engagiert in Bildung und Wissenstransfer",
        "Fasziniert von Unternehmensstrategie und Wachstum",
        "Neugierig auf Technologie und Digitalisierung",
        "Leidenschaft für Nachhaltigkeit und Umwelt",
        "Interessiert an Gesundheit und Wohlbefinden",
        "Getrieben von sozialer Wirkung erzielen",
        "Neugierig auf Unternehmertum und Startups",
        "Inspiriert von Kultur und kreativer Kunst",
        "Interessiert an Zukunftstrends und Entwicklungen",
        "Fasziniert von menschlichem Verhalten und Motivation"
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
  nl: "Nederlands",
  en: "English",
  de: "Deutsch",
  no: "Norsk"
};

const translations = {
  nl: {
    mainTitle: "Vind werk\ndat bij je past",
    website: "www.vinster.ai",
    idealJobTitle: "Jouw ideale functie-inhoud",
    activitiesSubtitle: "Wat je graag doet",
    environmentSubtitle: "Jouw ideale werkomgeving",
    interestsSubtitle: "Jouw interessegebieden",
    careersTitle: "Mogelijke beroepen",
    pageOf: "Pagina"
  },
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
  <div className="absolute left-4 md:left-10 bottom-4 md:bottom-16">
    <div className="flex gap-1">
      <div className="w-8 h-8 md:w-14 md:h-14 bg-[#F5D54B]"></div>
      <div className="w-8 h-8 md:w-14 md:h-14 border-2 border-[#78BFE3]"></div>
    </div>
    <div className="flex gap-1 mt-1">
      <div className="w-8 h-8 md:w-14 md:h-14 bg-[#78BFE3]"></div>
      <div className="w-8 h-8 md:w-14 md:h-14 bg-[#F5D54B]"></div>
      <div className="w-8 h-8 md:w-14 md:h-14 bg-[#232D4B]"></div>
    </div>
  </div>
);

// Decorative square for content sections
const SectionSquare = ({ color }: { color: 'yellow' | 'blue' | 'darkblue' }) => {
  const colorMap = {
    yellow: '#F5D54B',
    blue: '#78BFE3',
    darkblue: '#232D4B'
  };
  return (
    <div 
      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4"
      style={{ backgroundColor: colorMap[color] }}
    />
  );
};

const VoorbeeldrapportGenerator = () => {
  const navigate = useNavigate();
  const { language: appLanguage } = useLanguage();
  
  // Map app language to report language (all languages are supported)
  const getInitialLanguage = (): Language => {
    if (['nl', 'en', 'de', 'no'].includes(appLanguage)) {
      return appLanguage as Language;
    }
    return 'nl';
  };
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getInitialLanguage());
  
  const reportContent = sampleReports[selectedLanguage];
  const t = translations[selectedLanguage];

  // Set custom title and favicon
  useEffect(() => {
    const originalTitle = document.title;
    const originalFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    const originalHref = originalFavicon?.href;
    
    document.title = "Voorbeeldrapport";
    
    if (originalFavicon) {
      originalFavicon.href = "/images/voorbeeldrapport-favicon.png";
    }
    
    return () => {
      document.title = originalTitle;
      if (originalFavicon && originalHref) {
        originalFavicon.href = originalHref;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug
          </Button>
          
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
        </div>
      </div>


      {/* Report Content */}
      <div className="max-w-[900px] mx-auto py-8 print:p-0 print:max-w-none space-y-6 print:space-y-0">
        
        {/* Page 1: Cover page */}
        <div className="bg-white min-h-[500px] md:aspect-[210/297] relative overflow-hidden shadow-lg print:shadow-none print:page-break-after-always print:aspect-[210/297] print:min-h-0">
          <CoverSquares />
          
          <div className="relative md:absolute md:inset-0 flex flex-col justify-center items-center px-6 md:px-16 py-12 md:py-0">
            {/* Main title */}
            <h1 className="text-4xl md:text-6xl font-bold text-[#232D4B] text-center leading-tight whitespace-pre-line mb-4">
              {t.mainTitle}
            </h1>
            
            {/* Website URL */}
            <p className="text-lg md:text-xl text-[#F5D54B] font-medium mb-8 md:mb-16">
              {t.website}
            </p>
            
            {/* User name */}
            <p className="text-2xl md:text-3xl font-semibold text-[#232D4B] mb-2">
              {reportContent.voorblad.naam}
            </p>
            
            {/* Date */}
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-0">
              {reportContent.voorblad.datum}
            </p>
            
            {/* Vinster logo - shown inline on mobile */}
            <div className="md:hidden mt-4">
              <img 
                src="/images/vinster-logo.png" 
                alt="Vinster" 
                className="h-16"
              />
            </div>
          </div>
          
          {/* Vinster logo bottom right - only on desktop */}
          <div className="hidden md:block absolute right-10 bottom-10">
            <img 
              src="/images/vinster-logo.png" 
              alt="Vinster" 
              className="h-24"
            />
          </div>
        </div>

        {/* Page 2: Ideal job content */}
        <div className="bg-white md:aspect-[210/297] relative overflow-hidden shadow-lg print:shadow-none print:page-break-after-always print:aspect-[210/297]">
          <div className="p-6 md:p-12 md:pr-12 h-full flex flex-col">
            {/* Title with yellow underline */}
            <div className="mb-6 md:mb-10">
              <h2 className="text-3xl md:text-6xl font-bold text-[#232D4B] mb-3">
                {t.idealJobTitle}
              </h2>
              <div className="w-48 md:w-64 h-1.5 bg-[#F5D54B]"></div>
            </div>
            
            <div className="space-y-6 md:space-y-10 flex-1">
              {/* Activities section */}
              <div className="relative pr-6 md:pr-8">
                <h3 className="text-xl md:text-3xl font-semibold text-[#78BFE3] mb-2 md:mb-3 italic">
                  {t.activitiesSubtitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-xl">
                  {formatKeywordsForReport(reportContent.ideale_functie.activiteiten)}
                </p>
                <div className="hidden md:block"><SectionSquare color="yellow" /></div>
              </div>

              {/* Work environment section */}
              <div className="relative pr-6 md:pr-8">
                <h3 className="text-xl md:text-3xl font-semibold text-[#78BFE3] mb-2 md:mb-3 italic">
                  {t.environmentSubtitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-xl">
                  {formatKeywordsForReport(reportContent.ideale_functie.werkomgeving)}
                </p>
                <div className="hidden md:block"><SectionSquare color="blue" /></div>
              </div>

              {/* Interests section */}
              <div className="relative pr-6 md:pr-8">
                <h3 className="text-xl md:text-3xl font-semibold text-[#78BFE3] mb-2 md:mb-3 italic">
                  {t.interestsSubtitle}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-xl">
                  {formatKeywordsForReport(reportContent.ideale_functie.interessegebieden)}
                </p>
                <div className="hidden md:block"><SectionSquare color="darkblue" /></div>
              </div>
            </div>
            
            {/* Page number */}
            <div className="text-right text-gray-500 text-sm mt-auto pt-4">
              {t.pageOf} 1 van 2
            </div>
          </div>
        </div>

        {/* Page 3: Career suggestions */}
        <div className="bg-white md:aspect-[210/297] relative overflow-hidden shadow-lg print:shadow-none print:aspect-[210/297]">
          <div className="p-6 md:p-12 md:pr-12 h-full flex flex-col">
            {/* Title with yellow underline */}
            <div className="mb-6 md:mb-10">
              <h2 className="text-3xl md:text-6xl font-bold text-[#232D4B] mb-3">
                {t.careersTitle}
              </h2>
              <div className="w-48 md:w-64 h-1.5 bg-[#F5D54B]"></div>
            </div>
            
            <div className="space-y-6 md:space-y-10 flex-1">
              {/* Career 1 */}
              <div className="relative pr-6 md:pr-8">
                <h3 className="text-xl md:text-3xl font-semibold text-[#78BFE3] mb-2 md:mb-3">
                  {reportContent.beroepen.beroep_1.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-xl">
                  {reportContent.beroepen.beroep_1.beschrijving}
                </p>
                <div className="hidden md:block"><SectionSquare color="yellow" /></div>
              </div>

              {/* Career 2 */}
              <div className="relative pr-6 md:pr-8">
                <h3 className="text-xl md:text-3xl font-semibold text-[#78BFE3] mb-2 md:mb-3">
                  {reportContent.beroepen.beroep_2.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-xl">
                  {reportContent.beroepen.beroep_2.beschrijving}
                </p>
                <div className="hidden md:block"><SectionSquare color="blue" /></div>
              </div>

              {/* Career 3 */}
              <div className="relative pr-6 md:pr-8">
                <h3 className="text-xl md:text-3xl font-semibold text-[#78BFE3] mb-2 md:mb-3">
                  {reportContent.beroepen.beroep_3.titel}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-xl">
                  {reportContent.beroepen.beroep_3.beschrijving}
                </p>
                <div className="hidden md:block"><SectionSquare color="darkblue" /></div>
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
