
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useEnthousiasmeResponses } from './useEnthousiasmeResponses';
import { useWensberoepenResponses } from './useWensberoepenResponses';
import { usePrioriteitenResponses } from './usePrioriteitenResponses';
import { useExtraInformatieResponses } from './useExtraInformatieResponses';

export const useDashboard = () => {
  const { user } = useAuth();
  const enthousiasmeData = useEnthousiasmeResponses();
  const wensberoepenData = useWensberoepenResponses();
  const { isCompleted: prioriteitenCompleted } = usePrioriteitenResponses();
  const { isCompleted: extraInformatieCompleted } = useExtraInformatieResponses();

  // Check if enthousiasme is completed by checking if responses exist and have content
  const enthousiasmeCompleted = enthousiasmeData.responses && 
    Object.values(enthousiasmeData.responses).some(value => value && value.trim() !== '');

  // Check if wensberoepen is completed by checking if responses exist and have content
  const wensberoepenCompleted = wensberoepenData.responses && 
    Object.values(wensberoepenData.responses).some(value => value && value.trim() !== '');

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
