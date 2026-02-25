import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatKeywordsForReport } from "@/utils/keywordUtils";

interface OrganisatieOnderzoeksplanInlineProps {
  roundId: string;
  onComplete?: () => void;
}

const QUESTIONS = [
  "Wat spreekt jou het meest aan uit het rapport?",
  "Op welke ideeën heeft Vinster jou gebracht?",
  "Welke mogelijkheden zijn er op dit moment in de organisatie?",
  "Aan welke andere mogelijkheden heb je ook nog gedacht?",
  "Waar zou je meer informatie kunnen krijgen over jouw favoriete functie(s)?",
  "Met wie zou je dan eens kunnen praten?",
  "Wat is er nog nodig om jouw favoriete functie te gaan vervullen?",
  "Welke twijfels heb je over deze functie of de mogelijkheden?",
  "Zijn er functies waar Vinster niet aan gedacht heeft, maar die volgens jou ook passen?",
  "Welke opleiding of training moet je eventueel gaan doen?",
  "Welke andere stappen zou je kunnen zetten om jouw volgende stap te bereiken?",
  "Wat kun je nu als vervolgstap zetten?",
  "Welke acties spreken jullie af?",
];

// Print-only cover page
const PrintCoverPage = ({ userName, startDate }: { userName: string; startDate: string }) => (
  <div className="print-page bg-white relative overflow-hidden" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-20">
      <h1 className="text-7xl font-bold text-[#232D4B] mb-6 leading-tight">
        Vind werk dat<br />bij je past
      </h1>
      <p className="text-[#F5C518] text-3xl mb-24">www.vinster.ai</p>
      <div className="space-y-3">
        <p className="text-3xl font-bold text-[#232D4B]">{userName}</p>
        <p className="text-2xl text-gray-500">{startDate}</p>
      </div>
    </div>
    <div className="absolute bottom-16 left-16 flex gap-3">
      <div className="w-10 h-10 bg-[#78BFE3]"></div>
      <div className="w-10 h-10 bg-[#F5C518]"></div>
      <div className="w-10 h-10 bg-[#78BFE3]"></div>
    </div>
    <div className="absolute bottom-28 left-16 flex gap-3">
      <div className="w-10 h-10 bg-[#F5C518]"></div>
      <div className="w-10 h-10 bg-white border-2 border-[#78BFE3]"></div>
    </div>
    <img src="/images/vinster-logo-print.png" alt="Vinster" className="absolute bottom-16 right-16 h-16 object-contain" />
  </div>
);

// Print-only ideale functie page
const PrintIdealeFunctiePage = ({ reportContent }: { reportContent: any }) => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    <div className="p-16 h-full relative">
      <div className="mb-14">
        <h2 className="text-5xl font-bold text-[#232D4B] mb-4">Jouw ideale functie-inhoud</h2>
        <div className="w-80 h-2 bg-[#F5C518]"></div>
      </div>
      <div className="space-y-10">
        <div>
          <h3 className="text-3xl font-semibold text-[#78BFE3] mb-4">Wat je graag doet</h3>
          <p className="text-xl text-gray-800 leading-relaxed line-clamp-6 overflow-hidden break-words">
            {formatKeywordsForReport(reportContent.ideale_functie?.activiteiten || [])}
          </p>
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-[#78BFE3] mb-4">Jouw ideale werkomgeving</h3>
          <p className="text-xl text-gray-800 leading-relaxed line-clamp-6 overflow-hidden break-words">
            {formatKeywordsForReport(reportContent.ideale_functie?.werkomgeving || [])}
          </p>
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-[#78BFE3] mb-4">Jouw interessegebieden</h3>
          <p className="text-xl text-gray-800 leading-relaxed line-clamp-6 overflow-hidden break-words">
            {formatKeywordsForReport(reportContent.ideale_functie?.interessegebieden || [])}
          </p>
        </div>
      </div>
      <div className="absolute right-0 top-1/3 flex flex-col gap-3">
        <div className="w-5 h-20 bg-[#F5C518]"></div>
        <div className="w-5 h-20 bg-[#78BFE3]"></div>
        <div className="w-5 h-20 bg-[#232D4B]"></div>
      </div>
      <div className="absolute bottom-8 right-8 text-base text-gray-400">Pagina 1 van 3</div>
    </div>
  </div>
);

// Print-only beroepen page
const PrintBeroepenPage = ({ reportContent }: { reportContent: any }) => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm', pageBreakAfter: 'always' }}>
    <div className="p-16 h-full relative">
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-[#232D4B] mb-4">Mogelijke beroepen</h2>
        <div className="w-80 h-2 bg-[#F5C518]"></div>
      </div>
      <div className="space-y-8">
        {reportContent.beroepen?.passend_1 && (
          <div>
            <h3 className="text-3xl font-semibold text-[#78BFE3] mb-3">{reportContent.beroepen.passend_1.titel}</h3>
            <p className="text-lg text-gray-800 leading-relaxed break-words">{reportContent.beroepen.passend_1.beschrijving}</p>
          </div>
        )}
        {reportContent.beroepen?.passend_2 && (
          <div>
            <h3 className="text-3xl font-semibold text-[#78BFE3] mb-3">{reportContent.beroepen.passend_2.titel}</h3>
            <p className="text-lg text-gray-800 leading-relaxed break-words">{reportContent.beroepen.passend_2.beschrijving}</p>
          </div>
        )}
        {reportContent.beroepen?.verrassend && (
          <div>
            <h3 className="text-3xl font-semibold text-[#78BFE3] mb-3">{reportContent.beroepen.verrassend.titel}</h3>
            <p className="text-lg text-gray-800 leading-relaxed break-words">{reportContent.beroepen.verrassend.beschrijving}</p>
          </div>
        )}
      </div>
      <div className="absolute right-0 top-1/3 flex flex-col gap-3">
        <div className="w-5 h-20 bg-[#F5C518]"></div>
        <div className="w-5 h-20 bg-[#78BFE3]"></div>
        <div className="w-5 h-20 bg-[#232D4B]"></div>
      </div>
      <div className="absolute bottom-8 right-8 text-base text-gray-400">Pagina 2 van 3</div>
    </div>
  </div>
);

// Print-only onderzoeksplan page
const PrintOnderzoeksplanPage = () => (
  <div className="print-page bg-white relative" style={{ width: '210mm', height: '297mm' }}>
    <div className="p-16 h-full relative">
      <div className="mb-10">
        <h2 className="text-5xl font-bold text-[#232D4B] mb-4">En nu?</h2>
        <div className="w-80 h-2 bg-[#F5C518]"></div>
      </div>
      <p className="text-lg text-gray-700 mb-8">
        Bespreek deze uitkomst met jouw loopbaan- of HR-adviseur. De vragen hieronder kunnen je daarbij helpen.
      </p>
      <ol className="space-y-3">
        {QUESTIONS.map((q, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-7 h-7 bg-[#232D4B] text-white rounded-full flex items-center justify-center font-bold text-xs">
              {i + 1}
            </span>
            <p className="text-base text-gray-800 pt-0.5">{q}</p>
          </li>
        ))}
      </ol>
      <div className="absolute right-0 top-1/3 flex flex-col gap-3">
        <div className="w-5 h-20 bg-[#F5C518]"></div>
        <div className="w-5 h-20 bg-[#78BFE3]"></div>
        <div className="w-5 h-20 bg-[#232D4B]"></div>
      </div>
      <div className="absolute bottom-8 right-8 text-base text-gray-400">Pagina 3 van 3</div>
    </div>
  </div>
);

const OrganisatieOnderzoeksplanInline = ({ roundId, onComplete }: OrganisatieOnderzoeksplanInlineProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reportContent, setReportContent] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Load report
      const { data: report } = await supabase
        .from('user_reports')
        .select('report_content')
        .eq('round_id', roundId)
        .eq('report_status', 'completed')
        .maybeSingle();

      if (report?.report_content) {
        setReportContent(report.report_content);
      }

      // Load user name
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

      // Load round date
      const { data: round } = await supabase
        .from('user_rounds')
        .select('started_at')
        .eq('id', roundId)
        .maybeSingle();
      if (round?.started_at) {
        const date = new Date(round.started_at);
        setStartDate(date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }));
      }

      setLoading(false);
    };
    loadData();
  }, [roundId, user]);

  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  const handlePrint = () => {
    window.print();
  };

  const handleRestart = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B]" />
      </div>
    );
  }

  return (
    <>
      {/* Screen content */}
      <div className="print:hidden">
        <Card className="rounded-3xl shadow-xl border-0">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#232D4B] mb-6 text-center">
                En nu?
              </h1>

              {/* Intro block */}
              <div className="bg-[#fffbeb] border-l-4 border-[#F5C518] rounded-xl p-6 mb-8">
                <p className="text-[#232D4B] text-lg leading-relaxed">
                  Bespreek deze uitkomst met jouw loopbaan- of HR-adviseur.
                </p>
                <p className="text-[#232D4B] text-lg leading-relaxed mt-2">
                  De vragen hieronder kunnen je daarbij helpen.
                </p>
              </div>

              {/* Questions heading */}
              <h2 className="text-xl md:text-2xl font-bold text-[#232D4B] mb-6">
                Vragen waar jullie het over kunnen hebben:
              </h2>

              {/* Questions list */}
              <ol className="space-y-4 mb-10">
                {QUESTIONS.map((question, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#232D4B] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1 text-base md:text-lg">{question}</p>
                  </li>
                ))}
              </ol>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrint}
                  className="text-lg px-8 py-6 border-[#232D4B] text-[#232D4B]"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Download als PDF
                </Button>
                <Button
                  size="lg"
                  onClick={handleRestart}
                  className="text-lg px-8 py-6 bg-[#1a2e5a] hover:bg-[#142347] text-white font-bold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Opnieuw beginnen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print-only content */}
      {reportContent && (
        <div className="hidden print:block">
          <PrintCoverPage userName={userName} startDate={startDate} />
          <PrintIdealeFunctiePage reportContent={reportContent} />
          <PrintBeroepenPage reportContent={reportContent} />
          <PrintOnderzoeksplanPage />
        </div>
      )}
    </>
  );
};

export default OrganisatieOnderzoeksplanInline;
