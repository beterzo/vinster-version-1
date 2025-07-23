
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('auth.email_required'),
        description: t('auth.email_required_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create redirect URL with language parameter to ensure correct language detection
      const redirectUrl = `https://vinster.ai/password-reset-success?lang=${language}`;
      console.log('🔗 Sending password reset with redirect URL:', redirectUrl);
      console.log('🌐 Current language:', language);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        let errorMessage = t('auth.password_reset_error');
        
        if (error.message.includes('Email not confirmed')) {
          errorMessage = t('auth.email_not_confirmed');
        } else if (error.message.includes('User not found')) {
          errorMessage = t('auth.user_not_found');
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: t('auth.password_reset_failed'),
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('✅ Password reset email sent successfully');
        // Store email for the check email page
        localStorage.setItem('password-reset-email', email);
        toast({
          title: t('auth.password_reset_sent'),
          description: t('auth.password_reset_sent_desc'),
          duration: 6000,
        });
        navigate(`/check-email-password-reset?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      console.error('❌ Password reset exception:', error);
      toast({
        title: t('auth.password_reset_failed'),
        description: t('auth.unexpected_error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image with quote overlay */}
      <div className="relative hidden lg:block">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              {t('auth.login.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Forgot password form */}
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

          {/* Forgot password form title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {t('auth.forgot_password_title')}
            </h1>
            <p className="text-gray-600">
              {t('auth.forgot_password_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-medium text-left block">
                {t('auth.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? t('auth.sending') : t('auth.send_reset_link')}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {t('auth.remember_password')}{" "}
                <Link to="/login" className="font-semibold text-yellow-500 hover:text-yellow-600">
                  {t('auth.back_to_login')}
                </Link>
              </p>
              
              <p className="text-sm text-gray-600">
                {t('auth.no_account')}{" "}
                <Link to="/signup" className="font-semibold text-yellow-500 hover:text-yellow-600">
                  {t('auth.register_here')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
