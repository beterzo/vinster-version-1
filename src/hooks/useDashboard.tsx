
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useEnthousiasmeResponses } from './useEnthousiasmeResponses';
import { useWensberoepenResponses } from './useWensberoepenResponses';
import { usePrioriteitenResponses } from './usePrioriteitenResponses';
import { useExtraInformatieResponses } from './useExtraInformatieResponses';

export const useDashboard = () => {
  const { user } = useAuth();
  const { isCompleted: enthousiasmeCompleted } = useEnthousiasmeResponses();
  const { isCompleted: wensberoepenCompleted } = useWensberoepenResponses();
  const { isCompleted: prioriteitenCompleted } = usePrioriteitenResponses();
  const { isCompleted: extraInformatieCompleted } = useExtraInformatieResponses();

  const progress = {
    enthousiasme: enthousiasmeCompleted ? 'completed' : 'not_started',
    wensberoepen: wensberoepenCompleted ? 'completed' : 'not_started',
    prioriteiten: prioriteitenCompleted ? 'completed' : 'not_started',
    extraInformatie: extraInformatieCompleted ? 'completed' : 'not_started'
  };

  const canStartEnthousiasme = progress.enthousiasme === 'not_started' || progress.enthousiasme === 'expired';
  const canStartWensberoepen = progress.wensberoepen === 'not_started' || progress.wensberoepen === 'expired';

  return {
    progress,
    canStartEnthousiasme,
    canStartWensberoepen
  };
};
