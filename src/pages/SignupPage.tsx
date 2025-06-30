
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t('signup.passwords_dont_match'),
        description: t('signup.passwords_dont_match_desc'),
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email || !password || !selectedLanguage) {
      toast({
        title: t('signup.fill_all_fields'),
        description: t('signup.fill_all_fields_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, firstName, lastName, selectedLanguage);

    if (error) {
      let errorMessage = t('signup.unknown_error');
      
      if (error.message === "User already registered") {
        errorMessage = t('signup.user_already_registered');
      } else if (error.message.includes("Password")) {
        errorMessage = t('signup.password_requirements');
      } else {
        errorMessage = error.message;
      }

      toast({
        title: t('signup.registration_error'),
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('signup.account_created'),
        description: t('signup.verification_email_sent'),
        duration: 6000,
      });
      
      // Navigate to email verification page
      navigate("/email-verification");
    }

    setIsLoading(false);
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
              {t('signup.quote')}
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          {/* Header with Logo and Language Switcher */}
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
            <LanguageSwitcher />
          </div>

          {/* Signup form title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {t('signup.title')}
            </h1>
            <p className="text-gray-600">
              {t('signup.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-900 font-medium text-left block">
                  {t('signup.first_name')}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t('signup.first_name_placeholder')}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-900 font-medium text-left block">
                  {t('signup.last_name')}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t('signup.last_name_placeholder')}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-medium text-left block">
                {t('signup.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signup.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-medium text-left block">
                {t('signup.password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t('signup.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-900 font-medium text-left block">
                {t('signup.confirm_password')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('signup.confirm_password_placeholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-blue-900 font-medium text-left block">
                {t('signup.preferred_language')} *
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage} required>
                <SelectTrigger className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900">
                  <SelectValue placeholder={t('signup.select_language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nl">Nederlands</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? t('signup.creating_account') : t('signup.create_account')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('signup.have_account')}{" "}
                <Link to="/login" className="font-semibold text-yellow-500 hover:text-yellow-600">
                  {t('signup.login_here')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
