import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const organisationItems = [
  { name: "Medisch Centrum", slug: "medisch-centrum", available: true },
  { name: "ErasmusMC", slug: "erasmus-mc", indent: true, available: true },
  { name: "Transport & Logistiek", shortName: "Transport", slug: "transport-en-logistiek", available: true },
  { name: "Financiële instellingen", shortName: "Financieel", slug: "financiele-instellingen", available: true },
  { name: "Universiteit", slug: "universiteit", available: false },
  { name: "Zorg en Welzijn", slug: "zorg-en-welzijn", available: false },
  { name: "Hogeschool", slug: "hogeschool", available: false },
  { name: "Mbo-instelling", slug: "mbo-instelling", available: false },
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
              <TooltipProvider delayDuration={200}>
                <div className="rounded-xl border border-gray-100 bg-white shadow-xl py-1">
                  {organisationItems.map((org) => (
                    org.available ? (
                      <Tooltip key={org.slug}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              navigate(`/organisaties/${org.slug}`);
                              setDropdownOpen(false);
                            }}
                            className={`block w-full text-left py-2.5 text-sm font-medium transition-colors ${
                              org.indent
                                ? "pl-10 text-gray-500 hover:bg-[rgba(26,46,90,0.05)] hover:text-[#1a2e5a]"
                                : "px-5 text-gray-700 hover:bg-[rgba(26,46,90,0.05)] hover:text-[#1a2e5a]"
                            }`}
                          >
                            {org.indent ? `→ ${org.name}` : (org.shortName || org.name)}
                          </button>
                        </TooltipTrigger>
                        {org.shortName && (
                          <TooltipContent side="right">
                            <p>{org.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ) : (
                      <Tooltip key={org.slug}>
                        <TooltipTrigger asChild>
                          <span
                            className="block w-full text-left py-2.5 px-5 text-sm font-medium text-gray-400 cursor-default"
                          >
                            {org.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Neem contact op</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  ))}
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default DesktopNavigation;
