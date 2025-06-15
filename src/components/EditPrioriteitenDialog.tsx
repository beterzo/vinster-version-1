
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { Loader2, Save, X } from "lucide-react";

interface EditPrioriteitenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSave: () => void;
}

const EditPrioriteitenDialog = ({ open, onOpenChange, data, onSave }: EditPrioriteitenDialogProps) => {
  const { saveResponses, loading, aiKeywords } = usePrioriteitenResponses();
  const [selectedActiviteiten, setSelectedActiviteiten] = useState<string[]>([]);
  const [selectedWerkomstandigheden, setSelectedWerkomstandigheden] = useState<string[]>([]);
  const [selectedInteresses, setSelectedInteresses] = useState<string[]>([]);
  const [extraActiviteitenTekst, setExtraActiviteitenTekst] = useState('');
  const [extraWerkomstandighedenTekst, setExtraWerkomstandighedenTekst] = useState('');
  const [extraInteressesToekst, setExtraInteressesToekst] = useState('');

  useEffect(() => {
    if (data && open) {
      setSelectedActiviteiten(data.selected_activiteiten_keywords || []);
      setSelectedWerkomstandigheden(data.selected_werkomstandigheden_keywords || []);
      setSelectedInteresses(data.selected_interesses_keywords || []);
      setExtraActiviteitenTekst(data.extra_activiteiten_tekst || '');
      setExtraWerkomstandighedenTekst(data.extra_werkomstandigheden_tekst || '');
      setExtraInteressesToekst(data.extra_interesses_tekst || '');
    }
  }, [data, open]);

  const handleKeywordToggle = (keyword: string, type: 'activiteiten' | 'werkomstandigheden' | 'interesses') => {
    if (type === 'activiteiten') {
      setSelectedActiviteiten(prev => 
        prev.includes(keyword) 
          ? prev.filter(k => k !== keyword)
          : [...prev, keyword]
      );
    } else if (type === 'werkomstandigheden') {
      setSelectedWerkomstandigheden(prev => 
        prev.includes(keyword) 
          ? prev.filter(k => k !== keyword)
          : [...prev, keyword]
      );
    } else if (type === 'interesses') {
      setSelectedInteresses(prev => 
        prev.includes(keyword) 
          ? prev.filter(k => k !== keyword)
          : [...prev, keyword]
      );
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        selected_activiteiten_keywords: selectedActiviteiten,
        selected_werkomstandigheden_keywords: selectedWerkomstandigheden,
        selected_interesses_keywords: selectedInteresses,
        extra_activiteiten_tekst: extraActiviteitenTekst,
        extra_werkomstandigheden_tekst: extraWerkomstandighedenTekst,
        extra_interesses_tekst: extraInteressesToekst
      };

      const success = await saveResponses(updateData);
      if (success) {
        onSave();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving prioriteiten:', error);
    }
  };

  const renderKeywordSection = (
    title: string,
    keywords: string[] = [],
    selectedKeywords: string[],
    type: 'activiteiten' | 'werkomstandigheden' | 'interesses',
    extraText: string,
    setExtraText: (text: string) => void
  ) => (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">{title}</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`${type}-${index}`}
                checked={selectedKeywords.includes(keyword)}
                onCheckedChange={() => handleKeywordToggle(keyword, type)}
              />
              <Label htmlFor={`${type}-${index}`} className="text-sm">
                {keyword}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor={`extra-${type}`}>Extra tekst voor {title.toLowerCase()}</Label>
        <Textarea
          id={`extra-${type}`}
          value={extraText}
          onChange={(e) => setExtraText(e.target.value)}
          placeholder={`Voeg extra ${title.toLowerCase()} toe...`}
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bewerk prioriteiten</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="activiteiten" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activiteiten">Activiteiten</TabsTrigger>
            <TabsTrigger value="werkomstandigheden">Werkomstandigheden</TabsTrigger>
            <TabsTrigger value="interesses">Interesses</TabsTrigger>
          </TabsList>

          <TabsContent value="activiteiten" className="mt-6">
            {renderKeywordSection(
              'Activiteiten',
              aiKeywords.activiteiten,
              selectedActiviteiten,
              'activiteiten',
              extraActiviteitenTekst,
              setExtraActiviteitenTekst
            )}
          </TabsContent>

          <TabsContent value="werkomstandigheden" className="mt-6">
            {renderKeywordSection(
              'Werkomstandigheden',
              aiKeywords.werkomstandigheden,
              selectedWerkomstandigheden,
              'werkomstandigheden',
              extraWerkomstandighedenTekst,
              setExtraWerkomstandighedenTekst
            )}
          </TabsContent>

          <TabsContent value="interesses" className="mt-6">
            {renderKeywordSection(
              'Interesses',
              aiKeywords.interesses,
              selectedInteresses,
              'interesses',
              extraInteressesToekst,
              setExtraInteressesToekst
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Annuleren
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-vinster-yellow hover:bg-yellow-600 text-gray-900 font-medium rounded-xl"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrioriteitenDialog;
