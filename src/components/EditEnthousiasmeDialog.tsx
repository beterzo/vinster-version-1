
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditEnthousiasmeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSave: () => void;
}

const EditEnthousiasmeDialog = ({ open, onOpenChange, data, onSave }: EditEnthousiasmeDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    kindertijd_liefste_activiteiten: '',
    kindertijd_favoriete_plekken: '',
    kindertijd_interesses: '',
    school_interessantste_vakken: '',
    school_thuiskomst_activiteiten: '',
    school_naschoolse_activiteiten: '',
    eerste_werk_leukste_aspecten: '',
    werkomgeving_aantrekkelijke_elementen: '',
    samenwerking_prettige_aspecten: '',
    plezierige_werkperiode_beschrijving: '',
    leuk_project_en_rol: '',
    fluitend_thuiskomen_dag: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        kindertijd_liefste_activiteiten: data.kindertijd_liefste_activiteiten || '',
        kindertijd_favoriete_plekken: data.kindertijd_favoriete_plekken || '',
        kindertijd_interesses: data.kindertijd_interesses || '',
        school_interessantste_vakken: data.school_interessantste_vakken || '',
        school_thuiskomst_activiteiten: data.school_thuiskomst_activiteiten || '',
        school_naschoolse_activiteiten: data.school_naschoolse_activiteiten || '',
        eerste_werk_leukste_aspecten: data.eerste_werk_leukste_aspecten || '',
        werkomgeving_aantrekkelijke_elementen: data.werkomgeving_aantrekkelijke_elementen || '',
        samenwerking_prettige_aspecten: data.samenwerking_prettige_aspecten || '',
        plezierige_werkperiode_beschrijving: data.plezierige_werkperiode_beschrijving || '',
        leuk_project_en_rol: data.leuk_project_en_rol || '',
        fluitend_thuiskomen_dag: data.fluitend_thuiskomen_dag || ''
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('enthousiasme_responses')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Wijzigingen opgeslagen",
        description: "Je enthousiasme-scan antwoorden zijn bijgewerkt.",
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving enthousiasme data:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Enthousiasme-scan bewerken
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Welke dingen deed je het liefst als kind?
                </Label>
                <Textarea
                  value={formData.kindertijd_liefste_activiteiten}
                  onChange={(e) => setFormData(prev => ({ ...prev, kindertijd_liefste_activiteiten: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Waar was je graag?
                </Label>
                <Textarea
                  value={formData.kindertijd_favoriete_plekken}
                  onChange={(e) => setFormData(prev => ({ ...prev, kindertijd_favoriete_plekken: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat interesseerde jou?
                </Label>
                <Textarea
                  value={formData.kindertijd_interesses}
                  onChange={(e) => setFormData(prev => ({ ...prev, kindertijd_interesses: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat interesseerde jou het meest op school?
                </Label>
                <Textarea
                  value={formData.school_interessantste_vakken}
                  onChange={(e) => setFormData(prev => ({ ...prev, school_interessantste_vakken: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat deed je zodra je thuis kwam?
                </Label>
                <Textarea
                  value={formData.school_thuiskomst_activiteiten}
                  onChange={(e) => setFormData(prev => ({ ...prev, school_thuiskomst_activiteiten: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat deed je naast school?
                </Label>
                <Textarea
                  value={formData.school_naschoolse_activiteiten}
                  onChange={(e) => setFormData(prev => ({ ...prev, school_naschoolse_activiteiten: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat vond je het leukst in je werk?
                </Label>
                <Textarea
                  value={formData.eerste_werk_leukste_aspecten}
                  onChange={(e) => setFormData(prev => ({ ...prev, eerste_werk_leukste_aspecten: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat sprak/spreekt je aan in de werkomgeving?
                </Label>
                <Textarea
                  value={formData.werkomgeving_aantrekkelijke_elementen}
                  onChange={(e) => setFormData(prev => ({ ...prev, werkomgeving_aantrekkelijke_elementen: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat vond/vind je fijn in samenwerken?
                </Label>
                <Textarea
                  value={formData.samenwerking_prettige_aspecten}
                  onChange={(e) => setFormData(prev => ({ ...prev, samenwerking_prettige_aspecten: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Aan welke periode denk je met heel veel plezier terug?
                </Label>
                <Textarea
                  value={formData.plezierige_werkperiode_beschrijving}
                  onChange={(e) => setFormData(prev => ({ ...prev, plezierige_werkperiode_beschrijving: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Kun je nog een leuke periode of project noemen?
                </Label>
                <Textarea
                  value={formData.leuk_project_en_rol}
                  onChange={(e) => setFormData(prev => ({ ...prev, leuk_project_en_rol: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wanneer kom jij fluitend thuis?
                </Label>
                <Textarea
                  value={formData.fluitend_thuiskomen_dag}
                  onChange={(e) => setFormData(prev => ({ ...prev, fluitend_thuiskomen_dag: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-xl"
            >
              Annuleren
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
            >
              {saving ? "Opslaan..." : "Wijzigingen opslaan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnthousiasmeDialog;
