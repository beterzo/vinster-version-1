
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
    name: "",
    email: "",
    company: "",
    quantity: "5",
    customQuantity: ""
  });

  const pricePerTraject = 29;

  const getQuantity = () => {
    if (formData.quantity === "custom") {
      return parseInt(formData.customQuantity) || 0;
    }
    return parseInt(formData.quantity);
  };

  const getTotalPrice = () => {
    return getQuantity() * pricePerTraject;
  };

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
      quantity: value,
      customQuantity: value === "custom" ? prev.customQuantity : ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company) {
      toast({
        title: "Vul alle velden in",
        description: "Naam, e-mailadres en bedrijf zijn verplicht.",
        variant: "destructive",
      });
      return;
    }

    const quantity = getQuantity();
    if (quantity < 5) {
      toast({
        title: "Minimum aantal trajecten",
        description: "Het minimum aantal trajecten is 5.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Here we will call the webhook that you'll provide
      const webhookData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        quantity: quantity,
        totalPrice: getTotalPrice(),
        pricePerTraject: pricePerTraject
      };

      console.log('Webhook data:', webhookData);
      
      // TODO: Replace with actual webhook URL
      // const response = await fetch('YOUR_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(webhookData),
      // });

      toast({
        title: "Bestelling geregistreerd!",
        description: "We nemen zo snel mogelijk contact met je op.",
      });
      
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
              Koop meerdere trajecten tegelijk en geef uw cliënten direct toegang tot Vinster.
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
              Bestelling plaatsen
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  Naam *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Je naam"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  E-mailadres *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="je@bedrijf.nl"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  Bedrijf *
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Jouw bedrijfsnaam"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  Aantal trajecten *
                </Label>
                <Select value={formData.quantity} onValueChange={handleQuantityChange}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-900 focus:ring-blue-900">
                    <SelectValue placeholder="Selecteer aantal trajecten" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 trajecten</SelectItem>
                    <SelectItem value="10">10 trajecten</SelectItem>
                    <SelectItem value="25">25 trajecten</SelectItem>
                    <SelectItem value="50">50 trajecten</SelectItem>
                    <SelectItem value="custom">Ander aantal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.quantity === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customQuantity" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                    Aantal trajecten (minimum 5)
                  </Label>
                  <Input
                    id="customQuantity"
                    name="customQuantity"
                    type="number"
                    min="5"
                    placeholder="Aantal trajecten"
                    value={formData.customQuantity}
                    onChange={handleInputChange}
                    className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: '#232D4B' }}>
                    Totaalprijs:
                  </span>
                  <span className="text-xl font-bold" style={{ color: '#232D4B' }}>
                    €{getTotalPrice()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getQuantity()} trajecten × €{pricePerTraject}
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Bezig met verzenden..." : "Bestelling plaatsen"}
              </Button>
            </form>
          </div>

          {/* Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
              Wat krijg je?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Toegangscodes</strong> die je direct kunt delen met je cliënten
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
                  <strong>Direct bruikbaar</strong> na betaling
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2" style={{ color: '#232D4B' }}>
                Hoe werkt het?
              </h3>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Vul het formulier in met je gegevens</li>
                <li>2. Kies het aantal trajecten dat je nodig hebt</li>
                <li>3. Plaats je bestelling</li>
                <li>4. Je ontvangt de toegangscodes per email</li>
                <li>5. Deel de codes met je cliënten</li>
              </ol>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vragen? Neem contact op via<br />
                <a href="mailto:info@deloopbaanopleiding.nl" className="text-blue-600 hover:underline">
                  info@deloopbaanopleiding.nl
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ToegangscodesProfessionals;
