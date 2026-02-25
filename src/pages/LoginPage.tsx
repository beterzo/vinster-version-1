
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useOrganisation } from "@/contexts/OrganisationContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { clearOrganisation } = useOrganisation();

  useEffect(() => {
    clearOrganisation();
  }, [clearOrganisation]);

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast({
        title: t('login.account_verified'),
        description: t('login.account_verified_desc')
      });
    }
  }, [searchParams, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: t('login.fill_all_fields'),
        description: t('login.fill_all_fields_desc'),
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      let errorMessage = t('login.unknown_error');
      if (error.message === "Invalid login credentials") {
        errorMessage = t('login.invalid_credentials');
      } else if (error.message === "Email not confirmed" || error.message.includes("Email not confirmed")) {
        errorMessage = t('login.email_not_confirmed');
      } else {
        errorMessage = error.message;
      }
      toast({
        title: t('login.login_error'),
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      toast({
        title: t('login.login_success'),
        description: t('login.welcome_back')
      });
      navigate("/home");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image with glassmorphism quote overlay */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white/15 backdrop-blur-[8px] border border-white/20 rounded-xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-white leading-relaxed drop-shadow-sm">
              {t('login.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <LanguageSwitcher />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#232D4B]">
              {t('login.title')}
            </h1>
            <p className="text-gray-600">
              {t('login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#232D4B] font-medium text-left block">
                {t('login.email')}
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('login.email_placeholder')} 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="h-12 px-4" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#232D4B] font-medium text-left block">
                {t('login.password')}
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder={t('login.password_placeholder')} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="h-12 px-4" 
                required 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  {t('login.remember_me')}
                </Label>
              </div>
              
              <Link to="/forgot-password" className="text-sm font-semibold text-[#F5C518] hover:text-[#d4a912]">
                {t('login.forgot_password')}
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#232D4B] hover:bg-[#1a2350] text-white font-semibold text-base rounded-[10px]" 
              disabled={isLoading}
            >
              {isLoading ? t('login.logging_in') : t('login.sign_in')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('login.no_account')}{" "}
                <Link to="/signup" className="font-semibold text-[#F5C518] hover:text-[#d4a912]">
                  {t('login.create_account')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
