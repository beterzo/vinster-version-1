
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  getNextStep: () => string;
}

const DashboardSidebar = ({ getNextStep }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      {/* Afbeelding - neemt de meeste ruimte in */}
      <div className="rounded-full flex-1 overflow-hidden">
        <img 
          src="/lovable-uploads/4d34612b-df14-4f89-abac-7542126c6ac2.png"
          alt="Professionele vrouw met loopbaanontwikkeling materialen"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gele knop - onderaan rechts */}
      <Button 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        size="lg"
        onClick={() => navigate(getNextStep())}
      >
        Ga verder waar je gebleven was
      </Button>
    </div>
  );
};

export default DashboardSidebar;
