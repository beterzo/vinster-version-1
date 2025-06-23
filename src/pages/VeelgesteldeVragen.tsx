
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const VeelgesteldeVragen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-vinster-blue border-vinster-blue hover:bg-vinster-blue hover:text-white"
            >
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-vinster-blue mb-8">Veelgestelde vragen</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-lg text-gray-700">
            Hier komen de veelgestelde vragen...
          </p>
        </div>
      </div>
    </div>
  );
};

export default VeelgesteldeVragen;
