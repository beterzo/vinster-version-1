
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
        {/* Header with Logo and Buttons */}
        <div className="py-6 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/9f446431-090f-44ce-9726-57f4cd0bd197.png" 
              alt="Vinster Logo" 
              className="h-12 w-auto" 
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/de-mens-achter-vinster')} 
              variant="outline"
              className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white font-semibold px-6 py-3 rounded-full border-2 border-white transition-all duration-200"
            >
              De mens achter Vinster
            </Button>
            <Button onClick={() => navigate('/login')} className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-full border border-gray-200 shadow-sm transition-all duration-200">
              Inloggen
            </Button>
          </div>
        </div>
        
        {/* Main Hero Content - Changed to flex layout for better left alignment */}
        <div className="flex items-center min-h-[400px]">
          {/* Left Content - Made wider and fully left-aligned */}
          <div className="w-full max-w-2xl space-y-6 text-left pb-8">
            <div className="text-sm text-white leading-relaxed">
              Vind werk dat bij je past, met AI.<br />
              Slim, persoonlijk en verrassend.
            </div>
            
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welkom bij <span style={{ color: '#FFCD3E' }}>Vinster</span>
            </h1>
            
            <p className="text-xl text-white leading-relaxed">
              Voor iedereen die denkt: "Wat wil ik eigenlijk écht met mijn werk?"<br />
              Of je nu net begint, vastloopt, iets nieuws zoekt of gewoon even wilt heroriënteren – <span style={{ color: '#FFCD3E' }}>Vinster</span> geeft overzicht, houvast en richting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
