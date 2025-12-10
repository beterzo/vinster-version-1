import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import RapportViewer from "@/components/RapportViewer";

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

const RapportBekijken = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [reportContent, setReportContent] = useState<ReportContent | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      if (!user || !roundId) {
        setLoading(false);
        return;
      }

      try {
        // Load report content
        const { data: reportData, error: reportError } = await supabase
          .from('user_reports')
          .select('report_content, round_id')
          .eq('round_id', roundId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (reportError) {
          console.error('Error loading report:', reportError);
          setError('Kon rapport niet laden');
          return;
        }

        if (!reportData || !reportData.report_content) {
          setError('Rapport niet gevonden');
          return;
        }

        // Load round number
        const { data: roundData } = await supabase
          .from('user_rounds')
          .select('round_number')
          .eq('id', roundId)
          .single();

        if (roundData) {
          setRoundNumber(roundData.round_number);
        }

        setReportContent(reportData.report_content as unknown as ReportContent);
      } catch (err) {
        console.error('Error loading report:', err);
        setError('Er is een fout opgetreden');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [user, roundId]);

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-xl text-blue-900">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !reportContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Rapport niet gevonden'}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Terug naar dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <RapportViewer 
      reportContent={reportContent} 
      onBack={handleBack}
      roundNumber={roundNumber}
    />
  );
};

export default RapportBekijken;
