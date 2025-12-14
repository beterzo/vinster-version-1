
import { useWensberoepenResponses } from "./useWensberoepenResponses";
import { useMemo } from "react";

export const useWensberoepenValidation = (roundId?: string) => {
  const { responses: wensberoepenResponses, isLoading: wensberoepenLoading } = useWensberoepenResponses(roundId);

  const validationResults = useMemo(() => {
    if (wensberoepenLoading) {
      return {
        isLoading: true,
        isWensberoepenComplete: false,
        missingFields: [],
        missingWensberoepenCount: 0
      };
    }

    // Check wensberoepen completion - wensberoep-based approach
    const isWensberoepenComplete = (() => {
      if (!wensberoepenResponses) return false;
      
      // Define fields for each wensberoep
      const fieldSuffixes = [
        'titel',
        'werkweek_activiteiten',
        'werklocatie_omgeving',
        'samenwerking_contacten',
        'fluitend_thuiskomen_dag',
        'werk_doel',
        'leukste_onderdelen',
        'belangrijke_aspecten',
        'kennis_focus'
      ];
      
      const wensberoepPrefixes = ['wensberoep_1', 'wensberoep_2', 'wensberoep_3'];
      
      // Check if all wensberoepen are complete
      return wensberoepPrefixes.every(prefix =>
        fieldSuffixes.every(suffix => {
          const fieldName = `${prefix}_${suffix}`;
          const value = wensberoepenResponses[fieldName as keyof typeof wensberoepenResponses];
          return value && String(value).trim() !== '';
        })
      );
    })();

    const missingFields = [];
    if (!isWensberoepenComplete) {
      missingFields.push('Wensberoepen scan');
    }

    return {
      isLoading: false,
      isWensberoepenComplete,
      missingFields,
      missingWensberoepenCount: isWensberoepenComplete ? 0 : 1
    };
  }, [wensberoepenResponses, wensberoepenLoading]);

  return validationResults;
};
