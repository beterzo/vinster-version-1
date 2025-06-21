import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getStorageUrl } from "@/hooks/useStorageUrl";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logoUrl = getStorageUrl('assets', 'vinster-logo.png');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Vul alle velden in",
        description: "E-mailadres en wachtwoord zijn verplicht.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      let errorMessage = "Er is een onbekende fout opgetreden.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.";
      } else if (error.message === "Email not confirmed") {
        errorMessage = "Je e-mailadres is nog niet bevestigd. Check je inbox voor de bevestigingsmail.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Je e-mailadres is nog niet bevestigd. Check je inbox voor de bevestigingsmail.";
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Fout bij inloggen",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succesvol ingelogd!",
        description: "Welkom terug.",
      });
      navigate("/home");
    }

    setIsLoading(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image with quote overlay */}
      <div className="relative hidden lg:block">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              "Ik ontdek waar mijn passie en talent samenkomen. Nu heb ik een succesvolle carrière."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          <div className="text-center">
            <div className="flex items-center cursor-pointer justify-center" onClick={handleLogoClick}>
              <img 
                src={logoUrl}
                alt="Vinster Logo" 
                className="h-12 w-auto filter brightness-110 contrast-110" 
              />
            </div>
          </div>

          {/* Login form title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              Log in om te beginnen
            </h1>
            <p className="text-gray-600">
              Start je reis naar een betere loopbaan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-medium text-left block">
                E-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="emailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-medium text-left block">
                Wachtwoord
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Onthoud mij
              </Label>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Bezig met inloggen..." : "Aanmelden"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Heb je nog geen account?{" "}
                <Link to="/signup" className="font-semibold text-yellow-500 hover:text-yellow-600">
                  Maak hier een aan
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
