
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const Ervaringen = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      quote: "Ik had nooit gedacht dat een paar vragen zo'n duidelijk beeld zouden geven van mijn ideale werk. Vinster heeft me geholpen ontdekken wat ik echt wil!",
      backgroundImage: "/lovable-uploads/3e3e3d08-b7d5-4902-aa28-370ce017308e.png",
      backgroundPosition: "center 20%"
    },
    {
      quote: "Na jaren van twijfelen over mijn carrière, gaf Vinster me eindelijk de richting die ik zocht. Helder, praktisch en heel herkenbaar.",
      backgroundImage: "/lovable-uploads/47b4682a-5bf7-40d3-9098-b43fc177af6e.png",
      backgroundPosition: "right center"
    },
    {
      quote: "De suggesties die ik kreeg waren verrassend accuraat. Het voelde alsof iemand echt naar mij had geluisterd en begreep wat ik zoek in werk.",
      backgroundImage: "/lovable-uploads/23b63bc5-3895-4312-ad2b-36f3e48adb5a.png",
      backgroundPosition: "left 30%"
    },
    {
      quote: "Vinster heeft me niet alleen geholpen met functies vinden, maar ook met begrijpen waarom bepaald werk bij mij past. Dat inzicht is onbetaalbaar.",
      backgroundImage: "/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png",
      backgroundPosition: "center 40%"
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Ervaringen
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Ontdek hoe Vinster anderen heeft geholpen bij het vinden van werk waar ze blij van worden.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]" style={{
              backgroundImage: `url('${testimonial.backgroundImage}')`,
              backgroundSize: '130%',
              backgroundPosition: testimonial.backgroundPosition,
              backgroundRepeat: 'no-repeat'
            }}>
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="relative z-10 px-12 py-16 flex items-center min-h-[300px]">
                {/* Text positioned alternating left/right */}
                <div className={`max-w-lg ${index % 2 === 0 ? 'ml-0' : 'ml-auto'}`}>
                  <blockquote className="text-2xl md:text-3xl font-bold leading-tight" style={{
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
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
