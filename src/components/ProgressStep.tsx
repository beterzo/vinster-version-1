
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
interface ProgressStepProps {
  title: string;
  description?: string;
  progress: number;
  isCompleted?: boolean;
  icon?: React.ReactNode;
  compact?: boolean;
}
const ProgressStep = ({
  title,
  description,
  progress,
  isCompleted = false,
  icon,
  compact = false
}: ProgressStepProps) => {
  if (compact) {
    return <Card className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              {icon}
            </div>}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-gray-900 text-base">Rapport & onderzoeksplan</h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {isCompleted ? '✔️ Klaar' : `${progress}% voltooid`}
                </span>
              </div>
              <Progress value={progress} className="h-1.5 bg-gray-100" />
            </div>
          </div>
        </div>
      </Card>;
  }
  return <Card className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {icon && <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mt-1">
            {icon}
          </div>}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
            {description && <p className="text-gray-600 text-sm leading-relaxed">{description}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {isCompleted ? '✔️ Klaar' : `${progress}% voltooid`}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-100" />
          </div>
        </div>
      </div>
    </Card>;
};
export default ProgressStep;
