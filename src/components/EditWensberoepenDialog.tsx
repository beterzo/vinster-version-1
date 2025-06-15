
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { Loader2, Save, X } from "lucide-react";

interface EditWensberoepenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSave: () => void;
}

const EditWensberoepenDialog = ({ open, onOpenChange, data, onSave }: EditWensberoepenDialogProps) => {
  const { saveResponse, isSaving } = useWensberoepenResponses();
  const [formData, setFormData] = useState({
    wensberoep_1_titel: '',
    wensberoep_1_werkweek_activiteiten: '',
    wensberoep_1_werklocatie_omgeving: '',
    wensberoep_1_binnen_buiten_verhouding: '',
    wensberoep_1_samenwerking_contacten: '',
    wensberoep_1_fluitend_thuiskomen_dag: '',
    wensberoep_1_werk_doel: '',
    wensberoep_1_reistijd: '',
    wensberoep_1_werkuren: '',
    wensberoep_1_werksfeer: '',
    wensberoep_1_leukste_onderdelen: '',
    wensberoep_1_belangrijke_aspecten: '',
    wensberoep_1_kennis_focus: '',
    wensberoep_2_titel: '',
    wensberoep_2_werkweek_activiteiten: '',
    wensberoep_2_werklocatie_omgeving: '',
    wensberoep_2_binnen_buiten_verhouding: '',
    wensberoep_2_samenwerking_contacten: '',
    wensberoep_2_fluitend_thuiskomen_dag: '',
    wensberoep_2_werk_doel: '',
    wensberoep_2_reistijd: '',
    wensberoep_2_werkuren: '',
    wensberoep_2_werksfeer: '',
    wensberoep_2_leukste_onderdelen: '',
    wensberoep_2_belangrijke_aspecten: '',
    wensberoep_2_kennis_focus: '',
    wensberoep_3_titel: '',
    wensberoep_3_werkweek_activiteiten: '',
    wensberoep_3_werklocatie_omgeving: '',
    wensberoep_3_binnen_buiten_verhouding: '',
    wensberoep_3_samenwerking_contacten: '',
    wensberoep_3_fluitend_thuiskomen_dag: '',
    wensberoep_3_werk_doel: '',
    wensberoep_3_reistijd: '',
    wensberoep_3_werkuren: '',
    wensberoep_3_werksfeer: '',
    wensberoep_3_leukste_onderdelen: '',
    wensberoep_3_belangrijke_aspecten: '',
    wensberoep_3_kennis_focus: '',
  });

  useEffect(() => {
    if (data && open) {
      setFormData({
        wensberoep_1_titel: data.wensberoep_1_titel || '',
        wensberoep_1_werkweek_activiteiten: data.wensberoep_1_werkweek_activiteiten || '',
        wensberoep_1_werklocatie_omgeving: data.wensberoep_1_werklocatie_omgeving || '',
        wensberoep_1_binnen_buiten_verhouding: data.wensberoep_1_binnen_buiten_verhouding || '',
        wensberoep_1_samenwerking_contacten: data.wensberoep_1_samenwerking_contacten || '',
        wensberoep_1_fluitend_thuiskomen_dag: data.wensberoep_1_fluitend_thuiskomen_dag || '',
        wensberoep_1_werk_doel: data.wensberoep_1_werk_doel || '',
        wensberoep_1_reistijd: data.wensberoep_1_reistijd || '',
        wensberoep_1_werkuren: data.wensberoep_1_werkuren || '',
        wensberoep_1_werksfeer: data.wensberoep_1_werksfeer || '',
        wensberoep_1_leukste_onderdelen: data.wensberoep_1_leukste_onderdelen || '',
        wensberoep_1_belangrijke_aspecten: data.wensberoep_1_belangrijke_aspecten || '',
        wensberoep_1_kennis_focus: data.wensberoep_1_kennis_focus || '',
        wensberoep_2_titel: data.wensberoep_2_titel || '',
        wensberoep_2_werkweek_activiteiten: data.wensberoep_2_werkweek_activiteiten || '',
        wensberoep_2_werklocatie_omgeving: data.wensberoep_2_werklocatie_omgeving || '',
        wensberoep_2_binnen_buiten_verhouding: data.wensberoep_2_binnen_buiten_verhouding || '',
        wensberoep_2_samenwerking_contacten: data.wensberoep_2_samenwerking_contacten || '',
        wensberoep_2_fluitend_thuiskomen_dag: data.wensberoep_2_fluitend_thuiskomen_dag || '',
        wensberoep_2_werk_doel: data.wensberoep_2_werk_doel || '',
        wensberoep_2_reistijd: data.wensberoep_2_reistijd || '',
        wensberoep_2_werkuren: data.wensberoep_2_werkuren || '',
        wensberoep_2_werksfeer: data.wensberoep_2_werksfeer || '',
        wensberoep_2_leukste_onderdelen: data.wensberoep_2_leukste_onderdelen || '',
        wensberoep_2_belangrijke_aspecten: data.wensberoep_2_belangrijke_aspecten || '',
        wensberoep_2_kennis_focus: data.wensberoep_2_kennis_focus || '',
        wensberoep_3_titel: data.wensberoep_3_titel || '',
        wensberoep_3_werkweek_activiteiten: data.wensberoep_3_werkweek_activiteiten || '',
        wensberoep_3_werklocatie_omgeving: data.wensberoep_3_werklocatie_omgeving || '',
        wensberoep_3_binnen_buiten_verhouding: data.wensberoep_3_binnen_buiten_verhouding || '',
        wensberoep_3_samenwerking_contacten: data.wensberoep_3_samenwerking_contacten || '',
        wensberoep_3_fluitend_thuiskomen_dag: data.wensberoep_3_fluitend_thuiskomen_dag || '',
        wensberoep_3_werk_doel: data.wensberoep_3_werk_doel || '',
        wensberoep_3_reistijd: data.wensberoep_3_reistijd || '',
        wensberoep_3_werkuren: data.wensberoep_3_werkuren || '',
        wensberoep_3_werksfeer: data.wensberoep_3_werksfeer || '',
        wensberoep_3_leukste_onderdelen: data.wensberoep_3_leukste_onderdelen || '',
        wensberoep_3_belangrijke_aspecten: data.wensberoep_3_belangrijke_aspecten || '',
        wensberoep_3_kennis_focus: data.wensberoep_3_kennis_focus || '',
      });
    }
  }, [data, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Save all fields
      for (const [field, value] of Object.entries(formData)) {
        if (value !== (data?.[field] || '')) {
          await saveResponse(field as any, value);
        }
      }
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving wensberoepen:', error);
    }
  };

  const renderWensberoepFields = (num: number) => {
    const prefix = `wensberoep_${num}`;
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${prefix}_titel`}>Titel van het beroep</Label>
          <Input
            id={`${prefix}_titel`}
            value={formData[`${prefix}_titel` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_titel`, e.target.value)}
            placeholder="Bijv. Marketing Manager"
          />
        </div>
        
        <div>
          <Label htmlFor={`${prefix}_werkweek_activiteiten`}>Werkweek activiteiten</Label>
          <Textarea
            id={`${prefix}_werkweek_activiteiten`}
            value={formData[`${prefix}_werkweek_activiteiten` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_werkweek_activiteiten`, e.target.value)}
            placeholder="Beschrijf de dagelijkse activiteiten..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor={`${prefix}_werklocatie_omgeving`}>Werklocatie en omgeving</Label>
          <Textarea
            id={`${prefix}_werklocatie_omgeving`}
            value={formData[`${prefix}_werklocatie_omgeving` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_werklocatie_omgeving`, e.target.value)}
            placeholder="Beschrijf de werklocatie..."
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor={`${prefix}_binnen_buiten_verhouding`}>Binnen/buiten verhouding</Label>
          <Input
            id={`${prefix}_binnen_buiten_verhouding`}
            value={formData[`${prefix}_binnen_buiten_verhouding` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_binnen_buiten_verhouding`, e.target.value)}
            placeholder="Bijv. 80% binnen, 20% buiten"
          />
        </div>

        <div>
          <Label htmlFor={`${prefix}_samenwerking_contacten`}>Samenwerking en contacten</Label>
          <Textarea
            id={`${prefix}_samenwerking_contacten`}
            value={formData[`${prefix}_samenwerking_contacten` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_samenwerking_contacten`, e.target.value)}
            placeholder="Met wie werk je samen..."
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor={`${prefix}_werkuren`}>Werkuren</Label>
          <Input
            id={`${prefix}_werkuren`}
            value={formData[`${prefix}_werkuren` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_werkuren`, e.target.value)}
            placeholder="Bijv. 40 uur per week"
          />
        </div>

        <div>
          <Label htmlFor={`${prefix}_reistijd`}>Reistijd</Label>
          <Input
            id={`${prefix}_reistijd`}
            value={formData[`${prefix}_reistijd` as keyof typeof formData]}
            onChange={(e) => handleInputChange(`${prefix}_reistijd`, e.target.value)}
            placeholder="Bijv. 30 minuten enkele reis"
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bewerk wensberoepen</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="wensberoep-1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wensberoep-1">Wensberoep 1</TabsTrigger>
            <TabsTrigger value="wensberoep-2">Wensberoep 2</TabsTrigger>
            <TabsTrigger value="wensberoep-3">Wensberoep 3</TabsTrigger>
          </TabsList>

          <TabsContent value="wensberoep-1" className="mt-6">
            {renderWensberoepFields(1)}
          </TabsContent>

          <TabsContent value="wensberoep-2" className="mt-6">
            {renderWensberoepFields(2)}
          </TabsContent>

          <TabsContent value="wensberoep-3" className="mt-6">
            {renderWensberoepFields(3)}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Annuleren
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWensberoepenDialog;
