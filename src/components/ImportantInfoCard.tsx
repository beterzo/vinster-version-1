import { Lightbulb } from "lucide-react";

const ImportantInfoCard = () => {
  return (
    <div className="bg-[#FEF9E6] border border-yellow-200 rounded-2xl p-6 flex gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-9 h-9 rounded-full bg-[#F5C518]/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-[#92400E]" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-[#232D4B] text-base mb-3">Goed om te weten</h3>
        <ul className="space-y-2.5 text-sm text-gray-700">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full mt-2 flex-shrink-0" />
            <span>Er zijn geen goede of foute antwoorden - wees eerlijk over wat jij echt leuk vindt</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full mt-2 flex-shrink-0" />
            <span>Je kunt maximaal tien keer door het traject</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full mt-2 flex-shrink-0" />
            <span>Alle informatie wordt vertrouwelijk behandeld</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full mt-2 flex-shrink-0" />
            <span>Denk aan concrete situaties en ervaringen uit jouw leven</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full mt-2 flex-shrink-0" />
            <span>Het is juist goed om de antwoorden en gedachten te laten bezinken voordat je verdergaat</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full mt-2 flex-shrink-0" />
            <span>Alle voortgang wordt automatisch opgeslagen</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImportantInfoCard;
