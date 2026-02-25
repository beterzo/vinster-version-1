import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, CheckCircle2, FileText, Search, Lightbulb, User, ClipboardList, MapPin, Lock, ChevronRight, Eye, Shield, Compass } from "lucide-react";
import { JourneyStep, JOURNEY_STEPS } from "@/types/journey";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WelkomInlineProps {
  onNext: () => void;
  completedSteps?: JourneyStep[];
  onStepClick?: (step: JourneyStep) => void;
  isOrganisationMode?: boolean;
  organisationName?: string | null;
  organisationAccessCodeId?: string | null;
}

function getOrgLabels(isOrganisationMode: boolean, name?: string | null, accessCodeId?: string | null) {
  if (!isOrganisationMode || !name) return null;
  const isCategory = !accessCodeId;
  const contextLabel = isCategory ? `een ${name.toLowerCase()}` : name;
  const brancheLabel = isCategory ? "deze branche" : name;
  const binnenLabel = isCategory ? `in ${brancheLabel}` : `binnen ${name}`;
  return { contextLabel, brancheLabel, binnenLabel, isCategory };
}

const WelkomInline = ({ 
  onNext, 
  completedSteps = [], 
  onStepClick,
  isOrganisationMode = false,
  organisationName,
  organisationAccessCodeId,
}: WelkomInlineProps) => {
  const { t } = useTranslation();
  const hasProgress = completedSteps.length > 0;
  const orgLabels = getOrgLabels(isOrganisationMode, organisationName, organisationAccessCodeId);

  const allSteps = [
    { id: 'enthousiasme' as JourneyStep, number: 1, icon: Lightbulb, title: t('welkom.steps.step1.title'), description: t('welkom.steps.step1.description'), time: t('welkom.steps.step1.time') },
    { id: 'wensberoepen' as JourneyStep, number: 2, icon: ClipboardList, title: t('welkom.steps.step2.title'),
      description: orgLabels ? `Noem drie wensberoepen en beschrijf wat je erin aanspreekt. Jouw antwoorden worden gebruikt om te bedenken bij welke functies ${orgLabels.binnenLabel} jouw wensen passen.` : t('welkom.steps.step2.description'),
      time: t('welkom.steps.step2.time') },
    { id: 'persoonsprofiel' as JourneyStep, number: 3, icon: User, title: t('welkom.steps.step3.title'), description: t('welkom.steps.step3.description'), time: t('welkom.steps.step3.time') },
    { id: 'loopbaanrapport' as JourneyStep, number: 4, icon: FileText, title: t('welkom.steps.step4.title'),
      description: orgLabels ? `Vinster vertaalt jouw woorden naar passende functierichtingen en concrete functie-ideeën binnen ${orgLabels.contextLabel}.` : t('welkom.steps.step4.description'),
      time: t('welkom.steps.step4.time') },
    { id: 'onderzoeksplan' as JourneyStep, number: 5, icon: MapPin, title: t('welkom.steps.step5.title'), description: t('welkom.steps.step5.description'), time: t('welkom.steps.step5.time') },
    { id: 'zoekprofiel' as JourneyStep, number: 6, icon: Search, title: t('welkom.steps.step6.title'), description: t('welkom.steps.step6.description'), time: t('welkom.steps.step6.time') }
  ];

  const steps = isOrganisationMode
    ? allSteps.filter(s => s.id !== 'zoekprofiel').map((s, i) => ({ ...s, number: i + 1 }))
    : allSteps;

  const totalSteps = steps.length;

  const tips = [
    t('welkom.tips.tip1'),
    t('welkom.tips.tip2'),
    t('welkom.tips.tip3')
  ];

  const getStepStatus = (stepId: JourneyStep): 'completed' | 'current' | 'locked' => {
    if (completedSteps.includes(stepId)) return 'completed';
    const stepIndex = JOURNEY_STEPS.findIndex(s => s.id === stepId);
    if (stepIndex === completedSteps.length) return 'current';
    return 'locked';
  };

  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  const getLockedTooltip = (stepIndex: number): string => {
    if (stepIndex > 0) {
      return `Voltooi "${steps[stepIndex - 1].title}" eerst`;
    }
    return 'Voltooi de vorige stap eerst';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-white shadow-card rounded-2xl">
        <div className="p-8 md:p-12">
          {/* Header - replaced logo with compass icon */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FEF9E6] p-3 flex items-center justify-center">
              <Compass className="w-12 h-12 text-[#232D4B]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#232D4B] mb-2">
              {hasProgress ? t('welkom.progress_title') : t('welkom.steps_overview_title')}
            </h1>
            
            {hasProgress && (
              <div className="w-full mx-auto mt-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-500">
                    {t('welkom.completed_count').replace('{{count}}', String(completedSteps.length))}
                  </p>
                  <span className="text-sm font-medium text-[#232D4B]">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2.5 w-full" />
              </div>
            )}
          </div>

          {/* Steps grid */}
          <div className="mb-10">
            <div className={isOrganisationMode 
              ? "grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[800px] mx-auto"
              : "flex flex-wrap justify-center gap-4"
            }>
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';
                const isLocked = status === 'locked';

                // Organisation mode: active card full-width, others in 2-col grid
                // Check if this is the last non-active card and there's an odd number of non-active cards
                const nonActiveSteps = steps.filter((_, i) => getStepStatus(steps[i].id) !== 'current');
                const isLastOddNonActive = isOrganisationMode && !isCurrent && 
                  nonActiveSteps.length % 2 === 1 && 
                  index === steps.length - 1;

                const isFullWidth = isOrganisationMode && (isCurrent || isLastOddNonActive);

                // Normal mode widths
                const lgWidth = !isOrganisationMode ? 'lg:w-[calc(33.333%-0.75rem)]' : '';

                const cardContent = (
                  <div className={
                    isOrganisationMode
                      ? `${isFullWidth ? 'sm:col-span-2' : 'col-span-1'}`
                      : `w-full md:w-[calc(50%-0.5rem)] ${lgWidth}`
                  }>
                    <div className={`${isFullWidth ? 'max-w-[560px] mx-auto' : ''}`}>
                    <div 
                      className={`
                         rounded-2xl p-5 flex flex-col h-full transition-all duration-200
                        ${isCompleted 
                          ? 'bg-white border border-gray-200 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover border-l-4 border-l-[#232D4B]' 
                          : isCurrent 
                            ? 'bg-white border-b-4 border-[#F5C518] shadow-card-hover' 
                            : isLocked
                              ? 'bg-gray-50 border border-gray-100 opacity-40 cursor-not-allowed'
                              : 'bg-white border border-gray-100 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          isCompleted 
                            ? 'bg-[#232D4B] text-white' 
                            : isCurrent 
                              ? 'bg-[#F5C518] text-[#232D4B]' 
                              : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <span>{step.number}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <step.icon className={`w-4 h-4 ${isLocked ? 'text-gray-400' : 'text-[#232D4B]'}`} />
                            <h3 className={`font-semibold text-sm ${isLocked ? 'text-gray-400' : 'text-[#232D4B]'}`}>
                              {step.title}
                            </h3>
                            {isCompleted && (
                              <span className="text-xs bg-[#232D4B] text-white px-2 py-0.5 rounded-full font-medium">
                                {t('welkom.step_completed')}
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-xs bg-[#F5C518] text-[#232D4B] px-2 py-0.5 rounded-full font-medium">
                                {t('welkom.step_current')}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-2 leading-relaxed ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                            {step.description}
                          </p>
                          
                          {step.time && (
                            <div className={`flex items-center gap-1.5 text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Clock className="w-3 h-3" />
                              <span>{step.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isCompleted && onStepClick && (
                        <div className="mt-auto pt-3 pl-14">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onStepClick(step.id)}
                            className="text-[#232D4B] border-[#232D4B]/20 hover:bg-[#232D4B] hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {t('welkom.view_button')}
                          </Button>
                        </div>
                      )}

                      {isCurrent && onStepClick && (
                        <div className="mt-auto pt-3">
                          <Button 
                            onClick={() => onStepClick(step.id)}
                            className="bg-[#F5C518] hover:bg-[#d4a912] text-[#232D4B] font-bold px-6 py-3 rounded-xl w-full transition-all duration-200"
                          >
                            Ga verder →
                          </Button>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                );

                if (isLocked) {
                  return (
                    <Tooltip key={step.number}>
                      <TooltipTrigger asChild>
                        {cardContent}
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p>{getLockedTooltip(index)}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={step.number}>{cardContent}</div>;
              })}
            </div>
          </div>

          {/* Total time */}
          {!hasProgress && (
            <div className="bg-gray-50 rounded-2xl p-5 mb-10">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#232D4B]" />
                <p className="text-[#232D4B] font-medium text-sm">
                  {t('welkom.total_time')}
                </p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mb-10 bg-[#FEF9E6] border border-yellow-200 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-full bg-[#F5C518]/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#92400E]" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#232D4B] text-base mb-3">
                  {t('welkom.tips_title')}
                </h3>
                <ul className="space-y-2.5">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F5C518] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Account notice */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-10 flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500">{t('welkom.account_notice')}</p>
          </div>

          {/* Start/Continue button */}
          <div className="flex justify-center">
            <Button 
              onClick={onNext}
              className="bg-[#232D4B] hover:bg-[#1a2350] text-white font-semibold text-lg px-12 py-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
            >
              {hasProgress ? t('welkom.continue_button') : t('welkom.start_button')}
              {hasProgress && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WelkomInline;
