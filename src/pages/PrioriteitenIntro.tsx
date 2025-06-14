import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Target, Star, Briefcase } from "lucide-react";

const PrioriteitenIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-8 w-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prioriteiten stellen</h1>
          <p className="text-xl text-gray-700">
            Nu gaan we samen bepalen wat voor jou het allerbelangrijkste is
          </p>
        </div>

        {/* Main content */}
        <Card className="p-8 mb-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8" style={{ color: '#78BFE3' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Op basis van jouw antwoorden hebben we kernwoorden geïdentificeerd
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Deze kernwoorden zijn gebaseerd op jouw enthousiasme-scan en wensberoepen. 
              Ze geven een goed beeld van wat jou motiveert en waar je energie van krijgt.
            </p>
          </div>

          {/* Three categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-white rounded-lg">
              <Star className="w-12 h-12 mx-auto mb-4" style={{ color: '#78BFE3' }} />
              <h3 className="font-bold text-lg mb-2">Wat je graag doet</h3>
              <p className="text-gray-600 text-sm">Activiteiten en taken waar jij energie van krijgt</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: '#78BFE3' }} />
              <h3 className="font-bold text-lg mb-2">Fijne werkomgeving</h3>
              <p className="text-gray-600 text-sm">Omstandigheden waarin jij goed functioneert</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <Target className="w-12 h-12 mx-auto mb-4" style={{ color: '#78BFE3' }} />
              <h3 className="font-bold text-lg mb-2">Jouw interesses</h3>
              <p className="text-gray-600 text-sm">Onderwerpen en gebieden die jou boeien</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg mb-8">
            <h3 className="font-bold text-lg mb-4">Wat ga je nu doen?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span>Je gaat de kernwoorden per categorie bekijken en selecteren welke voor jou het allerbelangrijkste zijn</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span>Je kunt per categorie aanvullende informatie toevoegen over wat je nog belangrijk vindt</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span>Er zijn geen goede of foute antwoorden - ga af op je gevoel en selecteer wat echt bij je past</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate("/home")}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Terug naar dashboard
          </Button>
          
          <Button
            onClick={() => navigate("/prioriteiten-activiteiten")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Beginnen met prioriteiten stellen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrioriteitenIntro;
