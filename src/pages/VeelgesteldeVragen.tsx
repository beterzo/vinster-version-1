
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const VeelgesteldeVragen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const faqItems = t('faq.questions') as Array<{question: string, answer: string}>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              alt="Vinster Logo" 
              onClick={() => navigate('/')} 
              src="/lovable-uploads/3e114e47-07e4-4807-a2a3-dd02abb93e9c.png" 
              className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200" 
            />
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="text-vinster-blue border-vinster-blue hover:bg-vinster-blue hover:text-white"
              >
                {t('faq.back_to_home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#232D4B' }}>
          {t('faq.page_title')}
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger 
                  onClick={() => toggleItem(index)} 
                  className="flex items-center justify-between w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold" style={{ color: '#232D4B' }}>
                    {item.question}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`} 
                    style={{ color: '#232D4B' }} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-base leading-relaxed" style={{ color: '#232D4B' }}>
                      {item.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VeelgesteldeVragen;
