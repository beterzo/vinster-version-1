import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, Download, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ZoekprofielDialog from "@/components/ZoekprofielDialog";

interface ZoekprofielInlineProps {
  roundId: string;
  subStep: 'intro' | 'complete';
  onComplete: () => void;
}

const ZoekprofielInline = ({ roundId, subStep, onComplete }: ZoekprofielInlineProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [zoekprofielExists, setZoekprofielExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const checkZoekprofiel = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_zoekprofielen')
        .select('id')
        .eq('user_id', user.id)
        .eq('pdf_status', 'completed')
        .maybeSingle();
      
      setZoekprofielExists(!!data);
      setLoading(false);
    };

    checkZoekprofiel();
  }, [user]);

  const handleZoekprofielComplete = () => {
    setZoekprofielExists(true);
    setDialogOpen(false);
    onComplete();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#232D4B]" />
      </div>
    );
  }

  // Intro / Start page
  if (subStep === 'intro' && !zoekprofielExists) {
    return (
      <>
        <Card className="rounded-3xl shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-[#232D4B] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#232D4B] mb-4">
              {t('dashboard.round_dashboard.content.zoekprofiel_start')}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('dashboard.round_dashboard.content.zoekprofiel_start_description')}
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold text-lg px-12 py-4 rounded-lg"
            >
              {t('dashboard.round_dashboard.content.start_zoekprofiel_button')}
            </Button>
          </CardContent>
        </Card>
        
        <ZoekprofielDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
          onComplete={handleZoekprofielComplete}
        />
      </>
    );
  }

  // Completed state
  return (
    <Card className="rounded-3xl shadow-xl border-0">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#232D4B] mb-4">
          {t('dashboard.round_dashboard.content.zoekprofiel_ready')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('dashboard.round_dashboard.content.zoekprofiel_ready_description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.open('/zoekprofiel-download', '_blank')}
            className="bg-[#232D4B] hover:bg-[#1a2238] text-white font-semibold px-8"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('dashboard.round_dashboard.content.download_button')}
          </Button>
          <Button 
            onClick={onComplete}
            className="bg-[#F5C518] hover:bg-yellow-500 text-[#232D4B] font-semibold px-8"
          >
            {t('journey.finish_button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoekprofielInline;
