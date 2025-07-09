
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Set language from URL parameter if provided
    const langParam = searchParams.get('lang');
    if (langParam && (langParam === 'nl' || langParam === 'en')) {
      setLanguage(langParam);
    }
  }, [searchParams, setLanguage]);

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
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('invalid') || error.message.includes('expired')) {
          toast({
            title: t('reset_password.invalid_token'),
            description: t('reset_password.invalid_token_desc'),
            variant: "destructive"
          });
        } else {
          toast({
            title: t('reset_password.error_updating'),
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        navigate('/password-reset-success');
      }
    } catch (error) {
      toast({
        title: t('reset_password.error_updating'),
        description: t('login.unknown_error'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
