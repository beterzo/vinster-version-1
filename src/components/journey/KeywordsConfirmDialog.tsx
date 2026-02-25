import { useState } from "react";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface KeywordsConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  onAdjust: () => void;
}

const KeywordsConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  onAdjust 
}: KeywordsConfirmDialogProps) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConfirm = async () => {
    setIsGenerating(true);
    try {
      await onConfirm();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518]/20">
            <Sparkles className="h-7 w-7 text-[#232D4B]" />
          </div>
          <DialogTitle className="text-2xl font-bold text-[#232D4B]">
            {t('journey.keywords_confirm.title')}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-4 text-left space-y-4">
            <p>{t('journey.keywords_confirm.description')}</p>
            
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                {t('journey.keywords_confirm.warning')}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onAdjust}
            disabled={isGenerating}
            className="flex-1 border-[#232D4B] text-[#232D4B] hover:bg-[rgba(26,46,90,0.05)]"
          >
            {t('journey.keywords_confirm.adjust_button')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isGenerating}
            className="flex-1 bg-[#1a2e5a] hover:bg-[#142347] text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('journey.keywords_confirm.generating')}
              </>
            ) : (
              t('journey.keywords_confirm.confirm_button')
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordsConfirmDialog;
