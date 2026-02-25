import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf8' }}>
      <div className="text-center max-w-md px-6">
        <img 
          src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
          alt="Vinster Logo" 
          className="h-20 w-auto mx-auto mb-8"
        />
        <h1 className="text-5xl font-bold text-[#232D4B] mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Pagina niet gevonden</p>
        <p className="text-gray-500 mb-8">De pagina die je zoekt bestaat niet of is verplaatst.</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-[#232D4B] hover:bg-[#1a2350] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
        >
          Terug naar home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
