import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";

const ExtraInformatieVragen = () => {
  const navigate = useNavigate();
  const { responses, saving, saveResponses } = useExtraInformatieResponses();
  
  const [formData, setFormData] = useState({
    opleidingsniveau: '',
    beroepsopleiding: '',
    fysieke_beperkingen: '',
    sector_voorkeur: ''
  });

  // Sync local state with loaded responses
  useEffect(() => {
    if (responses) {
      setFormData({
        opleidingsniveau: responses.opleidingsniveau || '',
        beroepsopleiding: responses.beroepsopleiding || '',
        fysieke_beperkingen: responses.fysieke_beperkingen || '',
        sector_voorkeur: responses.sector_voorkeur || ''
      });
    }
  }, [responses]);

  const handleSave = async () => {
    const success = await saveResponses(formData);
    if (success) {
      navigate("/prioriteiten-activiteiten");
    }
  };

  // Updated validation - only opleidingsniveau is required
  const isFormValid = formData.opleidingsniveau !== '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <h1 className="text-xl font-bold text-blue-900">Vinster</h1>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nog iets meer over jou</h1>
          <p className="text-xl text-gray-700">
            Voor je prioriteiten gaat stellen hebben we nog vier vragen voor je
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Extra informatie
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              Prioriteiten stellen
            </span>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 mb-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
          <div className="space-y-8">
            {/* Question 1: Opleidingsniveau - Updated with "Niet van toepassing" option */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                1. Wat is jouw opleidingsniveau?
              </h3>
              <RadioGroup 
                value={formData.opleidingsniveau} 
                onValueChange={(value) => setFormData({...formData, opleidingsniveau: value})}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mbo" id="mbo" />
                  <Label htmlFor="mbo" className="text-lg">Mbo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hbo" id="hbo" />
                  <Label htmlFor="hbo" className="text-lg">Hbo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wo" id="wo" />
                  <Label htmlFor="wo" className="text-lg">Wo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="niet_van_toepassing" id="niet_van_toepassing" />
                  <Label htmlFor="niet_van_toepassing" className="text-lg">Niet van toepassing</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 2: Beroepsopleiding - Now optional */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                2. Welke beroepsopleiding heb je afgerond?
              </h3>
              <Textarea
                placeholder="Bijv. Marketing & Communicatie, Verpleegkunde, Werktuigbouwkunde... (optioneel)"
                value={formData.beroepsopleiding}
                onChange={(e) => setFormData({...formData, beroepsopleiding: e.target.value})}
                className="min-h-[100px] text-lg"
              />
            </div>

            {/* Question 3: Fysieke beperkingen - Updated with (fysieke) in parentheses */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                3. Zijn er (fysieke) beperkingen waar we rekening mee moeten houden?
              </h3>
              <Textarea
                placeholder="Bijv. kan niet lang staan, heeft moeite met tillen, is slechtziend... (optioneel)"
                value={formData.fysieke_beperkingen}
                onChange={(e) => setFormData({...formData, fysieke_beperkingen: e.target.value})}
                className="min-h-[100px] text-lg"
              />
            </div>

            {/* Question 4: Sector voorkeur - Updated question text */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                4. Wil je binnen een bepaalde sector zoeken?
              </h3>
              <p className="text-gray-600 mb-4">
                Je kunt dan bijvoorbeeld denken aan de bouw, defensie of de zorg. Als je dat aangeeft, 
                dan geven we je mogelijkheden binnen die sector.
              </p>
              <Textarea
                placeholder="Bijv. zorg, onderwijs, techniek, bouw, defensie, overheid... (optioneel)"
                value={formData.sector_voorkeur}
                onChange={(e) => setFormData({...formData, sector_voorkeur: e.target.value})}
                className="min-h-[100px] text-lg"
              />
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => navigate("/profiel-voltooien-intro")} 
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!isFormValid || saving}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50" 
            size="lg"
          >
            {saving ? (
              <>
                <Save className="w-5 h-5 mr-2 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                Doorgaan naar prioriteiten
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {!isFormValid && (
          <p className="text-red-600 text-center mt-4">
            Vul je opleidingsniveau in om door te gaan.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExtraInformatieVragen;
