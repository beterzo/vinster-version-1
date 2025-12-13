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
    labelKey: 'journey.step_enthousiasme',
    subSteps: ['intro', 'step1', 'step2', 'step3']
  },
  { 
    id: 'wensberoepen', 
    labelKey: 'journey.step_wensberoepen',
    subSteps: ['intro', 'step1', 'step2', 'step3']
  },
  { 
    id: 'persoonsprofiel', 
    labelKey: 'journey.step_persoonsprofiel',
    subSteps: ['intro', 'extra_info', 'activiteiten', 'werkomstandigheden', 'interesses']
  },
  { 
    id: 'controle', 
    labelKey: 'journey.step_controle',
    subSteps: ['complete']
  },
  { 
    id: 'loopbaanrapport', 
    labelKey: 'journey.step_loopbaanrapport',
    subSteps: ['complete']
  },
  { 
    id: 'zoekprofiel', 
    labelKey: 'journey.step_zoekprofiel',
    subSteps: ['intro', 'complete']
  }
];
