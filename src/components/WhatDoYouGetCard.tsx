import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const WhatDoYouGetCard = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const handleStartClick = () => {
    navigate('/signup');
  };

  const handleViewSampleReport = () => {
    // Language-specific PDF URLs
    const dutchPdfUrl = 'https://api.pdf4me.com/Document/GetDoc?d=eyJUZW5hbnRJZCI6IjQxNDJiMWY0LWRkYTYtNDE3ZC05ODMwLWYyYTFjZmQ5ZjBiNCIsIkFwaUNhbGxJZCI6ImFjNDcwYTQ3LTVlNjYtNDIzYy04MWU0LWU4MDI5MGZlYzM0MSIsIkpvYklkIjoiYWM0NzBhNDctNWU2Ni00MjNjLTgxZTQtZTgwMjkwZmVjMzQxIiwiRG9jdW1lbnRJZCI6IjZlYjVjODAzLWI4OGEtNGFhMi1hNzFjLWQ2Nzg5NDM1ZTNmZCIsIkZpbGVOYW1lIjoibWVyZ2VkLnBkZiIsIlBhZ2VJZCI6bnVsbH0=';
    const englishPdfUrl = 'https://api.pdf4me.com/Document/GetDoc?d=eyJUZW5hbnRJZCI6IjQxNDJiMWY0LWRkYTYtNDE3ZC05ODMwLWYyYTFjZmQ5ZjBiNCIsIkFwaUNhbGxJZCI6Ijc3NjcxOTViLWNlMzctNGRlMi04NTExLTQ2NzVkNjJjZTI2OCIsIkpvYklkIjoiNzc2NzE5NWItY2UzNy00ZGUyLTg1MTEtNDY3NWQ2MmNlMjY4IiwiRG9jdW1lbnRJZCI6IjQ2YzNhMjM2LTZkODYtNDhiNy04ZDcyLTJkZmIyZGMxZjlmZiIsIkZpbGVOYW1lIjoibWVyZ2VkLnBkZiIsIlBhZ2VJZCI6bnVsbH0=';
    
    // Select URL based on current language, fallback to Dutch
    const pdfUrl = language === 'en' ? englishPdfUrl : dutchPdfUrl;
    
    window.open(pdfUrl, '_blank');
  };

  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full flex flex-col" style={{
      backgroundColor: '#0476B9'
    }}>
      <div className="space-y-6 flex-grow">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left">
          {t('landing.what_do_you_get.title')}
        </h2>
        
        <p className="text-base md:text-lg opacity-95 text-left">
          {t('landing.what_do_you_get.subtitle')}
        </p>
        
        <ul className="space-y-3 text-base md:text-lg opacity-95">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{t('landing.what_do_you_get.insight_interests')}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{t('landing.what_do_you_get.job_suggestions')}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{t('landing.what_do_you_get.research_plan')}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{t('landing.what_do_you_get.search_profile')}</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col gap-3 mt-6">
        <Button 
          onClick={handleStartClick}
          className="bg-white hover:bg-gray-100 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full"
          style={{ color: '#0476B9' }}
        >
          {t('landing.what_do_you_get.start_now')}
        </Button>
        <Button 
          onClick={handleViewSampleReport}
          className="border-2 border-white hover:bg-white hover:bg-opacity-10 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full bg-transparent text-white"
        >
          {t('landing.what_do_you_get.view_sample')}
        </Button>
      </div>
    </Card>
  );
};

export default WhatDoYouGetCard;
