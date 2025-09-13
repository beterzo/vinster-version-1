import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import OrganizationForm from "@/components/OrganizationForm";
const ToegangscodesProfessionals = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    t,
    language
  } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    quantity: ""
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleQuantityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      quantity: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.quantity) {
      toast({
        title: t('professionals.toasts.fill_all_fields'),
        description: t('professionals.toasts.fill_all_fields_desc'),
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('https://hook.eu2.make.com/t82267kxgdplyqkpejofmt4fi1jnbyy9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          quantity: parseInt(formData.quantity),
          language: language,
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const responseData = await response.json();
        toast({
          title: t('professionals.toasts.request_sent'),
          description: t('professionals.toasts.redirecting')
        });

        // Check if webhook returned a checkout URL
        if (responseData && responseData.checkout_url) {
          // Open payment page in new tab
          window.open(responseData.checkout_url, '_blank');
        } else {
          console.log('No checkout_url in webhook response:', responseData);
          toast({
            title: t('professionals.toasts.contact_note'),
            description: t('professionals.toasts.contact_note_desc')
          });
        }
        setFormData({
          email: "",
          quantity: ""
        });
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      toast({
        title: t('professionals.toasts.send_error'),
        description: t('professionals.toasts.send_error_desc'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img alt="Vinster Logo" onClick={() => navigate('/')} src="/lovable-uploads/597d8366-bb5f-4218-8d55-ff225da64b7d.png" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" />
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button onClick={() => navigate('/')} variant="outline" className="text-vinster-blue border-vinster-blue hover:bg-vinster-blue hover:text-white">
                {t('professionals.back_to_home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6" style={{
            color: '#232D4B'
          }}>
              {t('professionals.page_title')}
            </h1>
            <p className="text-lg mb-8 max-w-3xl mx-auto" style={{
            color: '#232D4B'
          }}>
              {t('professionals.page_description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{
            color: '#232D4B'
          }}>
              {t('professionals.order_section.title')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{
                color: '#232D4B'
              }}>
                  {t('professionals.order_section.email_label')}
                </Label>
                <Input id="email" name="email" type="email" placeholder={t('professionals.order_section.email_placeholder')} value={formData.email} onChange={handleInputChange} className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium" style={{
                color: '#232D4B'
              }}>
                  {t('professionals.order_section.quantity_label')}
                </Label>
                <Select value={formData.quantity} onValueChange={handleQuantityChange}>
                  <SelectTrigger className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900">
                    <SelectValue placeholder={t('professionals.order_section.quantity_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">{t('professionals.order_section.quantity_options.5')}</SelectItem>
                    <SelectItem value="10">{t('professionals.order_section.quantity_options.10')}</SelectItem>
                    <SelectItem value="25">{t('professionals.order_section.quantity_options.25')}</SelectItem>
                    <SelectItem value="50">{t('professionals.order_section.quantity_options.50')}</SelectItem>
                    <SelectItem value="100">{t('professionals.order_section.quantity_options.100')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{
                color: '#232D4B'
              }}>
                  {t('professionals.order_section.pricing_info.title')}
                </h3>
                <p className="text-sm text-gray-700">
                  {t('professionals.order_section.pricing_info.price_per_code')}<br />
                  {t('professionals.order_section.pricing_info.contact_note')}
                </p>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold" disabled={isLoading}>
                {isLoading ? t('professionals.order_section.submitting') : t('professionals.order_section.submit_button')}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {t('professionals.order_section.bulk_order_note')}
                </p>
              </div>
            </form>
          </div>

          {/* Information Section */}
          <div className="space-y-8">
            {/* What You Get */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6" style={{
              color: '#232D4B'
            }}>
                {t('professionals.what_you_get.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>{t('professionals.what_you_get.feature1').split(' ')[0]}</strong> {t('professionals.what_you_get.feature1').split(' ').slice(1).join(' ')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>{t('professionals.what_you_get.feature2').split(' ')[0]} {t('professionals.what_you_get.feature2').split(' ')[1]}</strong> {t('professionals.what_you_get.feature2').split(' ').slice(2).join(' ')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>{t('professionals.what_you_get.feature3').split(' ')[0]} {t('professionals.what_you_get.feature3').split(' ')[1]}</strong> {t('professionals.what_you_get.feature3').split(' ').slice(2).join(' ')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>{t('professionals.what_you_get.feature4').split(' ')[0]} {t('professionals.what_you_get.feature4').split(' ')[1]}</strong> {t('professionals.what_you_get.feature4').split(' ').slice(2).join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6" style={{
              color: '#232D4B'
            }}>
                {t('professionals.how_it_works.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-700">
                    {t('professionals.how_it_works.step1')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-700">
                    {t('professionals.how_it_works.step2')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-700">
                    {t('professionals.how_it_works.step3')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-gray-700">
                    {t('professionals.how_it_works.step4')}
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <p className="text-gray-700">
                    {t('professionals.how_it_works.step5')}
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('professionals.how_it_works.contact_info')}<br />
                  <a href="mailto:team@vinster.ai" className="text-blue-600 hover:underline">
                    team@vinster.ai
                  </a>
                </p>
          </div>
        </div>

        {/* Organization Form Section */}
        <div className="mt-12">
          <OrganizationForm />
        </div>
      </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default ToegangscodesProfessionals;