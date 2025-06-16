
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, FileText } from "lucide-react";

interface DashboardSidebarProps {
  getNextStep: () => string;
  hasUserReport: boolean;
  hasStarted: boolean;
  hasZoekprofielPdf: boolean;
  downloadRapportPdf: () => Promise<void>;
  downloadZoekprofielPdf: () => Promise<void>;
}

const DashboardSidebar = ({ 
  getNextStep, 
  hasUserReport, 
  hasStarted, 
  hasZoekprofielPdf,
  downloadRapportPdf,
  downloadZoekprofielPdf
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  // Check if both documents are ready for download
  const bothDocumentsReady = hasUserReport && hasZoekprofielPdf;

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
        {bothDocumentsReady ? (
          // Beide documenten zijn klaar - toon download knoppen
          <>
            <Button 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
              size="lg"
              onClick={downloadZoekprofielPdf}
            >
              <FileText className="w-6 h-6" />
              Bekijk mijn zoekprofiel
            </Button>

            <Button 
              className="w-full text-white font-bold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#21324E' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a3b5c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#21324E'}
              size="lg"
              onClick={downloadRapportPdf}
            >
              <Download className="w-5 h-5" />
              Bekijk mijn rapport
            </Button>
          </>
        ) : (
          // Normale navigatie knoppen (huidige gedrag)
          <>
            <Button 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
              onClick={() => navigate(getNextStep())}
            >
              {hasStarted ? "Ga verder waar je gebleven was" : "Begin hier"}
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
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;
