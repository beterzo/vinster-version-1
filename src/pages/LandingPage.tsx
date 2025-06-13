
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, FileText, Search, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/b67ce5d1-c717-4a77-b5ad-550d88a42378.png')"
          }}
        >
          {/* Overlay for better text readability - made lighter */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6">
          {/* Logo */}
          <div className="py-6">
            <img
              src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png"
              alt="Vinster Logo"
              className="h-8 w-auto"
            />
          </div>
          
          {/* Main Hero Content */}
          <div className="grid grid-cols-2 gap-8 items-center min-h-[400px]">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="text-sm text-white leading-relaxed">
                Wij brengen met wetenschappelijke methoden<br />
                waardevolle inzichten over jouw talenten in kaart.<br />
                Leer meer over jezelf!
              </div>
              
              <h1 className="text-4xl font-bold text-white leading-tight">
                Doe het <span className="text-yellow-400">werk</span> waar<br />
                je <span className="text-yellow-400">gelukkig</span> van wordt.
              </h1>
              
              <div className="flex gap-4">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full">
                  Doe de test
                </Button>
                <Button className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full">
                  Hoe het werkt
                </Button>
              </div>
            </div>
            
            {/* Right side - empty space to let background image show */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Three Cards Section - Wrapped in White Container */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Yellow Card */}
            <div className="col-span-4">
              <Card className="bg-yellow-400 text-white p-6 rounded-3xl border-0 h-48">
                <h3 className="text-xl font-bold mb-4 leading-tight">
                  Bekijk hier<br />
                  hoe ons advies<br />
                  tot stand komt.
                </h3>
              </Card>
            </div>
            
            {/* Blue Card with Report */}
            <div className="col-span-4">
              <Card
                className="text-white p-6 rounded-3xl border-0 relative overflow-hidden h-48"
                style={{ backgroundColor: '#A9C5E2' }}
              >
                <h3 className="text-xl font-bold mb-4 leading-tight">
                  Voorbeeld<br />rapport
                </h3>
                <div className="absolute bottom-0 right-4">
                  {/* Larger, more realistic document with updated color */}
                  <div className="w-36 h-48 bg-white rounded-lg shadow-xl transform rotate-12 relative overflow-hidden">
                    {/* Document header */}
                    <div
                      className="h-7 flex items-center px-3"
                      style={{ backgroundColor: '#78BFE3' }}
                    >
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                    {/* Document content */}
                    <div className="p-3 space-y-1.5">
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                      <div
                        className="h-3 rounded w-full mt-3"
                        style={{ backgroundColor: '#78BFE3', opacity: 0.7 }}
                      ></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right Column - Dashboard Card + Text */}
            <div className="col-span-4 flex flex-col space-y-4">
              {/* Dark Blue Dashboard Card */}
              <Card className="bg-blue-900 text-white p-6 rounded-3xl border-0 h-24">
                <h3 className="text-xl font-bold leading-tight text-white">
                  Je persoonlijke<br />dashboard
                </h3>
              </Card>
              
              {/* Text directly on white background */}
              <div className="px-2">
                <h4 className="text-lg font-bold mb-3 text-blue-900">Over deze tool</h4>
                <p className="text-sm leading-relaxed text-blue-900">
                  De denkwijze achter vinster is ontwikkeld door Heidi Jansen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Process Steps Section */}
      <div className="max-w-[1440px] mx-auto px-6 py-16 bg-gray-50">
        <div className="text-center mb-16">
          <div className="text-yellow-400 text-sm font-semibold mb-4 uppercase tracking-wider">
            Het proces
          </div>
          <h2 className="text-4xl font-bold text-blue-900 leading-tight max-w-4xl mx-auto">
            Samen vinden we stap voor stap uit<br />
            waar jouw interesses liggen
          </h2>
        </div>

        {/* Luxury Process Flow */}
        <div className="relative">
          {/* Background gradient line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 via-blue-200 to-blue-300 rounded-full transform -translate-y-1/2 opacity-30"></div>
          
          {/* Process steps container */}
          <div className="relative grid grid-cols-4 gap-8">
            
            {/* Step 1: Enthousiasmescan */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                {/* Luxury circle with gradient and shadow */}
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Inner circle with sparkles */}
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                    <div className="relative">
                      {/* Main sparkle in center */}
                      <Sparkles className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                      {/* Top-left sparkle */}
                      <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute -top-3 -left-3" />
                      {/* Bottom-right sparkle */}
                      <Sparkles className="w-4 h-4 text-yellow-600 fill-yellow-600 absolute -bottom-1 -right-2" />
                    </div>
                  </div>
                  {/* Floating particles */}
                  <div className="absolute top-2 right-4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-75"></div>
                </div>
                {/* Step number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Enthousiasmescan</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Ontdek waar jij energie van krijgt en wat jou echt enthousiast maakt
              </p>
            </div>

            {/* Step 2: Wensberoepen */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                    <div className="relative">
                      <Users className="w-10 h-10 text-blue-600" />
                      {/* Decorative elements */}
                      <div className="absolute -top-1 -right-2 w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="absolute -bottom-1 -left-2 w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                      <div className="absolute top-1 right-0 w-2 h-2 bg-yellow-400 rounded"></div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-2 w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-100"></div>
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Wensberoepen</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Verken verschillende carrièremogelijkheden die bij jou passen
              </p>
            </div>

            {/* Step 3: Prioriteiten stellen */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                    <div className="relative">
                      <Target className="w-10 h-10 text-purple-600" />
                      {/* Target rings */}
                      <div className="absolute inset-0 w-10 h-10 border-2 border-purple-300 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-3 w-2 h-2 bg-purple-200 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-150"></div>
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Prioriteiten stellen</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Bepaal wat voor jou het belangrijkst is in je carrière
              </p>
            </div>

            {/* Step 4: Laatste check */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                    <div className="relative">
                      <Search className="w-10 h-10 text-green-600" />
                      {/* Search sparkles */}
                      <div className="absolute -top-2 -right-1 flex gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-2 w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse delay-200"></div>
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Laatste check</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Verfijn je keuzes en krijg je persoonlijke carrière-advies
              </p>
            </div>

          </div>

          {/* Connecting arrows */}
          <div className="absolute top-16 left-0 w-full flex justify-between px-16">
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-300 to-blue-300"></div>
              <div className="w-2 h-2 border-r-2 border-t-2 border-blue-300 transform rotate-45"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"></div>
              <div className="w-2 h-2 border-r-2 border-t-2 border-purple-300 transform rotate-45"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-300 to-green-300"></div>
              <div className="w-2 h-2 border-r-2 border-t-2 border-green-300 transform rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-12 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
            Start jouw reis
          </Button>
        </div>
      </div>

      {/* Testimonial Section as Block on Page */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
        <div
          className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]"
          style={{
            backgroundImage: "url('/lovable-uploads/f40f684e-643d-4161-be1c-240737966a76.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Light overlay for better text readability */}
          <div className="absolute inset-0 bg-white bg-opacity-20"></div>
          
          <div className="relative z-10 px-12 py-16">
            <div className="grid grid-cols-2 gap-8 items-center">
              {/* Quote */}
              <div className="space-y-6">
                <blockquote className="text-3xl font-normal text-blue-900 leading-tight">
                  "Ik zag mezelf niet ineens<br />
                  die switch maken, maar<br />
                  wat ben ik blij dat ik het<br />
                  gedaan heb!"
                </blockquote>
              </div>
              
              {/* Empty space to let background image show */}
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
