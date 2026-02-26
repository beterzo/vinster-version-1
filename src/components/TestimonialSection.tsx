
import { useTranslation } from "@/hooks/useTranslation";

const TestimonialSection = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]" style={{
        backgroundImage: "url('/lovable-uploads/3e3e3d08-b7d5-4902-aa28-370ce017308e.png')",
        backgroundSize: '130%',
        backgroundPosition: 'left 30%',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Lighter overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 px-12 py-16 flex items-center min-h-[300px]">
          <div className="max-w-lg">
            <div className="bg-white/15 backdrop-blur-[4px] border border-white/20 rounded-xl p-8">
              <blockquote className="text-2xl md:text-3xl font-bold leading-tight text-left text-white">
                "{t('landing.testimonial')}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
