import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStepAccess } from "@/hooks/useStepAccess";
import { useExistingReport } from "@/hooks/useExistingReport";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMakeWebhookData } from "@/hooks/useMakeWebhookData";
import { sendMakeWebhook } from "@/services/webhookService";

const RapportGenererenConfirmatie = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const stepAccess = useStepAccess();
  const { hasExistingReport, loading: reportLoading } = useExistingReport();
  const { collectMakeWebhookData } = useMakeWebhookData();
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if user has access to this page
  useEffect(() => {
    if (!stepAccess.isLoading) {
      // Redirect if persoonsprofiel not completed
      if (!stepAccess.persoonsprofiel.isCompleted) {
        toast({
          title: t('common.toast.generic_error'),
          description: "Je moet eerst alle voorgaande stappen voltooien.",
          variant: "destructive",
        });
        navigate('/home');
      }
    }
  }, [stepAccess.isLoading, stepAccess.persoonsprofiel.isCompleted, navigate, toast, t]);

  // Redirect if report already exists
  useEffect(() => {
    if (!reportLoading && hasExistingReport) {
      toast({
        title: t('common.toast.report_already_generated'),
        description: t('common.toast.report_already_generated_description'),
      });
      navigate('/rapport-download');
    }
  }, [reportLoading, hasExistingReport, navigate, toast, t]);

  const handleGenerateReport = async () => {
    if (!user) {
      toast({
        title: t('common.toast.no_user_found'),
        description: t('common.toast.no_user_found_description'),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log('🚀 Starting report generation for user:', user.id);

      // 1. Create report record in database
      const { data: reportData, error: reportError } = await supabase
        .from('user_reports')
        .upsert({
          user_id: user.id,
          report_data: {},
          report_status: 'generating',
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (reportError) {
        console.error('❌ Error creating report record:', reportError);
        throw reportError;
      }

      console.log('✅ Report record created:', reportData);

      // 2. Collect webhook data
      const webhookData = collectMakeWebhookData();
      if (!webhookData) {
        console.error('❌ No webhook data available');
        throw new Error('No webhook data available');
      }

      console.log('📦 Webhook data collected, sending to Make.com...');

      // 3. Send webhook to Make.com
      await sendMakeWebhook(webhookData);
      
      console.log('✅ Webhook sent successfully');

      toast({
        title: t('common.rapport_confirmatie.generating'),
        description: t('common.rapport_confirmatie.please_wait'),
      });

      // 4. Navigate to download page
      navigate('/rapport-download');

    } catch (error) {
      console.error('❌ Error generating report:', error);

      // Update report status to failed
      if (user) {
        await supabase
          .from('user_reports')
          .update({
            report_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      toast({
        title: t('common.toast.generate_error'),
        description: t('common.toast.generate_error_description'),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (stepAccess.isLoading || reportLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-blue-900">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Logo Header */}
        <div className="mb-12 text-center">
          <img 
            src="/lovable-uploads/e35e2329-dbcb-46a6-a616-711bf30bfe4f.png" 
            alt="Vinster Logo" 
            className="h-20 mx-auto"
          />
        </div>

        {/* Main Card */}
        <Card className="rounded-3xl shadow-xl border-0">
          <CardContent className="p-12">
            {/* Title */}
            <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
              {t('common.rapport_confirmatie.title')}
            </h1>
            <p className="text-lg text-gray-700 mb-8 text-center">
              {t('common.rapport_confirmatie.subtitle')}
            </p>

            {/* Warning Box */}
            <div className="mb-8 border-2 border-orange-400 bg-orange-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-orange-900 mb-2">
                    {t('common.rapport_confirmatie.warning_title')}
                  </h2>
                  <p className="text-orange-800 leading-relaxed">
                    {t('common.rapport_confirmatie.warning_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
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

            {/* Info Text */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">
                {t('common.rapport_confirmatie.info_text')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={isGenerating}
                className="text-lg px-8 py-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t('common.rapport_confirmatie.back_button')}
              </Button>
              <Button
                size="lg"
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="text-lg px-8 py-6 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900 mr-2"></div>
                    {t('common.rapport_confirmatie.generating')}
                  </>
                ) : (
                  t('common.rapport_confirmatie.confirm_button')
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RapportGenererenConfirmatie;
