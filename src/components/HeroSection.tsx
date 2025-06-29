
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

const HeroSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/b67ce5d1-c717-4a77-b5ad-550d88a42378.png')"
      }}>
        {/* Overlay for better text readability - made lighter */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-6">
        {/* Header with Logo (left) and Menu + LanguageSwitcher + Button (right) */}
        <div className="py-6 flex items-center justify-between">
          {/* Left side - Logo only, made bigger and moved more to the left */}
          <div className="flex items-center pt-1 -ml-4">
            <img 
              alt="Vinster Logo" 
              className="h-24 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
          
          {/* Right side - Mobile Menu, Language Switcher and Login Button aligned */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MobileMenu />
            </div>
            {/* Language Switcher - visible on all screen sizes */}
            <LanguageSwitcher />
            {/* Hide login button on mobile */}
            <Button 
              onClick={() => navigate('/login')} 
              className="hidden md:block bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-full border border-gray-200 shadow-sm transition-all duration-200 h-12"
            >
              {t('landing.login')}
            </Button>
          </div>
        </div>
        
        {/* Main Hero Content - Changed to flex layout for better left alignment */}
        <div className="flex items-center min-h-[400px]">
          {/* Left Content - Made wider and fully left-aligned */}
          <div className="w-full max-w-2xl space-y-6 text-left pb-8">
            <div className="text-xl text-white leading-relaxed">
              {t('landing.tagline')}
            </div>
            
            <h1 className="text-4xl font-bold text-white leading-tight">
              {t('landing.welcome')} <span style={{ color: '#FFCD3E' }}>Vinster</span>
            </h1>
            
            <p className="text-xl text-white leading-relaxed">
              {t('landing.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
