import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Zap, Clock, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const PaymentRequired = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    hasPaid,
    refreshPaymentStatus
  } = usePaymentStatus();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user has already paid
  useEffect(() => {
    if (hasPaid) {
      console.log('✅ User has paid, redirecting to home');
      navigate('/home');
    }
  }, [hasPaid, navigate]);
  const features = [{
    title: "Volledige enthousiasmescan",
    description: "Ontdek waar jouw echte passies liggen",
    icon: <Star className="w-5 h-5 text-yellow-400" />
  }, {
    title: "Wensberoepen analyse",
    description: "Krijg gepersonaliseerde beroepsadviezen",
    icon: <CheckCircle className="w-5 h-5 text-yellow-400" />
  }, {
    title: "Persoonlijk rapport",
    description: "Uitgebreide analyse van jouw loopbaanprofiel",
    icon: <Shield className="w-5 h-5 text-yellow-400" />
  }, {
    title: "Zoekprofiel generator",
    description: "Automatisch gegenereerd profiel voor vacatures",
    icon: <Zap className="w-5 h-5 text-yellow-400" />
  }];
  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Fout",
        description: "Gebruikersgegevens niet beschikbaar",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const webhookData = {
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        userId: user.id
      };
      console.log('Sending webhook data:', webhookData);
      const response = await fetch('https://hook.eu2.make.com/byf77ioiyyzqrsri73hmsri7hjhjyoup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      console.log('Webhook response status:', response.status);
      if (response.ok) {
        console.log('Webhook successfully sent');
        const contentType = response.headers.get('content-type');
        console.log('Response content-type:', contentType);
        let responseData;
        try {
          responseData = await response.json();
          console.log('Webhook response data:', responseData);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          const textResponse = await response.text();
          console.log('Response as text:', textResponse);
          throw new Error('Invalid JSON response from webhook');
        }
        if (responseData && responseData.checkout_url) {
          console.log('Opening checkout URL in new tab:', responseData.checkout_url);
          const newWindow = window.open(responseData.checkout_url, '_blank');
          if (newWindow) {
            toast({
              title: "Succes",
              description: "Betaalpagina wordt geopend in een nieuw tabblad. Na betaling word je automatisch doorgeleid."
            });

            // Start checking payment status periodically after opening checkout
            const checkInterval = setInterval(async () => {
              await refreshPaymentStatus();
            }, 5000); // Check every 5 seconds

            // Clean up interval after 10 minutes
            setTimeout(() => {
              clearInterval(checkInterval);
            }, 600000);
          } else {
            console.log('Popup blocked, using direct redirect');
            window.location.href = responseData.checkout_url;
          }
        } else {
          console.error('No checkout_url in response:', responseData);
          toast({
            title: "Fout",
            description: "Geen betaallink ontvangen. Probeer het opnieuw.",
            variant: "destructive"
          });
        }
      } else {
        console.error('Webhook failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden bij het verwerken van je aanvraag. Probeer het opnieuw.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwerken van je aanvraag. Probeer het opnieuw.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Header with new logo */}
        <div className="text-center mb-8">
          <img alt="Vinster Logo" className="h-12 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity duration-200 mb-6" onClick={() => navigate('/')} src="/lovable-uploads/23b63bc5-3895-4312-ad2b-36f3e48adb5a.png" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-vinster-blue mb-4">
            Welkom bij Vinster, {user?.user_metadata?.first_name || 'daar'}!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Je bent nog maar één stap verwijderd van het ontdekken van jouw ideale loopbaan!
          </p>
        </div>

        {/* Main content - responsive layout with aligned columns */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          
          {/* Left column: Content */}
          <div className="space-y-6 lg:space-y-8 flex flex-col">
            {/* Welcome card */}
            <Card className="p-6 lg:p-8 border-0 rounded-3xl" style={{
            backgroundColor: '#E6F0F6'
          }}>
              <h2 className="text-xl lg:text-2xl font-bold text-vinster-blue mb-4">Start jouw loopbaanontwikkeling</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Met Vinster krijg je toegang tot wetenschappelijk onderbouwde tools die je helpen 
                jouw ideale loopbaan te vinden. Onze methode is gebaseerd op jarenlang onderzoek 
                en heeft al duizenden mensen geholpen.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Begin vandaag nog met de enthousiasmescan en ontdek wat je echt drijft in je werk. 
                Het complete programma duurt ongeveer 45 minuten en geeft je direct inzicht in 
                jouw unieke loopbaanprofiel.
              </p>
            </Card>

            {/* Features grid - responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 flex-grow">
              {features.map((feature, index) => <Card key={index} className="p-4 lg:p-6 border-0 rounded-3xl bg-white shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-vinster-blue mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>)}
            </div>

            {/* Data Safety Card */}
            <Card className="p-6 lg:p-8 border-0 rounded-3xl" style={{
            backgroundColor: '#E6F0F6'
          }}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-vinster-blue mb-3">100% Veilig & GDPR-compliant</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Jouw gegevens zijn volledig veilig en GDPR-compliant. We gebruiken AI-modellen om je persoonlijke 
                    inzichten te genereren, maar jouw gegevens worden nooit opgeslagen door deze modellen. 
                    Alles blijft privé en vertrouwelijk bij jou.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column: Pricing + Additional content */}
          <div className="flex flex-col gap-6 lg:gap-6">
            {/* Pricing Card */}
            <Card className="p-6 lg:p-8 border-0 rounded-3xl bg-white shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-vinster-blue mb-2">Volledige toegang</h3>
                <p className="text-gray-600 mb-4">Eenmalige betaling voor levenslange toegang</p>
                <div className="text-3xl lg:text-4xl font-bold text-vinster-blue mb-1">€29</div>
                <p className="text-sm text-gray-500">Eenmalig, geen abonnement</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Volledige enthousiasmescan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Wensberoepen analyse</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Persoonlijk rapport (PDF)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Zoekprofiel generator</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Levenslange toegang</span>
                </div>
              </div>

              <Button onClick={handlePayment} disabled={isLoading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold py-3 lg:py-4 text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200" size="lg">
                {isLoading ? "Verwerken..." : "Start nu voor €29"}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Veilig betalen met iDEAL, creditcard of PayPal
              </p>
            </Card>

            {/* Money-back guarantee */}
            <Card className="p-4 lg:p-6 border-0 rounded-3xl bg-green-50 border-green-200">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-vinster-blue mb-2">30 dagen geld-terug garantie</h4>
                <p className="text-sm text-green-700">
                  Niet tevreden? Krijg je geld terug, geen vragen gesteld.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default PaymentRequired;