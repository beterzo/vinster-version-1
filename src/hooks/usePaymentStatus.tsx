
import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentStatus = () => {
  const { user } = useAuth();
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasPaid(null);
      setLoading(false);
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        console.log('🔍 Checking payment status for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('has_paid')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('❌ Error checking payment status:', error);
          setHasPaid(false);
        } else {
          console.log('💰 Payment status:', data?.has_paid || false);
          setHasPaid(data?.has_paid || false);
        }
      } catch (error) {
        console.error('❌ Exception checking payment status:', error);
        setHasPaid(false);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();

    // Set up real-time subscription to listen for payment status changes
    const channel = supabase
      .channel('payment-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔄 Payment status updated via real-time:', payload);
          if (payload.new && typeof payload.new.has_paid === 'boolean') {
            setHasPaid(payload.new.has_paid);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up payment status subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const refreshPaymentStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('has_paid')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setHasPaid(data.has_paid || false);
      }
    } catch (error) {
      console.error('Error refreshing payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    hasPaid,
    loading,
    refreshPaymentStatus
  };
};
