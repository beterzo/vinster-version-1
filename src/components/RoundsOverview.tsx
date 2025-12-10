import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, FileText, Loader2 } from "lucide-react";
import { useUserRounds, UserRound, RoundReport } from "@/hooks/useUserRounds";
import { useTranslation } from "@/hooks/useTranslation";

interface RoundsOverviewProps {
  onViewReport: (roundId: string, roundNumber: number) => void;
}

const RoundsOverview = ({ onViewReport }: RoundsOverviewProps) => {
  const { t } = useTranslation();
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
      <Card className="p-6 border-0 rounded-3xl bg-white">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-vinster-blue" />
        </div>
      </Card>
    );
  }

  const completedRounds = roundsWithReports.filter(r => r.status === 'completed');

  if (completedRounds.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 border-0 rounded-3xl bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-vinster-blue">{t('dashboard.rounds.reports_title')}</h2>
        <p className="text-gray-600 text-sm">{t('dashboard.rounds.reports_subtitle')}</p>
      </div>

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
    </Card>
  );
};

export default RoundsOverview;
