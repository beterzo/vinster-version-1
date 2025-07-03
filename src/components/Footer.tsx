import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigationLinks = [
    { title: t('landing.footer.about_vinster'), path: "/over-vinster" },
    { title: t('landing.footer.for_whom'), path: "/voor-wie-is-het" },
    { title: t('landing.footer.faq'), path: "/veelgestelde-vragen" },
    { title: t('landing.footer.contact'), path: "/contact" },
    { title: t('landing.footer.privacy_policy'), path: "/privacy-verklaring" },
    { title: t('landing.footer.terms_conditions'), path: "/algemene-voorwaarden" },
    { title: t('landing.footer.cookie_policy'), path: "/cookiebeleid" },
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo section */}
          <div className="flex items-start">
            <img 
              alt="Vinster Logo" 
              className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              {t('landing.footer.navigation_title')}
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-600 hover:text-blue-900 transition-colors duration-200 text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              {t('landing.footer.contact_title')}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">{t('landing.footer.email')}</span><br />
                team@vinster.ai
              </p>
              <p>
                <span className="font-medium">{t('landing.footer.phone')}</span><br />
                +31 6 22 23 85 95
              </p>
              <p>
                <span className="font-medium">{t('landing.footer.kvk')}</span><br />
                04050762
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            {t('landing.footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
