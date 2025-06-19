
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReadyToStartCard = () => {
  const handleViewSampleReport = () => {
    window.open('/sample-report.pdf', '_blank');
  };

  const scrollToProcess = () => {
    const processSection = document.getElementById('het-proces');
    if (processSection) {
      processSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card className="text-white p-6 md:p-8 rounded-3xl border-0 relative overflow-hidden h-full flex flex-col justify-center" style={{
      backgroundColor: '#4A6B8A'
    }}>
      <div className="space-y-6 text-center">
        <p className="text-xl md:text-2xl font-bold" style={{ color: '#FFCD3E' }}>
          Doe werk waar je blij van wordt.
        </p>
        
        <div className="flex flex-col gap-4 pt-4">
          <Button 
            onClick={handleViewSampleReport}
            className="bg-white hover:bg-gray-100 text-blue-900 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full"
          >
            Bekijk voorbeeldrapport
          </Button>
          <Button 
            onClick={scrollToProcess}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full"
          >
            Hoe het werkt
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReadyToStartCard;
