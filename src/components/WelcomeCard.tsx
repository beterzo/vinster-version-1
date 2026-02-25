import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const WelcomeCard = () => {
  return (
    <Card className="p-6 border border-[#e5e7eb] rounded-xl shadow-card">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-[#232D4B]" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg text-vinster-blue mb-3">
            Welkom bij Vinster!
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Begin met de enthousiasmescan om erachter te komen wat je echt drijft. 
            Dit vormt de basis voor het vinden van je ideale loopbaan.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
