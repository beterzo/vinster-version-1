import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface EditExtraInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSave: () => void;
}

const EditExtraInfoDialog = ({ open, onOpenChange, data, onSave }: EditExtraInfoDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    opleidingsniveau: '',
    beroepsopleiding: '',
    fysieke_beperkingen: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        opleidingsniveau: data.opleidingsniveau || '',
        beroepsopleiding: data.beroepsopleiding || '',
        fysieke_beperkingen: data.fysieke_beperkingen || ''
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('extra_informatie_responses')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Wijzigingen opgeslagen",
        description: "Je extra informatie is bijgewerkt.",
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving extra info data:', error);
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vinster-blue">Extra informatie bewerken</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Opleidingsniveau
            </Label>
            <Select
              value={formData.opleidingsniveau}
              onValueChange={(value) => setFormData(prev => ({ ...prev, opleidingsniveau: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecteer je opleidingsniveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basisonderwijs">Basisonderwijs</SelectItem>
                <SelectItem value="vmbo">VMBO</SelectItem>
                <SelectItem value="havo">HAVO</SelectItem>
                <SelectItem value="vwo">VWO</SelectItem>
                <SelectItem value="mbo">MBO</SelectItem>
                <SelectItem value="hbo">HBO</SelectItem>
                <SelectItem value="wo">WO (Universiteit)</SelectItem>
                <SelectItem value="niet_van_toepassing">Niet van toepassing</SelectItem>
                <SelectItem value="anders">Anders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Beroepsopleiding of specialisatie
            </Label>
            <Textarea
              value={formData.beroepsopleiding}
              onChange={(e) => setFormData(prev => ({ ...prev, beroepsopleiding: e.target.value }))}
              placeholder="Beschrijf je beroepsopleiding, cursussen of specialisaties..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Fysieke beperkingen of speciale behoeften
            </Label>
            <Textarea
              value={formData.fysieke_beperkingen}
              onChange={(e) => setFormData(prev => ({ ...prev, fysieke_beperkingen: e.target.value }))}
              placeholder="Geef eventuele fysieke beperkingen of speciale behoeften aan..."
              className="mt-1"
              rows={3}
            />
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

export default EditExtraInfoDialog;
