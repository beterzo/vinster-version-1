
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const initializePasswordReset = async () => {
      console.log('🔐 Initializing password reset page');
      console.log('🔗 Reset password page URL:', window.location.href);
      console.log('🔗 Search params:', Object.fromEntries(searchParams.entries()));
      console.log('🔗 Hash params:', window.location.hash);
      
      // Set language from URL parameter if provided
      const langParam = searchParams.get('lang');
      if (langParam && (langParam === 'nl' || langParam === 'en')) {
        setLanguage(langParam);
      }

      // Check for direct token access via URL parameters (fallback method)
      const token = searchParams.get('token');
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      
      console.log('🔗 Direct URL token check:', {
        hasToken: !!token,
        hasTokenHash: !!tokenHash,
        type: type,
        isRecoveryType: type === 'recovery'
      });

      // If we have a recovery token directly in URL, try to verify it
      if ((token || tokenHash) && type === 'recovery') {
        console.log('🔐 Found recovery token in URL, attempting verification');
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash || token || '',
            type: 'recovery'
          });
          
          if (error) {
            console.error('❌ Direct token verification failed:', error);
            handleInvalidToken();
            return;
          } else {
            console.log('✅ Direct token verification successful');
            setHasValidSession(true);
            setIsVerifying(false);
            return;
          }
        } catch (error) {
          console.error('❌ Exception during direct token verification:', error);
        }
      }

      // Check for auth session with more lenient approach
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔐 Session check in ResetPasswordPage:', {
          hasSession: !!session,
          error: error?.message,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });

        if (error) {
          console.error('❌ Session error:', error);
          // Don't immediately redirect on session error, give user a chance
          handleInvalidToken();
          return;
        }

        if (session && session.user) {
          console.log('✅ Valid session found for password reset');
          setHasValidSession(true);
        } else {
          console.log('⚠️ No session found, but allowing user to try reset');
          // Give the user a chance - the session might be in the process of being established
          // Let them try the reset, and if it fails, they'll get proper error messages
          setHasValidSession(true);
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        // Even on error, give the user a chance to try
        setHasValidSession(true);
      } finally {
        setIsVerifying(false);
      }
    };

    initializePasswordReset();
  }, [searchParams, setLanguage]);

  const handleInvalidToken = () => {
    console.log('🔄 Redirecting to forgot password due to invalid/missing token');
    toast({
      title: t('reset_password.invalid_token'),
      description: t('reset_password.invalid_token_desc'),
      variant: "destructive"
    });
    
    // Redirect to forgot password page after a short delay
    setTimeout(() => {
      navigate('/forgot-password');
    }, 3000);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      toast({
        title: t('reset_password.password_too_short'),
        description: t('reset_password.password_too_short_desc'),
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t('reset_password.passwords_dont_match'),
        description: t('reset_password.passwords_dont_match_desc'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting to update password');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Password update error:', error);
        
        if (error.message.includes('invalid') || 
            error.message.includes('expired') ||
            error.message.includes('session') ||
            error.message.includes('token')) {
          toast({
            title: t('reset_password.invalid_token'),
            description: t('reset_password.invalid_token_desc'),
            variant: "destructive"
          });
          setTimeout(() => navigate('/forgot-password'), 2000);
        } else {
          toast({
            title: t('reset_password.error_updating'),
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        console.log('✅ Password updated successfully');
        navigate('/password-reset-success');
      }
    } catch (error) {
      console.error('❌ Exception updating password:', error);
      toast({
        title: t('reset_password.error_updating'),
        description: t('login.unknown_error'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while verifying session
  if (isVerifying) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Image with quote overlay */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-end p-12">
            <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
              <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
                {t('login.quote')}
              </blockquote>
            </div>
          </div>
        </div>

        {/* Right side - Loading */}
        <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6 lg:space-y-8 text-center">
            <div className="flex items-center justify-between">
              <img 
                alt="Vinster Logo" 
                src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
                className="h-20 w-auto" 
              />
              <LanguageSwitcher />
            </div>
            
            <div className="space-y-4">
              <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Verifying reset token...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image with quote overlay */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              {t('login.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Reset password form */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          {/* Header with Logo and Language Switcher */}
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-20 w-auto" 
            />
            <LanguageSwitcher />
          </div>

          {/* Form title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {t('reset_password.title')}
            </h1>
            <p className="text-gray-600">
              {t('reset_password.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-medium text-left block">
                {t('reset_password.new_password')}
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder={t('reset_password.new_password_placeholder')} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-900 font-medium text-left block">
                {t('reset_password.confirm_password')}
              </Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder={t('reset_password.confirm_password_placeholder')} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900" 
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg" 
              disabled={isLoading}
            >
              {isLoading ? t('reset_password.updating') : t('reset_password.update_password')}
            </Button>

            <div className="text-center">
              <Link to="/login" className="font-semibold text-yellow-500 hover:text-yellow-600">
                {t('forgot_password.back_to_login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
