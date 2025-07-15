
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
    const baseItems = [
      { title: t('mobile_menu.home'), path: "/" },
      { 
        title: t('mobile_menu.about_vinster'), 
        path: language === 'en' ? "/about-vinster" : 
              language === 'de' ? "/uber-vinster" : 
              "/over-vinster" 
      },
      { 
        title: t('mobile_menu.for_whom'), 
        path: language === 'en' ? "/who-is-it-for" : 
              language === 'de' ? "/fur-wen-ist-es" : 
              "/voor-wie-is-het" 
      },
      { 
        title: t('mobile_menu.faq'), 
        path: language === 'en' ? "/frequently-asked-questions" : 
              language === 'de' ? "/haufig-gestellte-fragen" : 
              "/veelgestelde-vragen" 
      },
      { 
        title: t('mobile_menu.experiences'), 
        path: language === 'en' ? "/experiences" : 
              language === 'de' ? "/erfahrungen" : 
              "/ervaringen" 
      },
      { 
        title: t('mobile_menu.contact'), 
        path: language === 'en' ? "/contact-us" : 
              language === 'de' ? "/kontakt" : 
              "/contact" 
      },
      { 
        title: t('mobile_menu.access_codes'), 
        path: language === 'en' ? "/access-codes-professionals" : 
              language === 'de' ? "/zugangscodes-profis" : 
              "/toegangscodes-professionals" 
      },
    ];
    
    return baseItems;
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
