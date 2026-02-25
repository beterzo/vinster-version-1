import { Lock, CheckCircle, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/useTranslation";

export type StepStatus = 'completed' | 'active' | 'locked';

interface StepCardProps {
  stepNumber: number;
  stepId: string;
  title: string;
  description: string;
  status: StepStatus;
  progress: number;
  onClick: () => void;
  blockedReason?: string;
}

const StepCard = ({
  stepNumber,
  stepId,
  title,
  description,
  status,
  progress,
  onClick,
  blockedReason,
}: StepCardProps) => {
  const { t } = useTranslation();

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#16a34a', color: '#ffffff' }}>
            <CheckCircle className="w-3 h-3" />
            {t('dashboard.round_dashboard.status_completed')}
          </span>
        );
      case 'active':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <Play className="w-3 h-3" />
            {t('dashboard.round_dashboard.status_active')}
          </span>
        );
      case 'locked':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
            <Lock className="w-3 h-3" />
            {t('dashboard.round_dashboard.status_locked')}
          </span>
        );
    }
  };

  const getActionButton = () => {
    switch (status) {
      case 'completed':
        return (
          <Button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            variant="outline"
            size="sm"
            className="w-full border-vinster-blue text-vinster-blue hover:bg-vinster-blue hover:text-white"
          >
            {t('dashboard.round_dashboard.view_answers')}
          </Button>
        );
      case 'active':
        return (
          <Button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            size="sm"
            className="w-full bg-vinster-blue hover:bg-vinster-blue/90 text-white"
          >
            {t('dashboard.round_dashboard.continue')}
          </Button>
        );
      case 'locked':
        return (
          <Button
            disabled
            variant="outline"
            size="sm"
            className="w-full opacity-50 cursor-not-allowed"
            title={blockedReason}
          >
            <Lock className="w-4 h-4 mr-2" />
            {t('dashboard.round_dashboard.locked')}
          </Button>
        );
    }
  };

  const cardStyles = {
    completed: 'bg-white border-2 shadow-md hover:shadow-lg',
    active: 'bg-white border-2 border-vinster-blue shadow-lg hover:shadow-xl ring-2 ring-vinster-blue/20',
    locked: 'bg-gray-50 border border-gray-200 opacity-75',
  };

  const getCompletedBorderStyle = () => status === 'completed' ? { borderColor: '#232D4B' } : {};
  const getIconBgStyle = () => {
    if (status === 'completed') return { backgroundColor: 'rgba(35, 45, 75, 0.1)' };
    if (status === 'active') return { backgroundColor: 'rgba(35, 45, 75, 0.1)' };
    return { backgroundColor: '#F3F4F6' };
  };

  return (
    <Card
      className={`p-6 rounded-2xl transition-all duration-300 min-h-[300px] flex flex-col ${cardStyles[status]} ${
        status !== 'locked' ? 'cursor-pointer' : ''
      }`}
      style={getCompletedBorderStyle()}
      onClick={status !== 'locked' ? onClick : undefined}
    >
      {/* Header with step number and status */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {t('dashboard.round_dashboard.step')} {stepNumber}
        </span>
        {getStatusBadge()}
      </div>

      {/* Vinster Logo Icon */}
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={getIconBgStyle()}
      >
        <img 
          src="/lovable-uploads/vinster-new-logo.png" 
          alt="Vinster" 
          className={`w-8 h-8 object-contain ${status === 'locked' ? 'opacity-40 grayscale' : ''}`}
        />
      </div>

      {/* Title and Description */}
      <h3 className={`text-lg font-bold mb-2 ${status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm mb-4 ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>

      {/* Spacer to push content to bottom */}
      <div className="flex-grow" />

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={status === 'locked' ? 'text-gray-400' : 'text-gray-500'}>
            {t('dashboard.round_dashboard.progress')}
          </span>
          <span className={`font-medium ${status === 'locked' ? 'text-gray-400' : 'text-gray-700'}`}>
            {progress}%
          </span>
        </div>
        <Progress 
          value={progress} 
          className={`h-2 ${status === 'locked' ? 'opacity-50' : ''}`}
        />
      </div>

      {/* Action Button - always at bottom */}
      {getActionButton()}
    </Card>
  );
};

export default StepCard;