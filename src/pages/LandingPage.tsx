
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Target, FileText, Search, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-100 to-blue-200 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Logo */}
          <div className="py-6">
            <div className="text-xl font-bold text-gray-800">LOGO</div>
          </div>
          
          {/* Main Hero Content */}
          <div className="grid grid-cols-2 gap-8 items-center min-h-[500px]">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="text-sm text-gray-600 leading-relaxed">
                Wij brengen met wetenschappelijke methoden<br />
                waardevolle inzichten over jouw talenten in kaart.<br />
                Leer meer over jezelf!
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Doe het <span className="text-blue-600">werk</span> waar<br />
                je <span className="text-blue-600">gelukkig</span> van wordt.
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
            
            {/* Right Image */}
            <div className="flex justify-end">
              <img 
                src="/lovable-uploads/4d34612b-df14-4f89-abac-7542126c6ac2.png"
                alt="Professionele vrouw met loopbaanontwikkeling materialen"
                className="w-full max-w-md h-auto object-cover rounded-lg"
              />
            </div>
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

      {/* Process Overview Section */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-yellow-400 text-sm font-semibold mb-4">Hoe werkt de loopbaan test?</div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            Samen vinden we stap voor stap uit<br />
            waar jouw interesses liggen en wat<br />
            je het liefste doet.
          </h2>
        </div>
        
        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
          
          <div className="grid grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">De enthousiasme-scan</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                We onderzoeken waar jij van nature enthousiast van wordt en wat je energie geeft.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Jouw wensberoepen</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Op basis van jouw profiel laten we zien welke beroepen bij jou passen.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Jouw rapport en aanvullingen</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Je ontvangt een persoonlijk rapport met concrete vervolgstappen.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Jouw antwoorden</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Begin met zoeken naar vacatures die perfect bij jouw profiel passen.
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
