import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ConditionalRouteProps {
  canAccess: boolean;
  blockedReason?: string;
  redirectTo?: string;
  children: React.ReactNode;
}

const ConditionalRoute = ({ 
  canAccess, 
  blockedReason, 
  redirectTo = '/home', 
  children 
}: ConditionalRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!canAccess) {
      toast({
        title: 'Toegang geweigerd',
        description: blockedReason || 'Je moet eerst de vorige stap voltooien',
        variant: 'destructive'
      });
      navigate(redirectTo);
    }
  }, [canAccess, blockedReason, redirectTo, navigate, toast]);

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalRoute;
