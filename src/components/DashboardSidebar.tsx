
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  getNextStep: () => string;
  hasUserReport: boolean;
}

const DashboardSidebar = ({ getNextStep, hasUserReport }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      {/* Afbeelding - neemt de meeste ruimte in */}
      <div className="rounded-2xl flex-1 overflow-hidden">
        <img 
          src="/lovable-uploads/4d34612b-df14-4f89-abac-7542126c6ac2.png"
          alt="Professionele vrouw met loopbaanontwikkeling materialen"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Knoppen - onderaan rechts */}
      <div className="space-y-4">
        {/* Altijd aanwezige "Ga verder" knop - terug naar geel */}
        <Button 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
          onClick={() => navigate(getNextStep())}
        >
          Ga verder waar je gebleven was
        </Button>

        {/* Conditionale "Bekijk mijn rapport" knop - naar donkerblauw #21324E */}
        {hasUserReport && (
          <Button 
            className="w-full text-white font-bold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: '#21324E' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a3b5c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#21324E'}
            size="lg"
            onClick={() => navigate("/rapport-download")}
          >
            Bekijk mijn rapport
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;
