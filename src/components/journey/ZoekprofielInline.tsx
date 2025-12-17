import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, ArrowLeft, ArrowRight, FileText, Printer } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useZoekprofielResponses } from "@/hooks/useZoekprofielResponses";
import { toast } from "sonner";
import ZoekprofielViewer from "@/components/ZoekprofielViewer";

interface ZoekprofielInlineProps {
  roundId: string;
  subStep: 'intro' | 'step1' | 'complete';
  onNext: () => void;
  onPrevious: () => void;
}

interface ZoekprofielContent {
  functie_zin: string;
  kerntaken_zin: string;
  sector_zin: string;
  organisatie_zin: string;
  regio_zin: string;
  voorwaarden_zin: string;
  samenvatting: string;
}

const ZoekprofielInline = ({ roundId, subStep, onNext, onPrevious }: ZoekprofielInlineProps) => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { responses, saveResponse, submitToWebhook, loading: responsesLoading } = useZoekprofielResponses(roundId);
  const [zoekprofielExists, setZoekprofielExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [zoekprofielContent, setZoekprofielContent] = useState<ZoekprofielContent | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const checkZoekprofiel = async () => {
      if (!user) return;
      
      // Fetch user name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData) {
        setUserName(`${profileData.first_name} ${profileData.last_name}`);
      }

      // Check for existing zoekprofiel with content for this specific round
      const { data } = await supabase
        .from('user_zoekprofielen')
        .select('*')
        .eq('user_id', user.id)
        .eq('round_id', roundId)
        .maybeSingle();
      
      if (data?.zoekprofiel_content) {
        setZoekprofielExists(true);
        setZoekprofielContent(data.zoekprofiel_content as unknown as ZoekprofielContent);
      }
      setLoading(false);
    };

    checkZoekprofiel();
  }, [user]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitToWebhook(language, roundId);
      if (result && result.zoekprofiel_content) {
        setZoekprofielContent(result.zoekprofiel_content);
        setZoekprofielExists(true);
        
        // Mark round as completed after zoekprofiel is generated
        await supabase
          .from('user_rounds')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', roundId);
        
        toast.success(t('journey.zoekprofiel.antwoorden.submit_success'));
        onNext();
      } else if (result === false) {
        // Error already handled in hook
      }
    } catch (error) {
      console.error('Error submitting zoekprofiel:', error);
      toast.error(t('journey.zoekprofiel.antwoorden.submit_error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || responsesLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B]" />
      </div>
    );
  }

  // Intro page
  if (subStep === 'intro') {
    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12 text-center">
          <Search className="w-16 h-16 text-[#232D4B] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#232D4B] mb-4">
            {t('journey.zoekprofiel.intro.title')}
          </h1>
          <div className="max-w-2xl mx-auto space-y-4 text-gray-600 mb-8">
            <p>{t('journey.zoekprofiel.intro.description')}</p>
            <p>{t('journey.zoekprofiel.intro.description_details')}</p>
            <p className="text-sm">{t('journey.zoekprofiel.intro.duration')}</p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="font-semibold px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('journey.zoekprofiel.intro.back_button')}
            </Button>
            <Button 
              onClick={onNext}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8"
            >
              {t('journey.zoekprofiel.intro.start_button')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Questions page (step1)
  if (subStep === 'step1') {
    const questions = [
      { key: 'functie_als', label: t('journey.zoekprofiel.antwoorden.question1') },
      { key: 'kerntaken', label: t('journey.zoekprofiel.antwoorden.question2') },
      { key: 'organisatie_bij', label: t('journey.zoekprofiel.antwoorden.question3') },
      { key: 'sector', label: t('journey.zoekprofiel.antwoorden.question4') },
      { key: 'gewenste_regio', label: t('journey.zoekprofiel.antwoorden.question5') },
      { key: 'arbeidsvoorwaarden', label: t('journey.zoekprofiel.antwoorden.question6') },
    ];

    const allFieldsFilled = questions.every(q => {
      const value = responses?.[q.key as keyof typeof responses];
      return value && String(value).trim().length > 0;
    });

    return (
      <Card className="rounded-3xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B] mb-2">
              {t('journey.zoekprofiel.antwoorden.title')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('journey.zoekprofiel.antwoorden.subtitle')}
            </p>

            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.key}>
                  <Label className="text-[#232D4B] font-medium mb-2 block">
                    {question.label}
                  </Label>
                  <Textarea
                    value={responses?.[question.key as keyof typeof responses] as string || ''}
                    onChange={(e) => saveResponse(question.key, e.target.value)}
                    placeholder={t('journey.zoekprofiel.antwoorden.placeholder')}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-10">
              <Button 
                onClick={onPrevious}
                variant="outline"
                className="font-semibold px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('journey.zoekprofiel.antwoorden.back_button')}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!allFieldsFilled || submitting}
                className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('journey.zoekprofiel.antwoorden.submitting')}
                  </>
                ) : (
                  <>
                    {t('journey.zoekprofiel.antwoorden.generate_button')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Complete page - show zoekprofiel result with viewer
  if (zoekprofielContent) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h2 className="text-2xl font-bold text-[#232D4B]">
            {t('journey.zoekprofiel.complete.title')}
          </h2>
          <div className="flex gap-3">
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="font-semibold"
            >
              <Printer className="w-4 h-4 mr-2" />
              {t('journey.zoekprofiel.complete.print_button')}
            </Button>
          </div>
        </div>

        <ZoekprofielViewer content={zoekprofielContent} userName={userName} />

        <div className="bg-[#E8F4FD] rounded-2xl p-6 text-center print:hidden">
          <p className="text-[#232D4B] mb-4">
            {t('journey.zoekprofiel.complete.next_steps')}
          </p>
          <Button 
            onClick={() => window.location.href = '/home'}
            className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8"
          >
            {t('journey.zoekprofiel.complete.to_dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  // Fallback if no content yet
  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-8 md:p-12 text-center">
        <div className="w-16 h-16 bg-[#E8F4FD] rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-[#232D4B]" />
        </div>
        <h1 className="text-3xl font-bold text-[#232D4B] mb-4">
          {t('journey.zoekprofiel.complete.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('journey.zoekprofiel.complete.generating')}
        </p>
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B] mx-auto" />
      </CardContent>
    </Card>
  );
};

export default ZoekprofielInline;
