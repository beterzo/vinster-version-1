
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
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
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <img 
          src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
          alt="Vinster Logo" 
          className="h-8 w-auto cursor-pointer" 
          onClick={() => navigate("/home")}
        />
        {user && (
          <div className="text-gray-700">
            <span className="font-medium">Welkom, {user.user_metadata?.first_name || user.email}</span>
          </div>
        )}
      </div>
      <Button 
        onClick={handleLogout}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Uitloggen</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
