
import { Card } from "@/components/ui/card";
import { Shield, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const DataSafetySection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Data Safety Card */}
          <Card className="p-6 lg:p-8 border-0 rounded-3xl" style={{ backgroundColor: '#E6F0F6' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-vinster-blue mb-3">
                  {t('landing.data_safety.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {t('landing.data_safety.description')}
                </p>
              </div>
            </div>
          </Card>

          {/* Flexible Journey Card */}
          <Card className="p-6 lg:p-8 border-0 rounded-3xl" style={{ backgroundColor: '#FEF3C7' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-vinster-blue mb-3">
                  {t('landing.flexible_journey.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {t('landing.flexible_journey.description')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DataSafetySection;
