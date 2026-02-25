import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Play, Loader2 } from "lucide-react";
import { useUserRounds, UserRound, RoundReport } from "@/hooks/useUserRounds";
import { useTranslation } from "@/hooks/useTranslation";

interface RoundsOverviewProps {
  onViewReport: (roundId: string, roundNumber: number) => void;
  onResumeRound: (roundId: string) => void;
}

const RoundsOverview = ({ onViewReport, onResumeRound }: RoundsOverviewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    rounds, 
    loading, 
    getCompletedRoundsWithReports 
  } = useUserRounds();

  const [roundsWithReports, setRoundsWithReports] = useState<Array<UserRound & { report?: RoundReport }>>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      setLoadingReports(true);
      const data = await getCompletedRoundsWithReports();
      setRoundsWithReports(data);
      setLoadingReports(false);
    };

    if (!loading && rounds.length > 0) {
      loadReports();
    } else if (!loading) {
      setLoadingReports(false);
    }
  }, [loading, rounds]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading || loadingReports) {
    return (
      <Card className="p-6 border border-gray-100 rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#232D4B]" />
        </div>
      </Card>
    );
  }

  if (rounds.length === 0) {
    return null;
  }

  // Combine completed rounds with reports and in-progress rounds
  const allRounds = rounds.map(round => {
    const roundWithReport = roundsWithReports.find(r => r.id === round.id);
    return roundWithReport || round;
  });

  return (
    <Card className="p-6 border border-gray-100 rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#232D4B]">{t('dashboard.rounds.game_rounds_title')}</h2>
        <p className="text-gray-600 text-sm">{t('dashboard.rounds.game_rounds_subtitle')}</p>
      </div>

      <div className="space-y-3">
        {allRounds.map((round) => (
          <div
            key={round.id}
            onClick={() => navigate(`/ronde/${round.id}`)}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-[#232D4B]/20"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                round.status === 'completed' 
                  ? 'bg-[#232D4B]' 
                  : 'bg-[#232D4B]'
              }`}>
                {round.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {t('dashboard.rounds.round_label')} {round.round_number}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    round.status === 'completed'
                      ? 'bg-[#232D4B] text-white'
                      : 'bg-[#F5C518] text-[#232D4B]'
                  }`}>
                    {round.status === 'completed' 
                      ? t('dashboard.rounds.status_completed')
                      : t('dashboard.rounds.status_in_progress')
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {round.completed_at ? formatDate(round.completed_at) : formatDate(round.created_at)}
                </div>
              </div>
            </div>

            <button 
              className="bg-[#232D4B] hover:bg-[#1a2350] text-white rounded-lg px-4 py-2 h-10 font-medium transition-all duration-200 text-sm"
            >
              {t('dashboard.rounds.view_round')}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RoundsOverview;
