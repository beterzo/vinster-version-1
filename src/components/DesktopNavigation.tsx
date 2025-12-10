import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const DesktopNavigation = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const getMenuItems = () => {
    if (language === 'en') {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/about-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/who-is-it-for' },
        { title: t('mobile_menu.faq'), path: '/frequently-asked-questions' },
        { title: t('mobile_menu.experiences'), path: '/experiences' },
        { title: t('mobile_menu.contact'), path: '/contact-us' },
        { title: t('mobile_menu.access_codes'), path: '/access-codes-professionals' },
      ];
    } else if (language === 'de') {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/uber-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/fur-wen-ist-es' },
        { title: t('mobile_menu.faq'), path: '/haufig-gestellte-fragen' },
        { title: t('mobile_menu.experiences'), path: '/erfahrungen' },
        { title: t('mobile_menu.contact'), path: '/kontakt' },
        { title: t('mobile_menu.access_codes'), path: '/zugangscodes-fachkrafte' },
      ];
    } else if (language === 'no') {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/om-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/hvem-er-det-for' },
        { title: t('mobile_menu.faq'), path: '/ofte-stilte-sporsmal' },
        { title: t('mobile_menu.experiences'), path: '/erfaringer' },
        { title: t('mobile_menu.contact'), path: '/kontakt' },
        { title: t('mobile_menu.access_codes'), path: '/tilgangskoder-fagfolk' },
      ];
    } else {
      // Dutch (default)
      return [
        { title: t('mobile_menu.about_vinster'), path: '/over-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/voor-wie-is-het' },
        { title: t('mobile_menu.faq'), path: '/veelgestelde-vragen' },
        { title: t('mobile_menu.experiences'), path: '/ervaringen' },
        { title: t('mobile_menu.contact'), path: '/contact' },
        { title: t('mobile_menu.access_codes'), path: '/toegangscodes-professionals' },
      ];
    }
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {getMenuItems().map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="text-white text-sm font-medium hover:text-yellow-300 transition-colors whitespace-nowrap"
        >
          {item.title}
        </button>
      ))}
    </nav>
  );
};

export default DesktopNavigation;
