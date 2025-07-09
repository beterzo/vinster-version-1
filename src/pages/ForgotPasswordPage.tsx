
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('login.fill_all_fields'),
        description: t('login.fill_all_fields_desc'),
        variant: "destructive"
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: t('login.login_error'),
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Sending password reset for:', email, 'in language:', language);
      const { error } = await resetPassword(email, language);

      if (error) {
        console.error('Password reset error:', error);
        if (error.message.includes('User not found')) {
          toast({
            title: t('forgot_password.email_not_found'),
            description: t('forgot_password.email_not_found'),
            variant: "destructive"
          });
        } else {
          toast({
            title: t('forgot_password.error_sending'),
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        console.log('✅ Password reset email sent successfully');
        setEmailSent(true);
        toast({
          title: t('forgot_password.email_sent'),
          description: t('forgot_password.email_sent_desc')
        });
      }
    } catch (error: any) {
      console.error('Password reset exception:', error);
      toast({
        title: t('forgot_password.error_sending'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                {t('forgot_password.email_sent')}
              </h1>
              <p className="text-gray-600">
                {t('forgot_password.email_sent_desc')}
              </p>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-semibold text-blue-900 hover:text-blue-800">
                {t('forgot_password.back_to_login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {t('forgot_password.title')}
            </h1>
            <p className="text-gray-600">
              {t('forgot_password.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-medium text-left block">
                {t('forgot_password.email_label')}
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('forgot_password.email_placeholder')} 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900" 
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg" 
              disabled={isLoading}
            >
              {isLoading ? t('forgot_password.sending') : t('forgot_password.send_reset_link')}
            </Button>

            <div className="text-center">
              <Link to="/login" className="font-semibold text-blue-900 hover:text-blue-800">
                {t('forgot_password.back_to_login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
