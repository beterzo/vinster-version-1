
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const DashboardHeader = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: t('dashboard.logout_error'),
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: t('dashboard.logout_success'),
        description: t('dashboard.logout_success_desc')
      });
      navigate("/");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
      <div className="flex items-center">
        <img 
          alt="Vinster Logo" 
          className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200 mr-4" 
          onClick={() => navigate('/home')} 
          src="/lovable-uploads/e35e2329-dbcb-46a6-a616-711bf30bfe4f.png" 
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          onClick={handleLogout} 
          className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-full border border-gray-200 shadow-sm transition-all duration-200 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('dashboard.logout')}</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
