export type JourneyStep = 
  | 'enthousiasme'
  | 'wensberoepen'
  | 'persoonsprofiel'
  | 'controle'
  | 'loopbaanrapport'
  | 'zoekprofiel';

export type SubStep = 
  | 'intro'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'extra_info'
  | 'activiteiten'
  | 'werkomstandigheden'
  | 'interesses'
  | 'complete';

export interface JourneyStepConfig {
  id: JourneyStep;
  labelKey: string;
  subSteps: SubStep[];
}

export const JOURNEY_STEPS: JourneyStepConfig[] = [
  { 
    id: 'enthousiasme', 
    labelKey: 'dashboard.journey.step_enthousiasme',
    subSteps: ['intro', 'step1', 'step2', 'step3']
  },
  { 
    id: 'wensberoepen', 
    labelKey: 'dashboard.journey.step_wensberoepen',
    subSteps: ['intro', 'step1', 'step2', 'step3']
  },
  { 
    id: 'persoonsprofiel', 
    labelKey: 'dashboard.journey.step_persoonsprofiel',
    subSteps: ['intro', 'extra_info', 'activiteiten', 'werkomstandigheden', 'interesses']
  },
  { 
    id: 'controle', 
    labelKey: 'dashboard.journey.step_controle',
    subSteps: ['complete']
  },
  { 
    id: 'loopbaanrapport', 
    labelKey: 'dashboard.journey.step_loopbaanrapport',
    subSteps: ['complete']
  },
  { 
    id: 'zoekprofiel', 
    labelKey: 'dashboard.journey.step_zoekprofiel',
    subSteps: ['intro', 'complete']
  }
];
