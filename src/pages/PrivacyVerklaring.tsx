import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
const PrivacyVerklaring = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  return <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img alt="Vinster Logo" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/')} src="/lovable-uploads/6bdacbe4-acb6-406d-bfd4-f1690d74f0ac.png" />
            </div>
            <Button onClick={() => navigate('/')} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold">
              {t('privacy.back_to_home')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            {t('privacy.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-sm text-gray-500 mb-8">
              {t('privacy.last_updated')}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.who_we_are.title')}</h2>
              <p>{t('privacy.sections.who_we_are.content')}</p>
              <p dangerouslySetInnerHTML={{
              __html: `<strong>${t('privacy.sections.who_we_are.contact_label')}</strong><br />${t('privacy.sections.who_we_are.contact')}`
            }} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.data_collected.title')}</h2>
              <p>{t('privacy.sections.data_collected.intro')}</p>
              <ul className="list-disc ml-6 space-y-2">
                {Array.isArray(t('privacy.sections.data_collected.items')) ? t('privacy.sections.data_collected.items').map((item: string, index: number) => <li key={index}>{item}</li>) : null}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.data_usage.title')}</h2>
              <p>{t('privacy.sections.data_usage.intro')}</p>
              <ul className="list-disc ml-6 space-y-2">
                {Array.isArray(t('privacy.sections.data_usage.items')) ? t('privacy.sections.data_usage.items').map((item: string, index: number) => <li key={index}>{item}</li>) : null}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.legal_basis.title')}</h2>
              <p>{t('privacy.sections.legal_basis.intro')}</p>
              <ul className="list-disc ml-6 space-y-2">
                {Array.isArray(t('privacy.sections.legal_basis.items')) ? t('privacy.sections.legal_basis.items').map((item: string, index: number) => <li key={index}>{item}</li>) : null}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.data_sharing.title')}</h2>
              <p>{t('privacy.sections.data_sharing.intro')}</p>
              <ul className="list-disc ml-6 space-y-2">
                {Array.isArray(t('privacy.sections.data_sharing.items')) ? t('privacy.sections.data_sharing.items').map((item: string, index: number) => <li key={index}>{item}</li>) : null}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.retention.title')}</h2>
              <p>{t('privacy.sections.retention.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.user_rights.title')}</h2>
              <p>{t('privacy.sections.user_rights.intro')}</p>
              <ul className="list-disc ml-6 space-y-2">
                {Array.isArray(t('privacy.sections.user_rights.items')) ? t('privacy.sections.user_rights.items').map((item: string, index: number) => <li key={index}>{item}</li>) : null}
              </ul>
              <p className="mt-4">{t('privacy.sections.user_rights.contact')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.security.title')}</h2>
              <p>{t('privacy.sections.security.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.third_party_accounts.title')}</h2>
              <p>{t('privacy.sections.third_party_accounts.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.cookies.title')}</h2>
              <p>{t('privacy.sections.cookies.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.changes.title')}</h2>
              <p>{t('privacy.sections.changes.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.sections.contact.title')}</h2>
              <p>{t('privacy.sections.contact.content')}</p>
              <p dangerouslySetInnerHTML={{
              __html: t('privacy.sections.contact.details')
            }} />
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default PrivacyVerklaring;