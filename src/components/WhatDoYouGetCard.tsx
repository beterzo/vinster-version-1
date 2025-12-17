
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const WhatDoYouGetCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStartClick = () => {
    navigate('/signup');
  };

  // Get translation strings with safety checks
  const title = String(t('landing.what_do_you_get.title') || '');
  const subtitle = String(t('landing.what_do_you_get.subtitle') || '');
  const insightInterests = String(t('landing.what_do_you_get.insight_interests') || '');
  const jobSuggestions = String(t('landing.what_do_you_get.job_suggestions') || '');
  const researchPlan = String(t('landing.what_do_you_get.research_plan') || '');
  const searchProfile = String(t('landing.what_do_you_get.search_profile') || '');
  const startNow = String(t('landing.what_do_you_get.start_now') || '');
  const viewSample = String(t('landing.what_do_you_get.view_sample') || '');

  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full flex flex-col" style={{
      backgroundColor: '#0476B9'
    }}>
      <div className="space-y-6 flex-grow">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-left">
          {title}
        </h2>
        
        <p className="text-base md:text-lg opacity-95 text-left">
          {subtitle}
        </p>
        
        <ul className="space-y-3 text-base md:text-lg opacity-95">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{insightInterests}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{jobSuggestions}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{researchPlan}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" style={{
              color: '#FFCD3E'
            }} />
            <span className="text-left">{searchProfile}</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col gap-3 mt-6">
        <Button 
          onClick={handleStartClick}
          className="bg-white hover:bg-gray-100 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full"
          style={{ color: '#0476B9' }}
        >
          {startNow}
        </Button>
        <Button 
          asChild
          className="border-2 border-white hover:bg-white hover:bg-opacity-10 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full bg-transparent text-white"
        >
          <Link to="/voorbeeldrapport">
            {viewSample}
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default WhatDoYouGetCard;
