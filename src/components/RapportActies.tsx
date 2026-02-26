import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Printer, ArrowLeft, Play } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useEnthousiasmeResponses } from "@/hooks/useEnthousiasmeResponses";
import { useWensberoepenResponses } from "@/hooks/useWensberoepenResponses";
import { usePrioriteitenResponses } from "@/hooks/usePrioriteitenResponses";
import { useExtraInformatieResponses } from "@/hooks/useExtraInformatieResponses";

interface RapportActiesProps {
  onPrint: () => void;
  onNewRound?: () => void;
  showNewRoundButton?: boolean;
}

const RapportActies = ({ onPrint, onNewRound, showNewRoundButton = true }: RapportActiesProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { responses: enthousiasmeResponses } = useEnthousiasmeResponses();
  const { responses: wensberoepenResponses } = useWensberoepenResponses();
  const { responses: prioriteitenResponses } = usePrioriteitenResponses();
  const { responses: extraInfoResponses } = useExtraInformatieResponses();

  const enthousiasmeQuestions = [
    { key: 'kindertijd_activiteiten', label: t('dashboard.round_dashboard.actions.questions.childhood_activities') },
    { key: 'kindertijd_interesses_nieuw', label: t('dashboard.round_dashboard.actions.questions.childhood_interests') },
    { key: 'kindertijd_plekken', label: t('dashboard.round_dashboard.actions.questions.childhood_places') },
    { key: 'eerste_werk_leukste_taken', label: t('dashboard.round_dashboard.actions.questions.first_job_tasks') },
    { key: 'eerste_werk_onderwerpen', label: t('dashboard.round_dashboard.actions.questions.first_job_topics') },
    { key: 'eerste_werk_werkomstandigheden', label: t('dashboard.round_dashboard.actions.questions.first_job_conditions') },
    { key: 'plezierige_werkperiode_beschrijving', label: t('dashboard.round_dashboard.actions.questions.pleasant_period') },
    { key: 'leuk_project_en_rol', label: t('dashboard.round_dashboard.actions.questions.nice_project') },
    { key: 'fluitend_thuiskomen_dag', label: t('dashboard.round_dashboard.actions.questions.whistling_home') },
  ];

  return (
    <div className="bg-gray-50 rounded-3xl p-6 mt-8">
      {/* Accordion: Bekijk mijn antwoorden */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="antwoorden" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(35, 45, 75, 0.1)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#232D4B' }} />
              </div>
              <div className="text-left">
                <span className="font-bold text-lg block">{t('dashboard.round_dashboard.actions.view_answers_title')}</span>
                <p className="text-sm text-gray-500">{t('dashboard.round_dashboard.actions.view_answers_subtitle')}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-6">
              {/* Enthousiasme Sectie */}
              <div>
                <h4 className="font-semibold text-[#232D4B] mb-3">{t('dashboard.round_dashboard.step_enthousiasme_title')}</h4>
                <div className="space-y-3">
                  {enthousiasmeQuestions.map((q) => {
                    const value = enthousiasmeResponses?.[q.key as keyof typeof enthousiasmeResponses];
                    return (
                      <div key={q.key} className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">{q.label}</p>
                        <p className="text-gray-900">{value || '-'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wensberoepen Sectie */}
              {wensberoepenResponses && (
                <div>
                  <h4 className="font-semibold text-[#232D4B] mb-3">{t('dashboard.round_dashboard.step_wensberoepen_title')}</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((num) => {
                      const titel = wensberoepenResponses[`wensberoep_${num}_titel` as keyof typeof wensberoepenResponses];
                      if (!titel) return null;
                      return (
                        <div key={num} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="font-medium text-[#232D4B] mb-2">{t('dashboard.round_dashboard.actions.dream_job')} {num}: {titel}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prioriteiten Sectie */}
              {prioriteitenResponses && (
                <div>
                  <h4 className="font-semibold text-[#232D4B] mb-3">{t('dashboard.round_dashboard.step_persoonsprofiel_title')}</h4>
                  <div className="space-y-3">
                    {prioriteitenResponses.selected_activiteiten_keywords?.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">{t('dashboard.round_dashboard.actions.selected_activities')}</p>
                        <div className="flex flex-wrap gap-2">
                          {prioriteitenResponses.selected_activiteiten_keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#fffbeb', color: '#232D4B' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {prioriteitenResponses.selected_werkomstandigheden_keywords?.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">{t('dashboard.round_dashboard.actions.selected_conditions')}</p>
                        <div className="flex flex-wrap gap-2">
                          {prioriteitenResponses.selected_werkomstandigheden_keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#fffbeb', color: '#232D4B' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {prioriteitenResponses.selected_interesses_keywords?.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">{t('dashboard.round_dashboard.actions.selected_interests')}</p>
                        <div className="flex flex-wrap gap-2">
                          {prioriteitenResponses.selected_interesses_keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#fffbeb', color: '#232D4B' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extra Info Sectie */}
              {extraInfoResponses && (
                <div>
                  <h4 className="font-semibold text-[#232D4B] mb-3">{t('dashboard.round_dashboard.actions.extra_info')}</h4>
                  <div className="space-y-3">
                    {extraInfoResponses.opleidingsniveau && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.round_dashboard.actions.education_level')}</p>
                        <p className="text-gray-900">{extraInfoResponses.opleidingsniveau}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Horizontale lijn */}
      <Separator className="my-6" />

      {/* Actieknoppen */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={onPrint} 
          className="border-[#232D4B] text-[#232D4B] hover:bg-[#232D4B] hover:text-white"
        >
          <Printer className="w-4 h-4 mr-2" />
          {t('dashboard.round_dashboard.actions.print_button')}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/home')} 
          className="border-[#232D4B] text-[#232D4B] hover:bg-[#232D4B] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('dashboard.round_dashboard.actions.back_to_dashboard')}
        </Button>
        {showNewRoundButton && onNewRound && (
          <Button 
            onClick={onNewRound} 
            className="bg-[#232D4B] text-white hover:bg-[#232D4B]/90"
          >
            <Play className="w-4 h-4 mr-2" />
            {t('dashboard.round_dashboard.actions.start_new_game')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RapportActies;