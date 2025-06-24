
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const Ervaringen = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      quote: "Ik had nooit gedacht dat een paar vragen zo'n duidelijk beeld zouden geven van mijn ideale werk. Vinster heeft me geholpen ontdekken wat ik echt wil!"
    },
    {
      quote: "Na jaren van twijfelen over mijn carrière, gaf Vinster me eindelijk de richting die ik zocht. Helder, praktisch en heel herkenbaar."
    },
    {
      quote: "De suggesties die ik kreeg waren verrassend accuraat. Het voelde alsof iemand echt naar mij had geluisterd en begreep wat ik zoek in werk."
    },
    {
      quote: "Vinster heeft me niet alleen geholpen met functies vinden, maar ook met begrijpen waarom bepaald werk bij mij past. Dat inzicht is onbetaalbaar."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Ervaringen
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Ontdek hoe Vinster anderen heeft geholpen bij het vinden van werk waar ze blij van worden.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <blockquote className="text-lg md:text-xl leading-relaxed text-gray-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Klaar om jouw ideale werk te ontdekken?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Begin vandaag nog met je loopbaanverkenning en ontdek welke mogelijkheden er voor jou zijn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              Start nu
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ervaringen;
