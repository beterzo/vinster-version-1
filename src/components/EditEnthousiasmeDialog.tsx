import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface EditEnthousiasmeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSave: () => void;
}

const EditEnthousiasmeDialog = ({ open, onOpenChange, data, onSave }: EditEnthousiasmeDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    kindertijd_activiteiten: '',
    kindertijd_plekken: '',
    kindertijd_interesses_nieuw: '',
    eerste_werk_leukste_taken: '',
    eerste_werk_werkomstandigheden: '',
    eerste_werk_onderwerpen: '',
    plezierige_werkperiode_beschrijving: '',
    leuk_project_en_rol: '',
    fluitend_thuiskomen_dag: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        kindertijd_activiteiten: data.kindertijd_activiteiten || '',
        kindertijd_plekken: data.kindertijd_plekken || '',
        kindertijd_interesses_nieuw: data.kindertijd_interesses_nieuw || '',
        eerste_werk_leukste_taken: data.eerste_werk_leukste_taken || '',
        eerste_werk_werkomstandigheden: data.eerste_werk_werkomstandigheden || '',
        eerste_werk_onderwerpen: data.eerste_werk_onderwerpen || '',
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
        title: t('common.toast.save_error'),
        description: t('common.toast.save_error_description'),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-vinster-blue">Enthousiasme gegevens bewerken</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat deed je graag? (kindertijd & tienertijd)
                </Label>
                <Textarea
                  value={formData.kindertijd_activiteiten}
                  onChange={(e) => setFormData(prev => ({ ...prev, kindertijd_activiteiten: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Waar was je veel te vinden?
                </Label>
                <Textarea
                  value={formData.kindertijd_plekken}
                  onChange={(e) => setFormData(prev => ({ ...prev, kindertijd_plekken: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat interesseerde jou?
                </Label>
                <Textarea
                  value={formData.kindertijd_interesses_nieuw}
                  onChange={(e) => setFormData(prev => ({ ...prev, kindertijd_interesses_nieuw: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat vond/vind je het leukst om te doen? (eerste werk)
                </Label>
                <Textarea
                  value={formData.eerste_werk_leukste_taken}
                  onChange={(e) => setFormData(prev => ({ ...prev, eerste_werk_leukste_taken: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Wat sprak/spreekt je aan in de werkomstandigheden?
                </Label>
                <Textarea
                  value={formData.eerste_werk_werkomstandigheden}
                  onChange={(e) => setFormData(prev => ({ ...prev, eerste_werk_werkomstandigheden: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Onderwerpen waar je je met plezier mee bezig hield/houdt
                </Label>
                <Textarea
                  value={formData.eerste_werk_onderwerpen}
                  onChange={(e) => setFormData(prev => ({ ...prev, eerste_werk_onderwerpen: e.target.value }))}
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
