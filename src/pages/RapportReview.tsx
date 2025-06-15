
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Edit, FileText, Heart, Target, Info, Activity } from "lucide-react";
import { useRapportData } from "@/hooks/useRapportData";
import { useRapportGeneration } from "@/hooks/useRapportGeneration";
import EditEnthousiasmeDialog from "@/components/EditEnthousiasmeDialog";
import EditExtraInfoDialog from "@/components/EditExtraInfoDialog";

const RapportReview = () => {
  const navigate = useNavigate();
  const { data, loading, refreshData } = useRapportData();
  const { generateReport, generating } = useRapportGeneration();

  const [editEnthousiasmeOpen, setEditEnthousiasmeOpen] = useState(false);
  const [editExtraInfoOpen, setEditExtraInfoOpen] = useState(false);

  const handleGenerateReport = async () => {
    const success = await generateReport(data);
    if (success) {
      navigate("/rapport-download");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Gegevens laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" 
            alt="Vinster Logo" 
            className="h-8 w-auto mb-6" 
          />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Controleer je antwoorden</h1>
          </div>
          <p className="text-lg text-gray-700">
            Bekijk hier al je antwoorden nog een keer. Je kunt ze aanpassen voordat je rapport wordt gegenereerd.
          </p>
        </div>

        <div className="space-y-6">
          {/* Enthousiasme-scan sectie */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Enthousiasme-scan</h2>
              </div>
              <Button
                onClick={() => setEditEnthousiasmeOpen(true)}
                variant="outline"
                className="gap-2 rounded-xl"
                disabled={!data.enthousiasme}
              >
                <Edit className="w-4 h-4" />
                Bewerk
              </Button>
            </div>
            
            {data.enthousiasme ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Kindertijd activiteiten:</strong> {data.enthousiasme.kindertijd_liefste_activiteiten?.substring(0, 100)}...</p>
                  <p><strong>Favoriete plekken:</strong> {data.enthousiasme.kindertijd_favoriete_plekken?.substring(0, 100)}...</p>
                  <p><strong>Interesses:</strong> {data.enthousiasme.kindertijd_interesses?.substring(0, 100)}...</p>
                </div>
                <div className="space-y-2">
                  <p><strong>School vakken:</strong> {data.enthousiasme.school_interessantste_vakken?.substring(0, 100)}...</p>
                  <p><strong>Werk aspecten:</strong> {data.enthousiasme.eerste_werk_leukste_aspecten?.substring(0, 100)}...</p>
                  <p><strong>Werkomgeving:</strong> {data.enthousiasme.werkomgeving_aantrekkelijke_elementen?.substring(0, 100)}...</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nog geen enthousiasme-scan ingevuld</p>
            )}
          </Card>

          {/* Wensberoepen sectie */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Wensberoepen</h2>
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                disabled={!data.wensberoepen}
              >
                <Edit className="w-4 h-4" />
                Bewerk
              </Button>
            </div>
            
            {data.wensberoepen ? (
              <div className="space-y-4">
                {[1, 2, 3].map((num) => {
                  const titel = data.wensberoepen[`wensberoep_${num}_titel`];
                  if (!titel) return null;
                  
                  return (
                    <div key={num} className="border-l-4 border-blue-400 pl-4">
                      <h3 className="font-semibold text-gray-900">{num}. {titel}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {data.wensberoepen[`wensberoep_${num}_werkweek_activiteiten`]?.substring(0, 150)}...
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Nog geen wensberoepen ingevuld</p>
            )}
          </Card>

          {/* Extra informatie sectie */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Extra informatie</h2>
              </div>
              <Button
                onClick={() => setEditExtraInfoOpen(true)}
                variant="outline"
                className="gap-2 rounded-xl"
                disabled={!data.extraInformatie}
              >
                <Edit className="w-4 h-4" />
                Bewerk
              </Button>
            </div>
            
            {data.extraInformatie ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Opleidingsniveau:</strong> {data.extraInformatie.opleidingsniveau}</p>
                  <p><strong>Beroepsopleiding:</strong> {data.extraInformatie.beroepsopleiding?.substring(0, 100)}...</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Fysieke beperkingen:</strong> {data.extraInformatie.fysieke_beperkingen?.substring(0, 100) || 'Geen'}</p>
                  <p><strong>Sector voorkeur:</strong> {data.extraInformatie.sector_voorkeur?.substring(0, 100) || 'Geen voorkeur'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nog geen extra informatie ingevuld</p>
            )}
          </Card>

          {/* Prioriteiten sectie */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Prioriteiten</h2>
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                disabled={!data.prioriteiten}
              >
                <Edit className="w-4 h-4" />
                Bewerk
              </Button>
            </div>
            
            {data.prioriteiten ? (
              <div className="space-y-4">
                {data.prioriteiten.selected_activiteiten_keywords && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Geselecteerde activiteiten:</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.prioriteiten.selected_activiteiten_keywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {data.prioriteiten.selected_werkomstandigheden_keywords && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Geselecteerde werkomstandigheden:</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.prioriteiten.selected_werkomstandigheden_keywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.prioriteiten.selected_interesses_keywords && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Geselecteerde interesses:</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.prioriteiten.selected_interesses_keywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Nog geen prioriteiten ingevuld</p>
            )}
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => navigate("/home")}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Button>
          
          <Button
            onClick={handleGenerateReport}
            disabled={generating || !data.enthousiasme || !data.wensberoepen}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
            size="lg"
          >
            {generating ? "Rapport genereren..." : "Genereer mijn rapport"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Edit Dialogs */}
        <EditEnthousiasmeDialog
          open={editEnthousiasmeOpen}
          onOpenChange={setEditEnthousiasmeOpen}
          data={data.enthousiasme}
          onSave={refreshData}
        />

        <EditExtraInfoDialog
          open={editExtraInfoOpen}
          onOpenChange={setEditExtraInfoOpen}
          data={data.extraInformatie}
          onSave={refreshData}
        />
      </div>
    </div>
  );
};

export default RapportReview;
