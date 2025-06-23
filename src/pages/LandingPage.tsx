
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import ProcessSteps from "@/components/ProcessSteps";
import DataSafetySection from "@/components/DataSafetySection";
import TestimonialSection from "@/components/TestimonialSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <HeroSection />

      {/* Two Cards Section - Wrapped in White Container */}
      <FeatureCards />

      {/* Luxury Process Steps Section */}
      <ProcessSteps />

      {/* Data Safety & Flexible Journey Section */}
      <DataSafetySection />

      {/* Testimonial Section as Block on Page */}
      <TestimonialSection />
    </div>
  );
};

export default LandingPage;
