import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
const AlgemeneVoorwaarden = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img alt="Vinster Logo" onClick={() => navigate('/')} src="/lovable-uploads/1b9bf08d-0b73-4b0a-bd2d-d82e21d845c4.png" className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" />
            </div>
            <Button onClick={() => navigate('/')} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold">
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            Algemene voorwaarden
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-sm text-gray-500 mb-8">
              Laatst bijgewerkt: 23 juni 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">1. Definities</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Vinster:</strong> De service aangeboden door De Loopbaanopleiding</li>
                <li><strong>Gebruiker:</strong> Iedere natuurlijke persoon die gebruik maakt van Vinster</li>
                <li><strong>Service:</strong> De online loopbaantool en bijbehorende diensten</li>
                <li><strong>Account:</strong> Het persoonlijke profiel van de gebruiker</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">2. Toepasselijkheid</h2>
              <p>
                Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen 
                De Loopbaanopleiding en gebruikers van Vinster. Door gebruik te maken van onze service 
                gaat u akkoord met deze voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">3. Account en toegang</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>U bent verantwoordelijk voor het veilig houden van uw inloggegevens</li>
                <li>U bent verantwoordelijk voor alle activiteiten onder uw account</li>
                <li>U mag slechts één account aanmaken per persoon</li>
                <li>Het is niet toegestaan om uw account te delen met derden</li>
                <li>Wij behouden ons het recht voor om accounts op te schorten bij misbruik</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">4. Gebruik van de service</h2>
              <p>Bij het gebruik van Vinster gaat u ermee akkoord dat u:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Waarheidsgetrouwe informatie verstrekt</li>
                <li>De service alleen voor persoonlijke, niet-commerciële doeleinden gebruikt</li>
                <li>Geen schade toebrengt aan onze systemen of die van derden</li>
                <li>Geen inbreuk maakt op intellectuele eigendomsrechten</li>
                <li>Zich houdt aan alle toepasselijke wet- en regelgeving</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">5. Betaling en prijzen</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>De kosten voor Vinster bedragen €29 voor eenmalige toegang</li>
                <li>Betaling gebeurt vooraf via onze beveiligde betalingspartner</li>
                <li>Prijzen zijn inclusief BTW waar van toepassing</li>
                <li>Na succesvolle betaling krijgt u direct toegang tot de volledige service</li>
                <li>Wij behouden ons het recht voor om prijzen aan te passen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">6. Herroepingsrecht</h2>
              <p>
                Omdat Vinster een digitale service betreft die direct na aankoop volledig beschikbaar is, 
                vervalt uw herroepingsrecht zodra u toegang heeft gekregen tot uw persoonlijke rapport. 
                Dit is in overeenstemming met artikel 6:230p lid 1 van het Burgerlijk Wetboek.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">7. Intellectueel eigendom</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Alle rechten op Vinster berusten bij De Loopbaanopleiding</li>
                <li>Het is niet toegestaan om onze content te kopiëren of te distribueren</li>
                <li>Uw persoonlijke rapport is eigendom van u als gebruiker</li>
                <li>U mag uw rapport delen, maar niet commercieel exploiteren</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">8. Beschikbaarheid en onderhoud</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Wij streven naar 99% beschikbaarheid van onze service</li>
                <li>Onderhoud wordt waar mogelijk buiten kantooruren uitgevoerd</li>
                <li>Wij zijn niet aansprakelijk voor tijdelijke onbeschikbaarheid</li>
                <li>Bij langdurige storing informeren wij gebruikers actief</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">9. Aansprakelijkheid</h2>
              <p>
                Onze aansprakelijkheid is beperkt tot het bedrag dat u heeft betaald voor de service. 
                Wij zijn niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst. 
                Vinster is een hulpmiddel ter ondersteuning van loopbaankeuzes; 
                de uiteindelijke beslissingen blijven uw eigen verantwoordelijkheid.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">10. Opzegging</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>U kunt uw account op elk moment verwijderen</li>
                <li>Wij kunnen accounts opzeggen bij schending van deze voorwaarden</li>
                <li>Bij opzegging vervalt de toegang tot de service</li>
                <li>Uw gegevens worden binnen 30 dagen na opzegging verwijderd</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">11. Wijzigingen</h2>
              <p>
                Wij behouden ons het recht voor om deze voorwaarden te wijzigen. 
                Wijzigingen worden ten minste 30 dagen van tevoren aangekondigd via e-mail. 
                Voortgezet gebruik na de ingangsdatum geldt als acceptatie van de nieuwe voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">12. Toepasselijk recht en geschillen</h2>
              <p>
                Op deze voorwaarden is Nederlands recht van toepassing. 
                Geschillen worden voorgelegd aan de bevoegde rechter in Nederland. 
                Wij streven ernaar om geschillen in der minne op te lossen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">13. Contact</h2>
              <p>
                Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen:
              </p>
              <p>
                Email: info@deloopbaanopleiding.nl<br />
                Telefoon: +31 6 22 23 85 95<br />
                KvK nr: 04050762
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default AlgemeneVoorwaarden;