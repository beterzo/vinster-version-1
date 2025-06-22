
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import PaymentGate from "./PaymentGate";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePayment?: boolean;
}

const ProtectedRoute = ({ children, requirePayment = true }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute check:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading, 
    requirePayment,
    currentPath: location.pathname
  });

  if (loading) {
    console.log('🔒 ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Check both user and session for maximum reliability
  if (!user || !session) {
    console.log('🔒 ProtectedRoute: No auth, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If payment is required, wrap in PaymentGate
  if (requirePayment) {
    console.log('💰 ProtectedRoute: Payment required, checking payment status');
    return (
      <PaymentGate>
        {children}
      </PaymentGate>
    );
  }

  // No payment required, just show content
  console.log('✅ ProtectedRoute: Authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
