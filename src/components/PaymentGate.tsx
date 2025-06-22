
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface PaymentGateProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const PaymentGate = ({ children, fallbackPath = "/payment-required" }: PaymentGateProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasPaid, loading: paymentLoading } = usePaymentStatus();

  console.log('🚪 PaymentGate check:', { 
    hasUser: !!user, 
    hasPaid, 
    authLoading, 
    paymentLoading 
  });

  // Still loading auth or payment status
  if (authLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Controleer betaalstatus...</p>
        </div>
      </div>
    );
  }

  // No user (should be handled by ProtectedRoute, but just in case)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User hasn't paid yet
  if (!hasPaid) {
    console.log('💸 User has not paid, redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} replace />;
  }

  // User has paid, show content
  console.log('✅ PaymentGate: User has paid, showing content');
  return <>{children}</>;
};

export default PaymentGate;
