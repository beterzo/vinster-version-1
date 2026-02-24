import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";

const organisationItems = [
  { name: "Medisch Centrum", slug: "medisch-centrum", available: true },
  { name: "ErasmusMC", slug: "erasmus-mc", indent: true, available: true },
  { name: "Universiteit", slug: "universiteit", available: false },
  { name: "Zorgorganisatie", slug: "zorgorganisatie", available: false },
  { name: "Hogeschool", slug: "hogeschool", available: false },
];

const DesktopNavigation = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getMenuItems = () => {
    if (language === 'en') {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/about-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/who-is-it-for' },
        { title: t('mobile_menu.faq'), path: '/frequently-asked-questions' },
        { title: t('mobile_menu.experiences'), path: '/experiences' },
        { title: t('mobile_menu.access_codes'), path: '/access-codes-professionals' },
      ];
    } else if (language === 'de') {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/uber-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/fur-wen-ist-es' },
        { title: t('mobile_menu.faq'), path: '/haufig-gestellte-fragen' },
        { title: t('mobile_menu.experiences'), path: '/erfahrungen' },
        { title: t('mobile_menu.access_codes'), path: '/zugangscodes-fachkrafte' },
      ];
    } else if (language === 'no') {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/om-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/hvem-er-det-for' },
        { title: t('mobile_menu.faq'), path: '/ofte-stilte-sporsmal' },
        { title: t('mobile_menu.experiences'), path: '/erfaringer' },
        { title: t('mobile_menu.access_codes'), path: '/tilgangskoder-fagfolk' },
      ];
    } else {
      return [
        { title: t('mobile_menu.about_vinster'), path: '/over-vinster' },
        { title: t('mobile_menu.for_whom'), path: '/voor-wie-is-het' },
        { title: t('mobile_menu.faq'), path: '/veelgestelde-vragen' },
        { title: t('mobile_menu.experiences'), path: '/ervaringen' },
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
          className="text-white text-[1.3rem] font-medium hover:text-yellow-300 transition-colors whitespace-nowrap"
        >
          {item.title}
        </button>
      ))}

      {/* Organisaties dropdown - only visible for Dutch */}
      {language === 'nl' && (
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            className="text-white text-[1.3rem] font-medium hover:text-yellow-300 transition-colors whitespace-nowrap flex items-center gap-1"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Organisaties
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 pt-2 w-56 z-50">
              <div className="rounded-lg border bg-white shadow-lg py-2">
                {organisationItems.map((org) => (
                  <button
                    key={org.slug}
                    onClick={() => {
                      navigate(org.available ? `/organisaties/${org.slug}` : `/organisaties/binnenkort`);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-vinster-blue transition-colors ${
                      org.indent ? "pl-8 text-gray-500" : ""
                    }`}
                  >
                    {org.indent ? `→ ${org.name}` : org.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default DesktopNavigation;
