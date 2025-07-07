import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Footer from '@/components/Footer';

const Cookiebeleid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <img 
              alt="Vinster Logo" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              {t('cookies.policy.title')}
            </h1>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Wat zijn cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('cookies.policy.what_are_cookies.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('cookies.policy.what_are_cookies.description')}
                </p>
              </section>

              {/* Welke cookies gebruiken we */}
              <section>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('cookies.policy.which_cookies.title')}
                </h2>
                
                {/* Noodzakelijke cookies */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {t('cookies.categories.necessary.title')}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {t('cookies.policy.necessary.description')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{t('cookies.policy.necessary.session')}</li>
                    <li>{t('cookies.policy.necessary.auth')}</li>
                    <li>{t('cookies.policy.necessary.preferences')}</li>
                  </ul>
                </div>

                {/* Statistiek cookies */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {t('cookies.categories.statistics.title')}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {t('cookies.policy.statistics.description')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{t('cookies.policy.statistics.analytics')}</li>
                    <li>{t('cookies.policy.statistics.usage')}</li>
                  </ul>
                </div>

                {/* Marketing cookies */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {t('cookies.categories.marketing.title')}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {t('cookies.policy.marketing.description')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{t('cookies.policy.marketing.tracking')}</li>
                    <li>{t('cookies.policy.marketing.remarketing')}</li>
                  </ul>
                </div>
              </section>

              {/* Hoe lang bewaren we cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('cookies.policy.retention.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('cookies.policy.retention.description')}
                </p>
              </section>

              {/* Hoe kun je je voorkeuren aanpassen */}
              <section>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('cookies.policy.manage.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('cookies.policy.manage.description')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('cookies.policy.manage.browser')}
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {t('cookies.policy.contact.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('cookies.policy.contact.description')}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Email:</strong> team@vinster.ai<br />
                  <strong>Telefoon:</strong> +31 6 22 23 85 95
                </p>
              </section>

              {/* Laatste update */}
              <section className="border-t pt-6">
                <p className="text-sm text-gray-500">
                  {t('cookies.policy.last_updated')}: {new Date().toLocaleDateString('nl-NL')}
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Cookiebeleid;
