
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PaymentRequired = () => {
  const { user } = useAuth();
  
  const features = [
    {
      title: "Volledige Enthousiasmescan",
      description: "Ontdek waar jouw echte passies liggen",
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Wensberoepen Analyse",
      description: "Krijg gepersonaliseerde beroepsadviezen",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      title: "Persoonlijk Rapport",
      description: "Uitgebreide analyse van jouw loopbaanprofiel",
      icon: <Shield className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Zoekprofiel Generator",
      description: "Automatisch gegenereerd profiel voor vacatures",
      icon: <Zap className="w-5 h-5 text-purple-500" />
    }
  ];

  const handlePayment = async () => {
    if (!user) {
      alert("Gebruikersgegevens niet beschikbaar");
      return;
    }

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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('Webhook successfully sent');
        // You can add success feedback here if needed
      } else {
        console.error('Webhook failed:', response.status, response.statusText);
        alert("Er is een fout opgetreden bij het verwerken van je aanvraag. Probeer het opnieuw.");
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      alert("Er is een fout opgetreden bij het verwerken van je aanvraag. Probeer het opnieuw.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-6" 
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welkom bij Vinster, {user?.user_metadata?.first_name || 'daar'}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Je bent nog maar één stap verwijderd van het ontdekken van jouw ideale loopbaan!
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-[1fr_400px] gap-8 min-h-[600px]">
          
          {/* Left column: Content */}
          <div className="space-y-8">
            {/* Welcome card */}
            <Card className="p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start jouw loopbaanontwikkeling</h2>
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

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 border-0 rounded-3xl bg-white shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Value proposition */}
            <Card className="p-6 border-0 rounded-3xl text-white" style={{ backgroundColor: '#78BFE3' }}>
              <h3 className="font-bold text-xl mb-4">Waarom kiezen voor Vinster?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Wetenschappelijk onderbouwde methode gebruikt door meer dan 10.000 professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Persoonlijk rapport met concrete vervolgstappen</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Direct toegang tot alle tools en analyses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span>Levenslang toegang tot jouw persoonlijke dashboard</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Right column: Pricing */}
          <div className="flex flex-col gap-8">
            {/* Pricing card */}
            <Card className="p-8 border-0 rounded-3xl bg-white shadow-lg flex-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Volledige Toegang</h3>
                <p className="text-gray-600 mb-4">Eenmalige betaling voor levenslange toegang</p>
                <div className="text-4xl font-bold text-gray-900 mb-1">€29</div>
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

              <Button 
                onClick={handlePayment} 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200" 
                size="lg"
              >
                Start nu voor €29
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Veilig betalen met iDEAL, creditcard of PayPal
              </p>
            </Card>

            {/* Guarantee */}
            <Card className="p-6 border-0 rounded-3xl bg-green-50 border-green-200">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">30 dagen geld-terug garantie</h4>
                <p className="text-sm text-green-700">
                  Niet tevreden? Krijg je geld terug, geen vragen gesteld.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequired;
