
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
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 h-14 w-14"
        >
          <Menu className="h-10 w-10" />
        </Button>
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
            {/* Login button with the same styling as other menu items */}
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
  );
};

export default MobileMenu;
