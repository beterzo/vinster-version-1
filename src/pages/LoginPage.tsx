
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Apple } from "lucide-react";

const LoginPage = () => {
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
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
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
            <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto mx-auto" />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-900">
              Meld je aan om te beginnen
            </h1>
            <p className="text-gray-600">
              Start je reis naar een betere loopbaan
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-medium">
                E-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="emailadres"
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-medium">
                Wachtwoord
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="wachtwoord"
                className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
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
            <Button className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base rounded-lg">
              Aanmelden
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Of login met</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12 border-gray-300 hover:bg-gray-50"
              >
                <Apple className="w-5 h-5 mr-2" />
                Apple
              </Button>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Heb je nog geen account?{" "}
                <a href="#" className="font-semibold text-yellow-500 hover:text-yellow-600">
                  Maak hier een aan
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
