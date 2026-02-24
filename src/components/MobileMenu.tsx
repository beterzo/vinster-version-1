
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const organisationItems = [
  { name: "Medisch Centrum", slug: "medisch-centrum", available: true },
  { name: "ErasmusMC", slug: "erasmus-mc", indent: true, available: true },
  { name: "Universiteit", slug: "universiteit", available: false },
  { name: "Zorgorganisatie", slug: "zorgorganisatie", available: false },
  { name: "Hogeschool", slug: "hogeschool", available: false },
];

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            className="p-2 hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Open menu"
          >
            <svg 
              width="32" 
              height="26" 
              viewBox="0 0 32 26" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="32" height="6" rx="3" fill="white" />
              <rect x="0" y="10" width="32" height="6" rx="3" fill="white" />
              <rect x="0" y="20" width="32" height="6" rx="3" fill="white" />
            </svg>
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-white">
          <DrawerHeader className="flex items-center justify-between px-6">
            <DrawerTitle className="text-xl font-bold text-vinster-blue">
              {t('mobile_menu.menu')}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-6 pb-8">
            <nav className="space-y-4">
              {getMenuItems().map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="block w-full text-left py-3 px-0 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-vinster-blue rounded-lg transition-colors duration-200"
                >
                  {item.title}
                </button>
              ))}

              {/* Organisaties - only for Dutch */}
              {language === 'nl' && (
                <>
                  <button
                    onClick={() => setOrgOpen(!orgOpen)}
                    className="flex w-full items-center justify-between py-3 px-0 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-vinster-blue rounded-lg transition-colors duration-200"
                  >
                    Organisaties
                    <ChevronDown className={`h-5 w-5 transition-transform ${orgOpen ? "rotate-180" : ""}`} />
                  </button>
                  {orgOpen && (
                    <div className="pl-6 space-y-2">
                      {organisationItems.map((org) => (
                        <button
                          key={org.slug}
                          onClick={() => handleNavigation(org.available ? `/organisaties/${org.slug}` : `/organisaties/binnenkort`)}
                          className={`block w-full text-left py-2 px-0 text-base font-medium transition-colors hover:text-blue-900 ${
                            org.indent ? "pl-4 text-gray-500" : "text-gray-600"
                          } ${!org.available ? "opacity-70" : ""}`}
                        >
                          {org.indent ? `→ ${org.name}` : org.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Login button */}
              <button
                onClick={() => handleNavigation('/login')}
                className="block w-full text-left py-3 px-0 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-vinster-blue rounded-lg transition-colors duration-200"
              >
                {t('mobile_menu.login')}
              </button>
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileMenu;
