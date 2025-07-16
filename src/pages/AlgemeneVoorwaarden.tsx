
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";

const AlgemeneVoorwaarden = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                alt="Vinster Logo" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              />
            </div>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              {t('terms.back_to_home')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            {t('terms.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-sm text-gray-500 mb-8">
              {t('terms.last_updated')}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.definitions.title')}</h2>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.definitions.items').map((item: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.applicability.title')}</h2>
              <p>{t('terms.sections.applicability.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.account.title')}</h2>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.account.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.usage.title')}</h2>
              <p>{t('terms.sections.usage.intro')}</p>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.usage.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.payment.title')}</h2>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.payment.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.cancellation.title')}</h2>
              <p>{t('terms.sections.cancellation.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.intellectual_property.title')}</h2>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.intellectual_property.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.availability.title')}</h2>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.availability.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.liability.title')}</h2>
              <p>{t('terms.sections.liability.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.termination.title')}</h2>
              <ul className="list-disc ml-6 space-y-2">
                {t('terms.sections.termination.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.changes.title')}</h2>
              <p>{t('terms.sections.changes.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.law.title')}</h2>
              <p>{t('terms.sections.law.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.sections.contact.title')}</h2>
              <p>{t('terms.sections.contact.content')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('terms.sections.contact.details') }} />
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AlgemeneVoorwaarden;
