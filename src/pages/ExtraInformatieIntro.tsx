
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Info, CheckCircle } from "lucide-react";

const ExtraInformatieIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mb-6 cursor-pointer" 
            onClick={() => navigate("/home")}
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Extra informatie</h1>
          <p className="text-xl text-gray-700">
            Nog wat aanvullende informatie om jouw advies te personaliseren
          </p>
        </div>

        {/* Main content */}
        <Card className="p-8 mb-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8" style={{ color: '#78BFE3' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bijna klaar met jouw loopbaantraject!
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We hebben nog vier korte vragen voor je. Deze extra informatie helpt ons om 
              jouw persoonlijke advies nog beter af te stemmen op jouw situatie en wensen.
            </p>
          </div>

          {/* Three benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-white rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#78BFE3' }} />
              <h3 className="font-bold text-lg mb-2">Gepersonaliseerd advies</h3>
              <p className="text-gray-600 text-sm">Door jouw achtergrond te kennen kunnen we passendere vacatures voorstellen</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#78BFE3' }} />
              <h3 className="font-bold text-lg mb-2">Rekening met beperkingen</h3>
              <p className="text-gray-600 text-sm">We houden rekening met eventuele fysieke beperkingen bij onze aanbevelingen</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <ArrowRight className="w-12 h-12 mx-auto mb-4" style={{ color: '#78BFE3' }} />
              <h3 className="font-bold text-lg mb-2">Sector focus</h3>
              <p className="text-gray-600 text-sm">Als je een voorkeur hebt voor een bepaalde sector, zoeken we daar specifiek in</p>
            </div>
          </div>

          {/* What to expect */}
          <div className="bg-white p-6 rounded-lg mb-8">
            <h3 className="font-bold text-lg mb-4">Wat ga je invullen?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span><strong>Opleidingsniveau:</strong> Mbo, Hbo of Wo - dit helpt ons bij het vinden van passende functies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span><strong>Beroepsopleiding:</strong> Jouw specifieke opleiding of vakgebied</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span><strong>Fysieke beperkingen:</strong> Eventuele aandachtspunten bij het werk (optioneel)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#78BFE3' }}></div>
                <span><strong>Sector voorkeur:</strong> Of je bijvoorbeeld graag in de zorg, bouw of tech wilt werken (optioneel)</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => navigate("/prioriteiten-interesses")} 
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Terug naar prioriteiten
          </Button>
          
          <Button 
            onClick={() => navigate("/extra-informatie-vragen")} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200" 
            size="lg"
          >
            Beginnen met extra informatie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtraInformatieIntro;
