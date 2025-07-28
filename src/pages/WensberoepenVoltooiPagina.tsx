
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, User, Target, Heart, Send, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { testWebhook, sendWebhookDirectly } from "@/utils/testWebhook";
import { useToast } from "@/hooks/use-toast";
import { useWebhookData } from "@/hooks/useWebhookData";

const WensberoepenVoltooiPagina = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { collectWebhookData } = useWebhookData();

  const handleProfielVoltooien = () => {
    navigate("/profiel-voltooien-intro");
  };

  const handleNaarDashboard = () => {
    navigate("/home");
  };

  const handleTestWebhook = async () => {
    toast({
      title: "Webhook test",
      description: "Versturen van test data naar webhook...",
    });

    const result = await testWebhook();
    
    if (result.success) {
      toast({
        title: "✅ Webhook test succesvol!",
        description: "Test data is succesvol verzonden naar de webhook.",
        variant: "default",
      });
    } else {
      toast({
        title: "❌ Webhook test gefaald",
        description: `Error: ${result.error}`,
        variant: "destructive",
      });
    }
  };

  const handleSendRealWebhook = async () => {
    toast({
      title: "Echte webhook data versturen",
      description: "Verzamelen en versturen van echte wensberoepen data...",
    });

    // Verzamel echte webhook data
    const realWebhookData = collectWebhookData();
    
    if (!realWebhookData) {
      toast({
        title: "❌ Geen data gevonden",
        description: "Kon geen webhook data verzamelen. Zorg dat je ingelogd bent.",
        variant: "destructive",
      });
      return;
    }

    console.log("🎯 Sending REAL webhook data:", realWebhookData);
    
    const result = await sendWebhookDirectly(realWebhookData);
    
    if (result.success) {
      toast({
        title: "✅ Echte webhook data verzonden!",
        description: "Je wensberoepen data is succesvol verzonden naar de webhook.",
        variant: "default",
      });
    } else {
      toast({
        title: "❌ Webhook verzending gefaald",
        description: `Error: ${result.error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/5d3316ef-25de-476e-a36d-e2739fec8439.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-green-100 rounded-full p-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              {t('wensberoepen.voltooi.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('wensberoepen.voltooi.subtitle')}
            </p>

            {/* What happened explanation */}
            <div className="bg-blue-50 rounded-2xl p-8 mb-12 text-left">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                {t('wensberoepen.voltooi.what_happened_title')}
              </h2>
              <p className="text-gray-700">
                {t('wensberoepen.voltooi.what_happened_description')}
              </p>
            </div>

            {/* Next steps */}
            <div className="bg-yellow-50 rounded-2xl p-8 mb-12 text-left">
              <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                {t('wensberoepen.voltooi.next_step_title')}
              </h2>
              <p className="text-gray-700 mb-6">
                {t('wensberoepen.voltooi.next_step_description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-yellow-200 rounded-full p-4 mb-3">
                    <Heart className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">{t('wensberoepen.voltooi.priorities_title')}</h3>
                  <p className="text-sm text-gray-600">{t('wensberoepen.voltooi.priorities_description')}</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-yellow-200 rounded-full p-4 mb-3">
                    <User className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">{t('wensberoepen.voltooi.extra_info_title')}</h3>
                  <p className="text-sm text-gray-600">{t('wensberoepen.voltooi.extra_info_description')}</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-yellow-200 rounded-full p-4 mb-3">
                    <Target className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">{t('wensberoepen.voltooi.report_title')}</h3>
                  <p className="text-sm text-gray-600">{t('wensberoepen.voltooi.report_description')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={handleProfielVoltooien} 
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-3 text-lg"
              >
                {t('wensberoepen.voltooi.create_report_button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={handleNaarDashboard} 
                variant="outline" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              >
                {t('wensberoepen.voltooi.to_dashboard_button')}
              </Button>
            </div>

            {/* Webhook data versturen */}
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Wensberoepen Data Versturen</h3>
              <p className="text-sm text-blue-700 mb-4">Verstuur je wensberoepen data naar de webhook voor verwerking</p>
              <Button 
                onClick={handleSendRealWebhook} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
              >
                <Zap className="mr-2 h-4 w-4" />
                Verstuur Wensberoepen Data
              </Button>
            </div>

            {/* Test Webhook Button (voor debugging) */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">🔧 Debug: Test de webhook verbinding</p>
              <Button 
                onClick={handleTestWebhook} 
                variant="outline" 
                className="border-gray-400 text-gray-700 hover:bg-gray-50"
                size="sm"
              >
                <Send className="mr-2 h-4 w-4" />
                Test Webhook
              </Button>
            </div>

            {/* Additional info */}
            <div className="mt-8 text-sm text-gray-500">
              <p>{t('wensberoepen.voltooi.tip_text')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WensberoepenVoltooiPagina;
