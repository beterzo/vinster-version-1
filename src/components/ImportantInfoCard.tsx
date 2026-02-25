import { Lightbulb, CheckCircle } from "lucide-react";

const ImportantInfoCard = () => {
  const items = [
    "Er zijn geen goede of foute antwoorden - wees eerlijk over wat jij echt leuk vindt",
    "Je kunt maximaal tien keer door het traject",
    "Alle informatie wordt vertrouwelijk behandeld",
    "Denk aan concrete situaties en ervaringen uit jouw leven",
    "Het is juist goed om de antwoorden en gedachten te laten bezinken voordat je verdergaat",
    "Alle voortgang wordt automatisch opgeslagen"
  ];

  return (
    <div className="bg-[#FEF9E6] border-l-4 border-[#F5C518] rounded-r-2xl p-6 flex gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-9 h-9 rounded-full bg-[#F5C518]/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-[#92400E]" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-[#232D4B] text-base mb-3">Goed om te weten</h3>
        <ul className="space-y-2.5 text-sm text-gray-700 leading-relaxed">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#F5C518] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImportantInfoCard;
