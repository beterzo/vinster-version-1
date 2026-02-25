
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const VoorWieIsHet = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const targetGroups = [
    {
      title: t('for_whom.target_groups.next_step.title'),
      description: t('for_whom.target_groups.next_step.description')
    },
    {
      title: t('for_whom.target_groups.stuck.title'),
      description: t('for_whom.target_groups.stuck.description')
    },
    {
      title: t('for_whom.target_groups.coaches.title'),
      description: t('for_whom.target_groups.coaches.description')
    },
    {
      title: t('for_whom.target_groups.parents.title'),
      description: t('for_whom.target_groups.parents.description')
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                alt="Vinster Logo" 
                onClick={() => navigate('/')} 
                src="/lovable-uploads/3bf8603d-9a08-411e-9eba-08ac95564c64.png" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              />
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)] font-semibold"
              >
                {t('for_whom.back_to_home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
            {t('for_whom.page_title')}
          </h1>
          
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              {t('for_whom.intro')}
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 flex justify-center">
            <img 
              src="/lovable-uploads/634341b7-07f8-4cc2-8ba1-b54650117aae.png" 
              alt="Professionele man in pak die lacht in een moderne kantooromgeving" 
              className="rounded-xl shadow-lg max-w-full h-auto max-h-96 object-cover" 
            />
          </div>

          {/* Target Groups */}
          <div className="grid gap-8 md:gap-6">
            {targetGroups.map((group, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    {group.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {group.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="h-12 px-8 border-[#1a2e5a] text-[#1a2e5a] hover:bg-[rgba(26,46,90,0.05)] font-semibold"
            >
              {t('for_whom.back_to_home')}
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            >
              {t('for_whom.start_button')}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VoorWieIsHet;
