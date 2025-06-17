
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Fout bij uitloggen",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succesvol uitgelogd",
        description: "Tot ziens!",
      });
      navigate("/");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/home")}>
        <img 
          src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
          alt="Vinster Logo" 
          className="h-12 w-auto filter brightness-110 contrast-110" 
        />
        <span className="text-2xl font-bold text-gray-800 tracking-wide">Vinster</span>
      </div>
      <Button 
        onClick={handleLogout}
        className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-full border border-gray-200 shadow-sm transition-all duration-200 flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Uitloggen</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
