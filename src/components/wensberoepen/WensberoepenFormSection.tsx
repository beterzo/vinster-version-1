
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WensberoepenFormSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const WensberoepenFormSection = ({ title, children }: WensberoepenFormSectionProps) => {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-vinster-blue border-b pb-2">{title}</h3>}
      {children}
    </div>
  );
};

interface WensberoepenFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'input' | 'textarea';
  rows?: number;
}

export const WensberoepenField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'input',
  rows = 2 
}: WensberoepenFieldProps) => {
  const Component = type === 'textarea' ? Textarea : Input;
  
  return (
    <div>
      <Label htmlFor={id} className="text-left block">{label}</Label>
      <Component
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={type === 'textarea' ? rows : undefined}
      />
    </div>
  );
};
