
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const ToegangscodesProfessionals = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    window.open('https://buy.stripe.com/4gM5kC89K1cX4zt2aV8EM00', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-vinster-blue border-vinster-blue hover:bg-vinster-blue hover:text-white"
            >
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ color: '#232D4B' }}>
              Toegangscodes voor professionals
            </h1>
            <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: '#232D4B' }}>
              Als professional, coach of adviseur kunt u toegangscodes aanschaffen voor uw cliënten. 
              Koop meerdere trajecten tegelijk en geef uw cliënten direct toegang tot Vinster.
            </p>
            
            {/* Main Call-to-Action Button */}
            <div className="mt-12">
              <Button 
                onClick={handlePurchase}
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-lg px-12 py-6 h-auto"
              >
                Koop toegangscodes
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Je wordt doorgestuurd naar onze veilige betaalpagina
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* What You Get */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
              Wat krijg je?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Toegangscodes</strong> die je direct kunt delen met je cliënten
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Volledige toegang</strong> tot alle Vinster trajecten per code
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Eenvoudig beheer</strong> van gebruikte en ongebruikte codes
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Direct bruikbaar</strong> na betaling
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
              Hoe werkt het?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700">
                  Klik op "Koop toegangscodes" hierboven
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-gray-700">
                  Kies het aantal trajecten dat je nodig hebt
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-gray-700">
                  Vul je gegevens in en betaal veilig
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <p className="text-gray-700">
                  Ontvang de toegangscodes per email
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <p className="text-gray-700">
                  Deel de codes met je cliënten
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2" style={{ color: '#232D4B' }}>
                Prijzen
              </h3>
              <p className="text-sm text-gray-700">
                €29 per traject<br />
                Verschillende pakketten beschikbaar
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vragen? Neem contact op via<br />
                <a href="mailto:team@vinster.ai" className="text-blue-600 hover:underline">
                  team@vinster.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ToegangscodesProfessionals;
