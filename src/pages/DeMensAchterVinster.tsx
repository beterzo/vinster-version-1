
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DeMensAchterVinster = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" className="h-12 w-auto" />
              <span className="text-xl font-bold tracking-wide" style={{ color: '#253857' }}>
                Vinster | jouw venster op de toekomst
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
            De mens achter Vinster
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              Hallo, ik ben <strong>Heidi Jansen</strong> – loopbaanadviseur, opleider, en de bedenker van de methode die ten grondslag ligt aan Vinster. Al meer dan 25 jaar help ik mensen en professionals in het loopbaanvak om richting te vinden in werk. Want dat is wat ik iedereen gun: werk waar je blij van wordt.
            </p>
            
            <p>
              In mijn werk als loopbaanadviseur heb ik gemerkt dat het best lastig kan zijn om precies te weten waar je naar toe wilt met je werk. Je wilt of moet iets anders, je voelt dat er meer mogelijk is, maar weet niet precies wat of hoe. Er zijn zóveel opties, zóveel gedachten – dat het lastig is om helderheid te krijgen. En dat is precies waar Vinster bij helpt: overzicht, inzicht en uitzicht.
            </p>
            
            <p>
              Vinster is gebaseerd op de <strong>Loopbaantrechter</strong>, een praktische en doordachte methode waarmee ik duizenden mensen hebben begeleid en die ik in de loop der jaren heb doorgegeven aan talloze loopbaanprofessionals – in binnen- en buitenland. De methode werkt, omdat ze het persoonlijke verbindt aan de realiteit van de arbeidsmarkt.
            </p>
            
            <p>
              Met Vinster breng ik deze aanpak nu online – ondersteund door AI, maar altijd mensgericht. Je beantwoordt een aantal vragen, waarna Vinster kernwoorden herkent in jouw antwoorden. Op basis daarvan krijg je suggesties voor passende functies en ideeën voor jouw volgende stap. Geen onrealistische dromen, maar inspirerende én haalbare mogelijkheden.
            </p>
            
            <p>
              Mijn missie? <strong>Bijdragen aan goed werk voor iedereen.</strong> Want goed werk is werk dat past bij wie je bent, waar je energie van krijgt, en waar je iets kunt betekenen. En dat begint bij helderheid. Daar is Vinster voor.
            </p>
            
            <p className="text-xl font-medium" style={{ color: '#FFCD3E' }}>
              Ik wens jou werk waar je blij van wordt!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="h-12 px-8 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Terug naar homepage
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            >
              Starten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeMensAchterVinster;
