
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
      console.log('🔗 Current URL:', window.location.href);
      console.log('🔗 URL search params:', Object.fromEntries(searchParams.entries()));
      console.log('🔗 URL hash:', window.location.hash);
      console.log('🔗 URL pathname:', window.location.pathname);
      console.log('🔗 URL search:', window.location.search);

      try {
        // Parse URL hash for auth tokens (Supabase often puts tokens in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type') || searchParams.get('type');
        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

        console.log('🔐 URL Analysis:', {
          fromHash: {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            tokenType,
            type: hashParams.get('type'),
            error: hashParams.get('error'),
            errorDescription: hashParams.get('error_description'),
            allHashParams: Object.fromEntries(hashParams.entries())
          },
          fromSearchParams: {
            type: searchParams.get('type'),
            recovery: searchParams.get('recovery'),
            lang: searchParams.get('lang'),
            error: searchParams.get('error'),
            allSearchParams: Object.fromEntries(searchParams.entries())
          }
        });

        // Check for auth errors first
        if (error) {
          console.error('❌ Auth error from URL:', error, errorDescription);
          toast({
            title: 'Authentication Error',
            description: errorDescription || error,
            variant: 'destructive'
          });
          navigate('/login');
          return;
        }

        // Get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔐 Session from callback:', {
          hasSession: !!session,
          error: sessionError?.message,
          userId: session?.user?.id,
          emailConfirmed: session?.user?.email_confirmed_at,
          recoveryResentAt: session?.user?.recovery_sent_at,
          userCreatedAt: session?.user?.created_at,
          lastSignInAt: session?.user?.last_sign_in_at,
          appMetadata: session?.user?.app_metadata,
          userMetadata: session?.user?.user_metadata
        });

        if (sessionError) {
          console.error('❌ Auth callback session error:', sessionError);
          toast({
            title: 'Authentication Error',
            description: sessionError.message,
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

        // Enhanced recovery detection with detailed logging
        const detectionChecks = {
          typeParamRecovery: type === 'recovery',
          recoveryParamTrue: searchParams.get('recovery') === 'true',
          hasTokensFromHash: !!(accessToken && refreshToken && tokenType === 'bearer'),
          userRecoveryFlag: session.user.recovery_sent_at !== null,
          hashContainsRecovery: window.location.hash.includes('recovery') || window.location.hash.includes('reset'),
          hashContainsType: window.location.hash.includes('type=recovery'),
          urlContainsRecover: window.location.href.includes('recover'),
          hasAccessTokenInHash: !!accessToken
        };

        console.log('🔐 Recovery detection checks:', detectionChecks);

        // Check if this is a recent session (likely from email link)
        const userCreated = new Date(session.user.created_at);
        const lastSignIn = session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at) : null;
        const now = new Date();
        const timeSinceLastSignIn = lastSignIn ? now.getTime() - lastSignIn.getTime() : null;
        const isRecentSession = timeSinceLastSignIn && timeSinceLastSignIn < 60000; // Less than 1 minute ago

        console.log('🔐 Time analysis:', {
          userCreated: userCreated.toISOString(),
          lastSignIn: lastSignIn?.toISOString(),
          now: now.toISOString(),
          timeSinceLastSignIn,
          isRecentSession
        });

        const isRecovery = detectionChecks.typeParamRecovery || 
                          detectionChecks.recoveryParamTrue || 
                          detectionChecks.hasTokensFromHash || 
                          detectionChecks.userRecoveryFlag || 
                          detectionChecks.hashContainsRecovery ||
                          detectionChecks.hashContainsType ||
                          detectionChecks.urlContainsRecover ||
                          (isRecentSession && detectionChecks.hasAccessTokenInHash);

        console.log('🔐 Final recovery decision:', {
          isRecovery,
          reasoning: Object.entries(detectionChecks).filter(([key, value]) => value).map(([key]) => key)
        });

        if (isRecovery) {
          console.log('✅ Password recovery callback detected, redirecting to reset page');
          const langParam = searchParams.get('lang');
          const resetUrl = langParam ? `/reset-password?lang=${langParam}` : '/reset-password';
          console.log('🔄 Redirecting to:', resetUrl);
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
        <p className="text-sm text-gray-500">Check console for detailed logs</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
