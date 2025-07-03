
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCookieConsent, CookieConsent } from '@/contexts/CookieContext';
import { useTranslation } from '@/hooks/useTranslation';

const CookieSettings = () => {
  const { showSettings, closeSettings, consent, updateConsent, acceptAll } = useCookieConsent();
  const { t } = useTranslation();
  const [tempConsent, setTempConsent] = useState<CookieConsent>({
    necessary: true,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    if (consent) {
      setTempConsent(consent);
    }
  }, [consent]);

  const handleSave = () => {
    updateConsent(tempConsent);
  };

  const handleAcceptAll = () => {
    acceptAll();
  };

  const updateTempConsent = (category: keyof CookieConsent, value: boolean) => {
    setTempConsent(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  return (
    <Dialog open={showSettings} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-900">
            {t('cookies.settings.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-gray-600">
            {t('cookies.settings.description')}
          </p>

          {/* Necessary Cookies */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {t('cookies.categories.necessary.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('cookies.categories.necessary.description')}
                </p>
              </div>
              <Checkbox
                checked={true}
                disabled={true}
                className="ml-4"
              />
            </div>
          </div>

          {/* Statistics Cookies */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {t('cookies.categories.statistics.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('cookies.categories.statistics.description')}
                </p>
              </div>
              <Checkbox
                checked={tempConsent.statistics}
                onCheckedChange={(checked) => updateTempConsent('statistics', !!checked)}
                className="ml-4"
              />
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {t('cookies.categories.marketing.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('cookies.categories.marketing.description')}
                </p>
              </div>
              <Checkbox
                checked={tempConsent.marketing}
                onCheckedChange={(checked) => updateTempConsent('marketing', !!checked)}
                className="ml-4"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSave}
            variant="outline"
            className="border-blue-900 text-blue-900 hover:bg-blue-50"
          >
            {t('cookies.settings.save')}
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="bg-[#ffc100] hover:bg-[#e6ad00] text-black font-medium"
          >
            {t('cookies.settings.accept_all')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;
