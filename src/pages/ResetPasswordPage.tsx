
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [hasValidToken, setHasValidToken] = useState<boolean | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Set language from URL parameter if present
    const langParam = searchParams.get('lang');
    if (langParam === 'nl' || langParam === 'en') {
      setLanguage(langParam);
    }

    // Check if we have a valid session/token from the URL
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          setHasValidToken(false);
          return;
        }
        
        // Check if this is a password recovery session
        if (session?.user && !session.user.email_confirmed_at) {
          // This might be a password reset session
          setHasValidToken(true);
        } else if (session?.user) {
          // User is already logged in, redirect to home
          navigate('/home');
        } else {
          setHasValidToken(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setHasValidToken(false);
      }
    };

    checkSession();
  }, [searchParams, setLanguage, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: t('reset_password.passwords_dont_match'),
        description: t('login.fill_all_fields_desc'),
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

    if (password.length < 6) {
      toast({
        title: t('signup.password_requirements'),
        description: t('signup.password_requirements'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Update password error:', error);
        toast({
          title: t('login.unknown_error'),
          description: error.message,
          variant: "destructive"
        });
      } else {
        setPasswordUpdated(true);
        toast({
          title: t('reset_password.password_updated'),
          description: t('reset_password.password_updated_desc')
        });
        
        // Sign out the user so they can sign in with their new password
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: t('login.unknown_error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (hasValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (hasValidToken === false) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Image */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
        </div>

        {/* Right side - Error message */}
        <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6 lg:space-y-8">
            {/* Header with Logo and Language Switcher */}
            <div className="flex items-center justify-between">
              <img 
                alt="Vinster Logo" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              />
              <LanguageSwitcher />
            </div>

            {/* Error message */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                {t('reset_password.invalid_token')}
              </h1>
              <p className="text-gray-600">
                {t('reset_password.invalid_token_desc')}
              </p>
            </div>

            <div className="text-center space-y-4">
              <Link 
                to="/forgot-password" 
                className="inline-flex items-center justify-center w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg transition-colors"
              >
                {t('reset_password.request_new_reset')}
              </Link>
              
              <Link to="/login" className="font-semibold text-blue-900 hover:text-blue-800">
                {t('reset_password.continue_to_login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (passwordUpdated) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Image */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
        </div>

        {/* Right side - Success message */}
        <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6 lg:space-y-8">
            {/* Header with Logo and Language Switcher */}
            <div className="flex items-center justify-between">
              <img 
                alt="Vinster Logo" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              />
              <LanguageSwitcher />
            </div>

            {/* Success message */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                {t('reset_password.password_updated')}
              </h1>
              <p className="text-gray-600">
                {t('reset_password.password_updated_desc')}
              </p>
            </div>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg transition-colors"
              >
                {t('reset_password.continue_to_login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
      </div>

      {/* Right side - Reset password form */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          {/* Header with Logo and Language Switcher */}
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <LanguageSwitcher />
          </div>

          {/* Reset password form title */}
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
              <Link to="/login" className="font-semibold text-blue-900 hover:text-blue-800">
                {t('reset_password.continue_to_login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
