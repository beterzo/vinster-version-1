
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";

const OnderzoeksplanPagina = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mb-6" 
          />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">En nu?</h1>
          </div>
          <p className="text-lg text-gray-700">
            Nu je je rapport hebt, is het tijd om dieper te duiken in de beroepen die bij je passen.
          </p>
        </div>

        {/* Research Plan */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-yellow-50 border-blue-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Onderzoek doen!</h2>
            <p className="text-gray-700 mb-6">
              Volg dit onderzoeksplan om de beste keuze te maken voor je loopbaan:
            </p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Dit is jouw onderzoeksplan:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <p className="text-gray-700">
                  Vraag AI naar een functie- of beroepsbeschrijving. Vraag ook naar vergelijkbare functies. 
                  Welk werk lijkt erop? Wat spreekt je aan in de antwoorden die je krijgt?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <p className="text-gray-700">
                  Kijk of je vacatures kunt vinden die een beeld geven van de inhoud van dit beroep.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <p className="text-gray-700">
                  Zoek op LinkedIn naar mensen die dit werk doen. Wat is hun achtergrond?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <p className="text-gray-700">
                  Is er een beroepsvereniging? Wat lees je op de website over ontwikkelingen in de sector en het beroep?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">5</span>
                </div>
                <p className="text-gray-700">
                  Heeft het beroep een vakblad? Zo ja, vraag er één of meerdere op en lees ze. 
                  Wat valt je op? Word je enthousiast van de onderwerpen?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">6</span>
                </div>
                <p className="text-gray-700">
                  Zoek organisaties waar mensen met dit beroep werken.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">7</span>
                </div>
                <p className="text-gray-700">
                  Welke opleiding heb je eventueel nodig voor dit werk? 
                  Schrijf alle vragen die bij je opkomen op. Die kun je gaan stellen aan mensen die al werkzaam zijn in deze richting.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-yellow-600 font-bold text-sm">8</span>
                </div>
                <p className="text-gray-700">
                  Maak een lijstje met mensen die je zou willen spreken over dit werk en benader hen.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-gray-700 font-medium">
                Als je genoeg aan de weet bent gekomen kies dan de functie die het allerbest bij je past 
                en ga verder met <span className="text-yellow-600 font-bold">de allerlaatste stap: het maken van jouw zoekprofiel!</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/home")}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Naar dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnderzoeksplanPagina;
