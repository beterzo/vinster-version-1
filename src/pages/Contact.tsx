
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import Footer from "@/components/Footer";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Vul alle velden in",
        description: "Naam, e-mailadres en vraag zijn verplicht.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Bericht verzonden!",
          description: "We nemen zo snel mogelijk contact met je op.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Failed to send message');
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
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" 
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

      {/* Hero Section with Image */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6" style={{ color: '#232D4B' }}>
                Contact
              </h1>
              <p className="text-lg mb-6" style={{ color: '#232D4B' }}>
                Heb je vragen over Vinster of wil je meer informatie? 
                We helpen je graag verder! Stuur ons een bericht en we nemen zo snel mogelijk contact met je op.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/07fedc05-be13-4802-99e6-48bb9fb976e7.png"
                alt="Vriendelijk contactteam"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
              Stuur ons een bericht
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
                  placeholder="je@email.nl"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 px-4 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium" style={{ color: '#232D4B' }}>
                  Vraag *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Stel hier je vraag..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="min-h-[120px] px-4 py-3 border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Bezig met verzenden..." : "Verstuur bericht"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#232D4B' }}>
              Contactgegevens
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 mt-1" style={{ color: '#232D4B' }} />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#232D4B' }}>
                    E-mail
                  </h3>
                  <a 
                    href="mailto:team@vinster.ai"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    team@vinster.ai
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2" style={{ color: '#232D4B' }}>
                  Bedrijfsgegevens
                </h3>
                <p className="text-gray-700">
                  KvK nr. 04050762
                </p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  We proberen binnen 24 uur te reageren op je bericht. 
                  Voor vragen kun je ons ook een e-mail sturen.
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

export default Contact;
