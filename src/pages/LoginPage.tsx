
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log("Login form submitted:", { email, password });
  };

  const handleLogoClick = () => {
    // TODO: Navigate to home
    console.log("Logo clicked");
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left side - Image with quote overlay */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/4bce3129-ec2c-4ee4-a082-bb74962f620e.png')"
          }}
        >
          {/* Lighter overlay for better visibility of the image */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        {/* Quote overlay */}
        <div className="relative z-10 h-full flex items-end p-12">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 max-w-md">
            <blockquote className="text-xl font-medium text-blue-900 leading-relaxed">
              "Ik ontdek waar mijn passie en talent samenkomen. Nu heb ik een succesvolle carrière."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <img 
              src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
              alt="Vinster Logo" 
              className="h-8 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-900">
              Log in om te beginnen
            </h1>
            <p className="text-gray-600">
              Start je reis naar een betere loopbaan
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
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

            {/* Password field */}
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

            {/* Remember me checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Onthoud mij
              </Label>
            </div>

            {/* Login button */}
            <Button 
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Bezig met inloggen..." : "Aanmelden"}
            </Button>

            {/* Sign up link */}
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
