import { useState } from "react";
import { ExternalLink, MessageCircle, Trophy, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface CardData {
  titleKey: string;
  subtitleKey: string;
  popupTextKey: string;
  buttonKey: string;
  link: string;
  icon: 'coach' | 'game';
}

const cards: CardData[] = [
  {
    titleKey: "en_nu_verder.coach.title",
    subtitleKey: "en_nu_verder.coach.subtitle",
    popupTextKey: "en_nu_verder.coach.popup_text",
    buttonKey: "en_nu_verder.coach.button",
    link: "https://www.deloopbaanopleiding.nl/register",
    icon: 'coach'
  },
  {
    titleKey: "en_nu_verder.online_game.title",
    subtitleKey: "en_nu_verder.online_game.subtitle",
    popupTextKey: "en_nu_verder.online_game.popup_text",
    buttonKey: "en_nu_verder.online_game.button",
    link: "https://loopbaanspel.nl/",
    icon: 'game'
  }
];

const EnNuVerderSection = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  const getIcon = (type: 'coach' | 'game') => {
    if (type === 'coach') return <MessageCircle className="w-6 h-6 text-[#232D4B]" />;
    return <Trophy className="w-6 h-6 text-[#232D4B]" />;
  };

  return (
    <div className="rounded-2xl p-8 bg-white border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#232D4B] mb-2">
          {t('dashboard.en_nu_verder.title')}
        </h2>
        <p className="text-gray-600">
          {t('dashboard.en_nu_verder.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch pb-8">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="p-6 bg-white rounded-xl cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col"
            onClick={() => setOpenDialog(index)}
          >
            <div className="w-12 h-12 rounded-full bg-[#FEF9E6] flex items-center justify-center mb-4">
              {getIcon(card.icon)}
            </div>
            <h3 className="font-bold text-lg text-[#232D4B] mb-2">
              {t(`dashboard.${card.titleKey}`)}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
              {t(`dashboard.${card.subtitleKey}`)}
            </p>
            <Button
              className="bg-[#232D4B] hover:bg-[#1a2350] text-white rounded-xl h-12 px-4 text-sm font-semibold w-fit gap-1"
              onClick={(e) => { e.stopPropagation(); setOpenDialog(index); }}
            >
              Meer info <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      {cards.map((card, index) => (
        <Dialog key={index} open={openDialog === index} onOpenChange={(open) => setOpenDialog(open ? index : null)}>
          <DialogContent className="sm:max-w-lg p-8">
            {/* Blue accent line */}
            <div className="absolute top-4 left-6 w-16 h-1 rounded-full bg-[#F5C518]" />

            <DialogHeader className="pt-6">
              <DialogTitle className="text-2xl font-bold text-[#232D4B]">
                {t(`dashboard.${card.titleKey}`)}
              </DialogTitle>
            </DialogHeader>
            
            <p className="text-lg text-gray-600 leading-relaxed py-4">
              {t(`dashboard.${card.popupTextKey}`)}
            </p>

            <a 
              href={card.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 bg-[#232D4B] hover:bg-[#1a2350] text-white rounded-xl px-8 py-3 h-12 font-semibold transition-all duration-200 w-full"
            >
              {t(`dashboard.${card.buttonKey}`)}
              <ExternalLink className="w-4 h-4" />
            </a>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default EnNuVerderSection;
