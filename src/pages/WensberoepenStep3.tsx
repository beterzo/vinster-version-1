
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import WensberoepenProgress from "@/components/WensberoepenProgress";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";

const WensberoepenStep3 = () => {
  const navigate = useNavigate();
  const { getFieldValue, saveResponse, isLoading } = useWensberoepenResponses();
  
  const [jobTitle, setJobTitle] = useState("");
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
    question11: "",
    question12: ""
  });

  // Load saved data when component mounts
  useEffect(() => {
    if (!isLoading) {
      setJobTitle(getFieldValue("wensberoep_3_titel"));
      setAnswers({
        question1: getFieldValue("wensberoep_3_werkweek_activiteiten"),
        question2: getFieldValue("wensberoep_3_werklocatie_omgeving"),
        question3: getFieldValue("wensberoep_3_binnen_buiten_verhouding"),
        question4: getFieldValue("wensberoep_3_samenwerking_contacten"),
        question5: getFieldValue("wensberoep_3_fluitend_thuiskomen_dag"),
        question6: getFieldValue("wensberoep_3_werk_doel"),
        question7: getFieldValue("wensberoep_3_reistijd"),
        question8: getFieldValue("wensberoep_3_werkuren"),
        question9: getFieldValue("wensberoep_3_werksfeer"),
        question10: getFieldValue("wensberoep_3_leukste_onderdelen"),
        question11: getFieldValue("wensberoep_3_belangrijke_aspecten"),
        question12: getFieldValue("wensberoep_3_kennis_focus")
      });
    }
  }, [isLoading, getFieldValue]);

  const handleJobTitleChange = (value: string) => {
    setJobTitle(value);
  };

  const handleJobTitleBlur = () => {
    saveResponse("wensberoep_3_titel", jobTitle);
  };

  const handleInputChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field: string, value: string) => {
    const fieldMap: { [key: string]: keyof any } = {
      question1: "wensberoep_3_werkweek_activiteiten",
      question2: "wensberoep_3_werklocatie_omgeving",
      question3: "wensberoep_3_binnen_buiten_verhouding",
      question4: "wensberoep_3_samenwerking_contacten",
      question5: "wensberoep_3_fluitend_thuiskomen_dag",
      question6: "wensberoep_3_werk_doel",
      question7: "wensberoep_3_reistijd",
      question8: "wensberoep_3_werkuren",
      question9: "wensberoep_3_werksfeer",
      question10: "wensberoep_3_leukste_onderdelen",
      question11: "wensberoep_3_belangrijke_aspecten",
      question12: "wensberoep_3_kennis_focus"
    };
    
    const dbField = fieldMap[field];
    if (dbField) {
      saveResponse(dbField, value);
    }
  };

  const handleComplete = () => {
    console.log("Wensberoepen scan completed!");
    alert("Wensberoepen scan afgerond!");
    navigate('/home');
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const questions = [
    "Wat doe je in een werkweek? Antwoord in werkwoorden en activiteiten.",
    "Waar doe je je werk? Beschrijf de omgeving, het gebouw, de ruimte ....",
    "Hoe is de verhouding binnen-buiten (op pad zijn)?",
    "Werk je meer samen of meer alleen? Met wat voor mensen heb je contact?",
    "Wat heb je gedaan op een dag dat je fluitend thuiskomt?",
    "Wat is je doel met dit werk?",
    "Hoeveel reistijd heb je?",
    "Hoeveel uren werk je?",
    "Hoe is de sfeer op je werk?",
    "Welke onderdelen uit je werk zijn het leukst?",
    "Wat is voor jou belangrijk in dit werk?",
    "Waar gaat het vooral over in jouw werk? Waar moet je veel van weten?"
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <WensberoepenProgress currentStep={3} totalSteps={3} />
        
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Wensberoep 3
              </h1>
              <p className="text-xl text-gray-600">
                Wat zou jij wel een poosje, of zelfs altijd, willen doen?
              </p>
            </div>

            {/* Job Title Input */}
            <div className="mb-8">
              <Label htmlFor="jobTitle" className="text-blue-900 font-medium text-lg mb-3 block">
                Naam van het beroep
              </Label>
              <Input
                id="jobTitle"
                placeholder="Vul hier de naam van je wensberoep in..."
                value={jobTitle}
                onChange={(e) => handleJobTitleChange(e.target.value)}
                onBlur={handleJobTitleBlur}
                className="text-lg border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index}>
                  <Label htmlFor={`question${index + 1}`} className="text-blue-900 font-medium mb-3 block">
                    {index + 1}. {question}
                  </Label>
                  <Textarea
                    id={`question${index + 1}`}
                    placeholder="Beschrijf hier je antwoord..."
                    value={answers[`question${index + 1}` as keyof typeof answers]}
                    onChange={(e) => handleInputChange(`question${index + 1}`, e.target.value)}
                    onBlur={(e) => handleInputBlur(`question${index + 1}`, e.target.value)}
                    className="min-h-[80px] border-gray-300 focus:border-blue-900 focus:ring-blue-900"
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-12">
              <Button 
                onClick={() => navigate('/wensberoepen-stap-2')}
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Vorige wensberoep
              </Button>
              <Button 
                onClick={handleComplete}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8"
              >
                Afronden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WensberoepenStep3;
