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

        {/* Simple Process Flow */}
        <div className="relative">
          {/* Background gradient line using existing colors */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-blue-300 to-blue-900 rounded-full transform -translate-y-1/2 opacity-30"></div>
          
          {/* Process steps container */}
          <div className="relative grid grid-cols-4 gap-8">
            
            {/* Step 1: Enthousiasmescan - Yellow */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                {/* Simple yellow circle */}
                <div className="w-24 h-24 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Enthousiasmescan</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Ontdek waar jij energie van krijgt en wat jou echt enthousiast maakt
              </p>
            </div>

            {/* Step 2: Wensberoepen - Light Blue */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: '#A9C5E2' }}>
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Wensberoepen</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Verken verschillende carrièremogelijkheden die bij jou passen
              </p>
            </div>

            {/* Step 3: Prioriteiten stellen - Dark Blue */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-900 rounded-full shadow-lg flex items-center justify-center">
                  <Target className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Prioriteiten stellen</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Bepaal wat voor jou het belangrijkst is in je carrière
              </p>
            </div>

            {/* Step 4: Laatste check - White with blue accent */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white border-2 border-blue-900 rounded-full shadow-lg flex items-center justify-center">
                  <Search className="w-10 h-10 text-blue-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Laatste check</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed max-w-48">
                Verfijn je keuzes en krijg je persoonlijke carrière-advies
              </p>
            </div>

          </div>

          {/* Simple connecting lines using existing colors */}
          <div className="absolute top-12 left-0 w-full flex justify-between px-12">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-0.5 bg-yellow-400"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-0.5" style={{ backgroundColor: '#A9C5E2' }}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-0.5 bg-blue-900"></div>
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
