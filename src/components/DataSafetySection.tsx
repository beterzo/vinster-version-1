
import { Card } from "@/components/ui/card";
import { Shield, Clock } from "lucide-react";

const DataSafetySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Data Safety Card */}
          <Card className="p-6 lg:p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">100% Veilig & GDPR-compliant</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Jouw gegevens zijn volledig veilig en GDPR-compliant. We gebruiken AI-modellen om je persoonlijke 
                  inzichten te genereren, maar jouw gegevens worden nooit opgeslagen door deze modellen. 
                  Alles blijft privé en vertrouwelijk bij jou.
                </p>
              </div>
            </div>
          </Card>

          {/* Flexible Journey Card */}
          <Card className="p-6 lg:p-8 border-0 rounded-3xl" style={{ backgroundColor: '#FEF3C7' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">Eén keer door, alle tijd die je nodig hebt</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Je doorloopt het programma één keer, maar je kunt zo lang je wilt nadenken tussen de stappen. 
                  Neem alle tijd die je nodig hebt om over de vragen na te denken - jouw data blijft altijd toegankelijk 
                  wanneer je terugkomt. Geen tijdsdruk, geen vervaldatum.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DataSafetySection;
