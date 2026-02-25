import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Zap, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { useOrganisation } from "@/contexts/OrganisationContext";
import { Building2 } from "lucide-react";
const PaymentRequired = () => {
  const {
    user
  } = useAuth();
  const { name: organisationName } = useOrganisation();
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
  const { englishVariant } = useLanguage();

  // US-specific pricing
  const isUS = language === 'en' && englishVariant === 'us';
  const price = isUS ? '$34' : t('payment.pricing.price');
  const startButtonText = isUS ? 'Start now for $34' : t('payment.pricing.start_button');
  const paymentMethods = isUS 
    ? 'Pay securely with credit card or PayPal' 
    : t('payment.pricing.payment_methods');

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
      const webhookLanguage = (language === 'en' && englishVariant === 'us') ? 'us' : language;

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { language: webhookLanguage }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden. Probeer het opnieuw.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast({
          title: "Fout",
          description: "Geen betaallink ontvangen. Probeer het opnieuw.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden. Probeer het opnieuw.",
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
      const { data, error } = await supabase.functions.invoke('validate-access-code', {
        body: {
          accessCode: accessCode.trim(),
          userId: user.id,
        }
      });

      if (error) {
        console.error('Error validating access code:', error);
        toast({
          title: t('payment.access_code.invalid_title'),
          description: t('payment.access_code.invalid_desc'),
          variant: "destructive"
        });
        setIsValidatingCode(false);
        return;
      }

      if (data?.success) {
        toast({
          title: t('payment.access_code.success_title'),
          description: t('payment.access_code.success_desc')
        });
        await refreshPaymentStatus();
        navigate('/home');
      } else {
        toast({
          title: t('payment.access_code.invalid_title'),
          description: data?.message || t('payment.access_code.invalid_desc'),
          variant: "destructive"
        });
        setAccessCode('');
      }
    } catch (error) {
      console.error('Error validating access code:', error);
      toast({
        title: t('payment.access_code.invalid_title'),
        description: t('payment.access_code.invalid_desc'),
        variant: "destructive"
      });
    } finally {
      setIsValidatingCode(false);
    }
  };

  const firstName = user?.user_metadata?.first_name || 'daar';
  return <div className="min-h-screen bg-[#fafaf8] font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Header with logo and language switcher */}
        <div className="flex justify-between items-center mb-8">
          <img alt="Vinster Logo" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/')} src="/lovable-uploads/vinster-logo-2.png" />
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
          {organisationName && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FEF9E6] text-[#232D4B] px-3 py-1 rounded-full mt-3">
              <Building2 className="w-3.5 h-3.5" />
              {organisationName}
            </div>
          )}
        </div>

        {/* Main content - responsive layout with aligned columns */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          
          {/* Left column: Content */}
          <div className="space-y-6 lg:space-y-8 flex flex-col">
            {/* Welcome card */}
            <Card className="p-6 lg:p-8 border border-[#e5e7eb] rounded-xl shadow-card">
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
                  {price}
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
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('payment.pricing.feature5')}</span>
                </div>
              </div>

              <Button onClick={handlePayment} disabled={isLoading} className="w-full bg-[#1a2e5a] hover:bg-[#142347] text-white font-bold py-3 lg:py-4 text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200" size="lg">
                {isLoading ? t('payment.pricing.processing') : startButtonText}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {paymentMethods}
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
        <Card className="p-6 lg:p-8 border border-[#e5e7eb] rounded-xl shadow-card mt-6 lg:mt-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Shield className="w-6 h-6 text-[#232D4B]" />
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