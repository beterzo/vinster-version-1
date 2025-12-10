import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, FileText, Play, Loader2 } from "lucide-react";
import { useUserRounds, UserRound, RoundReport } from "@/hooks/useUserRounds";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";

interface RoundsOverviewProps {
  onViewReport: (roundId: string, roundNumber: number) => void;
  onStartNewRound: () => void;
}

const RoundsOverview = ({ onViewReport, onStartNewRound }: RoundsOverviewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    rounds, 
    loading, 
    creating, 
    canStartNewRound, 
    roundsRemaining,
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-vinster-blue" />
        </div>
      </Card>
    );
  }

  const completedRounds = roundsWithReports.filter(r => r.status === 'completed');
  const hasCompletedRounds = completedRounds.length > 0;

  return (
    <Card className="p-6 border-0 rounded-3xl bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-vinster-blue">{t('dashboard.rounds.title')}</h2>
          <p className="text-gray-600 text-sm">{t('dashboard.rounds.subtitle')}</p>
        </div>
        
        {canStartNewRound && (
          <Button
            onClick={onStartNewRound}
            disabled={creating}
            className="bg-vinster-blue hover:bg-vinster-blue/90 gap-2"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {t('dashboard.rounds.start_new')}
          </Button>
        )}
      </div>

      {!hasCompletedRounds && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('dashboard.rounds.no_rounds')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('dashboard.rounds.start_first')}</p>
        </div>
      )}

      {hasCompletedRounds && (
        <div className="space-y-4">
          {completedRounds.map((round) => (
            <div
              key={round.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-vinster-blue/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t('dashboard.rounds.round_label')} {round.round_number}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {round.completed_at ? formatDate(round.completed_at) : formatDate(round.created_at)}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onViewReport(round.id, round.round_number)}
                variant="outline"
                className="gap-2 border-vinster-blue text-vinster-blue hover:bg-vinster-blue hover:text-white"
              >
                <FileText className="w-4 h-4" />
                {t('dashboard.rounds.view_report')}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Remaining rounds indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 text-center">
          {roundsRemaining > 0 ? (
            <>
              {t('dashboard.rounds.remaining').replace('{count}', String(roundsRemaining))}
            </>
          ) : (
            t('dashboard.rounds.max_reached')
          )}
        </p>
      </div>
    </Card>
  );
};

export default RoundsOverview;
