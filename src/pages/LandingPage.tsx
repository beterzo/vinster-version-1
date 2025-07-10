
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import WhatIsVinsterCard from "@/components/WhatIsVinsterCard";
import ProcessSteps from "@/components/ProcessSteps";
import WhatDoYouGetCard from "@/components/WhatDoYouGetCard";
import TestimonialSection from "@/components/TestimonialSection";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import TitleManager from "@/components/TitleManager";
import CookieBanner from "@/components/CookieBanner";

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if this is a password recovery redirect that ended up on the homepage
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Check for recovery indicators in URL
    const isRecoveryFlow = 
      urlParams.get('type') === 'recovery' ||
      hashParams.get('type') === 'recovery' ||
      urlParams.get('recovery') === 'true' ||
      hashParams.get('recovery') === 'true' ||
      window.location.href.includes('recovery') ||
      window.location.href.includes('type=recovery');

    if (isRecoveryFlow) {
      console.log('🔄 FALLBACK: Recovery flow detected on homepage, redirecting to auth callback');
      console.log('🔗 Current URL:', window.location.href);
      console.log('🔗 Search params:', Object.fromEntries(urlParams.entries()));
      console.log('🔗 Hash params:', Object.fromEntries(hashParams.entries()));
      
      // Redirect to auth callback with current URL parameters
      const currentUrl = new URL(window.location.href);
      const callbackUrl = `/auth/callback${currentUrl.search}${currentUrl.hash}`;
      console.log('🔄 Redirecting to:', callbackUrl);
      navigate(callbackUrl);
      return;
    }
  }, [navigate]);

  return (
    <>
      <TitleManager title={t('landing.title')} />
      <div className="min-h-screen bg-white">
        <HeroSection />
        <WhatIsVinsterCard />
        <ProcessSteps />
        <WhatDoYouGetCard />
        <TestimonialSection />
        <FeatureCards />
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
};

export default LandingPage;
