import { useState } from "react";
import { ExternalLink } from "lucide-react";
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
}

const cards: CardData[] = [
  {
    titleKey: "en_nu_verder.coach.title",
    subtitleKey: "en_nu_verder.coach.subtitle",
    popupTextKey: "en_nu_verder.coach.popup_text",
    buttonKey: "en_nu_verder.coach.button",
    link: "https://www.deloopbaanopleiding.nl/register"
  },
  {
    titleKey: "en_nu_verder.online_game.title",
    subtitleKey: "en_nu_verder.online_game.subtitle",
    popupTextKey: "en_nu_verder.online_game.popup_text",
    buttonKey: "en_nu_verder.online_game.button",
    link: "https://loopbaanspel.nl/"
  },
  {
    titleKey: "en_nu_verder.physical_game.title",
    subtitleKey: "en_nu_verder.physical_game.subtitle",
    popupTextKey: "en_nu_verder.physical_game.popup_text",
    buttonKey: "en_nu_verder.physical_game.button",
    link: "https://www.thema.nl/spel-loopbaanspel/"
  }
];

const EnNuVerderSection = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  return (
    <div className="rounded-3xl p-8" style={{ backgroundColor: '#E6F0F6' }}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-vinster-blue mb-2">
          {t('dashboard.en_nu_verder.title')}
        </h2>
        <p className="text-gray-600">
          {t('dashboard.en_nu_verder.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="p-6 bg-white rounded-2xl cursor-pointer hover:shadow-lg transition-shadow duration-200 border-0"
            onClick={() => setOpenDialog(index)}
          >
            <div className="mb-4">
              <img 
                src="/lovable-uploads/loopbaan-logo.png" 
                alt="Loopbaan logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="font-bold text-lg text-vinster-blue mb-2">
              {t(`dashboard.${card.titleKey}`)}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t(`dashboard.${card.subtitleKey}`)}
            </p>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      {cards.map((card, index) => (
        <Dialog key={index} open={openDialog === index} onOpenChange={(open) => setOpenDialog(open ? index : null)}>
          <DialogContent className="sm:max-w-lg p-8">
            {/* Teal accent line */}
            <div className="absolute top-4 left-6 w-16 h-1 rounded-full" style={{ backgroundColor: '#5DBFB3' }} />
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-12 flex flex-col gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E5B84F' }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#5DBFB3' }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#232D4B' }} />
            </div>

            <DialogHeader className="pt-6">
              <DialogTitle className="text-2xl font-bold text-vinster-blue">
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
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 rounded-full px-8 py-4 font-semibold transition-all duration-200 w-full"
              style={{ color: '#232D4B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#232D4B';
                e.currentTarget.style.borderColor = '#232D4B';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#232D4B';
              }}
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
