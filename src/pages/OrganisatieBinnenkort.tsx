import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrganisatieBinnenkort = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-vinster-blue py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img
            src="/lovable-uploads/vinster-new-logo.png"
            alt="Vinster Logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-vinster-blue/10">
            <Clock className="h-10 w-10 text-vinster-blue" />
          </div>
          <h1 className="text-3xl font-bold text-vinster-blue mb-4">Binnenkort beschikbaar</h1>
          <p className="text-muted-foreground mb-8">
            We werken hard aan dit organisatietype. Binnenkort kun je hier terecht voor jouw loopbaantraject.
          </p>
          <Button onClick={() => navigate("/")} size="lg">
            Terug naar home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganisatieBinnenkort;
