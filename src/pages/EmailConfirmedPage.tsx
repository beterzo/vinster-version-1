import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const handleGoToLogin = () => {
    navigate('/login');
  };
  return <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
      }}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              "Welkom! Je account is succesvol geactiveerd."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Confirmation content */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 text-center">
          <div className="text-center">
            <img alt="Vinster Logo" onClick={() => navigate('/')} src="/lovable-uploads/a1545c1d-6a6b-475e-9e50-3519f1d35965.png" className="h-20 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" />
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              Email succesvol bevestigd!
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              Gefeliciteerd! Je email adres is succesvol bevestigd en je account is nu geactiveerd.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-green-800">Je kunt nu aan de slag!</h3>
              <p className="text-sm text-green-700">
                Je account is klaar voor gebruik. Log in om je loopbaanreis te beginnen.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleGoToLogin} className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg">
              Ga naar inloggen
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Op weg naar een betere loopbaan
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default EmailConfirmedPage;