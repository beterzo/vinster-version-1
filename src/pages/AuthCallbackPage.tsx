
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
      console.log('🔗 Full URL:', window.location.href);

      try {
        // Parse URL hash for auth tokens (Supabase often puts tokens in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type') || searchParams.get('type');

        console.log('🔐 Parsed tokens from hash:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenType,
          type
        });

        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔐 Session from callback:', {
          hasSession: !!session,
          error: error?.message,
          userId: session?.user?.id,
          emailConfirmed: session?.user?.email_confirmed_at,
          recoveryResentAt: session?.user?.recovery_sent_at,
          userCreatedAt: session?.user?.created_at,
          lastSignInAt: session?.user?.last_sign_in_at
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

        if (!session) {
          console.log('❌ No session found in callback');
          toast({
            title: 'Authentication Failed',
            description: 'Could not authenticate user',
            variant: 'destructive'
          });
          navigate('/login');
          return;
        }

        // Enhanced recovery detection
        const isRecoveryFromType = type === 'recovery';
        const isRecoveryFromTokens = accessToken && refreshToken && tokenType === 'bearer';
        const isRecoveryFromUser = session.user.recovery_sent_at !== null;
        const isRecoveryFromHash = window.location.hash.includes('recovery') || window.location.hash.includes('reset');
        const isRecoveryFromParams = searchParams.get('recovery') === 'true';
        
        // Check if this is a recent session (likely from email link)
        const userCreated = new Date(session.user.created_at);
        const lastSignIn = session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at) : null;
        const now = new Date();
        const isRecentSession = lastSignIn && (now.getTime() - lastSignIn.getTime()) < 60000; // Less than 1 minute ago

        const isRecovery = isRecoveryFromType || 
                          isRecoveryFromTokens || 
                          isRecoveryFromUser || 
                          isRecoveryFromHash || 
                          isRecoveryFromParams ||
                          (isRecentSession && accessToken); // Recent session with token likely means password reset

        console.log('🔐 Recovery detection analysis:', {
          isRecoveryFromType,
          isRecoveryFromTokens,
          isRecoveryFromUser,
          isRecoveryFromHash,
          isRecoveryFromParams,
          isRecentSession,
          finalIsRecovery: isRecovery,
          timeSinceLastSignIn: lastSignIn ? now.getTime() - lastSignIn.getTime() : 'N/A'
        });

        if (isRecovery) {
          console.log('✅ Password recovery callback detected, redirecting to reset page');
          const langParam = searchParams.get('lang');
          const resetUrl = langParam ? `/reset-password?lang=${langParam}` : '/reset-password';
          navigate(resetUrl);
          return;
        }

        if (type === 'signup') {
          console.log('✅ Email confirmation callback detected');
          toast({
            title: t('email_confirmed.title'),
            description: t('email_confirmed.description')
          });
          navigate('/');
          return;
        }

        // Default case for regular auth
        console.log('✅ General auth callback, redirecting to dashboard');
        navigate('/');

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
