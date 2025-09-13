import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface OrganizationFormData {
  email: string;
  quantity: string;
  organization: string;
  contactPerson: string;
  costCenter: string;
  comments: string;
}

const OrganizationForm = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData>({
    email: "",
    quantity: "",
    organization: "",
    contactPerson: "",
    costCenter: "",
    comments: ""
  });
  
  const [errors, setErrors] = useState<Partial<OrganizationFormData>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Partial<OrganizationFormData> = {};

    if (!formData.email) {
      newErrors.email = t('professionals.organization_form.validation.email_required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('professionals.organization_form.validation.email_invalid');
    }

    if (!formData.quantity) {
      newErrors.quantity = t('professionals.organization_form.validation.quantity_required');
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      newErrors.quantity = t('professionals.organization_form.validation.quantity_invalid');
    }

    if (!formData.organization) {
      newErrors.organization = t('professionals.organization_form.validation.organization_required');
    }

    if (!formData.contactPerson) {
      newErrors.contactPerson = t('professionals.organization_form.validation.contact_required');
    }

    if (!formData.costCenter) {
      newErrors.costCenter = t('professionals.organization_form.validation.cost_center_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof OrganizationFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://hook.eu2.make.com/ridk4qt9ezc49c632dhws7h03p1dyre8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          quantity: parseInt(formData.quantity),
          organisatie: formData.organization,
          contactpersoon: formData.contactPerson,
          kostenplaats: formData.costCenter,
          opmerkingen: formData.comments,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          email: "",
          quantity: "",
          organization: "",
          contactPerson: "",
          costCenter: "",
          comments: ""
        });
        setErrors({});
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

  if (showSuccess) {
  return (
    <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center" style={{ borderRadius: '8px' }}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#232D4B' }}>
            {t('professionals.organization_form.success_message')}
          </h3>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            Nieuw formulier invullen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-8" style={{ borderRadius: '8px' }}>
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#232D4B' }}>
          {t('professionals.organization_form.title')}
        </h2>
        
        <p className="text-lg mb-2" style={{ color: '#232D4B' }}>
          {t('professionals.organization_form.introduction')}
        </p>
        
        <p className="text-gray-600 mb-8">
          {t('professionals.organization_form.description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#232D4B' }}>
              {t('professionals.organization_form.email_label')}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('professionals.organization_form.email_placeholder')}
              value={formData.email}
              onChange={handleInputChange}
              className={`h-12 px-4 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium" style={{ color: '#232D4B' }}>
              {t('professionals.organization_form.quantity_label')}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              placeholder={t('professionals.organization_form.quantity_placeholder')}
              value={formData.quantity}
              onChange={handleInputChange}
              className={`h-12 px-4 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.quantity ? 'border-red-500' : ''}`}
              min="1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="text-sm font-medium" style={{ color: '#232D4B' }}>
              {t('professionals.organization_form.organization_label')}
            </Label>
            <Textarea
              id="organization"
              name="organization"
              placeholder={t('professionals.organization_form.organization_placeholder')}
              value={formData.organization}
              onChange={handleInputChange}
              className={`min-h-[100px] px-4 py-3 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.organization ? 'border-red-500' : ''}`}
            />
            {errors.organization && (
              <p className="text-red-500 text-sm">{errors.organization}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="text-sm font-medium" style={{ color: '#232D4B' }}>
              {t('professionals.organization_form.contact_label')}
            </Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              type="text"
              placeholder={t('professionals.organization_form.contact_placeholder')}
              value={formData.contactPerson}
              onChange={handleInputChange}
              className={`h-12 px-4 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.contactPerson ? 'border-red-500' : ''}`}
            />
            {errors.contactPerson && (
              <p className="text-red-500 text-sm">{errors.contactPerson}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="costCenter" className="text-sm font-medium" style={{ color: '#232D4B' }}>
              {t('professionals.organization_form.cost_center_label')}
            </Label>
            <Input
              id="costCenter"
              name="costCenter"
              type="text"
              placeholder={t('professionals.organization_form.cost_center_placeholder')}
              value={formData.costCenter}
              onChange={handleInputChange}
              className={`h-12 px-4 border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.costCenter ? 'border-red-500' : ''}`}
            />
            {errors.costCenter && (
              <p className="text-red-500 text-sm">{errors.costCenter}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium" style={{ color: '#232D4B' }}>
              {t('professionals.organization_form.comments_label')}
            </Label>
            <Textarea
              id="comments"
              name="comments"
              placeholder={t('professionals.organization_form.comments_placeholder')}
              value={formData.comments}
              onChange={handleInputChange}
              className="min-h-[100px] px-4 py-3 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading ? t('professionals.organization_form.submitting') : t('professionals.organization_form.submit_button')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;