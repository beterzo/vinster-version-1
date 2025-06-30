
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnderzoeksplanPagina = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      text: "Vraag AI (of Google) naar een uitgebreide functiebeschrijving van de functies uit je loopbaanrapport. Vraag AI ook naar vergelijkbare functies. Welk werk lijkt erop? Wat spreekt je aan in de antwoorden die je krijgt?"
    },
    {
      number: 2,
      text: "Kijk of je vacatures kunt vinden die een beeld geven van de inhoud van deze functie en van de organisaties die deze functies hebben."
    },
    {
      number: 3,
      text: "Zoek op LinkedIn naar mensen die dit werk doen. Wat is hun achtergrond?"
    },
    {
      number: 4,
      text: "Is er een beroepsvereniging? Wat lees je op de website over ontwikkelingen in de sector en het beroep?"
    },
    {
      number: 5,
      text: "Heeft het beroep een vakblad? Zo ja, vraag er één of meerdere aan en lees ze. Wat valt je op? Word je enthousiast van de onderwerpen?"
    },
    {
      number: 6,
      text: "Zoek organisaties waar mensen met dit beroep werken."
    },
    {
      number: 7,
      text: "Welke opleiding heb je eventueel nodig voor dit werk? Vraag het AI of Google."
    },
    {
      number: 8,
      text: "Schrijf alle vragen op die bij je opkomen tijdens het onderzoek. Die kun je gaan stellen aan mensen die al werkzaam zijn in deze richting."
    },
    {
      number: 9,
      text: "Maak een lijstje met mensen die je zou willen spreken over dit werk en benader hen. Je vindt die mensen via LinkedIn en/of via je persoonlijke netwerk."
    },
    {
      number: 10,
      text: "Verzamel genoeg informatie om een keuze te maken. Neem de tijd en praat er met anderen over."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/home')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Onderzoeksplan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Dit is jouw stappenplan om te bepalen hoe je volgende functie eruit moet komen te zien.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-3xl mx-auto">
            <p className="text-yellow-800 font-medium">
              💡 Dit onderzoeksplan staat ook onderaan jouw loopbaanrapport, dus daar kun je hem altijd terugvinden.
            </p>
          </div>
        </div>

        <Card className="rounded-3xl shadow-xl mb-8">
          <CardContent className="p-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              Dit is jouw stappenplan:
            </h2>
            
            {/* Steps */}
            <div className="space-y-6 mb-12">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Na je onderzoek:
              </h3>
              <p className="text-green-700 mb-4">
                Als je genoeg aan de weet bent gekomen kies dan de functie die het allerbest bij je past en vul het zoekprofiel op de website in. Vinster zal jouw tekst omzetten naar een paar zinnen die je kunt gebruiken om anderen te laten weten wat je zoekt.
              </p>
              <p className="text-green-700 mb-4">
                Je kunt nu gericht gaan solliciteren! Zoek vacatures, laat jouw netwerk weten wat je wilt en deel op LinkedIn welke functie je zoekt.
              </p>
              <p className="text-green-700 font-semibold">
                We wensen jou veel werkplezier in je volgende functie!
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                ⏰ Neem hier de tijd voor dit onderzoek
              </h3>
              <p className="text-blue-700 mb-3">
                Dit onderzoek is cruciaal voor het vinden van je ideale functie. Neem de tijd om elke stap zorgvuldig uit te voeren.
              </p>
              <p className="text-blue-700">
                Hoe beter je dit onderzoek doet, hoe beter je straks je zoekprofiel kunt invullen en hoe gerichter je kunt solliciteren.
              </p>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <Button 
                onClick={() => navigate('/home')}
                size="lg"
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Home className="w-5 h-5" />
                Terug naar dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnderzoeksplanPagina;
