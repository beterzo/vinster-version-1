import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useReportGenerationLimit = () => {
  const { user } = useAuth();
  const [hasCompletedReport, setHasCompletedReport] = useState(false);
  const [canGenerateNewReport, setCanGenerateNewReport] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkReportStatus = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has a completed report
        const { data: reportData, error: reportError } = await supabase
          .from('user_reports')
          .select('report_status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (reportError) {
          console.error('Error checking report status:', reportError);
          setLoading(false);
          return;
        }

        const hasCompleted = reportData?.report_status === 'completed';
        setHasCompletedReport(hasCompleted);

        if (hasCompleted) {
          // Check if there's an active journey reset (allows new report)
          const { data: resetData, error: resetError } = await supabase
            .from('journey_resets')
            .select('reset_completed, webhook_processed')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (resetError) {
            console.error('Error checking journey reset:', resetError);
          }

          // User can generate new report if there's a completed reset
          const canGenerate = resetData?.reset_completed === true;
          setCanGenerateNewReport(canGenerate);
          
          console.log('🔐 Report generation limit check:', {
            hasCompleted,
            hasReset: !!resetData,
            resetCompleted: resetData?.reset_completed,
            canGenerate
          });
        } else {
          // No completed report, user can generate
          setCanGenerateNewReport(true);
        }
      } catch (error) {
        console.error('Error in useReportGenerationLimit:', error);
      } finally {
        setLoading(false);
      }
    };

    checkReportStatus();
  }, [user?.id]);

  return {
    hasCompletedReport,
    canGenerateNewReport,
    loading
  };
};
