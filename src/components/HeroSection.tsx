import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import DesktopNavigation from "./DesktopNavigation";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/lovable-uploads/b67ce5d1-c717-4a77-b5ad-550d88a42378.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="py-6 flex items-center justify-between">
          <div className="flex items-center pt-1 -ml-4">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/35bcd379-05ae-4af8-abe6-ffeebd2ea3ac.png" 
              className="h-40 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
          </div>
          
          <div className="flex items-center space-x-4 mt-6">
            <DesktopNavigation />
            <LanguageSwitcher />
            <Button 
              onClick={() => navigate('/login')} 
              className="hidden md:block bg-white hover:bg-gray-100 text-[#232D4B] font-semibold px-6 py-3 rounded-full border border-gray-200 shadow-sm transition-all duration-200 h-12"
            >
              {t('landing.login')}
            </Button>
            <MobileMenu />
          </div>
        </div>
        
        {/* Main Hero Content */}
        <div className="flex items-center min-h-[400px]">
          <div className="w-full max-w-2xl space-y-6 text-left pb-8">
            <div className="text-xl text-white leading-relaxed">
              {t('landing.tagline')}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {t('landing.welcome')} <span style={{ color: '#F5C518' }}>Vinster</span>
            </h1>
            
            <p className="text-xl text-white leading-relaxed">
              {t('landing.description')}
            </p>

            <div className="pt-2">
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-[#F5C518] hover:bg-[#d4a912] text-[#232D4B] font-bold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 h-auto"
              >
                {t('landing.process_steps.start_button') || 'Start hier voor €29'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
