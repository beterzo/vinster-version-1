
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

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { canStartEnthousiasme, canStartWensberoepen } = useDashboard();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    // Handle sign out logic here
    navigate('/login');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64 border-r p-4 pt-6">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigeer door de verschillende onderdelen van de website.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/")}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/rapport-review")}
          >
            Loopbaanrapport
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/zoekprofiel-download")}
          >
            Zoekprofiel
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/profiel-voltooien-intro")}
          >
            Profiel voltooien
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={() => navigate("/payment-required")}
          >
            Betaalpagina
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={handleSignOut}
          >
            Uitloggen
          </Button>
        </div>

        {canStartEnthousiasme && (
          <Button 
            onClick={() => navigate("/enthousiasme-intro")} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl"
          >
            Start enthousiasmescan
          </Button>
        )}

        {canStartWensberoepen && (
          <Button 
            onClick={() => navigate("/wensberoepen-intro")} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-vinster-blue font-bold rounded-xl"
          >
            Start wensberoepen
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSidebar;
