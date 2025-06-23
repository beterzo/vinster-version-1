
import { Card } from "@/components/ui/card";

const ImportantInfoCard = () => {
  return (
    <Card className="p-6 border-0 rounded-3xl text-white flex flex-col text-left" style={{ backgroundColor: '#78BFE3' }}>
      <h3 className="font-bold text-xl mb-4">Belangrijk om te weten</h3>
      <ul className="space-y-4 text-sm flex-1 flex flex-col justify-between">
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
          <span>Er zijn geen goede of foute antwoorden - wees eerlijk over wat jij echt leuk vindt</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
          <span>Denk aan concrete situaties en ervaringen uit jouw leven</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
          <span>Je kunt je antwoorden altijd aanpassen tijdens het traject</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
          <span>Je voortgang wordt automatisch opgeslagen</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
          <span>Na het invullen van beide interviews wordt automatisch een persoonlijk rapport gegenereerd</span>
        </li>
      </ul>
    </Card>
  );
};

export default ImportantInfoCard;
