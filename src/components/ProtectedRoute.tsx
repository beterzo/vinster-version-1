
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute check:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading, 
    currentPath: location.pathname,
    emailConfirmed: user?.email_confirmed_at
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

  // Check if email is confirmed
  if (!user.email_confirmed_at) {
    console.log('🔒 ProtectedRoute: Email not confirmed, redirecting to email confirmation');
    return <Navigate to="/email-confirmation" replace />;
  }

  console.log('✅ ProtectedRoute: Authenticated and confirmed, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
