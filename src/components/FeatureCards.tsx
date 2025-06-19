
import WhatIsVinsterCard from "./WhatIsVinsterCard";
import WhatDoYouGetCard from "./WhatDoYouGetCard";
import ReadyToStartCard from "./ReadyToStartCard";

const FeatureCards = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <WhatIsVinsterCard />
          <WhatDoYouGetCard />
          <ReadyToStartCard />
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
