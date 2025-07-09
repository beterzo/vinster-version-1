
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔐 Auth callback page loaded');
      console.log('🔗 URL params:', Object.fromEntries(searchParams.entries()));
      console.log('🔗 URL hash:', window.location.hash);

      try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔐 Session from callback:', {
          hasSession: !!session,
          error: error?.message,
          userId: session?.user?.id
        });

        if (error) {
          console.error('❌ Auth callback error:', error);
          toast({
            title: 'Authentication Error',
            description: error.message,
            variant: 'destructive'
          });
          navigate('/login');
          return;
        }

        // Check if this is a password recovery callback
        const type = searchParams.get('type');
        const isRecovery = type === 'recovery' || 
                          session?.user?.recovery_sent_at ||
                          window.location.hash.includes('recovery');

        console.log('🔐 Callback type check:', {
          type,
          recoveryResentAt: session?.user?.recovery_sent_at,
          hashIncludes: window.location.hash.includes('recovery'),
          isRecovery
        });

        if (session && isRecovery) {
          console.log('✅ Password recovery callback detected, redirecting to reset page');
          const langParam = searchParams.get('lang');
          const resetUrl = langParam ? `/reset-password?lang=${langParam}` : '/reset-password';
          navigate(resetUrl);
          return;
        }

        if (session && type === 'signup') {
          console.log('✅ Email confirmation callback detected');
          toast({
            title: t('email_confirmed.title'),
            description: t('email_confirmed.description')
          });
          navigate('/');
          return;
        }

        if (session) {
          console.log('✅ General auth callback, redirecting to dashboard');
          navigate('/');
          return;
        }

        // No session found
        console.log('❌ No session found in callback');
        toast({
          title: 'Authentication Failed',
          description: 'Could not authenticate user',
          variant: 'destructive'
        });
        navigate('/login');

      } catch (error) {
        console.error('❌ Auth callback exception:', error);
        toast({
          title: 'Authentication Error',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
