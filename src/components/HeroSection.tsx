
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToProcess = () => {
    const processSection = document.getElementById('het-proces');
    if (processSection) {
      processSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleStartJourney = () => {
    navigate('/signup');
  };

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
        {/* Header with Logo and Login Button */}
        <div className="py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold tracking-wide" style={{
            color: '#253857'
          }}>Vinster | jouw venster op de toekomst</span>
          </div>
          <Button onClick={() => navigate('/login')} className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-full border border-gray-200 shadow-sm transition-all duration-200">
            Inloggen
          </Button>
        </div>
        
        {/* Main Hero Content - Changed to flex layout for better left alignment */}
        <div className="flex items-center min-h-[400px]">
          {/* Left Content - Made wider and fully left-aligned */}
          <div className="w-full max-w-2xl space-y-6 text-left">
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
            
            {/* Two buttons side by side */}
            <div className="flex gap-4 justify-left pt-4 pb-8">
              <Button onClick={scrollToProcess} className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                Hoe het werkt
              </Button>
              <Button onClick={handleStartJourney} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                Start jouw reis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
