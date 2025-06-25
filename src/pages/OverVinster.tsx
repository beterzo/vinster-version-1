import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
const OverVinster = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img alt="Vinster Logo" className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/')} src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Heidi's Photo and Introduction */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="order-2 md:order-1">
              <div className="relative">
                <img alt="Heidi Jansen - Oprichter van Vinster" className="w-full max-w-md mx-auto rounded-2xl shadow-lg object-cover aspect-[3/4]" src="/lovable-uploads/790a1059-98fe-415f-bc29-f36d00c53e4c.jpg" />
                <div className="absolute -bottom-4 -right-4 bg-blue-900 text-white p-4 rounded-xl shadow-lg">
                  <p className="text-sm font-semibold">25+ jaar ervaring</p>
                  <p className="text-xs opacity-90">Loopbaanadviseur</p>
                </div>
              </div>
            </div>
            
            {/* Introduction Text */}
            <div className="order-1 md:order-2">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                Over Vinster
              </h1>
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Hallo, ik ben <strong className="text-blue-900">Heidi Jansen</strong> – loopbaanadviseur, opleider, en de bedenker van de methode die ten grondslag ligt aan Vinster.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Al meer dan 25 jaar help ik mensen en professionals in het loopbaanvak om richting te vinden in werk. Want dat is wat ik iedereen gun: werk waar je blij van wordt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Block 1: Her Experience */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Mijn ervaring in loopbaanbegeleiding
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            In mijn werk als loopbaanadviseur heb ik gemerkt dat het best lastig kan zijn om precies te weten waar je naar toe wilt met je werk. Je wilt of moet iets anders, je voelt dat er meer mogelijk is, maar weet niet precies wat of hoe. Er zijn zóveel opties, zóveel gedachten – dat het lastig is om helderheid te krijgen. En dat is precies waar Vinster bij helpt: overzicht, inzicht en uitzicht.
          </p>
        </div>

        {/* Block 2: The Loopbaantrechter Method */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            De Loopbaantrechter methode
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Vinster is gebaseerd op de <strong className="text-blue-900">Loopbaantrechter</strong>, een praktische en doordachte methode waarmee ik duizenden mensen hebben begeleid en die ik in de loop der jaren heb doorgegeven aan talloze loopbaanprofessionals – in binnen- en buitenland. De methode werkt, omdat ze het persoonlijke verbindt aan de realiteit van de arbeidsmarkt.
          </p>
        </div>

        {/* Block 3: About Vinster Platform */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Vinster: online loopbaanbegeleiding
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Met Vinster breng ik deze aanpak nu online – ondersteund door AI, maar altijd mensgericht. Je beantwoordt een aantal vragen, waarna Vinster kernwoorden herkent in jouw antwoorden. Op basis daarvan krijg je suggesties voor passende functies en ideeën voor jouw volgende stap. Geen onrealistische dromen, maar inspirerende én haalbare mogelijkheden.
          </p>
        </div>

        {/* Block 4: Mission */}
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-lg p-8 md:p-12 border-l-4 border-yellow-400">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Mijn missie
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Mijn missie? <strong className="text-blue-900">Bijdragen aan goed werk voor iedereen.</strong> Want goed werk is werk dat past bij wie je bent, waar je energie van krijgt, en waar je iets kunt betekenen. En dat begint bij helderheid. Daar is Vinster voor.
          </p>
          <div className="bg-yellow-100 rounded-2xl p-6">
            <p className="text-xl font-semibold text-yellow-800 text-center">
              "Ik wens jou werk waar je blij van wordt!"
            </p>
            <p className="text-center text-yellow-700 mt-2 font-medium">- Heidi Jansen</p>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Klaar om te beginnen?
            </h3>
            <p className="text-gray-600">Op weg naar een betere loopbaan</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} variant="outline" className="h-12 px-8 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold">
              Terug naar homepage
            </Button>
            <Button onClick={() => navigate('/signup')} className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold">
              Starten
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default OverVinster;