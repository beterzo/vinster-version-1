import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrganisatieBinnenkort = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <img
              src="/lovable-uploads/4022d2c1-42bd-4652-b17d-48fafea4de1d.png"
              alt="Vinster Logo"
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => navigate("/")}
            />
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Terug naar home
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Clock className="h-10 w-10 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Binnenkort beschikbaar</h1>
          <p className="text-gray-600 mb-8">
            We werken hard aan dit organisatietype. Binnenkort kun je hier terecht voor jouw loopbaantraject.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 px-8"
          >
            Terug naar home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatieBinnenkort;
