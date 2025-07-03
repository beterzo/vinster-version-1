
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieContext';
import { useTranslation } from '@/hooks/useTranslation';

const CookieBanner = () => {
  const { showBanner, acceptAll, openSettings } = useCookieConsent();
  const { t } = useTranslation();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('cookies.banner.message')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button
              onClick={openSettings}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t('cookies.banner.customize')}
            </Button>
            <Button
              onClick={acceptAll}
              className="bg-[#ffc100] hover:bg-[#e6ad00] text-black font-medium"
            >
              {t('cookies.banner.accept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
