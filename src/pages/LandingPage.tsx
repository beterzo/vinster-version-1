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
          {/* Yellow Card */}
          <Card className="bg-yellow-400 text-black p-8 rounded-3xl border-0">
            <h3 className="text-xl font-bold mb-4">
              Bekijk hier<br />
              hoe ons advies<br />
              tot stand komt.
            </h3>
          </Card>
          
          {/* Blue Card with Report */}
          <Card className="bg-blue-400 text-white p-8 rounded-3xl border-0 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4">Voorbeeld<br />rapport</h3>
            <div className="absolute bottom-4 right-4">
              <div className="w-24 h-32 bg-white rounded transform rotate-12 shadow-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </Card>
          
          {/* Dark Blue Card */}
          <Card className="bg-blue-900 text-white p-8 rounded-3xl border-0">
            <h3 className="text-xl font-bold mb-4">Je persoonlijke dashboard</h3>
            <div className="text-sm mb-4 font-semibold">Over deze tool</div>
            <p className="text-sm leading-relaxed">
              Lorem ipsum dolor sit consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
          </Card>
        </div>
      </div>

      {/* Process Overview Section - New Design */}
      <div className="max-w-[1440px] mx-auto px-6 py-16 bg-white">
        <div className="mb-12">
          <div className="text-yellow-400 text-sm font-semibold mb-4">Hoe werkt de loopbaan test?</div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight max-w-2xl">
            Samen vinden we stap voor stap uit waar jouw interesses liggen en wat je het liefste doet.
          </h2>
        </div>
        
        {/* Process Steps with New Layout */}
        <div className="relative min-h-[500px]">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
               refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#e5e7eb" />
              </marker>
            </defs>
            {/* Line from step 1 to step 2 */}
            <line x1="20%" y1="25%" x2="50%" y2="15%" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Line from step 2 to step 3 */}
            <line x1="70%" y1="15%" x2="80%" y2="50%" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Line from step 3 to step 4 */}
            <line x1="80%" y1="70%" x2="50%" y2="85%" stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>
          
          {/* Step 1 - De enthousiasme-scan (left) */}
          <div className="absolute left-0 top-[20%] w-64" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">De enthousiasme-scan</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
          </div>
          
          {/* Step 2 - Jouw wensberoepen (top center) */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-64" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Jouw wensberoepen</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
          </div>
          
          {/* Step 3 - Jouw rapport en aanvullingen (right) */}
          <div className="absolute right-0 top-[40%] w-64" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Jouw rapport en aanvullingen</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
          </div>
          
          {/* Step 4 - Jouw antwoorden (bottom center) */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-64" style={{ zIndex: 2 }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Jouw antwoorden</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
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
