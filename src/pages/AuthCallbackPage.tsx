
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

        // STEP 1: PRIORITY CHECK - If this is a recovery flow, go directly to reset password
        const isRecoveryFlow = type === 'recovery' || 
                              searchParams.get('recovery') === 'true' ||
                              hashParams.get('type') === 'recovery' ||
                              window.location.hash.includes('recovery') ||
                              window.location.hash.includes('type=recovery') ||
                              window.location.href.includes('recovery');

        console.log('🔐 Recovery flow detection (PRIORITY CHECK):', {
          typeParam: type,
          recoveryParam: searchParams.get('recovery'),
          hashType: hashParams.get('type'),
          urlContainsRecovery: window.location.href.includes('recovery'),
          hashContainsRecovery: window.location.hash.includes('recovery'),
          isRecoveryFlow
        });

        if (isRecoveryFlow) {
          console.log('✅ RECOVERY FLOW DETECTED - Redirecting to reset password immediately');
          const langParam = searchParams.get('lang');
          const resetUrl = langParam ? `/reset-password?lang=${langParam}` : '/reset-password';
          console.log('🔄 Redirecting to reset password:', resetUrl);
          navigate(resetUrl);
          return;
        }

        // STEP 2: Only check session for non-recovery flows
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔐 Session from callback:', {
          hasSession: !!session,
          error: sessionError?.message,
          userId: session?.user?.id,
          emailConfirmed: session?.user?.email_confirmed_at,
          recoveryResentAt: session?.user?.recovery_sent_at,
          userCreatedAt: session?.user?.created_at,
          lastSignInAt: session?.user?.last_sign_in_at
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

        // STEP 3: Handle other auth flows (signup confirmation, regular login)
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
