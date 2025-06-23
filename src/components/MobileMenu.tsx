
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

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Over Vinster", path: "/over-vinster" },
    { title: "Voor wie is het?", path: "/voor-wie-is-het" },
    { title: "Veelgestelde vragen", path: "/veelgestelde-vragen" },
    { title: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-xl font-bold text-vinster-blue">
            Menu
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="px-6 pb-8">
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="block w-full text-left py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-vinster-blue rounded-lg transition-colors duration-200"
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
