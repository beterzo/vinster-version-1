
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressStepProps {
  title: string;
  description: string;
  progress: number;
  isCompleted?: boolean;
  icon?: React.ReactNode;
}

const ProgressStep = ({ title, description, progress, isCompleted = false, icon }: ProgressStepProps) => {
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {isCompleted ? 'Voltooid' : `${progress}% voltooid`}
              </span>
              {isCompleted && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✓ Klaar
                </span>
              )}
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              style={{
                backgroundColor: '#f3f4f6'
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressStep;
