

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
              src="/lovable-uploads/b3731930-5d78-4bcb-8d0a-362ad1ef3e97.png" 
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

      {/* Three Cards Section - Wrapped in White Container */}
      <div className="max-w-[1440px] mx-auto px-6 py-20 bg-gray-50">
        <div className="bg-white rounded-3xl shadow-xl p-8">
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
              <Card className="bg-blue-500 text-white p-6 rounded-3xl border-0 relative overflow-hidden h-48">
                <h3 className="text-xl font-bold mb-4 leading-tight">Voorbeeld<br />rapport</h3>
                <div className="absolute bottom-0 right-4">
                  {/* Larger, more realistic document with updated color */}
                  <div className="w-36 h-48 bg-white rounded-lg shadow-xl transform rotate-12 relative overflow-hidden">
                    {/* Document header */}
                    <div className="h-7 flex items-center px-3" style={{ backgroundColor: '#78BFE3' }}>
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
                      <div className="h-3 rounded w-full mt-3" style={{ backgroundColor: '#78BFE3', opacity: 0.7 }}></div>
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
                <h3 className="text-xl font-bold leading-tight text-white">Je persoonlijke<br />dashboard</h3>
              </Card>
              
              {/* Text directly on white background */}
              <div className="px-2">
                <h4 className="text-lg font-bold mb-3 text-blue-900">Over deze tool</h4>
                <p className="text-sm leading-relaxed text-blue-900">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Overview Section - Updated Flow */}
      <div className="max-w-[1440px] mx-auto px-6 py-16 bg-gray-50">
        <div className="mb-12">
          <div className="text-yellow-400 text-sm font-semibold mb-4">Hoe werkt de loopbaan tool</div>
          <h2 className="text-3xl font-bold text-blue-900 leading-tight max-w-2xl">
            Samen vinden we stap voor stap uit<br />
            waar jouw interesses liggen en wat<br />
            je het liefste doet.
          </h2>
        </div>
        
        {/* Process Steps with Smooth Flowing Line */}
        <div className="relative min-h-[120px] overflow-hidden">
          {/* Smooth flowing curved line */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <path 
              d="M -400 60 C -200 45, -100 70, 0 55 C 100 40, 200 75, 300 60 C 400 45, 500 80, 600 55 C 700 30, 800 65, 900 50 C 1000 35, 1100 70, 1200 55 C 1300 40, 1400 65, 1800 55" 
              stroke="#d1d5db" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Step 1 - De enthousiasme-scan */}
          <div className="absolute" style={{ left: '200px', top: '60px', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
              <div className="relative">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-4" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute top-1 -left-1" />
              </div>
            </div>
          </div>
          
          {/* Step 2 - Wensberoepen */}
          <div className="absolute" style={{ left: '450px', top: '60px', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
              <div className="relative">
                <Users className="w-8 h-8 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                <Star className="absolute -top-1 right-3 w-3 h-3 text-blue-400" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-2 border-blue-400 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Step 3 - Prioriteiten stellen */}
          <div className="absolute" style={{ left: '700px', top: '60px', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
              <div className="relative">
                <Target className="w-8 h-8 text-green-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-2 border-green-500 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Step 4 - Laatste check */}
          <div className="absolute" style={{ left: '950px', top: '60px', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
              <div className="relative">
                <Search className="w-8 h-8 text-yellow-500" />
                <div className="absolute -top-1 right-1 flex gap-0.5">
                  <div className="w-0.5 h-0.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-0.5 h-0.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-0.5 h-0.5 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section as Block on Page */}
      <div className="max-w-[1440px] mx-auto px-6 py-20 bg-gray-50">
        <div 
          className="relative overflow-hidden rounded-3xl shadow-xl min-h-[400px]"
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

