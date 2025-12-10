import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface UserRound {
  id: string;
  user_id: string;
  round_number: number;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoundReport {
  id: string;
  round_id: string;
  report_status: string;
  report_content: any;
  created_at: string;
}

const MAX_ROUNDS = 10;

export const useUserRounds = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rounds, setRounds] = useState<UserRound[]>([]);
  const [currentRound, setCurrentRound] = useState<UserRound | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadRounds = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_rounds')
        .select('*')
        .eq('user_id', user.id)
        .order('round_number', { ascending: false });

      if (error) throw error;

      const typedRounds = (data || []) as UserRound[];
      setRounds(typedRounds);

      // Find current in-progress round
      const inProgressRound = typedRounds.find(r => r.status === 'in_progress');
      setCurrentRound(inProgressRound || null);
    } catch (error) {
      console.error('Error loading rounds:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRounds();
  }, [loadRounds]);

  const canStartNewRound = rounds.length < MAX_ROUNDS;
  const roundsRemaining = MAX_ROUNDS - rounds.length;

  const startNewRound = async (): Promise<UserRound | null> => {
    if (!user) return null;
    if (!canStartNewRound) {
      toast({
        title: "Maximum bereikt",
        description: `Je hebt al ${MAX_ROUNDS} rondes voltooid.`,
        variant: "destructive"
      });
      return null;
    }

    setCreating(true);
    try {
      const nextRoundNumber = rounds.length > 0 
        ? Math.max(...rounds.map(r => r.round_number)) + 1 
        : 1;

      const { data, error } = await supabase
        .from('user_rounds')
        .insert({
          user_id: user.id,
          round_number: nextRoundNumber,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      const newRound = data as UserRound;
      setRounds(prev => [newRound, ...prev]);
      setCurrentRound(newRound);

      console.log('✅ New round started:', newRound);
      return newRound;
    } catch (error) {
      console.error('Error starting new round:', error);
      toast({
        title: "Fout",
        description: "Kon geen nieuwe ronde starten. Probeer het opnieuw.",
        variant: "destructive"
      });
      return null;
    } finally {
      setCreating(false);
    }
  };

  const getReportForRound = async (roundId: string): Promise<RoundReport | null> => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('id, round_id, report_status, report_content, created_at')
        .eq('round_id', roundId)
        .maybeSingle();

      if (error) throw error;
      return data as RoundReport | null;
    } catch (error) {
      console.error('Error fetching report for round:', error);
      return null;
    }
  };

  const getCompletedRoundsWithReports = async (): Promise<Array<UserRound & { report?: RoundReport }>> => {
    const completedRounds = rounds.filter(r => r.status === 'completed');
    
    const roundsWithReports = await Promise.all(
      completedRounds.map(async (round) => {
        const report = await getReportForRound(round.id);
        return { ...round, report: report || undefined };
      })
    );

    return roundsWithReports;
  };

  return {
    rounds,
    currentRound,
    loading,
    creating,
    canStartNewRound,
    roundsRemaining,
    startNewRound,
    getReportForRound,
    getCompletedRoundsWithReports,
    refreshRounds: loadRounds
  };
};
