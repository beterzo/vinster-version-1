
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const ToegangscodesProfessionals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    quantity: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      quantity: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.quantity) {
      toast({
        title: "Vul alle velden in",
        description: "E-mailadres en aantal kortingscodes zijn verplicht.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://hook.eu2.make.com/t82267kxgdplyqkpejofmt4fi1jnbyy9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          quantity: parseInt(formData.quantity),
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast({
          title: "Aanvraag verzonden!",
          description: "We nemen zo snel mogelijk contact met je op voor de betaling en levering van je kortingscodes.",
        });
        setFormData({ email: "", quantity: "" });
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      toast({
        title: "Fout bij verzenden",
        description: "Er is iets misgegaan. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/208c47cf-042c-4499-94c1-33708e0f5639.png" 
            />
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-vinster-blue border-vinster-blue hover:bg-vinster-blue hover:text-white"
            >
              Terug naar Home
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ color: '#232D4B' }}>
              Toegangscodes voor professionals
            </h1>
            <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: '#232D4B' }}>
              Als professional, coach of adviseur kunt u toegangscodes aanschaffen voor uw cliënten. 
              Vul onderstaand formulier in om kortingscodes aan te vragen.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
              Kortingscodes bestellen
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  E-mailadres *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="je@email.nl"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  Aantal kortingscodes *
                </Label>
                <Select value={formData.quantity} onValueChange={handleQuantityChange}>
                  <SelectTrigger className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900">
                    <SelectValue placeholder="Selecteer aantal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 kortingscodes</SelectItem>
                    <SelectItem value="10">10 kortingscodes</SelectItem>
                    <SelectItem value="25">25 kortingscodes</SelectItem>
                    <SelectItem value="50">50 kortingscodes</SelectItem>
                    <SelectItem value="100">100 kortingscodes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: '#232D4B' }}>
                  Prijsinformatie
                </h3>
                <p className="text-sm text-gray-700">
                  €29 per kortingscode<br />
                  Na uw aanvraag nemen we contact op voor betaling en levering
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Bezig met verzenden..." : "Kortingscodes aanvragen"}
              </Button>
            </form>
          </div>

          {/* Information Section */}
          <div className="space-y-8">
            {/* What You Get */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
                Wat krijg je?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>Kortingscodes</strong> die je direct kunt delen met je cliënten
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>Volledige toegang</strong> tot alle Vinster trajecten per code
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>Eenvoudig beheer</strong> van gebruikte en ongebruikte codes
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    <strong>Persoonlijke begeleiding</strong> bij de levering
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
                Hoe werkt het?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-700">
                    Vul het formulier in met je email en gewenste aantal
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-700">
                    We nemen binnen 24 uur contact met je op
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-700">
                    Betaling via beveiligde betaallink
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-gray-700">
                    Ontvang de kortingscodes direct na betaling
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <p className="text-gray-700">
                    Deel de codes met je cliënten
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vragen? Neem contact op via<br />
                  <a href="mailto:team@vinster.ai" className="text-blue-600 hover:underline">
                    team@vinster.ai
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ToegangscodesProfessionals;
