
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const PrivacyVerklaring = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                alt="Vinster Logo" 
                className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
              />
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            Privacy verklaring
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-sm text-gray-500 mb-8">
              Laatst bijgewerkt: 23 juni 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">1. Wie zijn wij?</h2>
              <p>
                Vinster is een service van De Loopbaanopleiding, gevestigd in Nederland. 
                Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in deze privacyverklaring.
              </p>
              <p>
                <strong>Contactgegevens:</strong><br />
                Email: info@deloopbaanopleiding.nl<br />
                Telefoon: +31 6 22 23 85 95<br />
                KvK nr: 04050762
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">2. Welke gegevens verzamelen wij?</h2>
              <p>Wij verzamelen de volgende persoonsgegevens:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Voor- en achternaam</li>
                <li>E-mailadres</li>
                <li>Antwoorden op vragen in de loopbaanscans</li>
                <li>Technische gegevens zoals IP-adres en browserinformatie</li>
                <li>Betalingsgegevens (verwerkt door onze betalingspartner)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">3. Waarvoor gebruiken wij uw gegevens?</h2>
              <p>Wij gebruiken uw persoonsgegevens voor:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Het leveren van onze loopbaanservice en het genereren van uw persoonlijke rapport</li>
                <li>Communicatie over uw account en onze services</li>
                <li>Verbetering van onze website en services</li>
                <li>Voldoen aan wettelijke verplichtingen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">4. Rechtsgrond voor verwerking</h2>
              <p>
                Wij verwerken uw persoonsgegevens op basis van:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Uitvoering van de overeenkomst tussen u en ons</li>
                <li>Uw toestemming</li>
                <li>Gerechtvaardigd belang voor verbetering van onze services</li>
                <li>Wettelijke verplichting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">5. Delen van gegevens</h2>
              <p>
                Wij delen uw persoonsgegevens niet met derden, behalve:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Met onze technische serviceproviders (onder strikte verwerkingsovereenkomsten)</li>
                <li>Wanneer dit wettelijk verplicht is</li>
                <li>Met uw expliciete toestemming</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">6. Bewaartermijn</h2>
              <p>
                Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk. 
                Accountgegevens worden bewaard zolang uw account actief is. 
                Na verwijdering van uw account worden gegevens binnen 30 dagen permanent verwijderd.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">7. Uw rechten</h2>
              <p>U heeft de volgende rechten betreffende uw persoonsgegevens:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Recht op inzage</li>
                <li>Recht op rectificatie</li>
                <li>Recht op verwijdering</li>
                <li>Recht op beperking van verwerking</li>
                <li>Recht op gegevensoverdraagbaarheid</li>
                <li>Recht van bezwaar</li>
              </ul>
              <p className="mt-4">
                Om deze rechten uit te oefenen kunt u contact met ons opnemen via info@deloopbaanopleiding.nl
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">8. Beveiliging</h2>
              <p>
                Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens 
                te beschermen tegen verlies, misbruik, ongeautoriseerde toegang, openbaarmaking, wijziging of vernietiging.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">9. Cookies</h2>
              <p>
                Wij gebruiken functionele cookies die noodzakelijk zijn voor het functioneren van onze website. 
                Deze cookies slaan geen persoonlijke informatie op.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">10. Wijzigingen</h2>
              <p>
                Wij kunnen deze privacyverklaring van tijd tot tijd wijzigen. 
                De meest recente versie is altijd beschikbaar op onze website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">11. Contact</h2>
              <p>
                Voor vragen over deze privacyverklaring of over de verwerking van uw persoonsgegevens 
                kunt u contact met ons opnemen:
              </p>
              <p>
                Email: info@deloopbaanopleiding.nl<br />
                Telefoon: +31 6 22 23 85 95
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyVerklaring;
