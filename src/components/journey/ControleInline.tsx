import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ControleInlineProps {
  roundId: string;
  onNext: () => void;
  onPrevious: () => void;
  onReportGenerated: () => void;
}

const ControleInline = ({ roundId, onNext, onPrevious, onReportGenerated }: ControleInlineProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!user) {
      toast({
        title: t('common.toast.no_user_found'),
        description: t('common.toast.no_user_found_description'),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🚀 Starting AI report generation for user:', user.id, 'round:', roundId);

      const { data, error } = await supabase.functions.invoke('generate-career-report', {
        body: {
          user_id: user.id,
          round_id: roundId,
          language: user.user_metadata?.language || 'nl'
        }
      });

      if (error) {
        console.error('❌ Error calling edge function:', error);
        throw error;
      }

      console.log('✅ Report generated successfully:', data);

      // Update round status to completed
      const { error: roundError } = await supabase
        .from('user_rounds')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', roundId);

      if (roundError) {
        console.error('❌ Error updating round status:', roundError);
      }

      toast({
        title: t('common.rapport_confirmatie.generating'),
        description: t('common.rapport_confirmatie.please_wait')
      });

      onReportGenerated();
      onNext();
    } catch (error) {
      console.error('❌ Error generating report:', error);
      toast({
        title: t('common.toast.generate_error'),
        description: t('common.toast.generate_error_description'),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-12">
        <h1 className="text-4xl font-bold text-[#232D4B] mb-4 text-center">
          {t('common.rapport_confirmatie.title')}
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          {t('common.rapport_confirmatie.subtitle')}
        </p>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#232D4B] mb-4">
            {t('common.rapport_confirmatie.summary_title')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="text-lg">
                <strong>{t('common.rapport_confirmatie.summary_enthousiasme')}</strong>: {t('common.rapport_confirmatie.completed')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="text-lg">
                <strong>{t('common.rapport_confirmatie.summary_wensberoepen')}</strong>: {t('common.rapport_confirmatie.completed')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="text-lg">
                <strong>{t('common.rapport_confirmatie.summary_prioriteiten')}</strong>: {t('common.rapport_confirmatie.completed')}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-xl">
          <p className="text-gray-700 leading-relaxed">
            {t('common.rapport_confirmatie.info_text')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onPrevious} 
            disabled={isGenerating} 
            className="text-lg px-8 py-6 border-[#232D4B] text-[#232D4B]"
          >
            {t('common.button.previous')}
          </Button>
          <Button 
            size="lg" 
            onClick={handleGenerateReport} 
            disabled={isGenerating} 
            className="text-lg px-8 py-6 bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-bold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('common.rapport_confirmatie.generating')}
              </>
            ) : (
              t('common.rapport_confirmatie.confirm_button')
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControleInline;
