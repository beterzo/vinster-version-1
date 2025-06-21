import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Wachtwoorden komen niet overeen",
        description: "Controleer of beide wachtwoorden hetzelfde zijn.",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Vul alle velden in",
        description: "Alle velden zijn verplicht.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, firstName, lastName);

    if (error) {
      let errorMessage = "Er is een onbekende fout opgetreden.";
      
      if (error.message === "User already registered") {
        errorMessage = "Dit e-mailadres is al geregistreerd. Probeer in te loggen.";
      } else if (error.message.includes("Password")) {
        errorMessage = "Het wachtwoord voldoet niet aan de vereisten. Gebruik minimaal 6 karakters.";
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Fout bij registreren",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account succesvol aangemaakt!",
        description: "Je bent nu ingelogd en kunt direct beginnen.",
        duration: 5000,
      });
      navigate("/home");
    }

    setIsLoading(false);
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
              "Begin je reis naar een succesvolle loopbaan. Ontdek je mogelijkheden."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 lg:space-y-8">
          {/* Signup form title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              Maak je account aan
            </h1>
            <p className="text-gray-600">
              Begin je reis naar een betere loopbaan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-900 font-medium text-left block">
                  Voornaam
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Voornaam"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-900 font-medium text-left block">
                  Achternaam
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Achternaam"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-900 font-medium text-left block">
                Bevestig wachtwoord
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="bevestig wachtwoord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Account aanmaken..." : "Account aanmaken"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Heb je al een account?{" "}
                <Link to="/login" className="font-semibold text-yellow-500 hover:text-yellow-600">
                  Log hier in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
