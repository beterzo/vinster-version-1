import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [accessCode, setAccessCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(true);
  const {
    t,
    language
  } = useTranslation();

  // Redirect if user has already paid
  useEffect(() => {
    if (hasPaid) {
      console.log('✅ User has paid, redirecting to home');
      navigate('/home');
    }
  }, [hasPaid, navigate]);
  const features = [{
    title: t('payment.features.full_scan'),
    description: t('payment.features.full_scan_desc'),
    icon: <Star className="w-5 h-5 text-yellow-400" />
  }, {
    title: t('payment.features.dream_jobs'),
    description: t('payment.features.dream_jobs_desc'),
    icon: <CheckCircle className="w-5 h-5 text-yellow-400" />
  }, {
    title: t('payment.features.personal_report'),
    description: t('payment.features.personal_report_desc'),
    icon: <Shield className="w-5 h-5 text-yellow-400" />
  }, {
    title: t('payment.features.search_profile'),
    description: t('payment.features.search_profile_desc'),
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
        userId: user.id,
        language: language
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

  const handleSubmitAccessCode = async () => {
    if (!user || !accessCode.trim()) return;
    
    setIsValidatingCode(true);
    
    try {
      const response = await fetch('https://hook.eu2.make.com/jw6af19g8fbvtbpe42ussanvp8sur37j', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessCode: accessCode.trim(),
          userId: user.id,
          email: user.email,
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          language: language
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success === false) {
          toast({
            title: t('payment.access_code.invalid_title'),
            description: data.message || t('payment.access_code.invalid_desc'),
            variant: "destructive"
          });
          setAccessCode('');
          setIsValidatingCode(false);
          return;
        }
      }
    } catch (error) {
      // Network error or CORS - but webhook might have succeeded
      console.log('Network error during access code validation, checking payment status...', error);
    }

    // Show success message (webhook was sent successfully)
    toast({
      title: t('payment.access_code.success_title'),
      description: t('payment.access_code.success_desc')
    });
    setShowAccessCodeInput(false);
    
    // Start checking payment status regardless of response
    // This handles cases where webhook succeeds but response is blocked by CORS
    const checkInterval = setInterval(async () => {
      await refreshPaymentStatus();
    }, 2000);
    
    setTimeout(() => {
      clearInterval(checkInterval);
      setIsValidatingCode(false);
    }, 60000);
  };

  const firstName = user?.user_metadata?.first_name || 'daar';
  return <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Header with logo and language switcher */}
        <div className="flex justify-between items-center mb-8">
          <img alt="Vinster Logo" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/')} src="/lovable-uploads/77b209e1-9056-49f8-96af-96495c9cfc8c.png" />
          <LanguageSwitcher />
        </div>

        {/* Welcome section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-vinster-blue mb-4">
            {t('payment.welcome').replace('{name}', firstName)}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('payment.subtitle')}
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
              <h2 className="text-xl lg:text-2xl font-bold text-vinster-blue mb-4">
                {t('payment.start_career')}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('payment.description')}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('payment.get_started')}
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
          </div>

          {/* Right column: Pricing */}
          <div className="flex flex-col gap-6 lg:gap-6">
            {/* Pricing Card */}
            <Card className="p-6 lg:p-8 border-0 rounded-3xl bg-white shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-vinster-blue mb-2">
                  {t('payment.pricing.title')}
                </h3>
                <p className="text-gray-600 mb-4">{t('payment.pricing.subtitle')}</p>
                <div className="text-3xl lg:text-4xl font-bold text-vinster-blue mb-1">
                  {t('payment.pricing.price')}
                </div>
                <p className="text-sm text-gray-500">{t('payment.pricing.price_desc')}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t('payment.pricing.feature1')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t('payment.pricing.feature2')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t('payment.pricing.feature3')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t('payment.pricing.feature4')}</span>
                </div>
              </div>

              <Button onClick={handlePayment} disabled={isLoading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold py-3 lg:py-4 text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200" size="lg">
                {isLoading ? t('payment.pricing.processing') : t('payment.pricing.start_button')}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {t('payment.pricing.payment_methods')}
              </p>

              {showAccessCodeInput && (
                <>
                  <div className="relative my-6">
                    <div className="w-full border-t border-gray-300" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="accessCode" className="text-sm font-medium text-vinster-blue">
                      {t('payment.access_code.label')}
                    </Label>
                    <Input
                      id="accessCode"
                      type="text"
                      placeholder={t('payment.access_code.placeholder')}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      disabled={isValidatingCode}
                      className="w-full"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && accessCode.trim()) {
                          handleSubmitAccessCode();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSubmitAccessCode}
                      disabled={isValidatingCode || !accessCode.trim()}
                      className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 ${
                        accessCode.trim() && !isValidatingCode
                          ? 'text-white hover:opacity-90'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      style={accessCode.trim() && !isValidatingCode ? { backgroundColor: '#1D3662' } : undefined}
                      size="sm"
                    >
                      {isValidatingCode ? t('payment.access_code.validating') : t('payment.access_code.button')}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>

        {/* Data Safety Card - Full width below the main content */}
        <Card className="p-6 lg:p-8 border-0 rounded-3xl mt-6 lg:mt-8" style={{
        backgroundColor: '#E6F0F6'
      }}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-vinster-blue mb-3">
                {t('payment.data_safety.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {t('payment.data_safety.description')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>;
};
export default PaymentRequired;