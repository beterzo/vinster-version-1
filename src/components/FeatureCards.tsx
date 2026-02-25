
import WhatIsVinsterCard from "./WhatIsVinsterCard";
import WhatDoYouGetCard from "./WhatDoYouGetCard";

const FeatureCards = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 bg-[#fafaf8]">
      <div className="bg-white rounded-xl shadow-card border border-[#f0f0f0] p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <WhatIsVinsterCard />
          <WhatDoYouGetCard />
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
