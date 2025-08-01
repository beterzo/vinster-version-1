
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useTranslation } from "@/hooks/useTranslation";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { canStartEnthousiasme, canStartWensberoepen } = useDashboard();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleSignOut = async () => {
    // Handle sign out logic here
    navigate('/login');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="lg" className="md:hidden h-12 w-12">
          <Menu className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64 border-r p-4 pt-6">
        <SheetHeader>
          <SheetTitle>{t('common.menu')}</SheetTitle>
          <SheetDescription>
            {t('common.navigate_description')}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/")}
          >
            {t('common.dashboard')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/rapport-review")}
          >
            {t('common.loopbaanrapport')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/zoekprofiel-download")}
          >
            {t('common.zoekprofiel')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/profiel-voltooien-intro")}
          >
            {t('common.profile_complete')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/payment-required")}
          >
            {t('common.payment_page')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={handleSignOut}
          >
            {t('common.logout')}
          </Button>
        </div>

        {canStartEnthousiasme && (
          <Button 
            onClick={() => navigate("/enthousiasme-intro")} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl"
          >
            {t('common.start_enthusiasm_scan')}
          </Button>
        )}

        {canStartWensberoepen && (
          <Button 
            onClick={() => navigate("/wensberoepen-intro")} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl"
          >
            {t('common.start_dream_jobs')}
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSidebar;
