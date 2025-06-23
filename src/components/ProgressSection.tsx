
import { Card } from "@/components/ui/card";

interface ProgressSectionProps {
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
}

const ProgressSection = ({ title, titleClassName = "text-xl font-bold text-vinster-blue mb-6", children }: ProgressSectionProps) => {
  return (
    <Card className="p-6 border-0 rounded-3xl bg-white">
      <h2 className={titleClassName}>
        {title}
      </h2>
      {children}
    </Card>
  );
};

export default ProgressSection;
