import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ConditionalRouteProps {
  canAccess: boolean;
  isLoading?: boolean;
  blockedReason?: string;
  redirectTo?: string;
  children: React.ReactNode;
}

const ConditionalRoute = ({ 
  canAccess, 
  isLoading = false,
  blockedReason, 
  redirectTo = '/home', 
  children 
}: ConditionalRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only check access after loading is complete
    if (!isLoading && !canAccess) {
      toast({
        title: 'Toegang geweigerd',
        description: blockedReason || 'Je moet eerst de vorige stap voltooien',
        variant: 'destructive'
      });
      navigate(redirectTo);
    }
  }, [canAccess, isLoading, blockedReason, redirectTo, navigate, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalRoute;
