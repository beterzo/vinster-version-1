import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { Loader2, Save, X } from "lucide-react";
import { WensberoepenForm } from "./wensberoepen/WensberoepenForm";

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
    wensberoep_1_samenwerking_contacten: '',
    wensberoep_1_fluitend_thuiskomen_dag: '',
    wensberoep_1_werk_doel: '',
    wensberoep_1_leukste_onderdelen: '',
    wensberoep_1_belangrijke_aspecten: '',
    wensberoep_1_kennis_focus: '',
    wensberoep_2_titel: '',
    wensberoep_2_werkweek_activiteiten: '',
    wensberoep_2_werklocatie_omgeving: '',
    wensberoep_2_samenwerking_contacten: '',
    wensberoep_2_fluitend_thuiskomen_dag: '',
    wensberoep_2_werk_doel: '',
    wensberoep_2_leukste_onderdelen: '',
    wensberoep_2_belangrijke_aspecten: '',
    wensberoep_2_kennis_focus: '',
    wensberoep_3_titel: '',
    wensberoep_3_werkweek_activiteiten: '',
    wensberoep_3_werklocatie_omgeving: '',
    wensberoep_3_samenwerking_contacten: '',
    wensberoep_3_fluitend_thuiskomen_dag: '',
    wensberoep_3_werk_doel: '',
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
        wensberoep_1_samenwerking_contacten: data.wensberoep_1_samenwerking_contacten || '',
        wensberoep_1_fluitend_thuiskomen_dag: data.wensberoep_1_fluitend_thuiskomen_dag || '',
        wensberoep_1_werk_doel: data.wensberoep_1_werk_doel || '',
        wensberoep_1_leukste_onderdelen: data.wensberoep_1_leukste_onderdelen || '',
        wensberoep_1_belangrijke_aspecten: data.wensberoep_1_belangrijke_aspecten || '',
        wensberoep_1_kennis_focus: data.wensberoep_1_kennis_focus || '',
        wensberoep_2_titel: data.wensberoep_2_titel || '',
        wensberoep_2_werkweek_activiteiten: data.wensberoep_2_werkweek_activiteiten || '',
        wensberoep_2_werklocatie_omgeving: data.wensberoep_2_werklocatie_omgeving || '',
        wensberoep_2_samenwerking_contacten: data.wensberoep_2_samenwerking_contacten || '',
        wensberoep_2_fluitend_thuiskomen_dag: data.wensberoep_2_fluitend_thuiskomen_dag || '',
        wensberoep_2_werk_doel: data.wensberoep_2_werk_doel || '',
        wensberoep_2_leukste_onderdelen: data.wensberoep_2_leukste_onderdelen || '',
        wensberoep_2_belangrijke_aspecten: data.wensberoep_2_belangrijke_aspecten || '',
        wensberoep_2_kennis_focus: data.wensberoep_2_kennis_focus || '',
        wensberoep_3_titel: data.wensberoep_3_titel || '',
        wensberoep_3_werkweek_activiteiten: data.wensberoep_3_werkweek_activiteiten || '',
        wensberoep_3_werklocatie_omgeving: data.wensberoep_3_werklocatie_omgeving || '',
        wensberoep_3_samenwerking_contacten: data.wensberoep_3_samenwerking_contacten || '',
        wensberoep_3_fluitend_thuiskomen_dag: data.wensberoep_3_fluitend_thuiskomen_dag || '',
        wensberoep_3_werk_doel: data.wensberoep_3_werk_doel || '',
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <WensberoepenForm
              prefix="wensberoep_1"
              formData={formData}
              onFieldChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="wensberoep-2" className="mt-6">
            <WensberoepenForm
              prefix="wensberoep_2"
              formData={formData}
              onFieldChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="wensberoep-3" className="mt-6">
            <WensberoepenForm
              prefix="wensberoep_3"
              formData={formData}
              onFieldChange={handleInputChange}
            />
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
            type="submit" 
            disabled={isSaving}
            className="bg-yellow-400 hover:bg-yellow-500 text-vinster-blue"
          >
            {isSaving ? "Opslaan..." : "Opslaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWensberoepenDialog;
