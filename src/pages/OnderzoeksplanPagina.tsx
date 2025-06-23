
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, Search } from "lucide-react";

const OnderzoeksplanPagina = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-vinster-blue">En nu? <span className="text-lg font-normal text-gray-600">(instructie bij de pagina over het onderzoeksplan)</span></h1>
          </div>
          <p className="text-lg text-gray-700">
            Jouw loopbaanrapport is klaar! Nu kun je op onderzoek uit, want je wilt eerst nog wat meer weten voor je een definitieve keuze kunt maken.
          </p>
        </div>

        {/* Research Plan */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-yellow-50 border-blue-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-vinster-blue mb-2">Onderzoek doen!</h2>
            <p className="text-gray-700 mb-6">
              Eerst doe je onderzoek achter je bureau en daarna in de praktijk. Dit is jouw stappenplan:
            </p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <p className="text-gray-700 text-left">
                  Vraag AI (of Google) naar een uitgebreide functiebeschrijving van de functies uit je 
                  loopbaanrapport. Vraag AI ook naar vergelijkbare functies. Welk werk lijkt erop? Wat spreekt 
                  je aan in de antwoorden die je krijgt?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <p className="text-gray-700 text-left">
                  Kijk of je vacatures kunt vinden die een beeld geven van de inhoud van deze functie en van 
                  de organisaties die deze functies hebben.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <p className="text-gray-700 text-left">
                  Zoek op LinkedIn naar mensen die dit werk doen. Wat is hun achtergrond?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <p className="text-gray-700 text-left">
                  Is er een beroepsvereniging? Wat lees je op de website over ontwikkelingen in de sector en het beroep?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">5</span>
                </div>
                <p className="text-gray-700 text-left">
                  Heeft het beroep een vakblad? Zo ja, vraag er één of meerdere aan en lees ze. Wat valt je 
                  op? Word je enthousiast van de onderwerpen?
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">6</span>
                </div>
                <p className="text-gray-700 text-left">
                  Zoek organisaties waar mensen met dit beroep werken.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">7</span>
                </div>
                <p className="text-gray-700 text-left">
                  Welke opleiding heb je eventueel nodig voor dit werk? Vraag het AI of Google.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">8</span>
                </div>
                <p className="text-gray-700 text-left">
                  Schrijf alle vragen op die bij je opkomen tijdens het onderzoek. Die kun je gaan stellen aan 
                  mensen die al werkzaam zijn in deze richting.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-yellow-600 font-bold text-sm">9</span>
                </div>
                <p className="text-gray-700 text-left">
                  Maak een lijstje met mensen die je zou willen spreken over dit werk en benader hen. Je vindt 
                  die mensen via LinkedIn en/of via je persoonlijke netwerk.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <span className="text-yellow-600 font-bold text-sm">10</span>
                </div>
                <p className="text-gray-700 text-left">
                  Verzamel genoeg informatie om een keuze te maken. Neem de tijd en praat er met anderen over.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Extra sentence */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700">
            Als je weet welke functie het wordt kun je het functieprofiel op deze website invullen.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-yellow-500 hover:bg-yellow-600 text-vinster-blue rounded-xl"
          >
            <Check className="w-4 h-4 mr-2" />
            Naar dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnderzoeksplanPagina;
