
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Target, FileText, Search, Users } from "lucide-react";

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
              src="/lovable-uploads/e1b00474-91f6-46ad-a01f-9f3c9bdaf981.png" 
              alt="Vinster Logo" 
              className="h-8 w-auto"
            />
          </div>
          
          {/* Main Hero Content */}
          <div className="grid grid-cols-2 gap-8 items-center min-h-[500px]">
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

      {/* Three Cards Section */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6">
          {/* Yellow Card with White Text */}
          <Card className="bg-yellow-400 text-white p-8 rounded-3xl border-0">
            <h3 className="text-xl font-bold mb-4 leading-tight">
              Bekijk hier<br />
              hoe ons advies<br />
              tot stand komt.
            </h3>
          </Card>
          
          {/* Blue Card with Larger Report Document */}
          <Card className="bg-blue-500 text-white p-8 rounded-3xl border-0 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4 leading-tight">Voorbeeld<br />rapport</h3>
            <div className="absolute bottom-2 right-2">
              {/* Larger, more realistic document */}
              <div className="w-40 h-52 bg-white rounded-lg shadow-xl transform rotate-12 relative overflow-hidden">
                {/* Document header */}
                <div className="h-8 bg-blue-600 flex items-center px-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  </div>
                </div>
                {/* Document content */}
                <div className="p-4 space-y-2">
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-blue-200 rounded w-full mt-4"></div>
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Dark Blue Card with Dashboard Layout */}
          <Card className="bg-blue-900 text-white p-8 rounded-3xl border-0 relative">
            <h3 className="text-xl font-bold mb-6 leading-tight text-white">Je persoonlijke dashboard</h3>
            
            {/* Over deze tool section overlapping with blue background */}
            <div className="absolute bottom-4 left-4 right-4 bg-blue-600 p-4 rounded-xl">
              <div className="text-xs text-white/80 mb-3 uppercase tracking-wider font-medium">Over deze tool</div>
              <p className="text-sm leading-relaxed text-white/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Process Overview Section - Exact Match to Image */}
      <div className="max-w-[1440px] mx-auto px-6 py-16 bg-gray-50">
        <div className="mb-12">
          <div className="text-yellow-400 text-sm font-semibold mb-4">Hoe werkt de loopbaan tool</div>
          <h2 className="text-3xl font-bold text-blue-900 leading-tight max-w-2xl">
            Samen vinden we stap voor stap uit<br />
            waar jouw interesses liggen en wat<br />
            je het liefste doet.
          </h2>
        </div>
        
        {/* Process Steps with Exact Layout from Image */}
        <div className="relative min-h-[600px]">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
               refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
              </marker>
            </defs>
            {/* Line from step 1 to step 2 */}
            <line x1="25%" y1="35%" x2="45%" y2="25%" stroke="#d1d5db" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Line from step 2 to step 3 */}
            <line x1="55%" y1="25%" x2="75%" y2="45%" stroke="#d1d5db" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Line from step 3 to step 4 */}
            <line x1="75%" y1="65%" x2="55%" y2="85%" stroke="#d1d5db" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>
          
          {/* Step 1 - De enthousiasme-scan (bottom left) */}
          <div className="absolute left-[5%] bottom-[10%] w-72" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-100 relative">
                <div className="absolute -top-2 -left-2">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute -top-1 left-6" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute top-2 -left-1" />
                </div>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-lg">De enthousiasme-scan</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit,<br />
                sed diam
              </p>
            </div>
          </div>
          
          {/* Step 2 - Jouw wensberoepen (top center) */}
          <div className="absolute left-1/2 top-[5%] transform -translate-x-1/2 w-72" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-100">
                <div className="relative">
                  <Users className="w-12 h-12 text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full"></div>
                  <Star className="absolute -top-2 right-4 w-4 h-4 text-blue-400" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-blue-400 rounded"></div>
                </div>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-lg">Jouw<br />wensberoepen</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit,<br />
                sed diam
              </p>
            </div>
          </div>
          
          {/* Step 3 - Jouw rapport en aanvullingen (right center) */}
          <div className="absolute right-[5%] top-[35%] w-72" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-100">
                <div className="relative">
                  <div className="w-12 h-16 bg-blue-600 rounded-sm flex flex-col">
                    <div className="flex justify-between items-center p-1 bg-blue-700 rounded-t-sm">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 p-1 space-y-1">
                      <div className="w-full h-0.5 bg-white rounded"></div>
                      <div className="w-full h-0.5 bg-white rounded"></div>
                      <div className="w-3/4 h-0.5 bg-white rounded"></div>
                      <div className="w-full h-0.5 bg-white rounded"></div>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rounded-sm transform rotate-12"></div>
                </div>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-lg">Jouw rapport en<br />aanvullingen</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit,<br />
                sed diam
              </p>
            </div>
          </div>
          
          {/* Step 4 - Jouw antwoorden (bottom right) */}
          <div className="absolute right-[15%] bottom-[10%] w-72" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-100">
                <div className="relative">
                  <Search className="w-12 h-12 text-yellow-500" />
                  <div className="absolute -top-1 right-2 flex gap-0.5">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-blue-900 mb-3 text-lg">Jouw<br />antwoorden</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit,<br />
                sed diam
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-blue-100 py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Quote */}
            <div className="space-y-6">
              <blockquote className="text-2xl font-bold text-blue-900 leading-tight">
                "Ik zag mezelf niet ineens<br />
                die switch maken, maar<br />
                wat ben ik blij dat ik het<br />
                gedaan heb!"
              </blockquote>
            </div>
            
            {/* Image */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/5c9e857b-c318-4c07-8c67-12a698a13be3.png"
                alt="Tevreden gebruiker met headset"
                className="w-full max-w-md h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
