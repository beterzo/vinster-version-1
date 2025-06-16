
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const EmailConfirmationPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, resendConfirmation, signOut } = useAuth();
  const { toast } = useToast();

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "E-mailadres vereist",
        description: "Vul je e-mailadres in om een nieuwe bevestigingsmail te ontvangen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await resendConfirmation(email);

    if (error) {
      toast({
        title: "Fout bij versturen",
        description: "Er is een fout opgetreden bij het versturen van de bevestigingsmail.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Bevestigingsmail verstuurd!",
        description: "Check je inbox en klik op de link in de email om je account te activeren.",
      });
    }

    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Bevestig je e-mailadres
          </h1>
          <p className="text-gray-600 mb-6">
            We hebben een bevestigingsmail gestuurd naar je e-mailadres. 
            Klik op de link in de email om je account te activeren.
          </p>
          
          {user?.email && (
            <p className="text-sm text-gray-500 mb-6 bg-gray-100 p-3 rounded">
              E-mail verstuurd naar: <strong>{user.email}</strong>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Geen email ontvangen? Voer je e-mailadres hieronder in om een nieuwe te ontvangen:
          </p>
          
          <form onSubmit={handleResendConfirmation} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-blue-900 font-medium">
                E-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="je@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Versturen..." : "Nieuwe bevestigingsmail versturen"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Uitloggen en opnieuw proberen
            </Button>
            
            <p className="text-xs text-gray-500">
              <Link to="/login" className="hover:underline">
                Terug naar inloggen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
