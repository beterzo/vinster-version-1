
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PaymentGuardProps {
  children: React.ReactNode;
}

const PaymentGuard = ({ children }: PaymentGuardProps) => {
  const { user, session, loading: authLoading } = useAuth();
  const location = useLocation();

  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('has_paid')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id && !!session,
  });

  console.log('💳 PaymentGuard check:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    authLoading,
    profileLoading,
    hasPaid: profile?.has_paid,
    currentPath: location.pathname,
    error: error?.message
  });

  // Show loading while checking auth or profile
  if (authLoading || profileLoading) {
    console.log('💳 PaymentGuard: Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificatie van toegang...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !session) {
    console.log('💳 PaymentGuard: No auth, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Handle profile fetch error
  if (error) {
    console.log('💳 PaymentGuard: Profile error, redirecting to payment page');
    return <Navigate to="/payment-required" replace />;
  }

  // Check payment status
  if (!profile?.has_paid) {
    console.log('💳 PaymentGuard: User has not paid, redirecting to payment page');
    return <Navigate to="/payment-required" replace />;
  }

  console.log('✅ PaymentGuard: User has paid, rendering protected content');
  return <>{children}</>;
};

export default PaymentGuard;
